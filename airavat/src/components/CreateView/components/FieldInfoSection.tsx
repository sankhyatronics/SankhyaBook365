import React from 'react';
import {
  Divider,
  Label,
  Spinner,
  Text,
  tokens,
} from '@fluentui/react-components';
import { ChevronDownRegular, ChevronRightRegular, LockClosedRegular } from '@fluentui/react-icons';
import type { NumberColumnDefinition } from '@sankhyatronics/apiclient';
import type { ILanguageContent } from '../../../common/Interfaces';

interface FieldInfoSectionProps {
  fieldDefinition: NumberColumnDefinition | null;
  isExpanded: boolean;
  isCalculating: boolean;
  onToggle: () => void;
  strings: ILanguageContent;
  classes: {
    infoSection: string;
    sectionHeader: string;
    expandIcon: string;
    fieldIcon: string;
    sectionContent: string;
    monoText: string;
  };
}

export const FieldInfoSection: React.FC<FieldInfoSectionProps> = ({
  fieldDefinition,
  isExpanded,
  isCalculating,
  onToggle,
  strings,
  classes,
}) => {
  if (!fieldDefinition) return null;

  return (
    <div className={classes.infoSection}>
      <div
        className={classes.sectionHeader}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDownRegular className={classes.expandIcon} />
        ) : (
          <ChevronRightRegular className={classes.expandIcon} />
        )}
        <LockClosedRegular className={classes.fieldIcon} />
        <Text size={300} weight="semibold">
          {strings.FieldInformation}
        </Text>
        {isCalculating && <Spinner size="tiny" />}
      </div>
      {isExpanded && (
        <>
          <Divider style={{ margin: '8px 0' }} />
          <div
            className={classes.sectionContent}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Label style={{ minWidth: 120, fontWeight: tokens.fontWeightSemibold }}>
                {strings.DisplayName}
              </Label>
              <Text size={300}>{fieldDefinition.displayName}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Label style={{ minWidth: 120, fontWeight: tokens.fontWeightSemibold }}>
                {strings.InternalName}
              </Label>
              <Text size={300} className={classes.monoText}>
                {fieldDefinition.name}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Label style={{ minWidth: 120, fontWeight: tokens.fontWeightSemibold }}>
                {strings.Group}
              </Label>
              <Text size={300}>{fieldDefinition.columnGroup}</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FieldInfoSection;
