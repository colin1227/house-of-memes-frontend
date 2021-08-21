import { useEffect, useState, useReducer, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button } from '@material-ui/core';

import "./MobileViewer.scss";

import vars from '../../constants/vars';
import { reducer, signOut } from "../../helper/index";

import renderFunctions from "../../components/renders/renders";
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
  const [muted, toggleMute] = useState(true);
  const [loaded, loadVid] = useState(false);
  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

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

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      // 109 = m, mute
      // 32 = space, pause
      // 117 = w, volume up 5%
      // 115 = s volume down 5%
      // 97 = a, hold 1 sec for previous meme
      // 100 = d, hold 1 sec for next meme

      // console.log(e.keyCode);
    })
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
  className='mobile-viewer'>
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
