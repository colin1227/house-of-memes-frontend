import { useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { styled } from '@material-ui/core/styles';
import './SignInForm.scss';
import { BottomNav, LoadingSVG } from '../../components/index';
import vars from '../../constants/vars';

const BackButton = styled(Button)({
  background: 'rgb(119,136,153)',
  color: 'white'
});

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

const SignInForm = (props) => {
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [error, changeError] = useState('');
  const [animate, changeAnimationClass] = useState('on-render');
  let history = useHistory();
  const location = useLocation();

  const goBack = () => {
    changeAnimationClass('on-back-button');
    setTimeout(() => {
      return history.push({ 
        // check that is of the same url houseofmemes.com or localhost(locally)
        pathname: (location &&
        location.state &&
        location.state.lastUrl) || '/memes'
      })
    }, 1000)
  }
  const signInButtons = [
    <div key={-1} className="sign-in-buttons">
      <BackButton className="back-button" variant="contained" onClick={() => goBack()}>Back</BackButton>
      <Button className="log-in" variant="contained" color="primary" type="submit">Log in</Button>
    </div>
  ];

  const verifySignInForm = async(e) => {
    e.preventDefault();
    if (username.length < 3) {
      changeError('username must be at a minimum 3 characters');
    } else if (password.length < 8) {
      changeError('passwords must be at min 8 characters');
    }
    changeAnimationClass('on-submit-button');

    let reqBody = {
      username,
      password
    };
    const result = await instance.post(`${vars.apiURL}/users/sign-in`, reqBody);

    setTimeout(() => {
      console.log(result.status)
      if (result.status === 200) {
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
        changeAnimationClass('if-failed-login');
      }
    }, 52);
  }

  return (
    <div className="sign-in-page">
        <div
          className={`margin-auto ${animate === 'on-submit-button' ? 'fade-in': animate === 'if-failed-login' ? 'fade-out' : ''}`}>
          <LoadingSVG />
        </div>

        <form onSubmit={(e) => verifySignInForm(e)} className={`${animate ? animate : ''} form-parent`}>
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
              <li><b>Password</b> are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in English</li>
              {error ? <li className="error-text">{error}</li> : false}
            </ul>
            <div className="sign-up">
              <div className="join-here" onClick={() => history.push('/users/sign-up')}>Join Here</div>
            </div>
            <BottomNav buttons={signInButtons} />
          </div>
        </form>
    </div>
  )
}

export default SignInForm;
