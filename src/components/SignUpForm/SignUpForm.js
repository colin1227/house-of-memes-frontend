import { useEffect, useState } from 'react';
import axios from 'axios';

import { useHistory } from 'react-router';

import './SignUpForm.scss';

let passwordRegEx = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

let emailRegEx = new RegExp(`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])`);

const myStorage = window.localStorage;

// const instance = axios.create({
//   baseURL: true ? 'http://localhost:9000': 'https://parasocial-media.com',
//   timeout: 3500,
//   headers: { "Content-Type": "application/json" }
// });

const SignUpForm = ({ logUsername, changeStatus }) => {
  const history = useHistory();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [confirmPassword, changeConfirmPassword] = useState('');
  const [email, changeEmail] = useState('');
  const [noties, changeNoteyStatus] = useState(false);
  const [error, changeError] = useState('');


  const verifyForum = async(e) => {
    e.preventDefault();
    if (!username.length || !password.length || !confirmPassword.length) {
      changeError('verfiy all required fields are filled');
    } else if (password !== confirmPassword) {
      changeError('passwords must match');
    } else if (password.length < 8 || !passwordRegEx.test(password)) {
      console.log('pass >= 8 characters, 1 #, 1 Symbol, 1');
    } else if (username.length < 3) {
      changeError('username must be at a minimum 3 characters');
    } else if (noties && !emailRegEx.test(email)) {
      console.log(email + ' is not valid');
    }

    let data = {
      username,
      password
    };

    if (noties) data.email = email;

    data = JSON.stringify({
      ...data
    });

    const result = await axios.request({
      method: 'POST',
      url: `http://localhost:9000/u/sign-up`,
      headers: { "Content-Type": "application/json" },
      data
    });

    console.log(result)

    if (String(result.status)[0] === '2') {
      myStorage.setItem('loggedIn', result.data.username);

      logUsername(result.data.username);
      changeStatus(result.data.status);
    } else {
      console.log(result.error.message);
    }
  }



  useEffect(() => {
    console.log('widePeopoLoaded');
  },[]);

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

          <div className="row form-confirmPassword">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input className='formInputs col-75' onChange={(e) => changeConfirmPassword(e.target.value)} type="password" name="confirmPassword" id="confirmPassword" required />
          </div>
        

          <div className="row form-email-checkbox">
            <label htmlFor="emailStatus">Email?</label>
            <input className='emailStatus col-20' onChange={() => changeNoteyStatus(!noties)} type="checkbox" name="emailCheck" id="emailCheck" />
          </div>
          {
            noties ? 
              <div className="row form-email">
                <label htmlFor="email">New feature updates n stuff</label>
                <input className='formInputs col-75' onChange={(e) => changeEmail(e.target.value)} type="email" name="email" id="email" />
              </div>
              :
              null
          }
          <div>
            <ul>
              <li><b>Username</b>'s are 3 characters or more</li>
              <li><b>Password</b> are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in 'merican</li>
              <li><b>Email</b>(optional)</li>
            </ul>
            { error ? <span>{error}</span> : <span></span>}
          </div>

          <div className="nav">
            <button onClick={() => history.push("/u/sign-in")}>Sign in</button>
            <button onClick={() => history.push("/m/")}>Memes</button>
            {/* <button prop="/u/fogot">Forgot somethin'</button> */}
          </div>
          <div className="form-submit">
            <input className='formButton col-50' type="submit" value="observe memes" />
          </div>
        </form>
    </div>
  )
}

export default SignUpForm;
