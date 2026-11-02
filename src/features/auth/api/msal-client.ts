import type { Configuration } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useMemo } from 'react';

// Defaults keep the current single-directory (zoracom.com) setup. For Microsoft
// sign-in across organizations, set VITE_MSAL_AUTHORITY to
// https://login.microsoftonline.com/organizations and make the Entra app
// registration multi-tenant.
const DEFAULT_CLIENT_ID = 'f4969f79-b174-4b2e-a018-883bd31a3829';
const DEFAULT_AUTHORITY = 'https://login.microsoftonline.com/zoracom.com';

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID || DEFAULT_CLIENT_ID,
        authority: import.meta.env.VITE_MSAL_AUTHORITY || DEFAULT_AUTHORITY,
        // Popup flow: the redirect URI only has to be registered, not routed.
        redirectUri: window.location.origin,
        onRedirectNavigate: () => false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
    },
};

export const loginRequest = {
    scopes: ['User.Read'],
};

export function useMsalAuth() {
    const { instance, accounts, inProgress } = useMsal();
    const account = accounts[0];
    const isAuthenticated = useIsAuthenticated();

    // memoize the whole result so it can be used as a hook dependency
    return useMemo(
        () => ({
            account,
            instance,
            inProgress,
            isAuthenticated,
            login: () => instance.loginPopup(loginRequest),
            logout: () => instance.logoutRedirect(),
        }),
        [account, inProgress, instance, isAuthenticated]
    );
}
