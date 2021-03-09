import { useEffect, useState, useReducer, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { Button } from '@material-ui/core';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, signOut } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";
import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";

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
  const [hovering, isHovering] = useState(false);
  const [loaded, loadVid] = useState(false);
  const [token, changeLogInStatus] = useState(myStorage.getItem('cryptoMiner'));
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

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}${token ? `?token=${token}` : ''}`);
        if (result.data.token) myStorage.setItem('cryptoMiner', result.data.token);
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
  },[memeUrls, formatList, descriptions, token]);

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls])

  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;
  const signIn = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' key={-2} onClick={() => history.push("/u/sign-in")}>Sign in</Button>
    </div>,
    muteButton
  ];
  const myAccount = [
    <div key={-2} className="myAccount-options">
      <Button key={-4} color="primary" variant='contained' onClick={() => history.push('/m/upload')} className="upload">upload</Button>
      <Button key={-5} color="primary" variant='contained' onMouseLeave={() => isHovering(false)} onMouseOver={() => isHovering(true)} onClick={() => handleSignOut()} className="main-nav-button">{hovering ? "sign out?" : username}</Button>
    </div>,
    muteButton
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
    loaded
  }

  return(
  <div className='viewer'>
    <TopNav variant='contained' buttons={token ? myAccount : signIn} />
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
            renderMemes(memeAttributes)
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
