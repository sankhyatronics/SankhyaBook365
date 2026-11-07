import type { AxiosInstance } from "axios";
import { getWithRetry } from "../utils/Retry";
import { buildGraphUrl } from "../utils/graph";

/** Use the shared axios instance so Authorization is injected by the interceptor */
export const siteService = (http: AxiosInstance) => ({
  async resolveSharePointIds(siteUrl: string): Promise<{ siteId: string; isSubsite: boolean; webTitle: string; }> {
    // 1) Get site (includes displayName = SP web title)
    const siteRes = await getWithRetry(http, buildGraphUrl(siteUrl));


    const siteData = siteRes.data as {
      id: string;
      displayName?: string;
      name?: string;
      siteCollection?: unknown;
    };

    const siteId = siteData.id;
    const isSubsite = !siteData.siteCollection;
    const webTitle = siteData.displayName ?? siteData.name ?? "";

    return {
      siteId,
      isSubsite,
      webTitle,
    };
  }

});

