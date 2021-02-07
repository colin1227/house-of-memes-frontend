import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Redirect
} from "react-router-dom";

/* (hash)Tags == Categories <Route exact path="/m/tags" /> */
import { SignInForm, SignUpForm, Upload, Viewer } from "./Containers/index";

import "./App.scss";

const App = () => {
  const [ username, logUsername] = useState('');
  const [ status, changeStatus] = useState('');
  const history = useHistory();

  if ((username && username.length <= 0 )|| (status && 0 >= status.length)) history.push("/u/sign-in");

  return (
      <div className="App">
        <Router>
          <Switch>
            <Redirect exact from="/" to="/m/" />
            
            <Route exact path="/m/" component={ () => <Viewer username={username} status={status} />} />
            <Route exact path="/m/upload" component={ () => <Upload username={username} status={status} />} />
            <Route exact path="/u/sign-in" component={ () => <SignInForm username={username} status={status} logUsername={logUsername} changeStatus={changeStatus} />} />
            <Route exact path="/u/sign-up" component={ () => <SignUpForm username={username} status={status} logUsername={logUsername} changeStatus={changeStatus} />} />   
          </Switch>
        </Router>
      </div>
  );
}

export default App;
