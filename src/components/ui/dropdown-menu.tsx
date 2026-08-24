import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";

type DropdownMenuProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;

export function DropdownMenu(props: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

export const DropdownMenuTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>((props, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} {...props} />
));

DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

type DropdownMenuItemIndicatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.ItemIndicator
>;

export function DropdownMenuItemIndicator(
  props: DropdownMenuItemIndicatorProps,
) {
  return <DropdownMenuPrimitive.ItemIndicator {...props} />;
}

type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      align="end"
      sideOffset={6}
      className={`z-50 min-w-28 rounded-md border border-slate-200 bg-white p-1 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-800 ${className ?? ""}`}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
> & {
  children?: ReactNode;
};

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={`relative flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-700 outline-none data-highlighted:bg-slate-100 dark:text-slate-200 dark:data-highlighted:bg-slate-700 ${className ?? ""}`}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator className="absolute left-1 text-sky-500">
      ✓
    </DropdownMenuPrimitive.ItemIndicator>
    <span className="w-3" />
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

