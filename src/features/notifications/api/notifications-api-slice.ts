import { api } from "../../../lib/api/base";
import type {
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
} from "../types/notifications-api.types";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => "/notifications/settings",
      providesTags: [{ type: "Admins", id: "NOTIFICATION_SETTINGS" }],
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
      invalidatesTags: [{ type: "Admins", id: "NOTIFICATION_SETTINGS" }],
    }),
  }),
});

export const { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } = adminApi;
