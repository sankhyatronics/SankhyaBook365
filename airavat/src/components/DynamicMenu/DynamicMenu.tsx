import * as React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
} from '@fluentui/react-components';
import { CheckmarkRegular } from '@fluentui/react-icons';
import { IDynamicMenuProps, INavItem, ISitePageTreeNode } from '../../common/Interfaces';
import { ControlledBits } from '../../common/commonTypes';

const renderSubMenuItems = (items: INavItem[]): React.ReactElement[] =>
  items.map((item) => {
    if (item.itemType === 'divider') return <MenuDivider key={item.key} />;
    if (item.subMenuProps?.items?.length) {
      return (
        <Menu key={item.key}>
          <MenuTrigger disableButtonEnhancement>
            <MenuItem icon={item.checked ? <CheckmarkRegular /> : undefined}>
              {item.text}
            </MenuItem>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {renderSubMenuItems(item.subMenuProps.items)}
            </MenuList>
          </MenuPopover>
        </Menu>
      );
    }
    return (
      <MenuItem
        key={item.key}
        icon={item.checked ? <CheckmarkRegular /> : undefined}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        {item.text}
      </MenuItem>
    );
  });

const renderTopLevelItem = (item: INavItem): React.ReactElement => {
  if (item.subMenuProps?.items?.length) {
    return (
      <Menu key={item.key}>
        <MenuTrigger>
          <MenuButton appearance="subtle" size="small" icon={item.icon}>
            {item.iconOnly ? undefined : item.text}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {renderSubMenuItems(item.subMenuProps.items)}
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }

  if (item.iconOnly && item.ariaLabel) {
    return (
      <Tooltip key={item.key} content={item.ariaLabel} relationship="label">
        <Button
          appearance="subtle"
          size="small"
          icon={item.icon}
          onClick={item.onClick}
          disabled={item.disabled}
          aria-label={item.ariaLabel}
        />
      </Tooltip>
    );
  }

  return (
    <Button
      key={item.key}
      appearance="subtle"
      size="small"
      icon={item.icon}
      onClick={item.onClick}
      disabled={item.disabled}
      aria-label={item.ariaLabel}
    >
      {item.iconOnly ? undefined : item.text}
    </Button>
  );
};

const DynamicMenu: React.FC<IDynamicMenuProps & ControlledBits> = (props) => {
  const onlyBranches = React.useCallback(
    (nodes: ISitePageTreeNode[]) =>
      (nodes ?? []).filter((n) => (n.children?.length ?? 0) > 0),
    []
  );

  const makeHandleClick = React.useCallback(
    (sourceIdx: number) =>
      (node: ISitePageTreeNode) => {
        const id = node.page?.id ?? node.id;
        if (id !== undefined) props.onSelect?.(id, sourceIdx);
        props.onMenuItemClickWithIndex?.(node, sourceIdx) ??
          props.onMenuItemClick?.(node) ?? null;
      },
    [props.onMenuItemClickWithIndex, props.onMenuItemClick, props.onSelect]
  );

  const toMenuItems = React.useCallback(
    (nodes: ISitePageTreeNode[], sourceIdx: number): INavItem[] =>
      onlyBranches(nodes).map((node, idx) => {
        const nodeId = node.page?.id ?? node.id ?? idx;
        const children = onlyBranches(node.children ?? []);

        const base: INavItem = {
          key: String(nodeId),
          text: node.page?.title || '(Untitled)',
          onClick: () => makeHandleClick(sourceIdx)(node),
          canCheck: true,
          checked:
            props.activeSourceIdx === sourceIdx &&
            Number(props.selectedId) === Number(node.page?.id ?? node.id),
        };

        if (children.length) {
          base.subMenuProps = { items: toMenuItems(children, sourceIdx) };
        }
        return base;
      }),
    [onlyBranches, makeHandleClick, props.selectedId, props.activeSourceIdx]
  );

  const items: INavItem[] = React.useMemo(() => {
    if (props.showOnlyFarItems) return [];
    if (props.roots.length === 1) {
      return toMenuItems(onlyBranches(props.roots[0]), 0);
    }
    return props.roots.map((rootArray, sourceIdx) => {
      const title = Array.isArray(props.siteTitles) ? props.siteTitles[sourceIdx] : undefined;
      const submenu = toMenuItems(onlyBranches(rootArray), sourceIdx);
      return {
        key: `source-${sourceIdx}`,
        text: title || `Source ${sourceIdx + 1}`,
        subMenuProps: { items: submenu },
        onClick: () => { if (submenu[0]?.onClick) submenu[0].onClick(); },
        canCheck: true,
        checked: props.activeSourceIdx === sourceIdx,
      } as INavItem;
    });
  }, [props.roots, props.siteTitles, props.activeSourceIdx, props.selectedId, onlyBranches, toMenuItems]);

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {items.map(renderTopLevelItem)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {(props.farItems ?? []).map(renderTopLevelItem)}
        </div>
      </div>
    </section>
  );
};

export default DynamicMenu;
