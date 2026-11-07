import { SPHttpClient } from '@microsoft/sp-http';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { ISiteInfo, Helpers } from '@sankhyatronics/apiclient';

type SPLib = { Id: string; Title: string; };
type SPCol = { Id: string; InternalName: string; Title: string; };


export interface ISiteColumnData {
  siteColumnMap: Map<string, string>;
  siteInfo: ISiteInfo;
}

export interface IHandbookViewHelperOptions {
  spHttpClient: SPHttpClient;
  sites: IPropertyFieldSite[];
  defaultParentField?: string;
}

export class HandbookViewHelpers {

  /**
   * Generates views based on selected sites and their common numeric columns
   */
  public static async loadSiteInfo(options: IHandbookViewHelperOptions): Promise<ISiteInfo[]> {
    const { spHttpClient, sites, defaultParentField = 'ParentPageId' } = options;

    // Check if sites are defined and not empty
    if (!sites || sites.length === 0) {
      return [];
    }

    try {
      // Process all sites
      const allSiteData = await this.processSites(spHttpClient, sites);

      // Extract column maps and site info
      const allSiteColumns = allSiteData.map(data => data.siteColumnMap);
      const allSiteInfo = allSiteData.map(data => data.siteInfo);

      // Find common columns
      const commonInternalNames = Helpers.findCommonInternalNames(allSiteColumns);

      // Create sources information
      const sources = this.createSources(allSiteInfo, commonInternalNames, defaultParentField);

      return sources;

    } catch (error) {
      console.error('Error in generateViews:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      throw new Error(`Failed to generate views: ${errorMessage}`);
    }
  }

  /**
   * Processes all sites to get their columns and info
   */
  private static async processSites(spHttpClient: SPHttpClient, sites: IPropertyFieldSite[]): Promise<ISiteColumnData[]> {
    const sitePromises = sites.map(async (site) => {
      const siteColumnMap = new Map<string, string>();
      const siteInfo: ISiteInfo = {
        webUrl: `${site.url}`,
        listId: '',
        parentField: '',
        siteTitle: site.title || 'Site',
        parentId: 0,
        siteId: site.id || ''
      };

      try {
        // Get SitePages lists
        const listsResponse = await spHttpClient.get(
          `${site.url}/_api/lists?$filter=EntityTypeName eq 'SitePages'`,
          SPHttpClient.configurations.v1
        );

        if (!listsResponse.ok) {
          console.error(`Failed to get lists for site ${site.url}`);
          return { siteColumnMap, siteInfo };
        }

        const web = await listsResponse.json();

        // Check if web.value exists and is an array
        if (!web || !web.value || !Array.isArray(web.value) || web.value.length === 0) {
          console.error(`No SitePages list found for site ${site.url}`);
          return { siteColumnMap, siteInfo };
        }

        // Use the first SitePages list
        const firstList = web.value[0];
        siteInfo.listId = firstList.Id || '';

        // Process all lists (or just the first one)
        const listPromises = web.value.map(async (lib: SPLib) => {
          try {
            const colsResponse = await spHttpClient.get(
              `${site.url}/_api/web/lists(guid'${lib.Id}')/Fields?$filter=TypeAsString eq 'Number' and startswith(InternalName,'hb')`,
              SPHttpClient.configurations.v1
            );

            if (colsResponse.ok) {
              const cols = await colsResponse.json();
              // Check if cols.value exists and is an array
              if (cols && cols.value && Array.isArray(cols.value)) {
                cols.value.forEach((col: SPCol) => {
                  if (col.InternalName && !siteColumnMap.has(col.InternalName)) {
                    siteColumnMap.set(col.InternalName, col.Title || '');
                  }
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching columns for list ${lib.Id}:`, error);
          }
        });

        await Promise.all(listPromises);
      } catch (error) {
        console.error(`Error processing site ${site.url}:`, error);
      }

      return { siteColumnMap, siteInfo };
    });

    return await Promise.all(sitePromises);
  }

  /**
   * Creates sources array from site info
   */
  private static createSources(
    allSiteInfo: ISiteInfo[],
    commonInternalNames: string[],
    defaultParentField: string
  ): ISiteInfo[] {
    if (commonInternalNames.length > 0) {
      const parentField = commonInternalNames[0]; // Use first common column as parent field
      return allSiteInfo.map(info => ({
        ...info,
        parentField: parentField
      }));
    } else {
      // If no common columns, create default sources
      return allSiteInfo.map(info => ({
        ...info,
        parentField: defaultParentField
      }));
    }
  }
}