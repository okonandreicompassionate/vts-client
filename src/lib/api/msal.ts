import type { Configuration } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useMemo } from 'react';

export const msalConfig: Configuration = {
    auth: {
        clientId: 'f4969f79-b174-4b2e-a018-883bd31a3829',
        authority: 'https://login.microsoftonline.com/zoracom.com',
        redirectUri: `http://localhost:5173/admin`,
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
