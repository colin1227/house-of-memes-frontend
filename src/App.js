import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  Redirect
} from "react-router-dom";

// <nav>
//   <ul>
//     <li>
//       <Link to="/m/">Memes</Link>
//     </li>
//     <li>
//       <Link to="/m/manage">Manage</Link>
//     </li>
//     <li>
//       <Link to="/m/upload">Upload</Link>
//     </li>
//     {/* <li>
//       <Link to="/a/search">search</Link>
//     </li> */}
//   </ul>
// </nav>

import { Viewer, Upload, Manage } from "./components/index";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route default exact path="/" component={() => (<Redirect to="/m/" />)} />
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