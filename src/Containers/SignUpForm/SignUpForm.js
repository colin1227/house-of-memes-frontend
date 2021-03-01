import { useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

import './SignUpForm.scss';

// import { BottomNav } from '../../components/index';

import constants from '../../constants/vars.json';
import { BottomNav } from '../../components';

let passwordRegEx = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


const myStorage = window.localStorage;

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const SecondaryButton = styled(Button)({
  background: 'linear-gradient(145deg, rgba(255,139,0,1) 45%, rgba(255,0,0,1) 100%)',
  color: 'white'
});


const SignUpForm = ({ logUsername, changeStatus }) => {
  const history = useHistory();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [confirmPassword, changeConfirmPassword] = useState('');
  const [error, changeError] = useState('');

  const signUpButtons = [
    <div className="sign-up-buttons">
      <SecondaryButton onClick={() => history.push("/u/sign-in")}>Sign in Page</SecondaryButton>
      <Button variant="contained" color="primary" type="submit">Finish</Button>
    </div>
  ]

  const verifyForm = async(e) => {
    e.preventDefault();
    if (!username.length || !password.length || !confirmPassword.length) {
      changeError('verfiy all required fields are filled');
    } else if (password !== confirmPassword) {
      changeError('passwords must match');
    } else if (password.length < 8 || !passwordRegEx.test(password)) {
      changeError('pass >= 8 characters, 1 #, 1 Symbol, 1');
    } else if (username.length < 3) {
      changeError('username must be at a minimum 3 characters');
    }

    let data = {
      username,
      password
    };

    data = JSON.stringify({
      ...data
    });

    const result = await axios.request({
      method: 'POST',
      url: `${url}/u/sign-up`,
      headers: { "Content-Type": "application/json" },
      data
    });

    if (String(result.status)[0] === '2') {
      myStorage.setItem('loggedIn', result.data.username);
      history.push('/m/');
      logUsername(result.data.username);
      changeStatus(result.data.status);
    } else {
      changeError('something didn\'t work');
    }
  }

  return (
    <div className="sign-up-page">
      <form onSubmit={(e) => verifyForm(e)} className="form-parent">
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
          </ul>
          { error ? <span>{error}</span> : <span></span>}
        </div>

        <BottomNav buttons={signUpButtons} />
      </form>
    </div>
  )
}

export default SignUpForm;
