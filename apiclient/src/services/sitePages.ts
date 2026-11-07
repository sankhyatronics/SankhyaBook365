// pagesService.ts
import { AxiosInstance } from "axios";
import { getWithRetry, patchWithRetry, postWithRetry } from "../utils/Retry";
import { GRAPH_BASE } from "../utils/graph";
import { GetSitePagesOptions, GetSitePagesResult, PageBasics, SitePage } from "../model/SitePage";

async function fetchPagesInBatch(http: AxiosInstance, siteId: string, pageIds: string[]): Promise<PageBasics[]> {
  const BATCH_SIZE = 20; // Graph limit
  const results: PageBasics[] = [];

  for (let i = 0; i < pageIds.length; i += BATCH_SIZE) {
    const chunk = pageIds.slice(i, i + BATCH_SIZE);

    const batchBody = {
      requests: chunk.map((uid, idx) => ({
        id: String(i + idx),
        method: "GET",
        url: `/sites/${siteId}/pages/${uid}/microsoft.graph.sitePage?$select=id,name,title,webUrl,sharepointIds,thumbnailWebUrl,description,createdBy,createdDateTime,lastModifiedBy,lastModifiedDateTime`,
      }))
    };

    const resp = await http.post(`${GRAPH_BASE}/$batch`, batchBody, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    });

    // Collect results
    const responses = resp.data?.responses ?? [];
    for (const r of responses) {
      if (r.status === 200) {
        results.push(r.body as PageBasics);
      }
    }
  }

  return results;
}


export const sitePagesService = (http: AxiosInstance) => ({
  async copyPage(
    siteId: string,
    listId: string,
    name: string,
    title: string,
    templateFileName: string,
    fromBlank: boolean,
    parentFieldInternalName: string,
    parentId?: number | null,
  ): Promise<string | undefined> {

    // 1) Get the Drive for the Site Pages library
    const drive = await getWithRetry(http, `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/drive`);
    const driveId: string = drive.data?.id;

    // 2) Copy to a new file name
    const cleanTitle = name.replace(/\s+/g, "-").replace(/[^A-Za-z0-9._-]/g, "").substring(0, 60);
    const filename = `${cleanTitle}.aspx`;

    if (fromBlank) {
      await postWithRetry(http,
        `${GRAPH_BASE}/sites/${siteId}/pages`,
        {
          "@odata.type": "#microsoft.graph.sitePage",
          "name": filename,
          "title": title,
          "pageLayout": "article",
        });
    }
    else {
      // 3) Resolve the source file (template) by path
      const sourcePath = encodeURIComponent(templateFileName);
      const sourceItem = await getWithRetry(
        http,
        `${GRAPH_BASE}/sites/${siteId}/drives/${driveId}/root:/${sourcePath}`
      );
      await postWithRetry(http,
        `${GRAPH_BASE}/sites/${siteId}/drives/${driveId}/items/${sourceItem.data.id}/copy`,
        {
          "parentReference": { "driveId": driveId, "id": "root" },
          "name": filename,
          "title": title
        });
    }

    // 4) Poll until the new file is available (copy is async)
    const targetPath = encodeURIComponent(filename);
    const maxAttempts = 15;
    const baseDelayMs = 400;

    let newPage: any = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        newPage = await getWithRetry(
          http,
          `${GRAPH_BASE}/sites/${siteId}/drives/${driveId}/root:/${targetPath}?$expand=listItem`
        );
        if (newPage?.data?.id) break; // success
      } catch {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt)); // backoff
    }
    if (!newPage?.data?.id) return undefined;



    // 5) Patch list item fields: Title + Parent (dynamic internal name)
    const me = await getWithRetry(http, `${GRAPH_BASE}/me?$select=userPrincipalName`);
    const itemId = newPage.data.listItem?.id;
    if (itemId) {
      const fieldsPayload: Record<string, any> = {
        Title: title,
        [parentFieldInternalName]: parentId ?? null,
      };
      await patchWithRetry(
        http,
        `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items/${itemId}/fields`,
        fieldsPayload
      );
    }

    return newPage.data.webUrl;
  },

  async getPages(opts: GetSitePagesOptions): Promise<GetSitePagesResult> {
    const { siteId, listId, parentField, filter, top = 100, nextLink } = opts;

    // Build the items URL (or reuse nextLink for paging)
    let itemsUrl: string;
    if (nextLink) {
      itemsUrl = nextLink;
    } else {
      const listPath = `/sites/${encodeURIComponent(siteId)}/lists/${encodeURIComponent(listId)}`;
      const selectItem = `id,webUrl,sharepointIds`;
      const expandFields = `$expand=fields($select=${parentField})`;
      const filterClause = filter ? `&$filter=${encodeURIComponent(filter)}` : "";
      const topClause = top ? `&$top=${top}` : "";
      const orderByClause = `&$orderby=fields/Title asc`
      itemsUrl = `${GRAPH_BASE}${listPath}/items?$select=${selectItem}&${expandFields}${filterClause}${topClause}${orderByClause}`;
    }

    // 1) Get a page of "list items" from "Site Pages"
    const itemsResp = await getWithRetry(http, itemsUrl, {
      method: "GET",
      headers: {
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    });
    const rawItems = itemsResp.data ?? {};
    const valItems: any[] = Array.isArray(rawItems.value) ? rawItems.value : [];
    const result: GetSitePagesResult = {
      nextLink: rawItems["@odata.nextLink"] ?? "",
      items: [],
    };

    if (valItems.length === 0) {
      return result;
    }

    // 2) fetch page metadata in batch
    const uids = Array.from(
      new Set(
        valItems
          .map((it) => it?.sharepointIds?.listItemUniqueId)
          .filter(Boolean)
      )
    );
    const pages = await fetchPagesInBatch(http, siteId, uids);

    // Build a lookup by listItemId -> page (Graph returns listItemId as string/number; normalize to number)
    const pagesByListId = new Map<number, (typeof pages)[number]>();
    for (const p of pages ?? []) {
      const k = Number(p?.sharepointIds?.listItemId);
      if (Number.isFinite(k)) {
        pagesByListId.set(k, p);
      }
    }

    // 3) Join by key: item.id === page.sharepointIds.listItemId
    const joined: SitePage[] = valItems
      .map((item: any) => {
        const itemId = Number(item?.id);
        if (!Number.isFinite(itemId)) return null;

        const page = pagesByListId.get(itemId);
        if (!page) return null;
        const rawParent = item?.fields?.[parentField];
        const parentId = Number(rawParent) || 0;

        // console.log(`match: item.id=${itemId} page.listItemId=${page.sharepointIds?.listItemId}`);

        const sitePage: SitePage = {
          page,
          id: itemId,
          parentId,
          fields: item?.fields ?? {},
        };
        return sitePage;
      })
      .filter((x): x is SitePage => x !== null)
      .sort((a, b) => {
        const ta = (a.page?.title ?? a.fields?.Title ?? "").trim();
        const tb = (b.page?.title ?? b.fields?.Title ?? "").trim();
        return ta.localeCompare(tb, undefined, { sensitivity: "base", numeric: true });
      });

    result.items = joined;
    return result;
  },

  /**
 * Check if a page with the given Title or filename already exists in the Site Pages library.
 * Returns true if it exists, false otherwise.
 */
  async checkPageNameExists(siteId: string, listId: string, nameRaw: string): Promise<boolean> {
    const name = (nameRaw ?? "").trim();
    if (!name) return false;

    // Escape single quotes for OData
    const esc = (s: string) => s.replace(/'/g, "''");

    // Build the same clean filename used by copyPage()
    const fileLeafRef = `${name}.aspx`;

    // Filter by Title or FileLeafRef (filename)
    const filter = `fields/Title eq '${esc(name)}' or fields/FileLeafRef eq '${esc(fileLeafRef)}'`;

    const url =
      `${GRAPH_BASE}/sites/${encodeURIComponent(siteId)}` +
      `/lists/${encodeURIComponent(listId)}` +
      `/items?$select=id&$filter=${encodeURIComponent(filter)}&$top=1`;

    const resp = await getWithRetry(http, url, {
      method: "GET",
      headers: {
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const arr: any[] = Array.isArray(resp?.data?.value) ? resp.data.value : [];
    return arr.length > 0;
  },

});