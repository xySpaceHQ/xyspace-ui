# Creating a UI component package (like xyspace-ui)

This doc walks through every step and command used to build **xyspace-ui** so the same
process can be repeated for a different organization/package. Replace `<pkg-name>`
(e.g. `acme-ui`) and `<org>` (e.g. `@acme`) with your own values throughout.

Stack: **pnpm**, **TypeScript**, **React 19**, **Tailwind CSS v4**, **Radix UI**,
**class-variance-authority**, **tsdown** (build), **Storybook** (dev/docs),
**Vitest + Playwright** (tests).

Versions used here: Node v22, pnpm 10.

---

## 1. Scaffold the project

```bash
mkdir <pkg-name> && cd <pkg-name>
git init
pnpm init
```

Edit the generated `package.json` to look like this (dual ESM/CJS output, typed):

```json
{
  "name": "<pkg-name>",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.mts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

`files: ["dist"]` + the `exports` map mean only the built output is published, and
consumers get typed ESM/CJS resolution automatically.

## 2. Add TypeScript

```bash
pnpm add -D typescript @types/react @types/react-dom @types/node
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": false,
    "emitDeclarationOnly": false,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 3. Add the build tool (tsdown)

```bash
pnpm add -D tsdown publint
```

`tsdown.config.ts`:

```ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolve: true,
  },
  deps: {
    neverBundle: ["react", "react-dom"],
  },
  publint: true,
});
```

- `neverBundle: ["react", "react-dom"]` keeps React out of the bundle (it's a peer dep).
- `publint: true` lint-checks the package shape (exports map, types, etc.) on every build.

## 4. React as a peer dependency

```bash
pnpm add -D react react-dom
```

Add to `package.json`:

```json
{
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": false },
    "react-dom": { "optional": false }
  }
}
```

## 5. Set up the source layout

```bash
mkdir -p src/components/ui src/components/custom src/lib
touch src/index.ts src/lib/utils.ts
```

```
src/
  components/
    ui/          # base primitives (Button, Select, Table, ...)
    custom/      # composed/opinionated components (DataTable, ...)
  lib/
    utils.ts     # shared helpers (e.g. `cn`)
  index.ts        # public API — barrel file exporting everything
```

`src/index.ts` re-exports every public component:

```ts
export * from "./components/ui/button";
export * from "./components/ui/avatar";
// ...one line per component
```

Only export things from here that are meant to be part of the public API.

## 6. Styling: Tailwind CSS v4 + class helpers

```bash
pnpm add clsx tailwind-merge class-variance-authority
pnpm add -D tailwindcss @tailwindcss/vite tw-animate-css autoprefixer postcss
```

`src/lib/utils.ts` — the standard `cn()` class-merge helper:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Design tokens (colors, spacing, radii, font sizes) are defined as CSS custom
properties and bridged into Tailwind via `@theme inline`. Create a stylesheet
(used by Storybook, and documented for consumers to copy into their own app since
the package ships no compiled CSS):

```css
/* .storybook/theme.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-btn-primary: var(--btn-primary);
  /* ...map every semantic token used in components... */
}

:root {
  --btn-primary: var(--grey-950);
  /* ...light-mode primitive values... */
}

.dark {
  --btn-primary: var(--base-white);
  /* ...dark-mode overrides... */
}
```

Build components against these semantic classes (`bg-btn-primary`, `text-display-01`,
`rounded-8`, `p-xl`, ...) instead of raw Tailwind colors, so themes/orgs can be
swapped by changing only the token values.

## 7. Add primitive dependencies as needed

Pick the headless-UI/utility libraries your components need. In this package:

```bash
pnpm add radix-ui @radix-ui/react-slot @base-ui/react lucide-react @tanstack/react-table
```

- `radix-ui` / `@radix-ui/react-slot` — accessible unstyled primitives (Select, DropdownMenu, `asChild` support)
- `class-variance-authority` — variant/size prop APIs (`buttonVariants({ variant, size })`)
- `lucide-react` — icon set
- `@tanstack/react-table` — headless table logic for `DataTable`

## 8. Write a component

Pattern used throughout this package — `cva` for variants, `cn` for class merging,
`Slot` for `asChild`, `data-slot`/`data-variant` attributes for styling hooks:

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center ...", {
  variants: {
    variant: { default: "bg-btn-primary text-btn-primary-text ...", secondary: "..." },
    size: { default: "h-10 px-lg", sm: "h-8 px-l", lg: "h-13 p-lg" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

Then add the export to `src/index.ts`.

## 9. Set up Storybook (dev environment + living docs)

```bash
pnpm dlx storybook@latest init
```

This scaffolds `.storybook/` and installs the framework packages. Then align it
with the Vite + Tailwind + path-alias setup:

```bash
pnpm add -D @storybook/react-vite @chromatic-com/storybook @storybook/addon-a11y @storybook/addon-docs @storybook/addon-mcp
```

`.storybook/main.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  async viteFinal(viteConfig) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = { ...viteConfig.resolve.alias, "@": path.resolve(dirname, "../src") };
    return viteConfig;
  },
};
export default config;
```

`.storybook/preview.tsx`:

```tsx
import type { Preview } from "@storybook/react-vite";
import "./theme.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "todo" },
  },
};
export default preview;
```

Write a `*.stories.tsx` file next to each component:

```tsx
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = { component: Button, title: "UI/Button" };
export default meta;

export const Default: StoryObj<typeof Button> = { args: { children: "Click me" } };
```

Run it:

```bash
pnpm storybook
```

## 10. Set up testing (Vitest + Storybook addon + Playwright)

```bash
pnpm add -D vitest @storybook/addon-vitest @vitest/browser-playwright @vitest/coverage-v8 playwright
pnpm exec playwright install
```

`vitest.shims.d.ts`:

```ts
/// <reference types="@vitest/browser-playwright" />
```

`vitest.config.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
```

This runs every Storybook story as a real browser test (via Playwright/Chromium),
so component regressions are caught without hand-written test files.

## 11. `.gitignore`

```
node_modules
dist/
*.tgz
*storybook.log
storybook-static
```

## 12. Build and sanity-check the package

```bash
pnpm build
```

`tsdown` emits `dist/index.mjs`, `dist/index.cjs`, `dist/index.d.mts`,
`dist/index.d.cts`, and runs `publint` to flag packaging mistakes
(missing types, wrong exports map, etc.).

Optionally pack and inspect the tarball before publishing:

```bash
pnpm pack
tar -tf <pkg-name>-0.1.0.tgz
```

## 13. Publish

```bash
npm login          # once, if not already authenticated
npm publish --access public
```

For a scoped/org package (`@<org>/<pkg-name>`), set `"name": "@<org>/<pkg-name>"`
in `package.json` and make sure `--access public` is passed (scoped packages
default to private otherwise).

Bump the version before each publish:

```bash
npm version patch   # or minor / major
npm publish --access public
```

---

## Full command list (copy-paste order)

```bash
mkdir <pkg-name> && cd <pkg-name>
git init
pnpm init

pnpm add -D typescript @types/react @types/react-dom @types/node
pnpm add -D tsdown publint
pnpm add react react-dom
pnpm add clsx tailwind-merge class-variance-authority
pnpm add -D tailwindcss @tailwindcss/vite tw-animate-css autoprefixer postcss
pnpm add radix-ui @radix-ui/react-slot lucide-react

pnpm dlx storybook@latest init
pnpm add -D @storybook/react-vite @chromatic-com/storybook @storybook/addon-a11y @storybook/addon-docs @storybook/addon-mcp

pnpm add -D vitest @storybook/addon-vitest @vitest/browser-playwright @vitest/coverage-v8 playwright
pnpm exec playwright install

# ...write tsconfig.json, tsdown.config.ts, vitest.config.ts, .storybook/*,
#    src/lib/utils.ts, src/components/**, src/index.ts (see sections above)

pnpm build
pnpm storybook

npm login
npm publish --access public
```

## Adapting this for a new organization

- Rename the package (`<org>/<pkg-name>`) and update `package.json` `name`, `repository`, `author`.
- Swap the design tokens in `.storybook/theme.css` (`--grey-*`, `--blue-*`, `--btn-*`, etc.) for the new org's brand palette — everything else (`@theme inline` mapping, component classnames) can stay the same since components consume semantic tokens, not raw colors.
- Keep the same folder split (`components/ui` vs `components/custom`) so contributors know where to add primitives vs. composed components.
- Consider shipping a compiled CSS/tokens file from `dist/` (not done in this package yet) so consumers don't have to hand-copy `theme.css` — see the note in [README.md](README.md).
