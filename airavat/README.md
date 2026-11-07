# @sankhyatronics/airavat

React 18 UI for the Handbook 365 SharePoint Framework web part (`sankhyabook`).
Private workspace package: built with Vite as a library and consumed by `sankhyabook` via `workspace:*`.

Public surface (`src/index.ts`): `Handbook365`, `IHandbookProps`, `ILanguageContent`, `LinkTargetTypes`.

## Scripts

```bash
pnpm build            # tsc -b && vite build -> dist/
pnpm lint
pnpm storybook        # http://localhost:6006
```

## Storybook

`stories/Handbook365.stories.ts` renders the handbook against a real tenant.
`.storybook/msal-decorator.tsx` signs in with MSAL (popup) using `VITE_CLIENT_ID` from `.env`
to get a Microsoft Graph token. The COOP header is set to `same-origin-allow-popups`
in `.storybook/main.ts` so the popup flow works.
