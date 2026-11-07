import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { createApiInstance } from "@sankhyatronics/apiclient";
import type { PageBasics } from "@sankhyatronics/apiclient";
import { BlankPage } from "../../common/commonTypes";
import PageCard from "../PageCards/PageCard";
import {
  Button,
  Input,
  Label,
  Tooltip,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  ShareRegular,
  SearchRegular,
  ImageRegular,
  ArrowSyncRegular,
  AddRegular,
} from "@fluentui/react-icons";
import { useHandbookStyles } from "../../common/Styles";
import { IPageCreatorProps } from "../../common/Interfaces";
import { PageNameField } from "./PageNameField";
import { Pane, SplitPane } from "react-split-pane";

// Import extracted hooks
import { usePageSearch } from "./hooks/usePageSearch";
import { usePageNameGenerator, generatePageName } from "./hooks/usePageNameGenerator";
import { usePageNameValidation } from "./hooks/usePageNameValidation";

// Import extracted components
import { StatusIndicator, getStatusInfo } from "./components/StatusIndicator";

const PageCreator: React.FC<IPageCreatorProps> = (props) => {
  const classes = useHandbookStyles();
  const api = useMemo(() => createApiInstance({ getToken: props.tokenProvider }), [props.tokenProvider]);

  // State
  const [title, setTitle] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<PageBasics | null>(null);
  const [isBlank, setIsBlank] = useState(false);
  const [busy, setBusy] = useState(false);

  // Extracted hooks
  const { searchQuery, setSearchQuery, filteredPages } = usePageSearch({ pages: props.pages });
  const {
    name,
    setName,
    isManualEdit,
    setIsManualEdit,
    handleNameChange,
    reset: resetName,
  } = usePageNameGenerator();

  // Check page name availability via API
  const checkPageNameApi = useCallback(async (pageName: string): Promise<boolean> => {
    if (!pageName.trim()) return false;

    try {
      const spIds = await api.sites.resolveSharePointIds(props.webUrl);
      const existStatus = await api.sitePages.checkPageNameExists(
        spIds.siteId,
        props.listId,
        pageName.trim()
      );
      return existStatus;
    } catch (error) {
      console.error("Failed to check page name:", error);
      return false;
    }
  }, [api, props.webUrl, props.listId]);

  const { nameStatus, isCheckingName, checkName } = usePageNameValidation({
    checkPageName: checkPageNameApi,
    selectedPage,
  });

  // Handle page selection
  const handlePageSelect = (page: PageBasics) => {
    setIsBlank(page === BlankPage);
    setSelectedPage(page);
    const newTitle = `${page.title}`;
    setTitle(newTitle);

    if (!isManualEdit) {
      const generatedName = generatePageName(newTitle);
      setName(generatedName);
    }
    checkName(''); // Reset validation
  };

  // Handle title change
  const handleTitleChange = (newValue: string) => {
    setTitle(newValue);

    if (!isManualEdit) {
      const generatedName = generatePageName(newValue);
      setName(generatedName);
    }
  };

  // Handle page name change
  const handlePageNameChange = (newName: string) => {
    handleNameChange(newName, title);
    checkName(newName);
  };

  // Create new page
  const createPage = useCallback(
    async (templateFileName?: string) => {
      if (!name?.trim() || !title?.trim() || nameStatus) return;

      try {
        setBusy(true);
        const spIds = await api.sites.resolveSharePointIds(props.webUrl);
        const newPage = await api.sitePages.copyPage(
          spIds.siteId,
          props.listId,
          name.trim(),
          title,
          `${templateFileName}`,
          isBlank,
          props.parentField,
          props.parentId ?? 0
        );

        props.onPageCreated(`${newPage}`);

        // Reset form
        setTitle("");
        resetName();
        setSelectedPage(null);
        setSearchQuery("");
        setIsBlank(false);
      } catch (err: unknown) {
        console.error("Failed to create page:", err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
      }
    },
    [api, props.webUrl, title, name, isBlank, props.listId, props.parentField, props.parentId, props.onPageCreated, nameStatus, resetName]
  );

  // Sync name when title changes (if not manually edited)
  React.useEffect(() => {
    if (title.trim() && !isManualEdit && !name.trim()) {
      const generatedName = generatePageName(title);
      setName(generatedName);
    }
  }, [title, isManualEdit, name, setName]);

  // Reset manual edit flag when title is cleared
  React.useEffect(() => {
    if (!title.trim()) {
      setIsManualEdit(false);
    }
  }, [title, setIsManualEdit]);

  // Status
  const statusInfo = getStatusInfo(
    !!title.trim(),
    nameStatus,
    !!selectedPage,
    props.strings
  );
  const canCreate = !!title.trim() && !!selectedPage && !busy && nameStatus === false;

  return (
    <div className={classes.pageCreatorContainer}>
      {/* Site Info Header */}
      {props.currentSiteTitle && (
        <div className={classes.siteInfoHeader}>
          <ShareRegular className={classes.siteInfoIcon} />
          <span>{props.strings.WorkingSite}</span>
          <span className={classes.Bold}>
            {props.currentSiteTitle}
          </span>
        </div>
      )}
      <SplitPane direction="horizontal" resizable={false}>
        <Pane minSize={425}>
          <div key="left" className={classes.col}>
            <Label className={classes.docCardTitle}>
              {props.strings.ChooseTemplate}
            </Label>
            <div className={classes.yPadding}>
              <div className={classes.Normal}>
                {props.strings.AvailableTemplates}: {props.pages.length + 1}
              </div>
            </div>

            {/* Search */}
            <div className={classes.yPadding}>
              <Input
                contentBefore={<SearchRegular />}
                placeholder={props.strings.Search}
                value={searchQuery}
                onChange={(_, data) => setSearchQuery(data.value)}
                className={classes.inputField}
              />
            </div>

            {/* Template Grid */}
            <div className={classes.templateGridEnhanced}>
              <PageCard
                strings={props.strings}
                size="small"
                key="blank"
                page={BlankPage}
                onSelect={() => handlePageSelect(BlankPage)}
                selectable
                isSelected={selectedPage === BlankPage}
              />
              {filteredPages.map((item, index) => {
                const page = 'page' in item ? item.page : item as PageBasics;
                return page ? (
                  <PageCard
                    size="small"
                    key={`${page.id}-${index}`}
                    page={page}
                    onSelect={handlePageSelect}
                    selectable
                    strings={props.strings}
                    isSelected={selectedPage?.id === page.id}
                  />
                ) : null;
              })}
            </div>

            {filteredPages.length === 0 && (
              <div className={classes.emptyHierarchy}>
                <SearchRegular className={classes.emptyHint} />
                <div className={classes.Bold}>
                  {props.strings.NoTemplatesFound}
                </div>
                <div className={classes.emptyHint}>
                  {searchQuery ? `${props.strings.NoMatchingTemplate} "${searchQuery}"` : props.strings.NoTemplatesAvailable}
                </div>
              </div>
            )}
          </div>
        </Pane>
        <Pane>
          <div key="right" className={classes.col}>
            <Label className={classes.docCardTitle}>
              {props.strings.PreviewTemplate}
            </Label>

            {/* Preview Section */}
            <div className={classes.previewCardEnhanced}>
              {selectedPage ? (
                <PageCard
                  strings={props.strings}
                  size="large"
                  key={`preview-${selectedPage.id}`}
                  page={selectedPage}
                />
              ) : (
                <div className={classes.emptyHierarchy}>
                  <ImageRegular className={classes.emptyHint} />
                  <div className={classes.Bold}>
                    {props.strings.TemplatePreview}
                  </div>
                  <div className={classes.emptyHint}>
                    {props.strings.SelectTemplatePreview}
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className={classes.formCardEnhanced}>
              <div className={classes.formGroup}>
                <Label className={classes.formLabel} required>
                  {props.strings.EnterPageTitle}
                </Label>
                <Input
                  placeholder={props.strings.PageTitleHint}
                  value={title}
                  onChange={(_, data) => handleTitleChange(data.value)}
                  className={classes.inputField}
                />
                <Text size={200} className={classes.emptyHint}>
                  {title.length}/255 characters
                </Text>
              </div>

              {/* Page Name Field with Sync Indicator */}
              <div className={classes.formGroup}>
                <div className={classes.spaceBetween}>
                  <Label className={classes.formLabel} required>
                    {props.strings.EnterPageName}
                  </Label>
                  {isManualEdit && (
                    <Tooltip content={props.strings.PageTitleEditedInfor} relationship="label">
                      <div
                        className={classes.rowNoWrap}
                        style={{
                          cursor: 'pointer',
                          alignItems: 'center',
                          gap: 4
                        }}
                        onClick={() => {
                          setIsManualEdit(false);
                          setName(generatePageName(title));
                        }}
                      >
                        <ArrowSyncRegular style={{ fontSize: 12, color: tokens.colorBrandForeground1 }} />
                        <span style={{ fontSize: 12, color: tokens.colorBrandForeground1 }}>
                          {props.strings.TitleSync}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                </div>

                <PageNameField
                  value={name}
                  onChange={handlePageNameChange}
                  checkPageName={checkPageNameApi}
                  debounceMs={350}
                  strings={props.strings}
                  isChecking={isCheckingName}
                  error={nameStatus === true}
                />
                <Text size={200} className={classes.emptyHint}>
                  {!isManualEdit ? (
                    props.strings.TitleGeneratedInfo
                  ) : (
                    props.strings.TitleEditMode
                  )}
                </Text>
              </div>

              {/* Status and Action Section */}
              <div className={classes.controlGroup}>
                <div className={classes.Normal}>
                  <StatusIndicator
                    status={statusInfo}
                    className={classes.rowNoWrap}
                    iconClassName={classes.siteInfoIcon}
                  />
                </div>

                <Button
                  appearance="primary"
                  className={classes.createButtonEnhanced}
                  disabled={!canCreate}
                  onClick={() => createPage(selectedPage?.name === "blank" ? undefined : String(selectedPage?.name ?? ""))}
                  icon={<AddRegular />}
                >
                  {props.strings.CreatePage}
                </Button>
              </div>
            </div>
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
};

export default PageCreator;
