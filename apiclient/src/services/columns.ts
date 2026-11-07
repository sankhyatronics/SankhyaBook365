import type { AxiosInstance } from "axios";
import type { NumberColumnDefinition, SiteColumnDefinition } from "../model/SPColumnType";
import { getWithRetry } from "../utils/Retry";
import { stripUnsupported } from "../utils/id";
import { Helpers } from "../utils/helper";
import { ISiteInfo } from "../model/SPSite";


export const columnsService = (http: AxiosInstance) => ({
  /**
 * Get all writable list columns, optionally filtered by internal-name prefix.
 * Read-only columns (e.g. ID, Created, Modified, system fields) are excluded
 * because callers always need writable fields for data input/editing.
 */
  async getListColumns(siteId: string, listId: string, opts?: { internalNameStartswith?: string }): Promise<SiteColumnDefinition[]> {
    let url = `https://graph.microsoft.com/v1.0/sites/${encodeURIComponent(siteId)}/lists/${encodeURIComponent(listId)}/columns`;
    const out: SiteColumnDefinition[] = [];
    const namehint = opts?.internalNameStartswith ;

    while (url) {
      const res = await getWithRetry(http, url);
      const page = (res?.data?.value ?? []) as SiteColumnDefinition[];
      // Drop read-only columns first; then apply optional internal-name prefix.
      // Graph's $filter on readOnly is unreliable on this endpoint, so we filter client-side.
      const writable = page.filter(ct => ct.readOnly !== true);
      out.push(
        ...(namehint ? writable.filter(ct =>  ct.name.startsWith(namehint)) : writable)
      );
      url = res?.data?.["@odata.nextLink"] ?? "";
    }
    return out;
  },

  async getListCommonColumns(siteListPairs: Array<ISiteInfo>, opts?: { internalNameStartswith?: string }): Promise<SiteColumnDefinition[]> {

    if (!siteListPairs?.length) return [];

    // Process only valid pairs
    const columnPromises = siteListPairs.filter(pair => pair?.siteId && pair?.listId).map(pair =>
      this.getListColumns(pair.siteId!, pair.listId!, opts)
        .catch(() => []) // Silently handle errors
    );

    const allSiteColumns = (await Promise.all(columnPromises)).filter(columns => columns?.length > 0);
    if (allSiteColumns.length === 0) return [];

    // Create maps
    const columnMaps = allSiteColumns.map(columns => {
      const map = new Map<string, string>();
      columns.forEach(col => {
        const key = col.name;
        const value = col.displayName;
        if (key && value) map.set(key, value);
      });
      return map;
    }).filter(map => map.size > 0);

    const commonNames = Helpers.findCommonInternalNames(columnMaps);

    return commonNames.length > 0 ? allSiteColumns[0].filter(col => {
      const id = col.name;
      return id && commonNames.includes(id);
    })
      : [];
  },

  async createListColumn(siteId: string, listId: string, column: SiteColumnDefinition, index: boolean = false): Promise<void> {
    const baseUrl = `https://graph.microsoft.com/v1.0/sites/${encodeURIComponent(siteId)}/lists/${encodeURIComponent(listId)}`;

    // 1. Create the column
    const createUrl = `${baseUrl}/columns`;
    const res = await http.post(createUrl, stripUnsupported(column));

    // 2. Optionally set it as indexed
    if (index && res?.data?.id) {
      const columnId = res.data.id;
      const patchUrl = `${baseUrl}/columns/${columnId}`;
      await http.patch(patchUrl, { indexed: true });
    }
  },

  async createParentFieldDefinition(displayName: string): Promise<NumberColumnDefinition> {
    // SharePoint-compatible GUID generator
    const generateGuid = (): string => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Calculate SharePoint-compatible internal field name
    const calculateName = (displayName: string): string => {
      // Remove all non-alphanumeric characters except underscores
      let cleanedName = displayName
        .replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, '') // Allow letters, numbers, underscores, and common accented chars
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_{2,}/g, '_') // Replace multiple underscores with single
        .replace(/^_+|_+$/g, '') // Trim underscores from start/end
        .toLowerCase();

      // Ensure name doesn't start with a number (SharePoint restriction)
      if (/^\d/.test(cleanedName)) {
        cleanedName = `f${cleanedName}`;
      }

      // Ensure total length is <= 32 characters (SharePoint limit for field names)
      const maxLength = 32;
      const prefix = 'hb';

      // Calculate available length for the display name part
      const availableLength = maxLength - prefix.length;

      if (cleanedName.length > availableLength) {
        cleanedName = cleanedName.substring(0, availableLength);
      }

      // Remove trailing underscores
      cleanedName = cleanedName.replace(/_+$/, '');

      return `${prefix}${cleanedName}`;
    };

    const name = calculateName(displayName);

    return {
      type: "number",
      number: {
        decimalPlaces: "none",
        displayAs: "number",
      },
      status: "new",
      id: generateGuid(),
      name: name,
      columnGroup: "Handbook365",
      displayName,
    };
  },

});

