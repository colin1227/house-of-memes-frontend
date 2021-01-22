import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Viewer, Upload, Manage, Landing } from "./components/index";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>

            <Route default path="/" component={Landing} />
            <Route exact path="/m/" component={Viewer} />
            <Route exact path="/m/upload" component={Upload} />
            <Route exact path="/m/manage" component={Manage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;