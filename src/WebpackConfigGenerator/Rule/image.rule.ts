import type webpack from "webpack";
import {RegExpUtil} from "./RegExpUtil";

export function imageRule(): webpack.RuleSetRule {
    return {
        test: RegExpUtil.fileExtension(".png", ".jpeg", ".jpg", ".gif", ".svg"),
        type: "asset/resource",
    };
}
