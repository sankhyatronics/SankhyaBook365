import * as React from 'react';
import {
  Card,
  CardPreview,
  Text,
  Button,
  Tooltip,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import { FALLBACK_IMG } from '../../common/commonTypes';
import { useHandbookStyles } from '../../common/Styles';
import { IPageCardProps } from '../../common/Interfaces';
import { HandbookConstants } from '../../common/Constants';

const PageCard: React.FC<IPageCardProps> = ({
  strings,
  page,
  size,
  selectable = false,
  onSelect,
  isSelected = false,
}) => {
  const classes = useHandbookStyles();

  if (!page) return null;

  const sizeClass =
    size === 'small' ? classes.pageCardSmall :
    size === 'large' ? classes.pageCard :
    classes.pageCardFit;

  const formatDate = (date?: Date | string): string => {
    if (!date) return '';
    try { return new Date(date).toLocaleDateString(); }
    catch { return ''; }
  };

  const handleClick = () => {
    if (selectable && page.id) onSelect?.(page);
  };

  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page?.webUrl) window.open(page.webUrl, HandbookConstants.LinkTarget.Blank);
  };

  const previewHeight =
    size === 'small' ? 120 :
    size === 'large' ? 180 : 160;

  const tooltipContent = (
    <div style={{ padding: 8 }}>
      {page.lastModifiedDateTime && (
        <div style={{ marginBottom: 4 }}>
          <strong>{strings.Updated}:</strong> {formatDate(page.lastModifiedDateTime)}
        </div>
      )}
      {page.lastModifiedBy?.user?.displayName && (
        <div>
          <strong>{strings.UpdatedBy}:</strong> {page.lastModifiedBy.user.displayName}
        </div>
      )}
    </div>
  );

  return (
    <Card
      className={mergeClasses(
        sizeClass,
        classes.pageCardRoot,
        selectable && isSelected ? classes.pageCardRootSelected : undefined,
        selectable && !isSelected ? classes.colorTransition : undefined
      )}
      onClick={handleClick}
      data-page-id={page.id}
      data-testid={`page-card-${page.id || 'unknown'}`}
      style={{ overflow: 'hidden' }}
    >
      <CardPreview style={{ height: previewHeight, overflow: 'hidden' }}>
        <img
          src={page?.thumbnailWebUrl || FALLBACK_IMG}
          alt={page.title || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </CardPreview>

      <div
        style={{
          padding: '12px 16px 4px',
          fontSize: size === 'small' ? '14px' : '16px',
          fontWeight: 600,
          cursor: 'pointer',
          borderBottom: `1px solid ${selectable && isSelected ? tokens.colorBrandStroke1 : tokens.colorNeutralStroke2}`,
        }}
        onClick={handleLocationClick}
      >
        {page.title || ''}
      </div>

      <div style={{ padding: '4px 16px', flex: 1, overflow: 'hidden' }}>
        {size !== 'small' && page.description && (
          <Text
            size={200}
            style={{
              lineHeight: '1.4',
              height: size === 'large' ? '60px' : '40px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: size === 'large' ? 3 : 2,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}
          >
            {page.description}
          </Text>
        )}
      </div>

      <div
        className={classes.rowNoWrap}
        style={{ justifyContent: 'flex-end', padding: '8px 8px 12px 16px', marginTop: size === 'small' ? 0 : 'auto' }}
      >
        <Tooltip content={tooltipContent} relationship="description">
          <Button
            appearance="subtle"
            size="small"
            icon={<InfoRegular style={{ fontSize: 12 }} />}
            aria-label="Page information"
            onClick={(e) => e.stopPropagation()}
            style={{ height: 28, width: 28, minWidth: 28, borderRadius: '50%' }}
          />
        </Tooltip>
      </div>
    </Card>
  );
};

export default PageCard;
