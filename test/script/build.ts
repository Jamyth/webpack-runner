import {WebpackBuilder} from "../../src";
import path from "path";

new WebpackBuilder({
    projectDirectory: path.join(__dirname, ".."),
}).run();
