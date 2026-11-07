import React from 'react';
import { Divider, Text } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronRightRegular, ShareRegular } from '@fluentui/react-icons';
import type { ILanguageContent } from '../../../common/Interfaces';

interface SiteDisplay {
  key: string;
  siteName: string;
  url: string;
}

interface SitesSectionProps {
  sites: SiteDisplay[];
  isExpanded: boolean;
  onToggle: () => void;
  strings: ILanguageContent;
  classes: {
    infoSection: string;
    sectionHeader: string;
    expandIcon: string;
    siteIcon: string;
    sectionContent: string;
    sitesList: string;
    siteItem: string;
    urlText: string;
  };
}

export const SitesSection: React.FC<SitesSectionProps> = ({
  sites,
  isExpanded,
  onToggle,
  strings,
  classes,
}) => {
  if (sites.length === 0) return null;

  return (
    <div className={classes.infoSection}>
      <div
        className={classes.sectionHeader}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDownRegular className={classes.expandIcon} />
        ) : (
          <ChevronRightRegular className={classes.expandIcon} />
        )}
        <ShareRegular className={classes.siteIcon} />
        <Text size={300} weight="semibold">
          {strings.TargetSites} ({sites.length})
        </Text>
      </div>
      {isExpanded && (
        <>
          <Divider style={{ margin: '8px 0' }} />
          <div className={classes.sectionContent}>
            <Text size={200} style={{ marginBottom: 10, display: 'block' }}>
              {strings.ViewCreationInfo}
            </Text>
            <div className={classes.sitesList}>
              {sites.map((site) => (
                <div key={site.key} className={classes.siteItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShareRegular style={{ fontSize: 14 }} />
                    <div>
                      <Text size={200} weight="semibold" style={{ display: 'block' }}>
                        {site.siteName}
                      </Text>
                      <Text size={200} className={classes.urlText}>
                        {site.url}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SitesSection;
