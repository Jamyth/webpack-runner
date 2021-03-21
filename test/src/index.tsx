import React from "react";
import ReactDOM from "react-dom";

const App = React.memo(() => {
    return <h1>Test Site</h1>;
});

ReactDOM.render(<App />, document.getElementById("test-entry"));
