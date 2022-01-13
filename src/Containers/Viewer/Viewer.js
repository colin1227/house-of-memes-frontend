import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button } from '@material-ui/core';
import { withRouter } from "react-router";

import "./Viewer.scss";

import vars from '../../constants/vars';

import renderFunctions from "../../components/renders/renders";
import { TopNav, LoadingSVG, NavigationBar } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PanoramaIcon from '@material-ui/icons/Panorama';

import PublishIcon from '@material-ui/icons/Publish';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const myStorage = window.localStorage;

const Viewer = () => {  
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [loaded, loadVid] = useState(false);
  const [token] = useState(myStorage.getItem('HoMCookie'));
  const [username] = useState(myStorage.getItem('loggedIn'));
  const [viewIndex, changeIndex] = useState(0);
  const [muted, toggleMute] = useState(true);
  const [mobileClick, changeMobileClick] = useState(false);
  const [windowWidth] = useState(window.innerWidth);

  const memeAttributes = {
    key: viewIndex,
    url: memeUrls[viewIndex],
    format: formatList[viewIndex],
    muted,
    autoplay: !initalMeme,
    loaded,
  }

  const changeMeme = (dir) => {
    if (windowWidth <= 632) {
      changeMobileClick(true);
    }

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
          myStorage.setItem('HoMCookie', result.data.token);
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
    let mobileClickTimer = setTimeout(() => changeMobileClick(false), 6500);
    return () => {
      clearTimeout(mobileClickTimer);
    };
  },[mobileClick]);

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
  
  const muteButton = <img key={-1}
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
    }
  ];
  
  const myAccount = [
    {
      key: 0,
      text: myStorage.getItem('loggedIn'),
      iconImg: <PermIdentityIcon />,
      onClick: () => history.push(`/users/${username}`)
    },
    {
      key: 2,
      text: "Upload",
      iconImg: <PublishIcon />,
      onClick: () => history.push('/memes/upload')
    },
    {
      key: 4,
      text: "Sign Out",
      iconImg: <ExitToAppIcon />,
    }
  ];

  const mobileNav = [
    <div key={-1} className="mobile-nav">
      <Button
        key={0}
        onClick={ token ?
          () => history.replace(`/users/${username}`) :
          () => history.replace('users/sign-in')}>
        <PermIdentityIcon />
      </Button>
      <Button
        key={1}
        onClick={() => history.push('/memes/upload')}>
        <PublishIcon />
      </Button>
      <Button
        key={2}
        onClick={() => history.push('/memes/')}>
        <PanoramaIcon />
      </Button>
    </div>
  ]

  const directionalButtons = [
    <div key={-1} className={`direct ${mobileClick ? 'mobile-click' : ''}`}>
      <Button
        variant='contained'
        disabled={memeUrls.length - 1 <= viewIndex}
        onClick={() => changeMeme(1)}>Next</Button>
      {
        windowWidth <= 632 && 
          <Button
          variant='contained'
          onClick={() => {
            toggleMute(!muted);
            changeMobileClick(true);
            }}>
            <img
              key={-1}
              alt="speaker representing sound toggle"
              className="sound-toggle"
              type="image"
              src={muted ? muteImg : unmutedImg} />
        </Button>
      }
      <Button
        variant='contained'
        disabled={0 >= viewIndex}
        onClick={() => changeMeme(-1)}>Prev</Button>
    </div>
  ];

  return(
  <div 
    className='Viewer-Container'>
    {
      windowWidth >= 632 ?
      <TopNav
        variant='contained'
        muteButton={muteButton}
        buttons={token ? myAccount : signIn} />
      :
      false
    }
    <div className="content">
      {
        windowWidth > 632 ?
        <div className="content-description-pannel">
          <h1 className="description">{descriptions[viewIndex]}</h1>
          <div className="space-taker-upper"/>
          <div>
            <NavigationBar variant='contained' buttons={directionalButtons} />
          </div>
        </div>
        :
        <NavigationBar variant='contained' buttons={directionalButtons} />
      }
      <div className="content-observation-pannel">
         {
          memeUrls && memeUrls.length ?
            // TODO: have multiple memes on page only using one at a time
            renderFunctions.renderMemes(memeAttributes) 
          : 
            <LoadingSVG />
        }
      </div>
      {
        windowWidth > 632 &&
        <div className="space-taker-upper content-comment-pannel" />
      }
    </div>
    {windowWidth <= 632 &&
        <NavigationBar variant='contained' buttons={mobileNav} />
    }
  </div>
  )
};

export default withRouter(Viewer);
