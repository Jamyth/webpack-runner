import {WebpackRunner} from "../../src";
import path from "path";

new WebpackRunner({
    port: 3000,
    projectDirectory: path.join(__dirname, ".."),
}).run();
