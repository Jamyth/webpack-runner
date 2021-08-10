import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

/**
 * Handles dependency requests to image assets (".png", ".jpeg", ".jpg", ".gif", ".svg")
 * by inlining as images as DataURL,
 * or emitting as separate files if file size is too large.
 *
 * @see https://webpack.js.org/guides/asset-modules/
 */
export function imageRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".png", ".jpeg", ".jpg", ".gif", ".svg"),
        type: "asset/resource",
    };
}
