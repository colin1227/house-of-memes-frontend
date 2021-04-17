import { useEffect, useState, useReducer, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button } from '@material-ui/core';

import "./Viewer.scss";

import vars from '../../constants/vars';
import { reducer, signOut } from "../../helper/index";

import renderFunctions from "../../components/MemeViewer/MemeViewer";
import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

const Viewer = (props) => {  
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [loaded, loadVid] = useState(false);
  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

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

  const changeMeme = (dir) => {
    if (dir === 1 && memeUrls.length - 1 > viewIndex.count) {
      changeIndex({type: 'increment' });
    } else if (dir === -1 && viewIndex.count > 0) {
      changeIndex({type: 'decrement' });
    }
  }

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${vars.apiURL}/memes/imports/${n}${token ? `?token=${token}` : ''}`);
        if (result.data.token) myStorage.setItem('cryptoMiner', result.data.token);
        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.names.map((name) => `${vars.apiURL}/memes/${name}`)
        ]);

        changeFormat([
          ...formatList,
          ...result.data.memeExport.formats
        ]);

        changeDescription([
          ...descriptions,
          ...result.data.memeExport.description
        ]);

      } catch(err) {
        console.log(err);
     }
  },[memeUrls, formatList, descriptions, token]);

  const handleKeyDown = (code) => {
    changeButtonsHeldDown(currentlyHeldButtons => [...currentlyHeldButtons, code]);
    buttonsHeldDownRef.current = [...buttonsHeldDownRef.current, code];
    changeButtonTimestampsHeldDown(currentlyHeldTimestamps => [ ...currentlyHeldTimestamps, Math.floor(Date.now() / 10) ]);
    buttonTimestampsHeldDownRef.current = [
      ...buttonTimestampsHeldDownRef.current,
      Math.floor(Date.now() / 10)
    ];
  }

  const handleKeyUp = (code) => {
    changeButtonsHeldDown(prvbtns => prvbtns.splice(1, 1));
    buttonsHeldDownRef.current = buttonsHeldDownRef.current.splice(1, 1);
    
    changeButtonTimestampsHeldDown(tStamp => tStamp.splice(1, 1));
    buttonTimestampsHeldDownRef.current = buttonTimestampsHeldDownRef.current.splice(1, 1);
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const pressed = buttonsHeldDownRef.current.includes(e.keyCode);
      if (!pressed && e.keyCode === 109) {
        // 109 === m, mute
        handleKeyDown(109);

      } else if (!pressed && e.keyCode === 32) {
          // 32 === space, pause
          handleKeyDown(32);
      } else if (!pressed && e.keyCode === 117) {
        // 117 === w, volume up 5%
        // 38 === up
        // TODO: v2

        handleKeyDown(117);

      } else if (!pressed && e.keyCode === 115) {
        // 115 === s volume down 5%
        // 40 === down
        // TODO: v2

      } else if (!pressed && e.keyCode === 97) {
        handleKeyDown(97);
        // 97 === a, hold 1 sec for previous meme
        // 37 === left

      } else if (!pressed && e.keyCode === 68) {
        handleKeyDown(68);
        // 68 === d, hold 1 sec for next meme
        // 39 === right
      }
    });

    document.addEventListener("keyup", (e) => {

      const rn = Math.floor(Date.now() / 10);

      const eventButtonIsPressed = buttonsHeldDownRef.current.includes(e.keyCode);

      const eventIndex = buttonsHeldDownRef.current.indexOf(e.keyCode);

      const timeReleased = buttonTimestampsHeldDownRef.current[eventIndex];

      const oneSecondPassed  = rn - timeReleased >= 100 && eventButtonIsPressed;

      // const pointEightFiveSecondPassed  = rn - timeReleased >= 85 && eventButtonIsPressed;
      // const halfSecondPassed = rn - timeReleased >= 50 && eventButtonIsPressed;

      if (e.keyCode === 109) {
        // 109 === m, mute
        handleKeyUp(109);
      } else if (e.keyCode === 32) {
        // 32 === space, pause
        handleKeyUp(32);

      } else if (e.keyCode === 117) {
        // 117 === w, volume up 5%
        // 38 === up
        // TODO: v2
        handleKeyUp(117);

      } else if (e.keyCode === 115) {
        // 115 === s volume down 5%
        // 40 === down
        // TODO: v2
        handleKeyUp(115);

      } else if (e.keyCode === 97) {
        // 97 === a, hold 1 sec for previous meme
        // 37 === left
        handleKeyUp(97);
        if (oneSecondPassed){
          changeMeme(-1);
        }

      } else if (e.keyCode === 68) {
        // 68 === d, hold 1 sec for next meme
        // 39 === right
        handleKeyUp(68);
        if (oneSecondPassed){
          changeIndex({type: 'increment' });
        }
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls]);

  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    {
      key: 0,
      text: "Sign In",
      iconImg: <VpnKeyIcon />,
      onClick: () => history.push({ pathname: "/users/sign-in", state: { lastUrl: window.location.pathname } })
    },
    {
      key: 1,
      text: "Groups",
      iconImg: <PeopleOutlineIcon />,
      onClick: () => history.push("/groups")
    }
  ];
  const myAccount = [
    {
      key: 0,
      text: "Account",
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/users/${username}`)
    },
    {
      key: 1,
      text: "Groups",
      iconImg: <PeopleOutlineIcon />,
      onClick: () => history.push("/groups")
    },
    {
      key: 2,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    {
      key: 3,
      text: "Settings",
      iconImg: <SettingsIcon />,
      onClick: () => history.push('/settings')
    },
    {
      key: 4,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
      onClick: () => handleSignOut(),
    }
  ];
  const directionalButtons = [
    <div key={-1} className='direct'>
      <Button variant='contained' disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>Next</Button>
      <Button variant='contained' disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>Previous</Button>
    </div>
  ];
  if (memeUrls && memeUrls.length) {
    setTimeout(() => {
      loadVid(true);
    }, 1250);
  }

  // const memeAttributesV2 = {
  //   currentIndex: viewIndex,
  //   renderCount: 3,
  // }

  const memeAttributes = {
    index: 0 || viewIndex.count,
    url: memeUrls[viewIndex.count],
    format: formatList[viewIndex.count],
    muted,
    autoplay: !initalMeme,
    loaded,
    background: false
  }

  return(
  <div 
  className='viewer'>
    <TopNav variant='contained' muteButton={muteButton} buttons={token ? myAccount : signIn} />
    <div className="memeRend">
      <div className="memeInfo">
        <h1 className="description">
          {descriptions[viewIndex.count]}
        </h1>
        <div className="space-taker-uper"/>
        <BottomNav variant='contained' buttons={directionalButtons} />
      </div>
      <div className="memeDiv">
        {
          memeUrls && memeUrls.length ? 
            renderFunctions.renderMemes(memeAttributes)
          : 
            loadingSVG()
        }
      </div>
      <div className="space-taker-uper" />
    </div>
  </div>
  )
};

export default Viewer;
