import { SitePage } from "@sankhyatronics/apiclient";
import { ISitePageTreeNode } from "./Interfaces";

// ---- tree builder ----
export function buildTree(sitePages: SitePage[]): ISitePageTreeNode[] {
  if (!sitePages) return [];
  const pageMap = new Map<number, ISitePageTreeNode>();
  const tree: ISitePageTreeNode[] = [];

  // First pass: create all nodes with empty children arrays
  sitePages.forEach(page => {
    pageMap.set(page.id, {
      ...page,
      children: []
    });
  });
  // Second pass: build the tree structure
  sitePages.forEach(page => {
    const currentPage = pageMap.get(page.id)!;

    if (page.parentId === null || page.parentId === 0 || !pageMap.has(page.parentId)) {
      // This is a root node
      tree.push(currentPage);
    } else {
      // This is a child node, find its parent
      const parent = pageMap.get(page.parentId);
      if (parent) {
        parent.children.push(currentPage);
      } else {
        // Orphan node (parent doesn't exist), treat as root
        tree.push(currentPage);
      }
    }
  });
  const sortRec = (nodes: ISitePageTreeNode[]) => {
    nodes.sort((a, b) => {
      const titleA = a.page?.title ?? "";
      const titleB = b.page?.title ?? "";
      return titleA.localeCompare(titleB);
    });
    for (const n of nodes) sortRec(n.children ?? []);
  };

  sortRec(tree);
  return tree;
}
