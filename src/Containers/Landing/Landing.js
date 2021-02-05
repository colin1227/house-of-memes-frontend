import { useState, /* useEffect */ } from 'react';

import './Landing.scss';
import { useHistory } from 'react-router';

const Landing = ({ props }) => {
  let history = useHistory();
  let [choose, ] = useState(true);

  return(
    <div className='landing'>
      { choose ?
        <div className="bigg">
          <div onClick={() => history.push("/u/sign-in")} className="user">
            <h1>Create User</h1>
            <ul>
              <li>Comment</li>
              <li>Post</li>
              <li>Random Question Tournement</li>
              <li>Create</li>
              {/* <li>Get an "N-Word" Pass</li> */}
              <li>etc.</li>
            </ul>
          </div>
          <div onClick={() => history.push("/m/")} className="memes">
            <h1>Observe memes</h1>
            <span>
              👁 👄 👁
            </span>
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
