import chalk from "chalk";

export function createConsoleLogger(title: string) {
    const print = (emoji: string) => (color: "blueBright" | "greenBright" | "redBright") => {
        return (title: string) =>
            (text: string | Error | (string | Error)[]): void => {
                const _title = chalk[color].bold(`${emoji} [${title}]`);
                const body = chalk.whiteBright.bgBlack((Array.isArray(text) ? text : [text]).map((_) => _.toString()).join(" "));
                console.info("");
                console.info(`${_title} ${body}`);
            };
    };

    return {
        info: print("âšī¸")("blueBright")(title),
        task: print("đ ")("greenBright")(title),
        error: print("â")("redBright")(title),
    };
}
