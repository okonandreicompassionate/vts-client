import { api } from "@/lib/api/api";
import type {
  NotificationPage,
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
} from "../types/notifications-api.types";

const INBOX = { type: "Notifications", id: "INBOX" } as const;

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => "/notifications/settings",
      providesTags: [{ type: "Notifications", id: "NOTIFICATION_SETTINGS" }],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettingsResponse,
      UpdateNotificationSettingsPayload
    >({
      query: (body) => ({
        url: "/notifications/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "NOTIFICATION_SETTINGS" }],
    }),

    // Newest first; each page's last id is the cursor for the next.
    getNotifications: builder.infiniteQuery<NotificationPage, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
      query: ({ pageParam }) => ({
        url: "/notifications",
        params: { limit: 15, ...(pageParam ? { cursor: pageParam } : {}) },
      }),
      providesTags: [INBOX],
    }),

    getUnreadNotificationCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count",
      providesTags: [INBOX],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: [INBOX],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [INBOX],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetNotificationsInfiniteQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;

export const NOTIFICATION_INBOX_TAG = INBOX;
