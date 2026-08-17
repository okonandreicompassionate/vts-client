import { adminApi } from "../../../lib/api/admin/admin-api";
import type {
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
} from "../types/notifications-api.types";

export const notificationsApi = adminApi.injectEndpoints({
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
  }),
});

export const { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } = notificationsApi;
