import {createConsoleLogger} from "./util/createConsoleLogger";
import DevServer from "webpack-dev-server";
import webpack from "webpack";
import path from "path";
import {WebpackConfigGenerator} from "./WebpackConfigGenerator";
import type {WebpackConfigGeneratorOptions} from "./WebpackConfigGenerator";

interface WebpackRunnerConfigOption
    extends Pick<
        WebpackConfigGeneratorOptions,
        // prettier-reserve
        "projectDirectory" | "dynamicConfigResolvers" | "extraEntries" | "prioritizedExtensionPrefixes" | "verbose" | "tsconfigFilePath" | "defineVars"
    > {
    projectDirectory: string;
    port: number;
    tsconfigFilePath?: string;
    externalModules?: string[];
    apiProxy?: {
        target: string;
        context: string[];
    };
    https?: boolean;
}

export class WebpackRunner {
    private readonly port: number;
    private readonly webpackConfig: webpack.Configuration;
    private readonly devServerConfigContentBase: string;
    private readonly apiProxy:
        | {
              target: string;
              context: string[];
          }
        | undefined;
    private readonly logger = createConsoleLogger("Webpack Runner");
    private readonly https: boolean;

    constructor({port, projectDirectory, apiProxy, tsconfigFilePath, externalModules, dynamicConfigResolvers, extraEntries, prioritizedExtensionPrefixes, verbose, defineVars, https = true}: WebpackRunnerConfigOption) {
        this.port = port;
        this.devServerConfigContentBase = path.join(projectDirectory, "static");
        this.apiProxy = apiProxy;
        this.https = https;
        this.webpackConfig = new WebpackConfigGenerator({
            projectDirectory,
            dynamicConfigResolvers,
            extraEntries,
            prioritizedExtensionPrefixes,
            tsconfigFilePath,
            externalModules,
            verbose,
            defineVars,
        }).development();
    }

    async run() {
        try {
            this.logger.info(["Starting Webpack Dev Server on port", String(this.port)]);
            const server = this.createInstance();
            const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
            for (const signal of signals) {
                process.on(signal, () => {
                    // force stop webpack dev server
                    server.stopCallback(() => {});
                    process.exit();
                });
            }
            await server.start();
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(error);
            }
            console.error(error);
            process.exit(1);
        }
    }

    private createInstance(): DevServer {
        return new DevServer(
            {
                port: this.port,
                host: "0.0.0.0",
                static: {
                    directory: this.devServerConfigContentBase,
                },
                historyApiFallback: true,
                server: {
                    type: "https",
                },
                compress: true,
                hot: true,
                client: {
                    overlay: {
                        errors: true,
                    },
                },
                devMiddleware: {
                    stats: {
                        colors: true,
                        // https://github.com/webpack/webpack/blob/b65d060040a26255cbf6f50350fef4d4ffcce4d7/lib/stats/DefaultStatsPresetPlugin.js#L96-L103
                        all: false,
                        errors: true,
                        errorsCount: true,
                        warnings: true,
                        warningsCount: true,
                        logging: "warn",
                    },
                },
                proxy: this.apiProxy
                    ? [
                          {
                              context: this.apiProxy.context,
                              target: this.apiProxy.target,
                              secure: false,
                              changeOrigin: true,
                          },
                      ]
                    : undefined,
            },
            webpack(this.webpackConfig)
        );
    }
}
