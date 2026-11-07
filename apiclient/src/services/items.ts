import type { AxiosInstance } from "axios";
import { buildGraphUrl } from "../utils/graph";
import { patchWithRetry } from "../utils/Retry";

export const itemsService = (http: AxiosInstance) => ({
  /**
   * Updates a SharePoint list item's fields via Microsoft Graph
   * (PATCH /sites/{site}/lists/{listId}/items/{itemId}/fields).
   *
   * @param webUrl  SharePoint site URL
   * @param listId  List ID (GUID)
   * @param itemId  List item ID
   * @param updates internalName -> new value
   * @returns The updated fields object returned by Graph
   */
  async updateItem(
    webUrl: string,
    listId: string,
    itemId: number,
    updates: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const url = buildGraphUrl(webUrl, `/lists/${listId}/items/${itemId}/fields`);
    const res = await patchWithRetry(http, url, updates, {
      headers: { "Content-Type": "application/json" },
    });
    return res?.data ?? {};
  },
});
