# xyspace-ui

A React component library built with Tailwind CSS v4, Radix UI, and class-variance-authority. Ships as ESM + CJS with full TypeScript declarations.

## Requirements

- React 19+ and React DOM 19+ (peer dependencies)
- Tailwind CSS v4 in the consuming app (components are styled with Tailwind utility classes and design-token CSS variables)

## Installation

```bash
npm install xyspace-ui
# or
pnpm add xyspace-ui
# or
yarn add xyspace-ui
```

## Usage

Import components directly from the package root:

```tsx
import { Button } from "xyspace-ui";

function App() {
  return <Button variant="default">Click me</Button>;
}
```

Available exports include `Button`, `Avatar`, `Chips`, `DropdownMenu`, `Select`, `Skeleton`, `Table`, `Tab`, `AppTab`, and `DataTable`. See [src/index.ts](src/index.ts) for the full list.

## Setting up a consuming project

The components rely on Tailwind CSS utility classes and a set of CSS custom properties (design tokens) for colors, spacing, radii, and typography. Since this package ships no compiled CSS, your app needs Tailwind v4 configured and the token variables defined.

### 1. Create/scaffold your app

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
```

### 2. Install Tailwind CSS v4 and the package

```bash
npm install tailwindcss @tailwindcss/vite tw-animate-css
npm install xyspace-ui
```

### 3. Wire up the Tailwind Vite plugin

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 4. Add a global stylesheet with Tailwind + design tokens

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

### 5. Use components

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

### 6. Toggle dark mode (optional)

Add/remove the `dark` class on a parent element (commonly `<html>` or `<body>`) to switch themes:

```tsx
document.documentElement.classList.toggle("dark");
```

## Local development (contributing to this package)

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

## Publishing

```bash
pnpm build
npm publish
```

The `files` field in `package.json` restricts the published package to the `dist/` folder.
