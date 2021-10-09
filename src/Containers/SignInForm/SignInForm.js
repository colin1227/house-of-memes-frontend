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

const passwordText = <li><b>Password</b>'s are <b>8</b> characters or more feat. a Symbol, a number, and an upercase and lower case letter in English</li>;

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
    } else if (username.split().filter(character => {
          return character !== character.toLowerCase();
        }).length !== 0) {
      changeError('username must be lower case');
    } else if (password.length < 8) {
      changeError('passwords must be a minimum of 8 characters');
    } else {
      changeAnimationClass('on-submit-button');

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      try {
        const result = await axios({
          method: 'POST',
          url: `${vars.apiURL}/users/sign-in`,
          data: formData,
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (result.status === 200) {
          myStorage.setItem('loggedIn', result.data.username);
          myStorage.setItem('HoMCookie', result.data.token);
          history.push({ pathname:
            (location &&
            location.state &&
            location.state.lastUrl)
              ||
            '/memes' });
        }
      } catch (error) {
        changeError('username or password didn\'t match');
        changeAnimationClass('on-failed-login');
      }

    }
  }

  return (
    <div className="sign-in-page">
        <div
          className={`margin-auto ${animate !== 'on-render' ? 'fade-in' : 'fade-out'}`}>
          <LoadingSVG />
        </div>

        <form onSubmit={(e) => verifySignInForm(e)}
        className={`${animate ? animate : ''} form-parent`}>
          <label className='big-label'>Sign In Page</label>
          <div className="row form-username">
            <label htmlFor="username">Username</label>
            <TextField
              className='form-inputs col-75'
              onChange={(e) => changeUsername(e.target.value)}
              type="text"
              name="username"
              id="username"
              required />
          </div>
          <div className="row form-password">
            <label htmlFor="password">Password</label>
            <TextField
              className='form-inputs col-75'
              onChange={(e) => changePassword(e.target.value)}
              type="password"
              name="password"
              id="password"
              required />
          </div>
          <div className="account-requirements">
            <ul>
              <li><b>Username</b>'s are <b>3</b> characters or more and lowercase</li>
              {passwordText}
              {error ? <li className="error-text">{error}</li> : false}
            </ul>
            <div className="sign-up">
              <div
                className="join-here"
                onClick={() => history.push('/users/sign-up')}>Join Here</div>
            </div>
            <BottomNav buttons={signInButtons} />
          </div>
        </form>
    </div>
  )
}

export default SignInForm;
