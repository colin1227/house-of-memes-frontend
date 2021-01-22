import { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
// import constants from '../../constants/vars.json';
// import axios from 'axios';

import './Landing.scss';

import SignUpForm from '../SignUpForm/SignUpForm';



const Landing = ({ props }) => {
  let [user, isLoggedIn] = useState(false);
  
  useEffect(() => {

  }, [])

  return(
    <div className='landing'>
      {user ? <Redirect to="/m/"/> : <SignUpForm isLoggedIn={isLoggedIn}  />}
    </div>
  );
}

export default Landing;
