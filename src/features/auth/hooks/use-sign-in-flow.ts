import { useState } from "react";
import { message } from "antd";

import { useSelectOrganizationMutation } from "../api/auth-api-slice";
import {
  requiresOrganizationSelection,
  type OrganizationSelectionRequired,
  type SignInResponse,
} from "../types/api-types";
import { useCompleteLogin } from "./use-complete-login";

/**
 * Email-first sign-in: the server finds the organization from the account.
 * When the same credentials belong to several organizations, the user picks one.
 */
export function useSignInFlow() {
  const completeLogin = useCompleteLogin();
  const [selection, setSelection] = useState<OrganizationSelectionRequired | null>(null);
  const [selectOrganization, { isLoading: isSelecting }] = useSelectOrganizationMutation();

  const handleSignIn = (response: SignInResponse) => {
    if (requiresOrganizationSelection(response)) {
      setSelection(response);
      return;
    }

    completeLogin(response);
  };

  const chooseOrganization = async (orgId: string) => {
    if (!selection) {
      return;
    }

    try {
      completeLogin(
        await selectOrganization({ selectionToken: selection.selectionToken, orgId }).unwrap(),
      );
    } catch {
      setSelection(null);
      message.error("Your sign-in expired. Please sign in again.");
    }
  };

  return {
    selection,
    isSelecting,
    handleSignIn,
    chooseOrganization,
    cancelSelection: () => setSelection(null),
  };
}
