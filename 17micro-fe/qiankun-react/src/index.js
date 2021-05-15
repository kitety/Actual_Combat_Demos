import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

let instance = null;
function render(props) {
  console.log(props);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
} else {
  // __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export async function bootstrap() {}
export async function mount(props) {
  console.log(props);
  render(props);
}
export async function unmount(props) {
  console.log(props);
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}
