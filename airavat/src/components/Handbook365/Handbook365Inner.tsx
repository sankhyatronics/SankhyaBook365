import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from "react";
import DynamicNav from "../DynamicNav/DynamicNav";
import PageCardView from "../PageCardView/PageCardView";
import { SitePage, createApiInstance, ISiteInfo } from "@sankhyatronics/apiclient";
import DynamicMenu from "../DynamicMenu/DynamicMenu";
import PageCreator from "../PageCreator/PageCreator";
import PageHierarchyManager from "../PageHierarchyManager/PageHierarchyManager";
import {
  Button,
  Label,
  OverlayDrawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  DismissRegular,
  TableRegular,
  DocumentAddRegular,
  ArrowClockwiseRegular,
  QuestionCircleRegular,
  EditRegular,
  AddRegular,
} from "@fluentui/react-icons";
import { useHandbookStyles } from "../../common/Styles";
import { IHandbookProps, INavItem } from "../../common/Interfaces";
import { buildTree } from "../../common/utils";
import { Guard } from "../CommonComponents/Guard";
import { Pane, SplitPane } from "react-split-pane";
import { CreateView } from "../CreateView/CreateView";
import { useHandbookData } from "../../hooks/useHandbookData";
import { useHandbookView } from "../../hooks/useHandbookView";
import { DrawerAction, useHandbookDrawer } from "../../hooks/useHandbookDrawer";
import { HandbookConstants } from "../../common/Constants";

const Handbook365Inner: React.FC<IHandbookProps> = (props) => {
  const { tokenProvider, pageSize, LeftMenuSize, strings, showTopMenu } = props;
  const classes = useHandbookStyles();

  // -- Drawer Hook --
  const {
    isOpen,
    setIsOpen,
    drawerAction,
    openDrawer,
    isCreateViewOpen,
    setIsCreateViewOpen
  } = useHandbookDrawer();

  const api = useMemo(
    () => createApiInstance({ getToken: tokenProvider }),
    [tokenProvider]
  );

  // -- View Hook --
  const {
    commonColumns,
    selectedView,
    modifiedSources,
    loadCommonColumns,
    onViewChange: handleViewChange
  } = useHandbookView({ api, sources: props.sources });

  // -- Data Hook --
  const {
    hookResults,
    overrides,
    setOverrides,
    loading,
    reloadAll: reloadData,
    getItemsFor
  } = useHandbookData({ tokenProvider, sources: modifiedSources, pageSize });

  const [currentHandbook, setCurrentHandbook] = useState<ISiteInfo>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Trigger reload of both columns and data
  const reloadAll = useCallback(async () => {
    await reloadData(loadCommonColumns);
  }, [reloadData, loadCommonColumns]);

  // Generate view items from common columns
  const viewItems = useMemo((): INavItem[] => {
    return commonColumns.map((col) => ({
      key: col.name,
      text: col.displayName,
      icon: <TableRegular />,
      onClick: () => {
        handleViewChange(col.name);
        setOverrides({});
      },
      data: {
        fieldName: col.name,
        isNumberField: true
      }
    }));
  }, [commonColumns, handleViewChange, setOverrides]);

  // Create the main view dropdown
  const enhancedViewItem = useMemo((): INavItem | undefined => {
    const divider: INavItem = {
      key: 'divider',
      itemType: 'divider',
    };
    const createView: INavItem = {
      key: 'AddView',
      text: strings.CreateView,
      ariaLabel: strings.CreateView,
      icon: <AddRegular />,
      onClick: () => setIsCreateViewOpen(true),
    };
    const editView: INavItem = {
      key: 'FarItem1',
      text: strings.EditView,
      ariaLabel: strings.EditView,
      icon: <EditRegular />,
      iconOnly: true,
      onClick: () => openDrawer(HandbookConstants.Drawer.ManageHierarchy as DrawerAction),
    };

    if (commonColumns.length === 0) {
      return createView;
    }

    return {
      key: 'views',
      text: selectedView?.label || commonColumns[0].displayName,
      icon: <TableRegular />,
      subMenuProps: {
        items: [...viewItems, divider, createView, editView]
      },
      data: {
        isViewSelector: true,
        columnCount: commonColumns.length
      }
    };
  }, [commonColumns, selectedView, viewItems, strings, openDrawer, setIsCreateViewOpen]);

  const farItems: INavItem[] = [
    ...(enhancedViewItem ? [enhancedViewItem] : []),
    {
      key: 'FarItem2',
      text: strings.CreateChildPage,
      ariaLabel: strings.CreateChildPage,
      iconOnly: true,
      icon: <DocumentAddRegular />,
      onClick: () => openDrawer(HandbookConstants.Drawer.NewChildPage as DrawerAction)
    },
    {
      key: 'FarItem3',
      text: strings.Refresh,
      ariaLabel: strings.Refresh,
      iconOnly: true,
      icon: <ArrowClockwiseRegular />,
      onClick: reloadAll,
    },
    {
      key: 'FarItem4',
      text: strings.Support,
      ariaLabel: strings.Support,
      iconOnly: true,
      icon: <QuestionCircleRegular />,
      onClick: () => window.open(strings.SupportLink, HandbookConstants.LinkTarget.Blank, "noopener,noreferrer"),
    },
  ];

  const configValid = useMemo(
    () =>
      modifiedSources.length > 0 &&
      modifiedSources.every((s) => !!(s.webUrl && s.parentField)),
    [modifiedSources]
  );

  const loadingInitial = loading || hookResults.some((r) => r.loadingInitial);
  const pageError = hookResults.find((r) => r.error)?.error;
  const error = pageError || null;

  const itemsBySource = hookResults.map(r => r.items);

  const roots = useMemo(
    () => modifiedSources.map((_, idx) => buildTree(getItemsFor(idx))),
    [modifiedSources, overrides, itemsBySource, getItemsFor]
  );

  // Initialize currentHandbook with the first source
  useEffect(() => {
    if (configValid && modifiedSources[0] && !loading) {
      setCurrentHandbook({
        webUrl: modifiedSources[0].webUrl,
        listId: modifiedSources[0].listId,
        parentField: modifiedSources[0].parentField,
        siteTitle: modifiedSources[0].siteTitle,
        parentId: modifiedSources[0].parentId,
      });
      setCurrentIndex(0);
    }
  }, [configValid, modifiedSources, loading]);

  const selectedItems = getItemsFor(currentIndex);
  const selectedRoot = roots[currentIndex];
  const selectedParentId = currentHandbook?.parentId ?? modifiedSources[currentIndex]?.parentId ?? 0;

  const onSelect = useCallback(
    (id: string | number, idx: number) => {
      const numericId = typeof id === "string" ? Number(id) : id;
      setCurrentHandbook({
        webUrl: modifiedSources[idx].webUrl,
        parentField: modifiedSources[idx].parentField,
        siteTitle: modifiedSources[idx].siteTitle,
        parentId: numericId,
        listId: modifiedSources[idx].listId,
      });
      setCurrentIndex(idx);
    },
    [modifiedSources]
  );

  const handleClick = (node: SitePage, index: number) => {
    onSelect(node.id, index);
  };

  const onPageCreated = (pageUrl: string) => {
    setIsOpen(false);
    window.open(`${pageUrl}?Mode=Edit`, HandbookConstants.LinkTarget.Blank, "noopener,noreferrer");
  };

  const drawerTitle = drawerAction === HandbookConstants.Drawer.NewChildPage
    ? strings.CreateChildPage
    : drawerAction === HandbookConstants.Drawer.ManageHierarchy
      ? strings.ManageHierarchy
      : "";

  const drawerSubtitle = drawerAction === HandbookConstants.Drawer.NewChildPage
    ? strings.CreateChildPageDetails
    : drawerAction === HandbookConstants.Drawer.ManageHierarchy
      ? strings.ManageHierarchyDetails
      : "";

  const handleDrawerDismiss = () => {
    setIsOpen(false);
    setTimeout(() => reloadAll(), 500);
  };

  const onReparent = useCallback(
    async (id: number, parentId: number | null) => {
      const items = getItemsFor(currentIndex);
      const prev = items.slice();

      const next = items.map(p =>
        p.id === id ? ({ ...p, parentId: parentId ?? 0 } as SitePage) : p
      );

      setOverrides((o) => ({ ...o, [currentIndex]: next }));

      try {
        if (!currentHandbook) return;
        if (!currentHandbook.listId) return;
        if (!currentHandbook.parentField) return;
        await api.items.updateItem(
          currentHandbook.webUrl,
          currentHandbook.listId,
          id,
          { [currentHandbook.parentField]: parentId }
        );
      } catch (err) {
        setOverrides((o) => ({ ...o, [currentIndex]: prev }));
        console.error("Failed to persist parent change", err);
      }
    },
    [api, currentHandbook, currentIndex, getItemsFor, setOverrides]
  );

  if (loading && !commonColumns.length) {
    return <Spinner size="large" />;
  }

  return (
    <Guard
      configValid={configValid}
      loading={loadingInitial}
      error={error ?? undefined}
      strings={strings}
    >
      <DynamicMenu
        {...props}
        roots={roots}
        siteTitles={modifiedSources.map((s) => s.siteTitle)}
        activeSourceIdx={currentIndex}
        selectedId={selectedParentId}
        onSelect={onSelect}
        farItems={farItems}
        onMenuItemClickWithIndex={(node, idx) => handleClick(node, idx)}
        showOnlyFarItems={!showTopMenu}
      />
      <SplitPane direction="horizontal" dividerClassName={classes.resizer}>
        <Pane defaultSize={LeftMenuSize}>
          <DynamicNav
            roots={roots}
            strings={strings}
            siteTitles={modifiedSources.map((s) => s.siteTitle)}
            showLeaf={false}
            onMenuItemClickWithIndex={(node, idx) => handleClick(node, idx)}
            activeSourceIdx={currentIndex}
            selectedId={selectedParentId}
            onSelect={onSelect}
          />
        </Pane>
        <Pane>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PageCardView
              pages={selectedItems}
              parentId={selectedParentId}
              strings={strings}
            />
          </div>
        </Pane>
      </SplitPane>

      <OverlayDrawer
        open={isOpen}
        onOpenChange={(_, { open }) => { if (!open) handleDrawerDismiss(); }}
        position="end"
        size="large"
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label={strings.Close}
                icon={<DismissRegular />}
                onClick={handleDrawerDismiss}
              />
            }
          >
            <div className={classes.leftMargin2}>
              <Label className={classes.docCardTitle}>{drawerTitle}</Label>
              <Text size={200} className={classes.TextContainer}>{drawerSubtitle}</Text>
            </div>
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {drawerAction === HandbookConstants.Drawer.NewChildPage && (
            <PageCreator
              pages={selectedItems}
              onPageCreated={onPageCreated}
              listId={currentHandbook?.listId ?? ""}
              parentField={currentHandbook?.parentField ?? ""}
              parentId={selectedParentId}
              webUrl={currentHandbook?.webUrl ?? ""}
              currentSiteTitle={currentHandbook?.siteTitle}
              {...props}
            />
          )}
          {drawerAction === HandbookConstants.Drawer.ManageHierarchy && (
            <PageHierarchyManager
              root={selectedRoot}
              pages={selectedItems}
              onReparent={onReparent}
              strings={strings}
              currentHandbook={currentHandbook}
              currentView={selectedView}
              availableSites={modifiedSources.map((s, idx) => ({
                title: s.siteTitle,
                index: idx
              }))}
              currentSiteIndex={currentIndex}
              onSiteChange={(newIndex) => {
                setCurrentIndex(newIndex);
                if (modifiedSources[newIndex]) {
                  setCurrentHandbook({
                    webUrl: modifiedSources[newIndex].webUrl,
                    listId: modifiedSources[newIndex].listId,
                    parentField: modifiedSources[newIndex].parentField,
                    siteTitle: modifiedSources[newIndex].siteTitle,
                    parentId: modifiedSources[newIndex].parentId,
                  });
                }
              }}
              onViewChange={handleViewChange}
            />
          )}
        </DrawerBody>
      </OverlayDrawer>

      <CreateView
        isOpen={isCreateViewOpen}
        strings={strings}
        onDismiss={() => setIsCreateViewOpen(false)}
        onCreateSuccess={reloadAll}
        tokenProvider={tokenProvider}
        sitesInfo={props.sources}
      />
    </Guard>
  );
};

export default Handbook365Inner;
