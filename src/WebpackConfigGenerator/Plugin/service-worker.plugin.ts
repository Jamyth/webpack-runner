import type webpack from "webpack";
import WorkboxPlugin from "workbox-webpack-plugin";
import {WebpackConfigSerializationUtil} from "../WebpackConfigSerializationUtil";

export function workboxGenerateSWPlugin(): webpack.WebpackPluginInstance {
    return WebpackConfigSerializationUtil.serializablePlugin("WorkboxGenerateSWWebpackPlugin", WorkboxPlugin.GenerateSW, {
        clientsClaim: true,
        skipWaiting: true,
    });
}
