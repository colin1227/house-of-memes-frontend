import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import "./index.scss";

import { signOut } from "../../helper/index";

import { TopNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
// import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
// import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import TestVideoviewer from '../../components/TestVideoViewer/testVideoViewer';
// removeMe

const myStorage = window.localStorage;

const TestContainer = () => {  
  const history = useHistory();
  const [token, changeLogInStatus] = useState(myStorage.getItem('HoMCookie'));
  const [username] = useState(myStorage.getItem('loggedIn'));

  // Button Changes
  const [muted, toggleMute] = useState(true);
  const [buttonsHeldDown, changeButtonsHeldDown] = useState([]);
  const buttonsHeldDownRef = useRef(buttonsHeldDown);

  // timestamps for buttons
  const [buttonTimestampsHeldDown, changeButtonTimestampsHeldDown] = useState([]);
  const buttonTimestampsHeldDownRef = useRef(buttonTimestampsHeldDown);

  const handleSignOut = () => {
    signOut();
    changeLogInStatus(false);
    history.push("/memes/");
  }

  const handleKeyDown = (code) => {
    changeButtonsHeldDown(currentlyHeldButtons => [...currentlyHeldButtons, code]);
    buttonsHeldDownRef.current = [...buttonsHeldDownRef.current, code];
    changeButtonTimestampsHeldDown(currentlyHeldTimestamps => [ ...currentlyHeldTimestamps, Math.floor(Date.now() / 10) ]);
    buttonTimestampsHeldDownRef.current = [
      ...buttonTimestampsHeldDownRef.current,
      Math.floor(Date.now() / 10)
    ];
  }
  const handleKeyUp = () => {
    changeButtonsHeldDown(prvbtns => prvbtns.splice(1, 1));
    buttonsHeldDownRef.current = buttonsHeldDownRef.current.splice(1, 1);
    
    changeButtonTimestampsHeldDown(tStamp => tStamp.splice(1, 1));
    buttonTimestampsHeldDownRef.current = buttonTimestampsHeldDownRef.current.splice(1, 1);
  }
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const pressed = buttonsHeldDownRef.current.includes(e.code);
      
      if (!pressed && e.code === "KeyM") {
        // mute
        handleKeyDown(109);
      } else if (!pressed && e.code === "Space") {
        // pause
        handleKeyDown(32);
      } else if (!pressed && e.code === "ArrowUp") {
        // volume up
        handleKeyDown(117);

      } else if (!pressed && e.code === "ArrowDown") {
        // volume down
        handleKeyUp(115);
      }
    });

    document.addEventListener("keyup", (e) => {

      if (e.code === "KeyM") {
        // mute
        handleKeyUp(109);
      } else if (e.code === "Space") {
        // pause
        handleKeyUp(32);
      } else if (e.code === "ArrowUp") {
        // volume up
        handleKeyUp(117);
      } else if (e.code === "ArrowDown") {
        // volume down
        handleKeyUp(115);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push({ pathname: "/users/sign-in", state: { lastUrl: window.location.pathname } })
    },
    // {
    //   key: 1,
    //   text: "Groups",
    //   iconImg: <PeopleOutlineIcon />,
    //   onClick: () => history.push("/groups")
    // }
  ];
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
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];

  return(
  <div 
    className='viewer'>
    <TopNav variant='contained'
      muteButton={muteButton}
      buttons={token ? myAccount : signIn}
    />
    <div className="memeRend">
      <div className="memeInfo">
        <div className="space-taker-upper"/>
        {/* <BottomNav variant='contained' buttons={directionalButtons} /> */}
      </div>
      <div className="memeDiv">
        <TestVideoviewer/>
      </div>
      <div className="space-taker-upper" />
    </div>
  </div>
  )
};

export default TestContainer;
