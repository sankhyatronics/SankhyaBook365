import * as React from 'react';
import { useState, useCallback } from 'react';
import { mergeClasses, Text } from '@fluentui/react-components';
import { IDynamicNavProps } from '../../common/Interfaces';
import { ControlledBits } from '../../common/commonTypes';
import { SideMenuNode } from './SideMenuNode';
import { SitePage } from '@sankhyatronics/apiclient';
import { useHandbookStyles } from '../../common/Styles';

const DynamicNav: React.FC<IDynamicNavProps & ControlledBits> = (props) => {
  const classes = useHandbookStyles();

  const [ucActiveIdx, setUcActiveIdx] = useState<number>(0);
  const [ucSelectedId, setUcSelectedId] = useState<string | number | undefined>(undefined);

  const activeIdx = props.activeSourceIdx ?? ucActiveIdx;
  const selectedGlobalId = props.selectedId ?? ucSelectedId;

  const [expandedBySource, setExpandedBySource] = useState<Record<number, Record<number, boolean>>>({});

  const selectInTree = useCallback(
    (id: string | number, sourceIdx: number) => {
      if (props.onSelect) {
        props.onSelect(id, sourceIdx);
      } else {
        setUcActiveIdx(sourceIdx);
        setUcSelectedId(id);
      }
    },
    [props.onSelect]
  );

  const getExpandedFor = (idx: number): Record<number, boolean> => expandedBySource[idx] ?? {};
  const setExpandedFor = (idx: number) =>
    (updater: React.SetStateAction<Record<number, boolean>>) => {
      setExpandedBySource(prev => {
        const current = prev[idx] ?? {};
        const next = typeof updater === 'function' ? (updater as any)(current) : updater;
        return { ...prev, [idx]: next };
      });
    };

  const makeHandleClick = useCallback(
    (sourceIdx: number) =>
      (node: SitePage) => {
        props.onMenuItemClickWithIndex?.(node, sourceIdx) ??
          props.onMenuItemClick?.(node) ?? null;
      },
    [props.onMenuItemClickWithIndex, props.onMenuItemClick]
  );

  const hasTitles =
    Array.isArray(props.siteTitles) && props.siteTitles.length === props.roots.length;

  return (
    <>
      {props.roots.map((rootArray, sourceIdx) => {
        const title = hasTitles ? props.siteTitles![sourceIdx] : undefined;
        const expanded = getExpandedFor(sourceIdx);
        const setExpanded = setExpandedFor(sourceIdx);
        const handleClick = makeHandleClick(sourceIdx);
        const onSelectForThisTree = (id: string | number) => selectInTree(id, sourceIdx);
        const selectedIdForThisTree = sourceIdx === activeIdx ? selectedGlobalId : undefined;
        const isSelected = sourceIdx === activeIdx;

        return (
          <section key={`nav-source-${sourceIdx}`} style={{ margin: 8 }}>
            {title && (
              <div
                key={`nav-source-item-${sourceIdx}`}
                className={mergeClasses(
                  classes.rowNoWrap,
                  classes.controlHeaderBackHoverStrong,
                  isSelected ? classes.navHeaderSelected : undefined
                )}
                style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, cursor: 'pointer', userSelect: 'none', padding: '4px 8px' }}
                onClick={() => selectInTree(0, sourceIdx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectInTree(0, sourceIdx);
                  }
                }}
                title={`${props.strings.ClickToSelect} ${title}`}
              >
                <Text weight="semibold" size={400}>{title}</Text>
              </div>
            )}
            {rootArray.map((node) => (
              <SideMenuNode
                key={node.id}
                node={node}
                expanded={expanded}
                setExpanded={setExpanded}
                showLeaf={props.showLeaf}
                onMenuItemClick={handleClick}
                selectedId={selectedIdForThisTree}
                onSelect={onSelectForThisTree}
                isChild={false}
              />
            ))}
          </section>
        );
      })}
    </>
  );
};

export default DynamicNav;
