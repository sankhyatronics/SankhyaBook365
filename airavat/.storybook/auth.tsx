// Storybook-only MSAL harness: signs in with a popup and hands Graph tokens to
// components that take a `tokenProvider` prop (the SPFx web part supplies its own).
import * as React from "react";
import {
  PublicClientApplication,
  EventType,
  LogLevel,
  type AccountInfo,
  type IPublicClientApplication,
} from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import type { TokenProvider } from "@sankhyatronics/apiclient";

export const AuthConstants = {
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID as string,
  AUTHORITY: "https://login.microsoftonline.com/organizations",
  GraphScopes: ["Sites.ReadWrite.All", "Files.ReadWrite.All"],
} as const;

const pca: IPublicClientApplication = new PublicClientApplication({
  auth: {
    clientId: AuthConstants.CLIENT_ID,
    authority: AuthConstants.AUTHORITY,
    redirectUri: window.location.origin + "/",
  },
  cache: { cacheLocation: "localStorage" },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii && level <= LogLevel.Warning) console.warn("[MSAL]", message);
      },
    },
  },
});

pca.addEventCallback((e) => {
  if ((e.eventType === EventType.LOGIN_SUCCESS || e.eventType === EventType.ACCOUNT_ADDED) && e.payload && "account" in e.payload) {
    pca.setActiveAccount(e.payload.account as AccountInfo);
  }
  if (e.eventType === EventType.LOGOUT_SUCCESS) {
    pca.setActiveAccount(pca.getAllAccounts()[0] ?? null);
  }
});

const MsalReady: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    pca.initialize().finally(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready ? <>{children}</> : <div style={{ padding: 12 }}>Auth: initializing…</div>;
};

export const MsalAuthProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <MsalProvider instance={pca}>
    <MsalReady>{children}</MsalReady>
  </MsalProvider>
);

/** Opens the Microsoft sign-in popup when there is no account, then renders children. */
export const RequireAuthPopup: React.FC<React.PropsWithChildren<{ fallback?: React.ReactNode }>> = ({ children, fallback }) => {
  const { instance } = useMsal();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!(instance.getActiveAccount() ?? instance.getAllAccounts()[0])) {
          await instance.loginPopup({ scopes: [...AuthConstants.GraphScopes], prompt: "select_account" });
        }
      } catch (e) {
        console.error("[storybook auth] loginPopup failed", e);
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [instance]);

  if (checking) return <>{fallback}</>;
  return instance.getActiveAccount() ?? instance.getAllAccounts()[0] ? <>{children}</> : <>{fallback}</>;
};

/** Wraps a component so it receives a Graph `tokenProvider` from the signed-in MSAL account. */
export function withMsalToken<P extends { tokenProvider: TokenProvider }>(Component: React.ComponentType<P>) {
  const Wrapped: React.FC<Omit<P, "tokenProvider">> = (props) => {
    const { instance, accounts } = useMsal();
    const tokenProvider = React.useCallback<TokenProvider>(
      async (force) => {
        const account = instance.getActiveAccount() ?? accounts[0];
        if (!account) return null;
        const res = await instance.acquireTokenSilent({ account, scopes: [...AuthConstants.GraphScopes], forceRefresh: !!force });
        return res.accessToken;
      },
      [instance, accounts]
    );
    return <Component {...(props as P)} tokenProvider={tokenProvider} />;
  };
  Wrapped.displayName = `withMsalToken(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
