import { createHttpClient } from "./core/http";
import { itemsService } from "./services/items";
import { columnsService } from "./services/columns";
import { siteService } from "./services/sites";
import { sitePagesService } from "./services/sitePages";

export function createApiInstance(opts: {
  baseURL?: string;
  getToken?: (force?: boolean) => Promise<string | null>;
  onAuthFailure?: (e: unknown) => void;
}) {
  const http = createHttpClient({
    ...opts,
    baseURL: opts.baseURL ?? "",
  });
  return {
    http,
    columns: columnsService(http),
    items: itemsService(http),
    sites: siteService(http),
    sitePages: sitePagesService(http),
  };
}
