import { useHistory } from 'react-router-dom';

import "./BottomNav.scss";

const BottomNav = (props) => {
  const history = useHistory();
  return (
    <div className="bottomNav">
      <button onClick={() => history.push("/m/upload")}>Upload</button>
      {props && props.buttons && props.buttons.map(btn => btn)}
      <button onClick={() => history.push("/m/")}>Memes</button>
    </div>
  )
}

export default BottomNav;
