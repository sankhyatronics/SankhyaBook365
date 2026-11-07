# SankhyaBook Solution


## Features

### 📖 SankhyaBook365 WebPart
- **SharePoint Integration**: Seamlessly integrates with SharePoint Pages and Lists via Microsoft Graph.
- **Dynamic Content**: Displays page cards with thumbnails, titles, and descriptions sourced directly from SharePoint sites.
- **Interactive Navigation**:
    - **Left Menu**: Configurable side navigation for easy access to different sections.
    - **Top Menu**: Optional top bar for additional quick links or global actions.
- **Page Hierarchy**: Supports parent-child page relationships (e.g., Chapter -> Topic) for structured content organization.

### 🎨 Modern UI/UX
- **Responsive Design**: Built with React and Fluent UI for a consistent, responsive experience across devices.
- **Page Cards**: Detailed card views with:
    - Thumbnail previews
    - Selection states (visual feedback)
    - Direct links to SharePoint pages (configurable target: `_self` or `_blank`)
- **Configurable Views**: Supports multiple data sources and customizable views.

### 🛠️ Technical Architecture
- **Monorepo Structure**:
    - `@sankhyatronics/apiclient`: Core data services and Graph API helpers (Centralized URL construction).
    - `@sankhyatronics/airavat`: Reusable React UI component library (Hooks-based state management).
    - `@sankhyatronics/sankhyabook`: SharePoint Framework integration layer.
- **Performance**:
    - Centralized data fetching hooks (`useHandbookData`).
    - Optimized dependency management with `pnpm` workspace.
- **Security**:
    - Uses SPFx `AadTokenProvider` for secure, token-based authentication with Microsoft Graph.


## Development Setup

### Prerequisites
1. Install Node.js 22
2. Install pnpm: `npm install -g pnpm`

### Installation
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build
```

### Storybook Development (airavat)
```bash
cd airavat
cp .env.example .env   # then set VITE_CLIENT_ID and VITE_HANDBOOK_SOURCES
pnpm storybook
```

The Storybook runs at `http://localhost:6006` with:
- **COOP header** configured as `same-origin-allow-popups` to support MSAL popup authentication
- **MSAL authentication** panel for testing authenticated components

### Build SharePoint Package (SPFx with Heft)
```bash
cd sankhyabook

# Development build (with watch mode); opens https://<tenant>/_layouts/15/workbench.aspx
$env:SPFX_SERVE_TENANT_DOMAIN = "contoso.sharepoint.com"
pnpm start

# Production build
pnpm build
```

The SPFx project uses **Heft** (Rush Stack) instead of gulp for:
- Faster builds with incremental compilation
- Better TypeScript integration
- Consistent build tooling across the monorepo


## PnP PowerShell Sample
```powershell
Connect-PnPOnline -Url https://contoso.sharepoint.com/sites/sampledata -ClientId <your-entra-app-client-id> -Interactive
```