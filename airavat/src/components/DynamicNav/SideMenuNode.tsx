import * as React from 'react';
import { mergeClasses, Button } from '@fluentui/react-components';
import { ArrowSquareUpRightRegular } from '@fluentui/react-icons';
import { useHandbookStyles } from '../../common/Styles';
import { ISideMenuNodeProps, ISitePageTreeNode } from '../../common/Interfaces';

export const SideMenuNode: React.FC<ISideMenuNodeProps> = React.memo(
  ({ node, expanded, setExpanded, showLeaf, onMenuItemClick, selectedId, onSelect, isChild }) => {
    const classes = useHandbookStyles();
    const id = node.id;
    const title = node.page?.title;
    const children = node.children ?? [];
    const hasChildren = children.length > 0;
    const webUrl = node.page?.webUrl;

    if (!showLeaf && !hasChildren) return null;

    const canToggle = hasChildren && showLeaf;
    const isOpen = canToggle ? (expanded[id] ?? true) : true;
    const ariaExpanded = canToggle ? (expanded[id] ?? true) : undefined;
    const isSelected = selectedId === id;

    const toggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      if (canToggle) {
        setExpanded(prev => ({ ...prev, [id]: !(prev[id] ?? true) }));
      }
    };

    const toggleKey = (e: React.KeyboardEvent) => {
      if (!canToggle) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(e);
      }
    };

    const handleTitleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(id, node);
      onMenuItemClick?.(node);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(id, node);
        onMenuItemClick?.(node);
      }
    };

    const headerRole = canToggle ? 'button' : undefined;
    const headerTabIndex = canToggle ? 0 : -1;

    return (
      <div className={mergeClasses(classes.row, classes.fullWidth, classes.transition)} key={id}>
        <div className={mergeClasses(classes.col, classes.fullWidth, classes.colorTransition)} aria-expanded={hasChildren ? ariaExpanded : undefined}>
          <div
            className={mergeClasses(
              classes.rowNoWrap,
              classes.controlBackHoverStrong,
              isSelected ? classes.navRowSelected : undefined
            )}
            role={headerRole}
            tabIndex={headerTabIndex}
            onClick={canToggle ? toggle : undefined}
            onKeyDown={canToggle ? toggleKey : undefined}
          >
            <div className={classes.navHeader}>
              <div className={mergeClasses(classes.rowNoWrap, classes.navHeader)}>
                <div
                  onClick={handleTitleClick}
                  onKeyDown={handleTitleKeyDown}
                  className={mergeClasses(
                    classes.navTitle,
                    classes.leftMargin,
                    isChild ? classes.leftMargin2 : undefined,
                    hasChildren && showLeaf ? classes.Bold : classes.Normal
                  )}
                >
                  {title}
                </div>
                <Button
                  className={classes.navIcon}
                  appearance="subtle"
                  size="small"
                  icon={<ArrowSquareUpRightRegular />}
                  onClick={() => window.open(webUrl, '_blank')}
                  aria-label="Open in new tab"
                  style={{ minWidth: 24, width: 24, height: 24, padding: 0 }}
                />
              </div>
            </div>
          </div>
          <div
            className={mergeClasses(
              classes.navChildrenWrap,
              isOpen ? classes.navChildrenWrapOpen : classes.navChildrenWrapClosed
            )}
          >
            {hasChildren && (
              <div className={classes.navChildren}>
                {children.map((child: ISitePageTreeNode) => (
                  <SideMenuNode
                    key={child.id}
                    node={child}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    showLeaf={showLeaf}
                    onMenuItemClick={onMenuItemClick}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    isChild={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SideMenuNode.displayName = 'SideMenuNode';
