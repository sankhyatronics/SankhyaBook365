import * as React from "react";
import { MosaicNode } from "./MosaicNode";
import { useHandbookStyles } from "../../common/Styles";
import { IPageHierarchyManagerProps } from "../../common/Interfaces";

const PageHierarchyManager: React.FC<IPageHierarchyManagerProps> = (props) => {
  const classes = useHandbookStyles();

  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [dragOverId, setDragOverId] = React.useState<number>(0);

  const moveToParent = React.useCallback(
    async (id: number, parentId: number | undefined) => {
      if (parentId === id) return;
      const current = props.pages.find((x) => x.id === id);
      if (!current) return;

      const originalParent = current?.parentId ?? null;
      const nextParent = parentId ?? null;
      if (originalParent === nextParent) return;

      // Expand target after drop (UX nicety)
      if (typeof parentId === "number") {
        setExpanded((e) => ({ ...e, [parentId]: true }));
      }

      // Delegate to parent (single source of truth)
      await props.onReparent?.(id, nextParent);
    },
    [props.pages, props.onReparent]
  );

  // DnD helpers
  const onDragStart = (e: React.DragEvent, id: number) => {
    e.stopPropagation();
    e.dataTransfer.setData("application/x-node-id", String(id));
    e.dataTransfer.setData("text/plain", String(id));
    e.dataTransfer.effectAllowed = "move";
  };
  const extractDragId = (e: React.DragEvent) => {
    const v = e.dataTransfer.getData("application/x-node-id") || e.dataTransfer.getData("text/plain");
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };
  const onDropOnNode = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = extractDragId(e);
    if (!draggedId || draggedId === targetId) return;
    setDragOverId(0);
    void moveToParent(draggedId, targetId);
  };
  const onDragEnterNode = (_e: React.DragEvent, targetId: number) => setDragOverId(targetId);
  const onDragLeaveNode = (_e: React.DragEvent, targetId: number) => {
    if (dragOverId === targetId) setDragOverId(0);
  };
  const onDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = extractDragId(e);
    if (!draggedId) return;
    setDragOverId(0);
    void moveToParent(draggedId, undefined); // unparent
  };
  const unparentItem = React.useCallback(async (id: number) => {
    await moveToParent(id, undefined);
  }, [moveToParent]);

  // Site selection handler
  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(event.target.value, 10);
    if (!isNaN(newIndex) && props.onSiteChange) {
      props.onSiteChange(newIndex);
    }
  };

  return (
    <div className={classes.hierarchyManagerContainer}>
      {/* View and Site Selector Header - Only show if props provided */}
      {(props.currentView || props.availableSites) && (
        <div className={classes.hierarchyManagerHeader}>
          <div className={classes.headerControls}>
            {props.availableSites && props.availableSites.length > 1 && (
              <div className={classes.controlGroup}>
                <label className={classes.controlLabel}>
                  {props.strings?.Site || "Site"}:
                </label>
                <select
                  className={classes.siteSelect}
                  value={props.currentSiteIndex || 0}
                  onChange={handleSiteChange}
                >
                  {props.availableSites.map((site, index) => (
                    <option key={index} value={index}>
                      {site.title || `${props.strings?.Site || "Site"} ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {props.currentView && props.onViewChange && (
              <div className={classes.controlGroup}>
                <label className={classes.controlLabel}>
                  {props.strings?.View || "View"}: {props.currentView.label}
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hierarchy Content */}
      <div
        className={classes.mosaicBoard}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropOnRoot}
      >
        {props.root.length === 0 ? (
          <div className={classes.emptyHierarchy}>
            <p>{props.strings.NoPagesAvailable}</p>
            {props.currentHandbook?.parentField && (
              <p className={classes.emptyHint}>
                {props.strings?.CurrentField}: {props.currentHandbook.parentField}
              </p>
            )}
          </div>
        ) : (
          props.root.map((node) => (
            node.page?.title && (
              <MosaicNode
                key={node.id}
                node={node}
                dragOverId={dragOverId}
                onDragStart={onDragStart}
                onDragEnterNode={onDragEnterNode}
                onDragLeaveNode={onDragLeaveNode}
                onDropOnNode={onDropOnNode}
                expanded={expanded}
                setExpanded={setExpanded}
                onUnparent={unparentItem}
                strings={props.strings}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};

export default PageHierarchyManager;
