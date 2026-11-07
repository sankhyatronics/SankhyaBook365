import { PageBasics } from "@sankhyatronics/apiclient";

export type LinkTargetTypes = '_self' | '_blank' | '_parent' | '_top';
export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999">No preview</text></svg>';

export const BlankPage: PageBasics = {
  id: "blank",
  title: "Blank Page",
  thumbnailWebUrl: FALLBACK_IMG,
  description: "Start from scratch",
  lastModifiedDateTime: new Date(),
  sharepointIds: {
    listItemUniqueId: "",
    listItemId: 0,
  },
};

export const PAGE_SIZE = 100;

export type ControlledBits = {
  selectedId?: string | number;
  activeSourceIdx?: number;
  onSelect?: (id: string | number, sourceIdx: number) => void;
};
