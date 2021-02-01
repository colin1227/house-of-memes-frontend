import { useHistory } from 'react-router-dom';

const Nav = (props) => {
  const history = useHistory();
  return (
    <div>
      <button onClick={() => history.push("/m/upload")}>Upload</button>
      <button onClick={() => history.push("/u/sign-up")}>Sign up</button>
      <button onClick={() => history.push("/m/")}>Memes</button>
  </div>
  )
}

export default Nav;
