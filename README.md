<p align="center">
  <img src="https://img.shields.io/badge/xyspace--ui-React%20Component%20Library-blue?style=for-the-badge&logo=react&logoColor=white" alt="xyspace-ui"/>
</p>

<h1 align="center">🎨 xyspace-ui</h1>

<p align="center">
  <strong>xySpace's shared React component library</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/xyspace-ui?style=flat-square&color=CB3837&logo=npm&logoColor=white" alt="npm version"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Radix%20UI-161618?style=flat-square&logo=radixui&logoColor=white" alt="Radix UI"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white" alt="Storybook"/>
</p>

<p align="center">
  <a href="#requirements">Requirements</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#testing">Testing</a> •
  <a href="#publishing">Publishing</a> •
  <a href="#contributing">Contributing</a>
</p>

---

xySpace's React component library is a set of shared, reusable UI components built with React, Radix UI, and Tailwind CSS. It's distributed as [`xyspace-ui`](https://www.npmjs.com/package/xyspace-ui) on npm, shipped as ESM + CJS with full TypeScript declarations.

## Requirements

- React 19+ and React DOM 19+ (peer dependencies)
- Tailwind CSS v4 in the consuming app (components are styled with Tailwind utility classes and design-token CSS variables)

## Getting Started

### Installation

```bash
npm install xyspace-ui
# or
pnpm add xyspace-ui
# or
yarn add xyspace-ui
```

### Usage

Import components directly from the package root:

```tsx
import { Button } from "xyspace-ui";

function App() {
  return <Button variant="default">Click me</Button>;
}
```

Available exports include `Button`, `Avatar`, `Chips`, `DropdownMenu`, `Select`, `Skeleton`, `Table`, `Tab`, `AppTab`, and `DataTable`. See [src/index.ts](src/index.ts) for the full list.

### Setting up a consuming project

The components rely on Tailwind CSS utility classes and a set of CSS custom properties (design tokens) for colors, spacing, radii, and typography. Since this package ships no compiled CSS, your app needs Tailwind v4 configured and the token variables defined.

#### 1. Create/scaffold your app

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

#### 2. Install Tailwind CSS v4 and the package

```bash
npm install tailwindcss @tailwindcss/vite tw-animate-css
npm install xyspace-ui
```

#### 3. Wire up the Tailwind Vite plugin

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

#### 4. Add a global stylesheet with Tailwind + design tokens

Create `src/index.css` and import Tailwind plus the token bridge. Copy the `@theme inline` block and the `:root` / `.dark` token definitions from [.storybook/theme.css](.storybook/theme.css) in this repo — this maps semantic classes used by the components (e.g. `bg-btn-primary`, `text-display-01`, `rounded-8`) to real values:

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* ...copy the token bridge from .storybook/theme.css... */
}

:root {
  /* ...copy the light-mode variables... */
}

.dark {
  /* ...copy the dark-mode variables... */
}
```

Then import it once in your app entry point:

```tsx
// src/main.tsx
import "./index.css";
```

#### 5. Use components

```tsx
import { Button, Chips, Avatar } from "xyspace-ui";

export default function App() {
  return (
    <div className="p-xl">
      <Avatar />
      <Button variant="secondary" size="lg">
        Save
      </Button>
      <Chips>New</Chips>
    </div>
  );
}
```

#### 6. Toggle dark mode (optional)

Add/remove the `dark` class on a parent element (commonly `<html>` or `<body>`) to switch themes:

```tsx
document.documentElement.classList.toggle("dark");
```

## Project Structure

```bash
pnpm install       # install dependencies
pnpm storybook     # browse/develop components in Storybook at http://localhost:6006
pnpm build         # bundle the library with tsdown -> dist/
pnpm dev           # build in watch mode
```

Component source lives in [src/components](src/components):
- `src/components/ui` — base primitives (Button, Select, Table, Tab, Avatar, Chips, Skeleton, DropdownMenu)
- `src/components/custom` — composed components (DataTable, AppTab)

Each component has a co-located `*.stories.tsx` file used by Storybook.

New components should be exported from [src/index.ts](src/index.ts) to be part of the public API.

## Testing

```bash
pnpm test          # run the vitest suite
pnpm typecheck     # type-check the project with tsc --noEmit
```

Tests run against [vitest.config.ts](vitest.config.ts) with the Playwright browser provider. Add tests alongside the component or logic they cover.

## Publishing

```bash
pnpm build
npm publish
```

The `files` field in `package.json` restricts the published package to the `dist/` folder.

## Contributing

Contributions are welcome. Please open a pull request with a clear description of the change, and make sure `pnpm typecheck` and `pnpm test` pass before requesting review.
