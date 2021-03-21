import {spawn, createConsoleLogger} from "./util";

const logger = createConsoleLogger("Prettier Format");

export function format() {
    logger.task("Format scripts");
    return spawn("prettier", ["--write", "--config", "config/prettier.config.json", "{src,script}/**/*.ts"], "Cannot format");
}

format();
