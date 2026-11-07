export class Helpers {

    /**
     * Finds common internal names across all sites
     */
    public static findCommonInternalNames(allSiteColumns: Map<string, string>[]): string[] {
        if (!allSiteColumns || allSiteColumns.length === 0) return [];

        // Filter out undefined/null and empty maps
        const validMaps = allSiteColumns.filter(map => map instanceof Map && map.size > 0);
        if (validMaps.length === 0) return [];

        // Safety check: ensure first map exists and is a Map
        if (!validMaps[0] || !(validMaps[0] instanceof Map)) return [];

        // Get InternalNames from first site
        const firstSiteInternalNames = Array.from(validMaps[0].keys());

        // Find intersection with all other sites
        let commonInternalNames = firstSiteInternalNames;

        for (let i = 1; i < validMaps.length; i++) {
            const currentSiteMap = validMaps[i];
            // Ensure current map is valid
            if (!currentSiteMap || !(currentSiteMap instanceof Map)) {
                continue; // Skip invalid maps
            }

            const currentSiteInternalNames = Array.from(currentSiteMap.keys());
            commonInternalNames = commonInternalNames.filter(internalName =>
                currentSiteInternalNames?.indexOf?.(internalName) !== -1
            );
        }

        return commonInternalNames;
    }
 
}