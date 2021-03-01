import { useState } from 'react';
import { useHistory } from 'react-router';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { styled } from '@material-ui/core/styles';
import './SignInForm.scss';
import { BottomNav } from '../../components/index';
import constants from '../../constants/vars.json';

const SecondaryButton = styled(Button)({
  background: 'linear-gradient(145deg, rgba(255,139,0,1) 45%, rgba(255,0,0,1) 100%)',
  color: 'white'
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

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

  const signInButtons = [
    <div className="sign-in-buttons">
      <SecondaryButton className="back-sign-in bad-practice-color-change" variant="contained" onClick={() => history.push('/u/sign-up')}>sign up Here</SecondaryButton>
      <Button className="log-in" variant="contained" color="primary" type="submit">Log in</Button>
    </div>
  ];
  if (pusername) history.push('/m/');

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
    const result = await instance.post(`${url}/u/sign-in`, reqBody);
    if (String(result.status)[0] === '2') {
      myStorage.setItem('loggedIn', result.data.username);

      logUsername(result.data.username);
      changeStatus(result.data.status);
      history.push('/m/');
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
