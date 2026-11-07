export const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

/** Extract hostname and trimmed path from a full SharePoint site URL */
export function parseSiteUrl(siteUrl: string): { hostname: string; sitePath: string } {
    const url = new URL(siteUrl);
    const sitePath = url.pathname.replace(/^\/+|\/+$/g, ''); // e.g., sites/YourSite
    return { hostname: url.hostname, sitePath: sitePath };
}

/**
 * Constructs a Microsoft Graph URL for a specific site and resource.
 * @param webUrl The full URL of the SharePoint site
 * @param resourcePath The path to the resource (e.g., '/lists/items')
 * @returns The fully qualified Graph URL
 */
export function buildGraphUrl(webUrl: string, resourcePath: string = ""): string {
    const { hostname, sitePath } = parseSiteUrl(webUrl);
    // Ensure resourcePath starts with / if not empty and not already starting with /
    const path = resourcePath && !resourcePath.startsWith('/') ? `/${resourcePath}` : resourcePath;
    return `${GRAPH_BASE}/sites/${hostname}:/${sitePath}:${path}`;
}
