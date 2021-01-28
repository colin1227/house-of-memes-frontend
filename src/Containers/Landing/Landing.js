import { useState, useEffect } from 'react';
// import { Redirect } from 'react-router';
// import constants from '../../constants/vars.json';
// import axios from 'axios';

import './Landing.scss';
import { useHistory } from 'react-router';

// import Waves from ' ../../components/Waves/Waves';

const Landing = ({ props }) => {
  let history = useHistory();
  let [choose, makeChoice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('This will run after 16 seconds!');
      makeChoice(true);
    }, 13500);
    return () => clearTimeout(timer);
  }, []);

  return(
    <div className='landing'>
      { choose ?
        <div className="bigg">
          <div onClick={() => history.push("/u/sign-in")} className="user">
            <h1>Create User</h1>
            <ul>
              <li>Comment</li>
              <li>Create Group's</li>
              <li>Get an "N-Word" Pass</li>
              <li>etc.</li>
            </ul>
          </div>
          <div className="memes">
            <h1>Observe memes</h1>
          </div>
        </div>
      :
        <div className="bigText">
          <span className="part1">If you are so <span className='red'>decrepit</span> popped off(got excited) for new airings of the Brady bunch or
          worse, You were literally in middle school 5 years ago,</span><span className="part2"> this app is <span className="red">not</span> for you.</span>
        </div>
      }
    </div>
  );
};

export default Landing;
