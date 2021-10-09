import { useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";

import axios from 'axios';
import { styled } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './SignUpForm.scss';

import vars from '../../constants/vars.js';
import { BottomNav, LoadingSVG } from '../../components';

let passwordRegEx = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
const myStorage = window.localStorage;

// const SecondaryButton = styled(Button)({
//   background: 'linear-gradient(145deg, rgba(255,139,0,1) 45%, rgba(255,0,0,1) 100%)',
//   color: 'white'
// });
const BackButton = styled(Button)({
  background: 'rgb(119,136,153)',
  color: 'white'
});

const SignUpForm = () => {
  const history = useHistory();
  const location = useLocation();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [confirmPassword, changeConfirmPassword] = useState('');
  const [error, changeError] = useState('');
  const [animate, changeAnimationClass] = useState('on-render');

  const goBack = () => {
    changeAnimationClass('on-back-button');
    setTimeout(() => {
      return history.push({ 
        pathname: (location &&
        location.state &&
        location.state.lastUrl) || '/memes'
      })
    }, 1000)
  }
  const signUpButtons = [
    <div key={-1} className="sign-up-buttons">
      <BackButton className="back-button" variant="contained" onClick={() => goBack()}>Back</BackButton>
      <Button variant="contained" color="primary" type="submit">Finish</Button>
    </div>
  ]

  const verifySignUpForm = async(e) => {
    e.preventDefault();
    // field check
    if (!username.length || !password.length || !confirmPassword.length) {
      changeError('verfiy all required fields are filled');
    } else if (password !== confirmPassword) {
      changeError('passwords must match');
    } else if (password.length < 8 || !passwordRegEx.test(password)) {
      changeError('pass >= 8 characters, 1 #, 1 Symbol, 1');
    } else if (username.length < 3) {
      changeError('username must be at a minimum 3 characters');
    }
    changeAnimationClass('on-submit-button');
    let data = {
      username,
      password
    };

    data = JSON.stringify({
      ...data
    });

    const result = await axios.request({
      method: 'POST',
      url: `${vars.apiURL}/users/sign-up`,
      headers: { "Content-Type": "application/json" },
      data
    });

    // setTimeout
    if (result.status === '201') {
      myStorage.setItem('loggedIn', result.data.username);
      history.push('/memes/');
      myStorage.setItem('HoMCookie', result.data.token);
    } else {
      changeError('something didn\'t work');
      changeAnimationClass('if-failed-login');
    }
  }

  return (
    <div className="sign-up-page">
        <div
          className={`margin-auto ${animate === 'on-submit-button' ? 'fade-in': animate === 'if-failed-login' ? 'fade-out' : ''}`}>
          <LoadingSVG />
        </div>
        <div
          className={`margin-auto ${animate === 'on-submit-button' ?
          'fade-in': animate === 'if-failed-login' ?
          'fade-out' : ''}`}>
          <LoadingSVG />
        </div>
      <form onSubmit={(e) => verifySignUpForm(e)} className={`${animate ? animate : ''} form-parent`}>
        <label className='big-label'>Sign Up Page</label>
        <div className="row form-username">
          <label htmlFor="username">Username</label>
          <TextField className='form-inputs col-75' onChange={(e) => changeUsername(e.target.value)} type="text" name="username" id="username" required />
        </div>

        <div className="row form-password">
          <label htmlFor="password">Password</label>
          <TextField className='form-inputs col-75' onChange={(e) => changePassword(e.target.value)} type="password" name="password" id="password" required />
        </div>

        <div className="row form-confirmPassword">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <TextField className='form-inputs col-75' onChange={(e) => changeConfirmPassword(e.target.value)} type="password" name="confirmPassword" id="confirmPassword" required />
        </div>

        <div className="account-requirements">
          <ul>
            <li><b>Username</b>'s are 3 characters or more</li>
            <li><b>Password</b> are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in 'Merican English</li>
            <li><b>Email</b>(optional)</li>
            {error ? <li className="error-text">{error}</li> : false}
          </ul>
        </div>
        <div className="sign-up">
          <div className="sign-in" onClick={() => history.push('/users/sign-in')}>Sign In</div>
        </div>
        <BottomNav buttons={signUpButtons} />
      </form>
    </div>
  )
}

export default SignUpForm;
