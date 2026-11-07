import { useState } from "react";
import { HandbookConstants } from "../common/Constants";

export type DrawerAction = keyof typeof HandbookConstants.Drawer | undefined;

export const useHandbookDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [drawerAction, setDrawerAction] = useState<DrawerAction>(undefined);
    const [isCreateViewOpen, setIsCreateViewOpen] = useState(false);

    const openDrawer = (action: DrawerAction) => {
        setDrawerAction(action);
        setIsOpen(true);
    };

    const closeDrawer = () => {
        setIsOpen(false);
        setDrawerAction(undefined);
    };

    return {
        isOpen,
        setIsOpen,
        drawerAction,
        setDrawerAction,
        isCreateViewOpen,
        setIsCreateViewOpen,
        openDrawer,
        closeDrawer
    };
};
