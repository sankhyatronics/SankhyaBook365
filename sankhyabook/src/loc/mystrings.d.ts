declare interface IHandbookWebPartStrings {
  // Webpart config
  Group_Source: string;
  Group_Display: string;
  Link_Target: string;
  OpenInSameTab: string;
  OpenInNewTab: string;
  ShowTopMenu: string;

  // Common
  Cancel: string;
  Creating: string;
  Close: string;

  // Gaurd
  pendingMessage: string;

  // CreateView
  ViewNameRequired: string;
  ViewCreatedSuccess: string;
  CreateView: string;
  CreateNewView: string;
  ViewNameLabel: string;
  ViewNamePlaceholder: string;
  FieldInformation: string;
  DisplayName: string;
  InternalName: string;
  Group: string;
  TargetSites: string;
  ViewCreationInfo: string;
  CreateViewButton: string;

  // DynamicNav
  ClickToSelect: string;

  // PageCreator
  PageTitleInfo: string;
  PageExist: string;
  SelectTemplate: string;
  ReadyToCreate: string;
  NoTemplatesFound: string;
  NoMatchingTemplate: string;
  NoTemplatesAvailable: string;
  TemplatePreview: string;
  SelectTemplatePreview: string;
  WorkingSite: string;
  PageTitleHint: string;
  PageTitleEditedInfor: string;
  TitleSync: string;
  TitleGeneratedInfo: string;
  TitleEditMode: string;
  AvailableTemplates: string;
  ChooseTemplate: string;
  PreviewTemplate: string;
  EnterPageTitle: string;
  EnterPageName: string;
  CreatePage: string;

  // PageHierarchyManager
  NoPagesAvailable: string;
  CurrentField: string;

  // Hanbook365Inner
  Refresh: string;
  Support: string;
  SupportLink: string;
  ManageHierarchy: string;
  CreateChildPageDetails: string;
  ManageHierarchyDetails: string;

  // Pagecard
  Updated: string;
  UpdatedBy: string;

  // Pagenamefield
  Checking: string;
  NameAvailable: string;
  NameExists: string;

  // mosaic
  DragOnMessage: string;
  Collapse: string;
  Expand: string;
  RemoveParent: string;
}

declare module 'HandbookWebPartStrings' {
  const strings: IHandbookWebPartStrings;
  export = strings;
}
