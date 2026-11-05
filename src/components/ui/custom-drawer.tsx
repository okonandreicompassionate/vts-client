import { Button, Drawer } from "antd";
import type { ReactNode } from "react";

import { usePopup } from "@/lib/contexts/popup/use-popup";
import { RowActions, type RowAction } from "./row-actions";

interface CustomDrawerProps {
  title: ReactNode;
  /**
   * The drawer's actions, in a dropdown at the top right (same menu as table rows):
   * `primary` for what's waiting on the user, `secondary` for everything else.
   */
  actions?: { primary?: RowAction[]; secondary?: RowAction[] };
  /** Names the actions menu for screen readers, e.g. the visitor's name. */
  actionsLabel?: string;
  /** What OK does. Without it, OK just closes the drawer. */
  onOk?: () => void | Promise<void>;
  okText?: string;
  okLoading?: boolean;
  okDisabled?: boolean;
  cancelText?: string;
  width?: number | string;
  /** Remove body padding for content that brings its own (e.g. full-bleed lists). */
  flush?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

/**
 * Standard right-hand drawer. Actions live in a dropdown in the header; the
 * footer only ever holds Cancel and OK. Open it with `openDrawer(<SomeDrawer … />)`
 * from `usePopup()`; it closes itself.
 */
export function CustomDrawer({
  title,
  actions,
  actionsLabel,
  onOk,
  okText = "OK",
  okLoading = false,
  okDisabled = false,
  cancelText = "Cancel",
  width = "min(100vw, 440px)",
  flush = false,
  onClose,
  children,
}: CustomDrawerProps) {
  const { isDrawerOpen, closeDrawer, onDrawerClosed } = usePopup();

  const close = () => {
    closeDrawer();
    onClose?.();
  };

  const hasActions = Boolean(actions?.primary?.length || actions?.secondary?.length);

  return (
    <Drawer
      title={title}
      extra={
        hasActions ? (
          <RowActions
            label={actionsLabel ?? (typeof title === "string" ? title : "this item")}
            primary={actions?.primary}
            secondary={actions?.secondary}
          />
        ) : undefined
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={close}>{cancelText}</Button>
          <Button
            type="primary"
            loading={okLoading}
            disabled={okDisabled}
            onClick={() => void (onOk ? onOk() : close())}
          >
            {okText}
          </Button>
        </div>
      }
      placement="right"
      width={width}
      open={isDrawerOpen}
      onClose={close}
      afterOpenChange={(open) => {
        if (!open) onDrawerClosed();
      }}
      styles={{ body: flush ? { padding: 0 } : undefined }}
    >
      {children}
    </Drawer>
  );
}

export default CustomDrawer;
