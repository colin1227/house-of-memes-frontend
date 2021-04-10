import { useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { styled } from '@material-ui/core/styles';
import './SignInForm.scss';
import { BottomNav } from '../../components/index';
import vars from '../../constants/vars';

const SecondaryButton = styled(Button)({
  background: 'linear-gradient(145deg, rgba(255,139,0,1) 45%, rgba(255,0,0,1) 100%)',
  color: 'white'
});

const BackButton = styled(Button)({
  background: 'rgb(119,136,153)',
  color: 'white'
});

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

// TODO: back button

const SignInForm = (props) => {
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [error, changeError] = useState('');
  let history = useHistory();
  const location = useLocation();
  const signInButtons = [
    <div key={-1} className="sign-in-buttons">
      <SecondaryButton className="back-sign-in" variant="contained" onClick={() => history.push('/users/sign-up')}>sign up Here</SecondaryButton>
      <BackButton className="back-button" variant="contained" onClick={() => {

      return history.push({ 
        pathname: (location &&
        location.state &&
        location.state.lastUrl) || '/memes'
      })
      }}>Back</BackButton>
      <Button className="log-in" variant="contained" color="primary" type="submit">Log in</Button>
    </div>
  ];

  const verifyForm = async(e) => {
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
    const result = await instance.post(`${vars.apiURL}/users/sign-in`, reqBody);
    if (String(result.status)[0] === '2') {
      myStorage.setItem('loggedIn', result.data.username);
      myStorage.setItem('cryptoMiner', result.data.token);
      history.push({ pathname:
        (location &&
        location.state &&
        location.state.lastUrl)
          ||
        '/memes' });
    } else {
      changeError('username or password didn\'t match');
    }
  }

  return (
    <div className="sign-in-page">
        <form onSubmit={(e) => verifyForm(e)} className="form-parent">
          <label className='big-label'>Sign In Page</label>
          <div className="row form-username">
            <label htmlFor="username">Username</label>
            <TextField className='form-inputs col-75' onChange={(e) => changeUsername(e.target.value)} type="text" name="username" id="username" required />
          </div>

          <div className="row form-password">
            <label htmlFor="password">Password</label>
            <TextField className='form-inputs col-75' onChange={(e) => changePassword(e.target.value)} type="password" name="password" id="password" required />
          </div>
          <div className="account-requirements">
            <ul>
              <li><b>Username</b>'s are 3 characters or more</li>
              <li><b>Password</b> are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in 'Merican English</li>
            </ul>
            { error ? <span className='error'>{error}</span> : <span></span>}
            <BottomNav buttons={signInButtons} />
          </div>
        </form>
    </div>
  )
}

export default SignInForm;
