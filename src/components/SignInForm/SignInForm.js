import { useState } from 'react';

import { useHistory } from 'react-router';


import axios from 'axios';

import './SignInForm.scss';


const url = true ? 'http://localhost:9000': 'https://parasocial-media.com';

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

const SignInForm = ({ pusername, logUsername, changeStatus }) => {
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [error, changeError] = useState('');
  let history = useHistory();

  if (pusername) history.push('/m/');

  const verifyForum = async(e) => {
    e.preventDefault();
    if (username.length < 3) {
      changeError('username must be at a minimum 3 characters');
    } else if (password.length < 8) {
      changeError('passwords must me at min 8 characters');
    }
    let reqBody = {
      username,
      password
    };
    const result = await instance.post(`${url}/u/sign-in`, reqBody);
    console.log(result);
    if (String(result.status)[0] === '2') {
      myStorage.setItem('loggedIn', result.data.username);

      logUsername(result.data.username);
      changeStatus(result.data.status);
      history.push('/m/');
    } else {
      console.log(result.error.message);
      changeError('username or password didn\'t match');
    }
  }

  return (
    <div className="container">
        <form onSubmit={(e) => verifyForum(e)} className="formParent">
          <div className="row form-username">
            <label htmlFor="username">Username</label>
            <input className='formInputs col-75' onChange={(e) => changeUsername(e.target.value)} type="text" name="username" id="username" required />
          </div>

          <div className="row form-password">
            <label htmlFor="password">Password</label>
            <input className='formInputs col-75' onChange={(e) => changePassword(e.target.value)} type="password" name="password" id="password" required />
          </div>
          <div>
            <ul>
              <li><b>Username</b>'s are 3 characters or more</li>
              <li><b>Password</b> are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in 'merican</li>
            </ul>
          <div className="form-submit">
            <input className='formButton' type="submit" value="observe memes"/>
          </div>
            { error ? <span className='red'>{error}</span> : <span></span>}
            <div>
              <button onClick={() => history.push("/u/sign-up")}>Sign up</button>
              <button onClick={() => history.push("/m/")}>Memes</button>
              {/* <button prop="/u/fogot">Forgot somethin'</button> */}
            </div>
          </div>
        </form>
    </div>
  )
}

export default SignInForm;
