import { message } from "antd";
import type { ReactNode } from "react";

import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";
import {
  useApproveVisitMutation,
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
} from "../api/admins-visit-api-slice";
import { isVisitAlreadyCheckedInError, type VisitorRow } from "../utils/visits";
import { useRefetchVisitLists } from "./use-refetch-visit-lists";

interface CheckActionCopy {
  title?: string;
  description?: ReactNode;
  okText?: string;
  errorFallback?: string;
}

interface CheckActionOptions {
  copy?: CheckActionCopy;
  /** Runs after the visit changed (e.g. close a drawer showing the old status). */
  onDone?: () => void;
}

/**
 * Approve / check-in / check-out confirmations for a visitor, opened with the popup
 * context's `confirm`. The dialog shows its own spinner and stays open on errors.
 */
export function useVisitorCheckActions() {
  const { confirm } = usePopup();
  const refetchVisitLists = useRefetchVisitLists();
  const [checkInVisit, { isLoading: isCheckingIn }] = useCheckInVisitMutation();
  const [checkOutVisit, { isLoading: isCheckingOut }] = useCheckOutVisitMutation();
  const [approveVisit, { isLoading: isApproving }] = useApproveVisitMutation();

  const confirmApprove = (visitor: VisitorRow, { copy, onDone }: CheckActionOptions = {}) => {
    if (visitor.status !== "Pending") return;

    confirm({
      title: copy?.title ?? `Approve ${visitor.name}'s visit?`,
      description: copy?.description ?? (
        <>
          <strong>{visitor.name}</strong> will be able to check in for{" "}
          <strong>{visitor.purpose}</strong>
          {visitor.host ? (
            <>
              {" "}
              with <strong>{visitor.host}</strong>
            </>
          ) : null}
          .
          {visitor.referenceId && (
            <span className="mt-2 block text-xs">Appointment: {visitor.referenceId}</span>
          )}
        </>
      ),
      okText: copy?.okText ?? "Approve",
      onConfirm: async () => {
        try {
          await approveVisit(visitor.id).unwrap();
          await refetchVisitLists();
          message.success(`${visitor.name}'s visit approved.`);
        } catch (error) {
          message.error(
            getVisitActionErrorMessage(
              error,
              copy?.errorFallback ?? "The visit could not be approved. Please try again.",
            ),
          );
          throw error;
        }

        onDone?.();
      },
    });
  };

  const confirmCheckIn = (visitor: VisitorRow, { copy, onDone }: CheckActionOptions = {}) => {
    if (visitor.status !== "Approved") return;

    confirm({
      title: copy?.title ?? "Confirm visitor check-in",
      description: copy?.description ?? (
        <>
          Confirm that <strong>{visitor.name}</strong> has arrived for{" "}
          <strong>{visitor.purpose}</strong>.
          {visitor.referenceId && (
            <span className="mt-2 block text-xs">Appointment: {visitor.referenceId}</span>
          )}
        </>
      ),
      okText: copy?.okText ?? "Confirm Check-in",
      onConfirm: async () => {
        try {
          await checkInVisit(visitor.id).unwrap();
          await refetchVisitLists();
          message.success(`${visitor.name} checked in successfully.`);
        } catch (error) {
          if (isVisitAlreadyCheckedInError(error)) {
            await refetchVisitLists();
            message.info(`${visitor.name} is already checked in. The list has been refreshed.`);
            onDone?.();
            return;
          }

          message.error(
            getVisitActionErrorMessage(
              error,
              copy?.errorFallback ?? "Visitor check-in could not be completed. Please try again.",
            ),
          );
          throw error;
        }

        onDone?.();
      },
    });
  };

  const confirmCheckOut = (visitor: VisitorRow, { copy, onDone }: CheckActionOptions = {}) => {
    if (visitor.status !== "Signed In") return;

    confirm({
      title: copy?.title ?? "Confirm visitor check-out",
      description: copy?.description ?? (
        <>
          Confirm that <strong>{visitor.name}</strong> is leaving after visiting{" "}
          <strong>{visitor.purpose}</strong>.
          {visitor.referenceId && (
            <span className="mt-2 block text-xs">Appointment: {visitor.referenceId}</span>
          )}
        </>
      ),
      okText: copy?.okText ?? "Confirm Check-out",
      onConfirm: async () => {
        try {
          await checkOutVisit(visitor.id).unwrap();
          await refetchVisitLists();
          message.success(`${visitor.name} checked out successfully.`);
        } catch (error) {
          message.error(
            getVisitActionErrorMessage(
              error,
              copy?.errorFallback ?? "Visitor check-out could not be completed. Please try again.",
            ),
          );
          throw error;
        }

        onDone?.();
      },
    });
  };

  return {
    confirmApprove,
    confirmCheckIn,
    confirmCheckOut,
    isApproving,
    isCheckingIn,
    isCheckingOut,
  };
}
