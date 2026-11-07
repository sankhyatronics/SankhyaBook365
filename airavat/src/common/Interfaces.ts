import type { ReactElement } from 'react';
import { NumberColumnDefinition, PageBasics, SitePage, TokenProvider } from "@sankhyatronics/apiclient";
import { ISiteInfo } from "@sankhyatronics/apiclient";
import { LinkTargetTypes } from "./commonTypes";

export type ILanguageContent = { [key: string]: string };

// Replaces ICommandBarItemProps from @fluentui/react
export type NavItemType = 'normal' | 'divider' | 'header';
export interface INavItem {
  key: string;
  text?: string;
  onClick?: () => void;
  icon?: ReactElement;
  iconOnly?: boolean;
  ariaLabel?: string;
  subMenuProps?: { items: INavItem[] };
  split?: boolean;
  canCheck?: boolean;
  checked?: boolean;
  itemType?: NavItemType;
  data?: Record<string, unknown>;
  disabled?: boolean;
}

export interface ISitePageTreeNode extends SitePage {
  children: ISitePageTreeNode[];
};
export interface IGuardProps {
  strings: ILanguageContent;
  configValid: boolean;
  loading: boolean;
  error: string | undefined;
  children: React.ReactNode;
}
export type IMosaicNodeProps = {
  strings: ILanguageContent;
  node: ISitePageTreeNode;
  dragOverId: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragEnterNode: (e: React.DragEvent, id: number) => void;
  onDragLeaveNode: (e: React.DragEvent, id: number) => void;
  onDropOnNode: (e: React.DragEvent, id: number) => void;
  expanded: Record<number, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onUnparent: (id: number) => void | Promise<void>;
};
export type ISideMenuNodeProps = {
  node: ISitePageTreeNode;
  expanded: Record<number, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onMenuItemClick?: (node: ISitePageTreeNode) => void;
  showLeaf: boolean;
  selectedId?: string | number;
  onSelect?: (id: string | number, node: ISitePageTreeNode) => void;
  isChild: boolean;
};
export interface IPageCardProps {
  strings: ILanguageContent;
  page: SitePage['page'];
  size?: 'small' | 'medium' | 'large';
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (page: PageBasics) => void;
}

export interface IDynamicMenuProps {
  linkTarget: LinkTargetTypes;
  roots: ISitePageTreeNode[][];
  farItems: INavItem[];
  siteTitles?: (string | undefined)[];
  showOnlyFarItems: boolean;
  onMenuItemClick?: (node: SitePage) => void;
  onMenuItemClickWithIndex?: (node: SitePage, sourceIndex: number) => void;
}
export interface IPageHierarchyManagerProps {
  strings: ILanguageContent;
  pages: SitePage[];
  root: ISitePageTreeNode[];
  onReparent?: (id: number, parentId: number | null) => void | Promise<void>;
  currentHandbook?: ISiteInfo;
  currentView: { key: string; label: string } | null;
  availableSites?: Array<{ title?: string; index: number }>;
  currentSiteIndex?: number;
  onSiteChange?: (index: number) => void;
  onViewChange?: (viewKey: string) => void;
}

export interface IHandbookProps {
  strings: ILanguageContent;
  tokenProvider: TokenProvider;
  LeftMenuSize: number,
  pageSize: number;
  sources: Array<ISiteInfo>
  linkTarget: LinkTargetTypes;
  showTopMenu: boolean;
}

export interface IDynamicNavProps {
  strings: ILanguageContent;
  siteTitles?: (string | undefined)[];
  showLeaf: boolean;
  onMenuItemClick?: (node: SitePage) => void;
  onMenuItemClickWithIndex?: (node: SitePage, sourceIndex: number) => void;
  roots: ISitePageTreeNode[][];
}
export interface IPageCardViewProps {
  strings: ILanguageContent;
  pages: SitePage[];
  parentId: number | null;
}
export interface IPageCreatorProps {
  strings: ILanguageContent;
  parentId: number | null;
  tokenProvider: TokenProvider;
  webUrl: string;
  listId: string;
  pages: SitePage[];
  parentField: string;
  onPageCreated: (pageUrl: string) => void;
  currentSiteTitle?: string;
}
export interface ICreateViewProps {
  isOpen: boolean;
  strings: ILanguageContent;
  onDismiss: () => void;
  onCreateSuccess: (parentField: NumberColumnDefinition | null) => void;
  tokenProvider: TokenProvider;
  sitesInfo: ISiteInfo[];
}

