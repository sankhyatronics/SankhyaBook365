import * as React from 'react';
import { mergeClasses, Button, Tooltip } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronRightRegular, DocumentRegular, LinkDismissRegular } from '@fluentui/react-icons';
import { useHandbookStyles } from '../../common/Styles';
import { IMosaicNodeProps, ISitePageTreeNode } from '../../common/Interfaces';

export const MosaicNode: React.FC<IMosaicNodeProps> = React.memo(
  ({ strings, node, dragOverId, onDragStart, onDragEnterNode, onDragLeaveNode, onDropOnNode, expanded, setExpanded, onUnparent }) => {
    const classes = useHandbookStyles();
    const id = node.id;
    const title = node.page?.title;
    const children = node.children ?? [];
    const isDragOver = dragOverId === id;
    const hasChildren = children.length > 0;
    const isOpen = expanded[id] ?? false;

    const toggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      setExpanded(prev => ({ ...prev, [id]: !(prev[id] ?? false) }));
    };

    const toggleKey = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); }
    };

    return (
      <div
        className={mergeClasses(classes.mosaicItem, isDragOver ? classes.mosaicItemDragOver : undefined)}
        draggable
        onDragStart={(e) => onDragStart(e, id)}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => onDragEnterNode(e, id)}
        onDragLeave={(e) => onDragLeaveNode(e, id)}
        onDrop={(e) => onDropOnNode(e, id)}
        title={strings.DragOnMessage}
      >
        <div
          className={mergeClasses(classes.mosaicCardBase, isOpen ? classes.mosaicCardOpen : classes.mosaicCardClosed)}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          <div className={classes.mosaicHeader}>
            {hasChildren ? (
              <div
                role="button"
                tabIndex={0}
                aria-label={isOpen ? strings.Collapse : strings.Expand}
                className={classes.mosaicToggle}
                onClick={toggle}
                onKeyDown={toggleKey}
                title={isOpen ? strings.Collapse : strings.Expand}
              >
                {isOpen
                  ? <ChevronDownRegular style={{ fontSize: 16 }} />
                  : <ChevronRightRegular style={{ fontSize: 16 }} />
                }
              </div>
            ) : (
              <DocumentRegular style={{ fontSize: 16 }} />
            )}

            <div className={classes.mosaicHeaderMain}>
              <span className={classes.mosaicTitle} title={`${title} (#${id})`}>{title}</span>
              <span className={classes.mosaicSubtitle} />
              <Tooltip content={strings.RemoveParent} relationship="label">
                <Button
                  appearance="subtle"
                  size="small"
                  disabled={node.parentId === 0}
                  aria-label={strings.RemoveParent}
                  icon={<LinkDismissRegular />}
                  onClick={(e) => { e.stopPropagation(); void onUnparent(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </div>
          </div>

          <div className={mergeClasses(classes.mosaicChildrenWrap, isOpen ? classes.mosaicChildrenWrapOpen : classes.mosaicChildrenWrapClosed)}>
            {hasChildren && (
              <div className={classes.mosaicChildren}>
                {children.map((child: ISitePageTreeNode) => (
                  <MosaicNode
                    key={child.id}
                    node={child}
                    dragOverId={dragOverId}
                    onDragStart={onDragStart}
                    onDragEnterNode={onDragEnterNode}
                    onDragLeaveNode={onDragLeaveNode}
                    onDropOnNode={onDropOnNode}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    onUnparent={onUnparent}
                    strings={strings}
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

MosaicNode.displayName = 'MosaicNode';
