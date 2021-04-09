import {imageRule} from "./image.rule";
import {inlineRule} from "./inline.rule";
import {tsRule} from "./ts.rule";
import {stylesheetRule} from "./stylesheet.rule";

/**
 * Static factories to create `webpack.config#modules.rules` items.
 */
export class Rule {
    static readonly image = imageRule;

    static readonly inline = inlineRule;

    static readonly ts = tsRule;

    static readonly stylesheet = stylesheetRule;
}
