import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button } from '@material-ui/core';

import "./Viewer.scss";

import vars from '../../constants/vars';

import renderFunctions from "../../components/renders/renders";
import { TopNav, LoadingSVG, BottomNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import PublishIcon from '@material-ui/icons/Publish';
// import SettingsIcon from '@material-ui/icons/Settings';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
// import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

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
  const [token] = useState(myStorage.getItem('cryptoMiner'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  const [viewIndex, changeIndex] = useState(0);
  const [muted, toggleMute] = useState(true);

  const changeMeme = (dir) => {
    if (dir === 1 &&
      memeUrls.length - 1 > viewIndex) {
      changeIndex(viewIndex + 1);
    } else if (dir === -1 && 0 < viewIndex) {
      changeIndex(viewIndex - 1);
    }
  }
  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result =
          await instance.get(`${vars.apiURL}/memes/imports/${n}${token ?
            `?token=${token}` : ''}`);
        if (result.data.token){
          myStorage.setItem('cryptoMiner', result.data.token);
        } 
        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.names.map((name) => {
          return `${vars.apiURL}/memes/${name}`})
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
    if (memeUrls && memeUrls.length) {
      setTimeout(() => {
        loadVid(true);
      }, 1250);
    }
  }, [memeUrls])
  useEffect(() => {
    if (initalMeme &&
        viewIndex === 1 &&
        memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex, memeUrls]);
  useEffect(() => {
    if (memeUrls.length <= viewIndex + 1) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex, formatList, handleImportMemes]);
  
  const muteButton =
    <img
      key={-1}
      alt="sound toggle"
      className="sound-toggle"
      onClick={() => toggleMute(!muted)}
      type="image"
      src={muted ? muteImg : unmutedImg} />;

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
    }
  ];
  const directionalButtons = [
    <div key={-1} className='direct'>
      <Button
        variant='contained'
        disabled={memeUrls.length - 1 <= viewIndex}
        onClick={() => changeMeme(1)}>Next</Button>
      <Button
        variant='contained'
        disabled={0 >= viewIndex}
        onClick={() => changeMeme(-1)}>Previous</Button>
    </div>
  ];


  const memeAttributes = {
    key: 0 || viewIndex,
    url: memeUrls[viewIndex],
    format: formatList[viewIndex],
    muted,
    autoplay: !initalMeme,
    loaded,
  }

  return(
  <div 
    className='Viewer-Container'>
    <TopNav
      variant='contained'
      muteButton={muteButton}
      buttons={token ? myAccount : signIn} />
    <div className="content">
      <div className="content-description-pannel">
        <h1 className="description">
          {descriptions[viewIndex]}
        </h1>
        <div className="space-taker-uper"/>
        <BottomNav variant='contained' buttons={directionalButtons} />
      </div>
      <div className="content-observation-pannel">
         {
          memeUrls && memeUrls.length ?
            // todo: change renderMemes to sequential rendering
            renderFunctions.renderMemes(memeAttributes) 
          : 
            <LoadingSVG />
        }
      </div>
      <div className="space-taker-uper" />
    </div>
  </div>
  )
};

export default Viewer;
