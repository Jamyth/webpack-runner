import {createConsoleLogger} from "../util/createConsoleLogger";
import fs from "fs";
import type {DynamicConfigResolver} from "../type";

interface WebpackResolveAliasMapOptions {
    env: string | null;
    dynamicConfigResolvers: DynamicConfigResolver[];
}

export class WebpackResolveAliasFactory {
    private static readonly logger = createConsoleLogger("WebpackResolveAliasFactory");

    static generate({env, dynamicConfigResolvers}: WebpackResolveAliasMapOptions): {[moduleAlias: string]: string} {
        if (env === null) {
            return {};
        }

        const moduleAliasMap: {[moduleAlias: string]: string} = {};

        for (const {prefix, resolveByEnv} of dynamicConfigResolvers) {
            if (prefix in moduleAliasMap) {
                throw new Error(`Duplicated key for dynamic resolver: ${prefix}`);
            }
            const resolvedAliasPath = WebpackResolveAliasFactory.resolveRealPath(env, {prefix, resolveByEnv});
            if (resolvedAliasPath !== null) {
                moduleAliasMap[prefix] = resolvedAliasPath;
            } else {
                WebpackResolveAliasFactory.logger.info(`Warning: dynamicConfigResolver cannot resolve for alias "${prefix}". Trying to use fallback path mapping.`);
            }
        }

        const createdAliasCount = Object.entries(moduleAliasMap).length;
        const dynamicConfigResolverCount = Object.entries(dynamicConfigResolvers).length;
        if (createdAliasCount !== 0 && createdAliasCount !== dynamicConfigResolverCount) {
            WebpackResolveAliasFactory.logger.error(
                `Cannot use fallback path mapping. ${createdAliasCount} out of ${dynamicConfigResolverCount} aliases are resolved,
            but fallback path mappings can only be used when all dynamicConfigResolvers failed.
            Sucessfully resolved aliases: ${JSON.stringify(moduleAliasMap)}`
            );
            throw new Error(`DynamicConfigResolvers: failed to resolve path mapping for aliases.`);
        }

        return moduleAliasMap;
    }

    private static resolveRealPath(env: string, {prefix, resolveByEnv}: DynamicConfigResolver): string | null {
        const realPath = resolveByEnv(env);
        if (prefix.trim() === "") {
            throw new Error(`Resolver prefix cannot be empty`);
        } else if (/\s/.test(prefix)) {
            throw new Error(`Resolver prefix cannot contain whitespace, received: ${prefix}`);
        } else if (!fs.existsSync(realPath)) {
            return null;
        }
        return realPath;
    }
}
