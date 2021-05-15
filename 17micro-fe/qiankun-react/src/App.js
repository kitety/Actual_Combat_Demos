import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router basename="/react">
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Route
        path="/"
        exact
        render={() => {
          return (
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
          );
        }}
      ></Route>
      <Route
        path="/about"
        exact
        render={() => {
          return <div className="App">关于</div>;
        }}
      ></Route>
    </Router>
  );
}

export default App;
