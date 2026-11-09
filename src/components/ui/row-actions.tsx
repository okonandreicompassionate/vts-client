import type { ReactNode } from "react";
import { Button, Dropdown, type MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

export interface RowAction {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface RowActionsProps {
  /** Who/what the row is, for the button's accessible name, e.g. the visitor's name. */
  label: string;
  /** Actions waiting on the user (approve, check in…). Listed first, above a divider; they turn the button blue. */
  primary?: RowAction[];
  /** General actions (view, edit…). */
  secondary?: RowAction[];
  disabled?: boolean;
}

/** Every row menu is the same width, whatever its labels. */
const MENU_WIDTH = 168;

const toMenuItem = (action: RowAction) => ({
  key: action.key,
  label: action.label,
  icon: action.icon,
  danger: action.danger,
  disabled: action.disabled,
});

/**
 * The one actions menu for table rows. Clicks don't reach the row, so rows can
 * still open a drawer on click.
 */
export function RowActions({ label, primary = [], secondary = [], disabled = false }: RowActionsProps) {
  const needsAction = primary.some((action) => !action.disabled);
  const actions = [...primary, ...secondary];

  const items: MenuProps["items"] = [
    ...primary.map(toMenuItem),
    ...(primary.length && secondary.length ? [{ type: "divider" as const, key: "divider" }] : []),
    ...secondary.map(toMenuItem),
  ];

  if (actions.length === 0) return null;

  return (
    // Keep clicks and key presses from triggering the row's own handlers.
    <span onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        disabled={disabled}
        menu={{
          items,
          style: { width: MENU_WIDTH },
          onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation();
            actions.find((action) => action.key === key)?.onSelect();
          },
        }}
      >
        <Button
          size="small"
          type={needsAction ? "primary" : "text"}
          icon={<EllipsisOutlined />}
          aria-label={needsAction ? `Actions for ${label}, action needed` : `Actions for ${label}`}
          title={needsAction ? "Action needed" : "Actions"}
        />
      </Dropdown>
    </span>
  );
}
