import type * as babel from "@babel/core";

interface State extends Pick<babel.PluginPass, "file" | "key" | "opts" | "cwd" | "filename"> {
    hasInjectedDeclineWebpackHMRNode: boolean;
}

/**
 * Injects `if (module.hot) module.hot.decline()` code snippet in files that contains injectLifecycle method.
 */
export default function ({types: t}: typeof babel): babel.PluginObj<State> {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                if (state.hasInjectedDeclineWebpackHMRNode) {
                    return;
                }

                const {
                    node: {
                        source: {value: importSource},
                    },
                } = path;

                if (!importSource.includes("injectLifecycle")) {
                    return;
                }

                // We now know the TS/JS file has included `injectLifecycle`, inject the code snippet
                const programPath = path.findParent((parentPath) => t.isProgram(parentPath.node))! as babel.NodePath<babel.types.Program>;

                // prettier-ignore
                const declineWebpackHMRNode = t.ifStatement(
                    t.memberExpression(
                        t.identifier("module"),
                        t.identifier("hot")
                    ),
                    t.expressionStatement(
                        t.callExpression(
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier("module"),
                                    t.identifier("hot"),
                                ),
                                t.identifier("decline"),
                            ),
                            [],
                        ),
                    ),
                );

                // Append `if (module.hot) module.hot.decline()` to end of program body
                programPath.pushContainer("body", declineWebpackHMRNode);

                // We only need to inject the code snippet once per file, mark as injected
                state.hasInjectedDeclineWebpackHMRNode = true;
            },
        },
    };
}
