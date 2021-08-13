export const Constant = {
    maxEntryPointKiloByte: 1500,

    maxAssetKiloByte: 4000,

    /**
     * List of file extensions that should be resolvable by webpack.config#resolve.extensions.
     * Extensions should begin with a dot (".").
     */
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],

    /**
     * List of font file extensions that should be bundled by webpack with file-loader.
     * Extensions should begin with a dot (".").
     */
    fontExtensions: [".woff", ".woff2", ".eot", ".ttf", ".otf"],

    /**
     * List of media file extensions that should be bundled by webpack with file-loader.
     * Extensions should begin with a dot (".").
     */
    mediaExtensions: [".mp3", ".mp4", ".wav", ".mov", ".flv", ".avi"],

    /**
     * List of filename candidates for webpack.config#entry.main that should reside in `<projectDirectory>/src/`.
     * Candidates placed at the front of the array has higher priority.
     */
    mainEntryFilenames: ["index.tsx", "index.ts", "index.jsx", "index.js", "index.less", "index.css"],
};
