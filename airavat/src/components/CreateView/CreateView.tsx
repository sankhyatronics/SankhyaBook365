import React, { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Input,
  Field,
  Label,
  Divider,
  Spinner,
  Text,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useHandbookStyles } from '../../common/Styles';
import { createApiInstance } from '@sankhyatronics/apiclient';
import type { NumberColumnDefinition } from '@sankhyatronics/apiclient';
import { ICreateViewProps } from '../../common/Interfaces';

// Import extracted hooks
import { useFieldDefinition } from './hooks/useFieldDefinition';
import { useCreateView } from './hooks/useCreateView';

// Import extracted components
import { AlertMessages } from './components/AlertMessages';
import { FieldInfoSection } from './components/FieldInfoSection';
import { SitesSection } from './components/SitesSection';

export const CreateView: React.FC<ICreateViewProps> = (props) => {
  const { isOpen, onDismiss, onCreateSuccess, tokenProvider, strings, sitesInfo } = props;
  const classes = useHandbookStyles();
  const [viewName, setViewName] = useState('');
  const [expandedSections, setExpandedSections] = useState({ fieldInfo: true, sitesInfo: false });

  const api = useMemo(() => createApiInstance({ getToken: tokenProvider }), [tokenProvider]);

  // API wrapper for field definition calculation
  const calculateFieldDefinitionApi = useCallback(
    async (name: string): Promise<NumberColumnDefinition | null> => {
      if (!name.trim()) return null;
      try {
        const fieldDef = await api.columns.createParentFieldDefinition(name);
        return fieldDef ?? null;
      } catch {
        return null;
      }
    },
    [api]
  );

  // Extracted hooks
  const {
    calculatedFieldDefinition,
    createdFieldDefinition,
    isCalculating,
    showFieldPreview,
    setShowFieldPreview,
    setCreatedFieldDefinition,
    calculateField,
    calculateFieldImmediate,
    reset: resetFieldDefinition,
  } = useFieldDefinition({ calculateFieldDefinition: calculateFieldDefinitionApi });

  const {
    isCreating,
    error,
    success,
    setError,
    setSuccess,
    createView,
    reset: resetCreateView,
  } = useCreateView({
    api,
    sitesInfo,
    onCreateSuccess,
    onDismiss,
    strings,
  });

  const handleViewNameChange = (newValue: string) => {
    setViewName(newValue);
    if (createdFieldDefinition) setCreatedFieldDefinition(null);
    setShowFieldPreview(false);
    calculateField(newValue);
  };

  const handleViewNameBlur = async () => {
    if (viewName.trim() && !showFieldPreview) {
      await calculateFieldImmediate(viewName);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCreateView = async () => {
    await createView(viewName, calculatedFieldDefinition);
  };

  const resetForm = () => {
    setViewName('');
    resetFieldDefinition();
    resetCreateView();
    setExpandedSections({ fieldInfo: true, sitesInfo: false });
  };

  const handleClose = () => {
    resetForm();
    onDismiss();
  };

  const sitesDisplay = sitesInfo.map((site, index) => ({
    key: index.toString(),
    siteName: site.siteTitle || new URL(site.webUrl).hostname,
    url: site.webUrl,
  }));

  if (!isOpen) return null;

  const canCreate =
    !isCreating && viewName.trim() && calculatedFieldDefinition;

  return (
    <div className={classes.createViewOverlay}>
      <div className={classes.createViewContainer}>
        <div className={classes.createViewContent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div>
              <Text size={500} weight="semibold">
                {strings.CreateNewView}
              </Text>
              <Divider style={{ marginTop: 8 }} />
            </div>

            {/* Messages */}
            <AlertMessages
              error={error}
              success={success}
              onDismissError={() => setError(null)}
              onDismissSuccess={() => setSuccess(null)}
            />

            {/* View Name */}
            <Field
              label={<Label required>{strings.ViewNameLabel}</Label>}
              validationMessage={!viewName.trim() ? strings.ViewNameRequired : undefined}
              validationState={!viewName.trim() ? 'error' : 'none'}
            >
              <Input
                placeholder={strings.ViewNamePlaceholder}
                value={viewName}
                onChange={(_, data) => handleViewNameChange(data.value)}
                onBlur={handleViewNameBlur}
                disabled={isCreating}
              />
            </Field>

            {/* Combined Info Box */}
            {(calculatedFieldDefinition || sitesInfo.length > 0) && (
              <div className={classes.combinedInfoBox}>
                <FieldInfoSection
                  fieldDefinition={calculatedFieldDefinition}
                  isExpanded={expandedSections.fieldInfo}
                  isCalculating={isCalculating}
                  onToggle={() => toggleSection('fieldInfo')}
                  strings={strings}
                  classes={classes}
                />
                <SitesSection
                  sites={sitesDisplay}
                  isExpanded={expandedSections.sitesInfo}
                  onToggle={() => toggleSection('sitesInfo')}
                  strings={strings}
                  classes={classes}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={handleClose} disabled={isCreating}>
                {strings.Cancel}
              </Button>
              <Button
                appearance="primary"
                onClick={handleCreateView}
                disabled={!canCreate}
                icon={isCreating ? <Spinner size="tiny" /> : <AddRegular />}
              >
                {isCreating ? strings.Creating : strings.CreateViewButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateView;
