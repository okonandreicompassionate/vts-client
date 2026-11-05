import { Popover as PopoverPrimitive } from "radix-ui";
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import { twMerge } from "tailwind-merge";

export function Popover(props: ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

export const PopoverTrigger = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => <PopoverPrimitive.Trigger ref={ref} {...props} />);

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

/** A themed floating panel, rendered in a portal above the page. */
export const PopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "end", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={16}
      className={twMerge(
        "z-50 rounded-xl border border-slate-200 bg-white shadow-lg outline-none dark:border-zinc-700 dark:bg-zinc-900",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;
