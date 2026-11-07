export interface ISiteInfo {
  webUrl: string;
  siteId?: string
  listId?: string;
  parentField?: string;
  siteTitle?: string;
  parentId?: number;
}

export interface SPSite {
  id: string;
  name: string;
  webUrl: string;
}