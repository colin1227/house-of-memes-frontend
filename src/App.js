import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import { Viewer, Upload, Manage } from "./components";
document.querySelector("body").style.backgroundColor = "blueviolet";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/m/">Memes</Link>
              </li>
              <li>
                <Link to="/m/manage">Manage</Link>
              </li>
              <li>
                <Link to="/m/upload">Upload</Link>
              </li>
              {/* <li>
                <Link to="/u/">Users</Link>
              </li> */}
            </ul>
          </nav>
          <Switch>
            <Route default exact path="/" component={() => (<Redirect to="/m/" />)} />
            <Route default exact path="/m/" component={Viewer} />
            <Route exact path="/m/upload" component={Upload} />
            <Route exact path="/m/manage" component={Manage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;