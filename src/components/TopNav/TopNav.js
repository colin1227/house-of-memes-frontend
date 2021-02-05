
import { useHistory } from 'react-router-dom';

import "./TopNav.scss";

const TopNav = (props) => {
  const history = useHistory();
  return (
    <div className="topNavBar">
      <button onClick={() => history.push("/u/sign-up")}>Sign up</button>
    </div>
  )
}

export default TopNav;
