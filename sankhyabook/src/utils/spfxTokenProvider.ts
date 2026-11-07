import type { WebPartContext } from "@microsoft/sp-webpart-base";
import type { TokenProvider } from "@sankhyatronics/apiclient";
import { GRAPH_RESOURCE } from "./constants";

export function makeGraphTokenProvider(context: WebPartContext): TokenProvider {
  return async () => {
    const aad = await context.aadTokenProviderFactory.getTokenProvider();
    return await aad.getToken(GRAPH_RESOURCE);
  };
}