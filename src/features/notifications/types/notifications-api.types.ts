export interface NotificationSettingsResponse {
  notifyPendingVisitEmail: boolean;
  dailySummaryEmailReport: boolean;
}

export interface UpdateNotificationSettingsPayload {
  notifyPendingVisitEmail?: boolean;
  dailySummaryEmailReport?: boolean;
}

export type NotificationType =
  | "VISIT_PENDING"
  | "VISIT_HOST_APPROVAL_REQUIRED"
  | "VISIT_HOST_APPROVED"
  | "VISIT_HOST_REJECTED"
  | "VISIT_APPROVED"
  | "VISIT_REJECTED"
  | "VISIT_READY_FOR_CHECKIN"
  | "VISIT_CHECKED_IN"
  | "VISIT_CHECKED_OUT"
  | "VISIT_CANCELLED"
  | "VISIT_EXPIRED"
  | "VISIT_OVERSTAYED"
  | "SYSTEM";

export type NotificationActionType = "INFO" | "ACTION_REQUIRED" | "SUCCESS" | "WARNING";

/** One in-app notification, as listed and as pushed live (`notification.created`). */
export interface AppNotification {
  id: string;
  type: NotificationType;
  actionType: NotificationActionType;
  title: string;
  message: string;
  visitId: string | null;
  read: boolean;
  createdAt: string;
  metadata: { referenceId?: string; visitorName?: string; hostName?: string | null } | null;
}

export interface NotificationPage {
  data: AppNotification[];
  /** Pass as `cursor` for the next page; null on the last page. */
  nextCursor: string | null;
}
