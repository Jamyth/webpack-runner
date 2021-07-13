import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

interface StylesheetRuleDeps {
    minimize: boolean;
}

function cssLoader(importLoaders: number): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("css-loader"),
        options: {
            importLoaders,
        },
    };
}

function sassLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("sass-loader"),
    };
}

function miniCssExtractPluginLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve(MiniCssExtractPlugin.loader),
    };
}

function postcssLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("postcss-loader"),
        options: {
            postcssOptions: {
                plugins: [
                    [require.resolve("autoprefixer")],
                    // prettier-format-preserve
                ],
            },
        },
    };
}

function styleLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("style-loader"),
    };
}

function lessLoader(): webpack.RuleSetUseItem {
    return {
        loader: require.resolve("less-loader"),
        options: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    };
}

/**
 * Handles dependency requests to stylesheet assets (".css", ".sass")
 * with `minimize: true` by `sassc` -> transform to js module -> inject to DOM as <style> tag,
 * or with `minimize: false` by `sassc` -> `autoprefixer` with `postcss` -> transform to js module -> extract to stylesheet
 *
 * @see https://webpack.js.org/loaders/css-loader/
 * @see https://webpack.js.org/loaders/sass-loader/
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/
 * @see https://webpack.js.org/loaders/postcss-loader/
 * @see https://webpack.js.org/loaders/style-loader/
 */
export function stylesheetRule({minimize}: StylesheetRuleDeps): webpack.RuleSetRule[] {
    const cssUse: webpack.RuleSetUseItem[] = minimize
        ? [
              miniCssExtractPluginLoader(),
              cssLoader(2),
              postcssLoader(),
              // prettier-format-preserve
          ]
        : [
              styleLoader(),
              cssLoader(1),
              // prettier-format-preserve
          ];

    const sassUse: webpack.RuleSetUseItem[] = minimize
        ? [
              miniCssExtractPluginLoader(),
              cssLoader(2),
              postcssLoader(),
              sassLoader(),
              // prettier-format-preserve
          ]
        : [
              styleLoader(),
              cssLoader(1),
              sassLoader(),
              // prettier-format-preserve
          ];

    const lessUse: webpack.RuleSetUseItem[] = minimize
        ? [
              miniCssExtractPluginLoader(),
              cssLoader(2),
              postcssLoader(),
              lessLoader(),
              // prettier-format-preserve
          ]
        : [
              styleLoader(),
              cssLoader(1),
              lessLoader(),
              // prettier-format-preserve
          ];

    return [
        {
            test: RegExpUtil.fileExtension(".css"),
            use: cssUse,
            // Declare all css/sass imports as side effects (not to be considered
            // as dead code), regardsass of the containing package claims to be
            // otherwise. This prevents css from being tree shaken.
            // Currently webpack does not add a warning / throw an error for this.
            // See: https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
        },
        {
            test: RegExpUtil.fileExtension(".sass", ".scss"),
            use: sassUse,
            // Declare all css/sass imports as side effects (not to be considered
            // as dead code), regardsass of the containing package claims to be
            // otherwise. This prevents css from being tree shaken.
            // Currently webpack does not add a warning / throw an error for this.
            // See: https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
        },
        {
            test: RegExpUtil.fileExtension(".less"),
            use: lessUse,
            // Declare all css/sass imports as side effects (not to be considered
            // as dead code), regardsass of the containing package claims to be
            // otherwise. This prevents css from being tree shaken.
            // Currently webpack does not add a warning / throw an error for this.
            // See: https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
        },
    ];
}
