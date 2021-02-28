import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";
import { Button } from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, signOut } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

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

document.addEventListener("keyup", (e) => {
  const video = document.querySelector('.x');
  if (e.key === " " && video) {
    if (!video.paused) {
      video.pause();
    } else if (video.paused) {
      video.play();
    }
  }
});

const Viewer = ({ username }) => {  
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [currentComment, updateComment] = useState('');
  const [commenting, toggleComments] = useState(false);
  const [muted, toggleMute] = useState(true);
  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });
  const [signingOut, isHovering] = useState(false);
  const [loaded, loadVid] = useState(false);

  
  const changeMeme = (dir) => {
    if (dir === 1 && memeUrls.length - 1 > viewIndex.count) {
      changeIndex({type: 'increment' });
    } else if (dir === -1 && viewIndex.count > 0) {
      changeIndex({type: 'decrement' });
    }
  }

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
    if (memeUrls.length <= viewIndex.count + 1) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;

  const signIn = [
    <div key={-2} className="myAccount">
      <Button color="primary" variant='contained' key={-2} onClick={() => history.push("/u/sign-in")}>Sign in</Button>
    </div>,
    muteButton
  ];
  const myAccount = [
    <div key={-2} className="myAccount">
      <Button color="primary" variant='contained' onClick={() => history.push('/m/upload')} className="upload">upload</Button>
      <Button color="primary" variant='contained' onMouseLeave={() => isHovering(false)} onMouseOver={() => isHovering(true)} onClick={() => signOut()} className="main-nav-button">{signingOut ? "sign out?" : username}</Button>
    </div>,
    muteButton
  ];
  const directionalButtons = [
    <div key={-1} className='direct'>
      <Button variant='contained' disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>Next</Button>
      <Button variant='contained' disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>Previous</Button>
    </div>
  ];
  const makeComment = [
    <div key={-1} onClick={() => toggleComments(true)} className='make-comment'>
      <Button variant='contained'>Say a thing</Button>
    </div>
  ];
  const commentInput = [
    <div className='make-comment'>
      <input type="text" value={currentComment} onChange={(e) => updateComment(e)} />
    </div>
  ];

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
    <TopNav variant='contained' buttons={ username ? myAccount : signIn} />
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
      {
        false &&
        <div className="comments">
          <h1 className="comments-header">Comments</h1>
          <div className="the-line" />
          <div className="comment-section">
        </div>
        <BottomNav buttons={commenting ? commentInput : makeComment} />
      </div>
      }
    </div>
  </div>
  )
};

export default Viewer;
