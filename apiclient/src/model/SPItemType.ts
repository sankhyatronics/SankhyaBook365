import { ColumnType } from "./SPColumnType";

export interface SPItemField {
  displayName: string;
  value: string;
  type?: ColumnType;
}

export type SPUser = {
  user?: {
    displayName?: string,
    email?: string
  }
}

export type SPItemType = Record<string, SPItemField>;
