import { Button } from "antd";
import { Bell } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
  useGetNotificationsInfiniteQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
} from "../api/notifications-api-slice";
import { useOpenNotification } from "../hooks/use-open-notification";
import type { AppNotification } from "../types/notifications-api.types";
import NotificationItem from "./notification-item";

/** The header bell: unread badge, and the inbox in a popover. */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unread } = useGetUnreadNotificationCountQuery();
  const count = unread?.count ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={count ? `Notifications, ${count} unread` : "Notifications"}
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Bell size={17} aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-none font-semibold text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(calc(100vw-32px),380px)] overflow-hidden">
        {/* Mounted only while open, so the list is fetched when first needed. */}
        <NotificationInbox unreadCount={count} onOpened={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function NotificationInbox({
  unreadCount,
  onOpened,
}: {
  unreadCount: number;
  onOpened: () => void;
}) {
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetNotificationsInfiniteQuery();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const openNotification = useOpenNotification();
  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  const handleOpen = (notification: AppNotification) => {
    openNotification(notification);
    onOpened();
  };

  return (
    <div className="flex max-h-[min(70vh,520px)] flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Notifications</p>
        <Button
          type="link"
          size="small"
          disabled={unreadCount === 0}
          loading={isMarkingAll}
          onClick={() => void markAllRead()}
          className="px-0!"
        >
          Mark all as read
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner variant="inline" />
          </div>
        ) : isError ? (
          <div className="px-4 py-10 text-center text-xs text-slate-500 dark:text-zinc-400">
            Notifications could not be loaded.{" "}
            <Button type="link" size="small" className="px-0!" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Bell size={22} className="text-slate-300 dark:text-zinc-600" aria-hidden="true" />
            <p className="text-xs text-slate-500 dark:text-zinc-400">You&apos;re all caught up.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <NotificationItem notification={notification} onOpen={handleOpen} />
              </li>
            ))}
          </ul>
        )}

        {hasNextPage && (
          <div className="border-t border-slate-100 p-2 text-center dark:border-zinc-800">
            <Button
              type="text"
              size="small"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Show older
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
