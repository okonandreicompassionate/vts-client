import type { JSX } from "react";

export type StatusMeta = {
  title: string;
  subtitle?: string;
  description: string;
  reason?: string;
  pillLabel?: string;
  pillClasses?: string;
  badgeColor: string;
  bannerBg?: string;
  iconWrapBg: string;
  icon?: JSX.Element;
  desktopIcon: JSX.Element;
  actionLabel: string;
  actionPath?: string;
  secondaryLabel: string;
};
