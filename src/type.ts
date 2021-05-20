import type webpack from "webpack";

export interface WebpackConfigGeneratorOptions {
    /**
     * Directory of containing the application code.
     * Should contains `package.json`, `tsconfig.json`, `src/`, `index.html` and a main entry.
     */
    projectDirectory: string;
    /**
     * Specify additional file extension prefixes from dependency requests
     * that should be take precedence before the default file extensions.
     * The leading "." should be excluded.
     *
     * For example, `prioritizedExtensionPrefixes: ["mobile"]` expands to
     * the following file extensions prioritized during resolution:
     * `[".mobile.ts", ".mobile.tsx", ".mobile.js", ".mobile.jsx", ".mobile.less", ".mobile.css"]`
     *
     * A particular use case is to enable the consumer projects to
     * dynamically resolve component files from shared projects, such as
     * a wrapped component with business logic but uses different layouts
     * on desktop web project and mobile web project, the following
     * file structure can be used:
     *
     * Example usage:
     * ```
     * [ConfigGeneratorOptions]
     * new ConfigGenerator({
     *   prioritizedExtensionPrefixes: ["mobile"],
     *   //...
     * })
     *
     * [Folder structure]
     * workspaceRoot
     * └── web
     *     ├── desktop
     *     │   └── components
     *     │       └── AComponentThatImportsWrappedTableComponent.tsx
     *     ├── mobile
     *     │   └── components
     *     │       └── AComponentThatImportsWrappedTableComponent.tsx
     *     └── shared
     *         └── components
     *             └── WrappedTableComponent
     *                 ├── index.tsx                 (handles business logic)
     *                 ├── TableComponent.tsx        (for desktop web)
     *                 └── TableComponent.mobile.tsx (for mobile web)
     *
     * [/web/shared/components/WrappedTableComponent/index.tsx]
     * import {TableComponent} from "./TableComponent";
     * export class WrappedTableComponent extends React.PureComponent<Props, State> {}
     * ```
     */
    externalModules?: string[];
    tsconfigFilePath?: string;
    enableServiceWorker?: boolean;
    prioritizedExtensionPrefixes?: string[];
    /**
     * List of module resolution aliases to dynamically compute from `env`.
     */
    dynamicConfigResolvers?: DynamicConfigResolver[];
    /**
     * Option to set or dynamically compute `output.publicUrl`.
     */
    webpackPublicPath?: string | ((env: string) => string);
    /**
     * Name of main entry output.
     * Defaults to "index".
     */
    indexName?: string;
    /**
     * Extra entries to be bundled separately.
     */
    extraEntries?: Record<string, string>;
    /**
     * Maximum file size (in KB) allowed by an entry bundle.
     * Entry bundles exceeding the specified file size (KB) will be warned.
     */
    maxEntryPointKiloByte?: number;
    /**
     * Maximum file size (in KB) allowed by an asset after transformation (if any).
     * Assets exceeding the specified file size (KB) will be warned.
     */
    maxAssetKiloByte?: number;
    /**
     * Print the entire webpack config to console (e.g. for debugging).
     * Non-serializable functions will be replaced by the token `[Function]`.
     *
     * Also dumps errors and warnings as raw json from WebpackBuilder.
     * Since webpack#stats.toString() might exclude messages from webpack child compilations.
     */
    verbose?: boolean;
    // TODO: onSuccess?: () => void
}

export interface DynamicConfigResolver {
    /**
     * Prefix of the dependencies that should be aliased.
     *
     * Example: `prefix: "merchant-conf/current"` would match the dependency requests from
     * `import {...} from "merchant-conf/current/MerchantConfig"`,
     * `require("merchant-conf/current/assets/logo.png")`
     * and replace the import path with the value returned from `resolveByEnv`
     */
    prefix: string;
    /**
     * Callback function that returns a path to replace dependency requests matched by `prefix`.
     *
     * Example: `prefix: "merchant-conf/current", resolveByEnv: (env) => "merchant-conf/" + env`
     * and running with `--env dev` will replace
     * `require("merchant-conf/current/assets/logo.png")` with
     * `require("merchant-conf/dev/assets/logo.png")`.
     */
    resolver: string | null | ((env: string | null) => string | null);
}

export interface EntryDescriptor {
    name: string;
    /**
     * Filepath to a file of type html/js/css.
     */
    entryPath: string;
    /**
     * Output filename of the entry.
     */
    outputFilename: string;
    /**
     * Filepath to an html template file. Omitting this will result in the output having a static filename (***not*** having contenthash).
     *
     * Example usage:
     * Backend requires the "third-party-error-handler" entry to have a static filename.
     * Content hash should not be included in the output filename if the EntryDescriptor does not have htmlPath specified.
     */
    htmlPath?: string; // If undefined, a separate JS entry with name `"<EntryDescriptor.name>.js"` will be generated.
}

/**
 * Same as EntryDescriptor, but guaranteed to have an htmlPath.
 * Used for creating HTMLWebpackPlugin instances.
 * @see {EntryDescriptor}
 */
export interface HTMLEntryDescriptor {
    name: string;
    entryPath: string;
    htmlPath: string;
}

export interface InternalCheckerOptions {
    /**
     * Directory of containing the application code.
     * Should contains `package.json`, `tsconfig.json`, `src/`, `index.html` and a main entry.
     */
    projectDirectory: string;
}

declare module "webpack" {
    interface TapablePlugin {
        apply(...args: any[]): void;
    }
    /**
     * Webpack 5 bundles its own type definition file, while the whole ecosystem
     * relies on "@types/webpack" before version 5.
     * The type definition of `webpack.Plugin` does not exists in "webpack@5.0.0"
     * and DefinitelyTyped packages that depended on "@types/webpack@^4.x" breaks.
     * This is because `import webpack from "webpack"` used to resolve to
     * "@types/webpack@^4.x", but after upgrading to version 5, the import resolves
     * to "webpack@5.0.0".
     *
     * This is a workaround to allow "@types/*-plugin" packages to work before their
     * type definitions are properly upgraded.
     */
    export abstract class Plugin {
        apply(compiler: webpack.Compiler): void;
    }
}
