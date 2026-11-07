import { SPUser } from "./SPItemType";

export type PageBasics = {
    id: string;
    name?: string;
    title?: string;
    pageLayout?: string;
    webUrl?: string;
    thumbnailWebUrl?: string;
    lastModifiedDateTime: Date;
    createdDateTime?: Date;
    description?: string;
    sharepointIds: {
        listItemUniqueId: string;
        listItemId: number;
    }
    createdBy?: SPUser;
    lastModifiedBy?: SPUser;
};

export interface SitePage {
    id: number;
    parentId: number;
    // custom columns
    fields: Record<string, any>;
    // metadata sharepoint pages
    page?: PageBasics;
};

export type GetSitePagesResult = {
    items: SitePage[];
    nextLink?: string;
};
export type GetSitePagesOptions = {
    siteId: string;
    listId: string;
    parentField: string;
    filter?: string;
    top?: number;
    nextLink?: string;
};