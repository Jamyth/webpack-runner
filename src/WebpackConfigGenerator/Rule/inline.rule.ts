import type webpack from "webpack";
import {Constant} from "../../Constant";
import {RegExpUtil} from "./RegExpUtil";

export function inlineRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".ico", ...Constant.mediaExtensions, ...Constant.fontExtensions),
        type: "asset/inline",
    };
}
