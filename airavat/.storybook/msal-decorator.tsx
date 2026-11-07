import React, { useState } from "react";
import { Decorator } from "@storybook/react-vite";
import { useMsal } from "@azure/msal-react";
import { AuthConstants, MsalAuthProviders, RequireAuthPopup } from "./auth";

// ── Auth panel shown above every story ────────────────────────
const AuthPanel: React.FC = () => {
  const { instance } = useMsal();
  const [busy, setBusy] = useState(false);
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];

  const login = async () => {
    setBusy(true);
    try {
      await instance.loginPopup({ scopes: [...AuthConstants.GraphScopes], prompt: "select_account" });
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await instance.logoutPopup();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #eee",
        display: "flex",
        gap: 8,
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <strong>Auth:</strong>
      {account ? (
        <>
          <span>{account.name ?? account.username}</span>
          <button onClick={logout} disabled={busy}>Sign out</button>
        </>
      ) : (
        <button onClick={login} disabled={busy}>Sign in with Microsoft</button>
      )}
      <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: 12 }}>
        Scopes: {AuthConstants.GraphScopes.join(", ")}
      </span>
    </div>
  );
};

// ── Storybook decorator ────────────────────────────────────────
export const withMsalAndApi: Decorator = (Story) => (
  <MsalAuthProviders>
    <AuthPanel />
    <RequireAuthPopup
      fallback={
        <div style={{ padding: 16, opacity: 0.7, fontSize: 12 }}>
          Opening Microsoft sign-in… (consent required for Graph scopes)
        </div>
      }
    >
      <div style={{ padding: 12 }}>
        <Story />
      </div>
    </RequireAuthPopup>
  </MsalAuthProviders>
);
