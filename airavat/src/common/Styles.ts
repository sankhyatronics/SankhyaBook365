import { makeStyles, tokens } from '@fluentui/react-components';

export const useHandbookStyles = makeStyles({
  // === LAYOUT UTILITIES ===
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowNoWrap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    minWidth: 0,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  flex1: {
    flex: '1',
  },
  fullWidth: {
    width: '100%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  // === TRANSITIONS & EFFECTS ===
  transition: {
    transition: 'transform .2s ease, opacity .2s ease',
  },
  colorTransition: {
    transition: 'border-color .16s ease, box-shadow .16s ease, background-color .16s ease',
  },
  overflowHidden: {
    overflow: 'hidden',
  },

  // === NAVIGATION CONTROLS ===
  controlBack: {
    backgroundColor: tokens.colorNeutralBackground4,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorNeutralStroke2,
  },
  controlBackHoverStrong: {
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorNeutralBackground4,
    '&:hover': {
      borderLeftColor: tokens.colorBrandStroke1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  controlHeaderBackHoverStrong: {
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralBackground4,
    '&:hover': {
      borderBottomColor: tokens.colorBrandStroke1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },

  // === NAVIGATION STATES ===
  navRowSelected: {
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  navHeaderSelected: {
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorNeutralBackground3,
  },

  // === RESIZER ===
  resizer: {
    paddingLeft: '4px',
    paddingRight: '4px',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },

  // === TEXT STYLES ===
  TextContainer: {
    marginLeft: tokens.spacingHorizontalM,
    marginRight: tokens.spacingHorizontalM,
    fontSize: tokens.fontSizeBase200,
  },
  docCardTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginLeft: tokens.spacingHorizontalM,
    fontSize: tokens.fontSizeBase400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  leftMargin: {
    marginLeft: tokens.spacingHorizontalS,
    fontWeight: tokens.fontWeightSemibold,
  },
  leftMargin2: {
    marginLeft: tokens.spacingHorizontalM,
    fontWeight: tokens.fontWeightSemibold,
  },
  yPadding: {
    marginLeft: tokens.spacingHorizontalM,
    marginRight: tokens.spacingHorizontalM,
  },

  // === TOGGLE BUTTON ===
  toggleButton: {
    position: 'fixed',
    borderRadius: '50%',
    bottom: '24px',
    left: '48px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    zIndex: 1000,
  },

  // === HIERARCHY & MOSAIC STYLES ===
  hierarchyCard: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    minHeight: '240px',
  },
  mosaicItem: {
    breakInside: 'avoid',
    WebkitColumnBreakInside: 'avoid',
    pageBreakInside: 'avoid',
    display: 'block',
    transition: 'transform .2s ease, opacity .2s ease',
  },
  mosaicItemDragOver: {
    '& .mosaicCard': {
      border: `1px solid ${tokens.colorBrandStroke1}`,
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
    },
  },

  // === MOSAIC CARD VARIANTS ===
  mosaicCardBase: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    margin: tokens.spacingHorizontalS,
    overflow: 'hidden',
    transition: 'border-color .16s ease, box-shadow .16s ease, background-color .16s ease',
  },
  mosaicCardOpen: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    boxShadow: tokens.shadow16,
  },
  mosaicCardClosed: {
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    boxShadow: tokens.shadow8,
  },

  // === MOSAIC HEADER ===
  mosaicHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    cursor: 'grab',
    userSelect: 'none',
  },
  mosaicHeaderMain: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    flex: '1',
  },
  mosaicTitle: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mosaicSubtitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    flexGrow: 1,
  },

  // === MOSAIC TOGGLE ===
  mosaicToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    marginLeft: tokens.spacingHorizontalS,
    marginRight: '2px',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
      outline: 'none',
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
      outline: 'none',
    },
  },
  mosaicTogglePlaceholder: {
    width: '28px',
    height: '28px',
    marginLeft: tokens.spacingHorizontalS,
    marginRight: '2px',
  },

  // === MOSAIC BOARD ===
  mosaicBoard: {
    columnGap: tokens.spacingHorizontalM,
    '@media (min-width: 480px) and (max-width: 767px)': {
      columnCount: 1,
    },
    '@media (min-width: 768px) and (max-width: 1023px)': {
      columnCount: 2,
    },
    '@media (min-width: 1024px)': {
      columnCount: 3,
    },
    '@media print': {
      columnCount: 1,
    },
  },

  // === MOSAIC CHILDREN ===
  mosaicChildrenWrap: {
    borderTopWidth: '1px',
    borderTopStyle: 'dashed',
    borderTopColor: tokens.colorNeutralStroke2,
    marginTop: tokens.spacingVerticalS,
    overflow: 'hidden',
    transition: 'max-height .22s ease, opacity .18s ease, transform .18s ease',
  },
  mosaicChildrenWrapOpen: {
    maxHeight: '1000px',
    opacity: 1,
    transform: 'scaleY(1)',
  },
  mosaicChildrenWrapClosed: {
    maxHeight: '0px',
    opacity: 0,
    transform: 'scaleY(0.98)',
  },
  mosaicChildren: {
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    columnWidth: '240px',
    columnGap: tokens.spacingHorizontalS,
  },

  // === NAVIGATION COMPONENTS ===
  navHeader: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    width: '100%',
  },
  navTitle: {
    flex: '1 1 auto',
    flexGrow: 1,
    minWidth: 0,
    color: 'inherit',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: 'none',
    cursor: 'pointer',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    marginLeft: tokens.spacingHorizontalS,
  },
  navIcon: {
    flex: '0 0 24px',
    marginLeft: 'auto',
  },

  // === NAVIGATION TOGGLE ===
  navToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    outline: 'none',
    marginLeft: tokens.spacingHorizontalS,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    '&:focus': {
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
      outline: 'none',
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${tokens.colorBrandStroke1}`,
      outline: 'none',
    },
  },

  // === NAVIGATION CHILDREN ===
  navChildrenWrap: {
    overflow: 'hidden',
    transition: 'max-height .22s ease, opacity .18s ease, transform .18s ease',
  },
  navChildrenWrapOpen: {
    maxHeight: '1000px',
    opacity: 1,
    transform: 'scaleY(1)',
  },
  navChildrenWrapClosed: {
    maxHeight: '0px',
    opacity: 0,
    transform: 'scaleY(0.98)',
  },
  navChildren: {
    display: 'flex',
    flexDirection: 'column',
  },

  // === FONT WEIGHT UTILITIES ===
  Bold: {
    fontWeight: tokens.fontWeightBold,
  },
  Normal: {
    fontWeight: tokens.fontWeightRegular,
    flexGrow: 1,
  },

  // === PAGE CARD STYLES ===
  pageCardMain: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalXL,
    '@media (max-width: 639px)': {
      gridTemplateColumns: '1fr',
    },
  },
  pageCardSmall: {
    width: '200px',
    maxWidth: '100%',
    height: '170px',
  },
  pageCardFit: {
    width: '100%',
    height: 'auto',
  },
  pageCard: {
    width: '100%',
    height: '340px',
  },
  pageCardRoot: {
    border: '2px solid transparent',
    cursor: 'default',
    transition: 'border 0.2s ease-in-out',
    borderRadius: tokens.borderRadiusMedium,
  },
  pageCardRootSelected: {
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
    cursor: 'pointer',
  },
  docCardPreview: {
    cursor: 'default',
  },

  // === FIXED FOOTER ===
  fixedFooter: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalM,
    background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.85), rgba(255,255,255,0))',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    '@media print': {
      display: 'none',
    },
  },

  // === HIERARCHY MANAGER STYLES ===
  hierarchyManagerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: tokens.spacingHorizontalM,
  },
  hierarchyManagerHeader: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingHorizontalM,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalS,
  },
  headerControls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalS,
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  controlLabel: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
  siteSelect: {
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: '200px',
  },
  viewSelect: {
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: '150px',
  },
  fieldDisplay: {
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
    fontFamily: 'monospace',
  },
  currentSelectionInfo: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    flexWrap: 'wrap',
  },
  siteInfo: {
    fontWeight: tokens.fontWeightSemibold,
  },
  viewInfo: {
    fontStyle: 'italic',
  },
  emptyHierarchy: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
  },
  emptyHint: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalS,
  },

  // === VIEW CREATOR STYLES ===
  combinedInfoBox: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalS,
  },
  infoSection: {
    marginBottom: tokens.spacingVerticalM,
  },
  sectionHeader: {
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  sectionContent: {
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
  },
  expandIcon: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  fieldIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '16px',
  },
  siteIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '16px',
  },
  monoText: {
    fontFamily: 'monospace',
    backgroundColor: tokens.colorNeutralBackground3,
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '6px',
    paddingRight: '6px',
    borderRadius: '3px',
  },
  urlText: {
    color: tokens.colorNeutralForeground2,
    fontFamily: 'monospace',
    fontSize: '11px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sitesList: {
    maxHeight: '200px',
    overflowY: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  siteItem: {
    padding: tokens.spacingHorizontalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  createViewOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  createViewContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow64,
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  createViewContent: {
    padding: tokens.spacingHorizontalXL,
  },
  Popuproot: {
    background: 'rgba(0, 0, 0, 0.2)',
    bottom: '0',
    left: '0',
    position: 'fixed',
    right: '0',
    top: '0',
  },
  Popupcontent: {
    background: 'white',
    left: '50%',
    maxWidth: '400px',
    padding: '0 2em 2em',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },

  // === PAGE CREATOR STYLES ===
  pageCreatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  siteInfoHeader: {
    backgroundColor: tokens.colorNeutralBackground2,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: tokens.spacingVerticalL,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase200,
  },
  siteInfoIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
  },
  templateGridEnhanced: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalS,
    '@media (max-width: 639px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: tokens.spacingHorizontalS,
    },
    '@media (max-width: 479px)': {
      gridTemplateColumns: '1fr',
    },
  },
  previewCardEnhanced: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow8,
    marginBottom: tokens.spacingVerticalL,
  },
  formCardEnhanced: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow4,
  },
  formGroup: {
    marginBottom: tokens.spacingVerticalL,
  },
  formLabel: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    display: 'block',
    fontSize: tokens.fontSizeBase300,
  },
  inputField: {
    width: '100%',
  },
  createButtonEnhanced: {
    borderRadius: tokens.borderRadiusSmall,
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '32px',
    paddingRight: '32px',
    minWidth: '160px',
    height: '40px',
    marginTop: tokens.spacingVerticalXL,
    fontWeight: tokens.fontWeightSemibold,
  },

  // === SR-ONLY ===
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
});
