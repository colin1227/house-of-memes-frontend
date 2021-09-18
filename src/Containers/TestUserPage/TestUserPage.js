import {
  useState,
  // useEffect
} from 'react';
import { TopNav } from '../../components';
import { useHistory } from 'react-router-dom';
import "./TestUserPage.scss";

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
// import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
// import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

const myStorage = window.localStorage;

const TestUserPage = () => {
  const [username] = useState(myStorage.getItem('loggedIn'));
  const history = useHistory();
  const myAccount = [
    {
      key: 0,
      text: myStorage.getItem('loggedIn'),
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/users/${username}`)
    },
    // {
    //   key: 1,
    //   text: "Groups",
    //   iconImg: <PeopleOutlineIcon />,
    //   onClick: () => history.push("/groups")
    // },
    {
      key: 2,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    // {
    //   key: 3,
    //   text: "Settings",
    //   iconImg: <SettingsIcon />,
    //   onClick: () => history.push('/settings')
    // },
    {
      key: 4,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />
    }
  ];

  const testDivCreator = (num) => {
    let final = [];
    for(let i = 0; i < num; i++) {
      const colur = Math.round(Math.random() * 6);
      final.push(<div className={['blue', 'red', 'yellow', 'green', 'purple', 'orange'][colur]} />)
    }
    return final;
  }
  return (
    <div className="User-container">
      <TopNav variant='contained' buttons={myAccount} />
      <div className="user-data">
        <div className="profile">
          <span className="profile-name">{username}</span>
          <div className="profile-picture"></div>
        </div>
        <div className="line" />
        <div className="profile-memes"> 
          {testDivCreator(20)}
        </div>
        <div className="footer" />
      </div>
    </div>
  )
}

export default TestUserPage;
