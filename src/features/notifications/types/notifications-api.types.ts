export interface NotificationSettingsResponse {
  notifyPendingVisitEmail: boolean;
  dailySummaryEmailReport: boolean;
}

export interface UpdateNotificationSettingsPayload {
  notifyPendingVisitEmail?: boolean;
  dailySummaryEmailReport?: boolean;
}