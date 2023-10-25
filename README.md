# ESAssets

> Portable asset management for the web

> [!important]
> ESAssets is currently nothing but an idea -- there's no code to support it. But if you like to offer suggestions, please [open a discussion](https://github.com/arendjr/es-assets/discussions/new/choose).

ESAssets is:

* **Portable.** Works with any bundler. In fact, you don't need a bundler at all.
* **Extensible.** How you process assets is up to you. There's out-of-the-box asset handlers for common file types, but adding custom handlers is a piece of cake.
* **Type safe.** All your assets are referenced from data structures with TypeScript definitions (plain JS files are supported too).

## Why ESAssets?

When building for the web, people often use a bundler for bundling their JS/TS sources along with static assets such as images and CSS files. Thanks to ECMAScript Modules, this process is relatively well-defined for source modules. But for images and other assets, people usually rely on bundler-specific import structures. This makes code difficult to port between bundlers, and also complicates running code inside test runners. It also compromises type safety, since TypeScript has no knowledge of your assets beyond generic `.d.ts` files.

ESAssets aims to replace this practice with bundler-agnostic asset management that is portable, type-safe, and supported in any environment.

**You don't use a bundler?** That's great! Even if you don't use a bundler, ESAssets can help you streamline your asset management. It offers tooling and conventions that can be useful in any environment.

## How does ESAssets work?

To explain how it works, it's important to understand that ESAssets consists of three parts:

* **ESAssets Core** is a set of conventions, accompanied by TypeScript definitions, that define the structure of ECMAScript Modules used for asset management. These asset modules can both contain inlined assets, as welll as reference assets by URL. Asset modules can be written by hand, but are friendly towards being generated.
* **ESAssets Tools** provides a library and CLI tooling to help generate asset modules. There are integrations for development servers, so the process is as streamlined as when using a traditional bundler.
* **ESAssets Handlers** can make your assets available in convenient formats. **Preprocessing handlers** can transform assets before adding them to an asset module, while **runtime handlers** can help you load or use assets in your application. Handlers can either be loaded as third-party libraries, or they can be loaded directly from your own codebase.

### Examples

> [!Note]
> These examples are provided to give you an idea how ESAssets works. You could write these files by hand, but you typically would use **ESAssets Tools** to generate and update them.

The first example shows how an `svg-react` handler could be used to take SVG asset definitions and export them as React components:

**`assets.svg.ts`**
```ts
import { process } from "https://es-assets.github.io/handlers/runtime/svg-react.ts";

/** @source ./arrow_up.svg */
export const ArrowUp = process({
    type: "link",
    url: "/images/arrow_up.svg"
});

/** @source ./arrow_down.svg */
export const ArrowDown = process({
    type: "link",
    url: "/images/arrow_down.svg"
});

export const MAP = {
    ArrowUp,
    ArrowDown
};

export type AssetKey = keyof typeof MAP;
```

The second example is a little bit more elaborate. It shows you how ESAssets can be used to provide a *type-safe* CSS Modules implementation in combination with PostCSS:

**`assets.css.ts`**
```ts
import type { CssModuleAsset } from "https://es-assets.github.io/handlers/preprocessing/cssModules.ts";
import { process as processCss, loadCss } from "https://es-assets.github.io/handlers/runtime/css.ts";
import { process as postCss } from "https://es-assets.github.io/handlers/runtime/postCss.ts";

// Somewhere in your code you need to call `loadCss()`, which will load all the processed CSS modules.
// For production builds, the ESAssets CLI can infer all CSS assets from this file and produce a single
// preprocessed CSS file.
export { loadCss };

const process = (asset: CssModuleAsset) => processCss(postCss(asset));

/** @source ./buttons/buttons.module.css */
export const ButtonsModule = process({
    type: "link",
    url: "/css/buttons.module.css",
    styles: {
        btnSmall: "button-small",
        btnLarge "button-large",
        btnPrimary: "button-primary",
    }
});

/** @source ./icons/icons.module.css */
export const IconsModule = process({
    type: "link",
    url: "/css/icons.module.css",
    styles: {
        iconSmall: "icon-small",
        iconLarge "icon-large"
    }
});

export const MAP = {
    ButtonsModule,
    IconsModule
};

export type AssetKey = keyof typeof MAP;
```
