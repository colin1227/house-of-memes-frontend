import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";
import { Button, IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

import "./MobileViewer.scss";

import constants from '../../constants/vars.json';
import { reducer, signOut } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
// TODO: use arrow pads to direct to new memes, keyCode fucntion I think
// TODO: figure out how to address memory leak
// TODO: pre-render memes
const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const myStorage = window.localStorage;

const Viewer = () => { 
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [muted, toggleMute] = useState(true);
  const [signingOut, isHovering] = useState(false);
  const [loggedIn, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
  const [loaded, loadVid] = useState(false);
  const [username] = useState(myStorage.getItem('loggedIn'));

  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

  const handleSignOut = () => {
    signOut();
    changeLogInStatus(false);
    window.location.reload(false);
  }
  const changeMeme = (dir) => {
    if (dir === 1 && memeUrls.length - 1 > viewIndex.count) {
      changeIndex({type: 'increment' });
    } else if (dir === -1 && viewIndex.count > 0) {
      changeIndex({type: 'decrement' });
    }
  }

  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' key={-2} onClick={() => history.push("/u/sign-in")}>Sign in</Button>
    </div>,
    <div key={-3} className="mobile-buttons" >
      {muteButton}
      <div className="mobile-direct">
        <IconButton disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton  disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  ];
  const myMobileAccount = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' onClick={() => history.push('/m/upload')} className="upload">upload</Button>
      <Button color="primary" variant='contained' onMouseLeave={() => isHovering(false)} onMouseOver={() => isHovering(true)} onClick={() => handleSignOut()} className="main-nav-button">{signingOut ? "sign out?" : username}</Button>
    </div>,
    <div key={-1} className="mobile-buttons" >
      {muteButton}
      <div className="mobile-direct">
        <IconButton disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton  disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  ];

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}`);
        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.names.map((name) => `${url}/m/meme/${name}`)
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
  },[memeUrls, formatList, descriptions]);

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls])

  useEffect(() => {
    try {
      if (memeUrls.length <= viewIndex.count + 1) {
        handleImportMemes(4);
      }
    } catch(err) {

    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);

  if (memeUrls && memeUrls.length) {
    setTimeout(() => {
      loadVid(true);
    }, 1250);
  }

  const memeAttributes = {
    index: viewIndex.count,
    url: memeUrls[viewIndex.count],
    format: formatList[viewIndex.count], 
    muted,
    autoplay: !initalMeme,
    loaded
  }

  return(
  <div className='viewer'>
    <TopNav variant='contained' buttons={loggedIn ? myMobileAccount : signIn} />
    <div className="memeRend">
      <div className="memeDiv">
        {
          memeUrls && memeUrls.length ? 
            renderMemes(memeAttributes)
          : 
            loadingSVG()
        }
      </div>
    </div>
  </div>
  )
};

export default Viewer;
