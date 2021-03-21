import {createConsoleLogger, spawn} from "./util";
import path from "path";

const logger = createConsoleLogger("Build");

function format() {
    logger.info("Formatting codes");
    return spawn("prettier", ["--write", "--config", "config/prettier.config.json", "{src,script}/**/*.ts"], "Cannot format");
}

function lint() {
    logger.info("Checking eslint");
    return spawn("eslint", ["--ext=.js,.jsx,.ts,.tsx", path.join(__dirname, "../src")], "Linting not pass, please fix");
}

function prepareDirectory() {
    logger.info("Preparing build folder");
    return spawn("rm", ["-rf", path.join(__dirname, "../dist")], "");
}

function compile() {
    logger.info("Compiling with tsc");
    return spawn("tsc", ["--project", path.join(__dirname, "../tsconfig.json")], "Cannot compile, might have errors");
}

function build() {
    format();
    lint();
    prepareDirectory();
    compile();
}

build();
