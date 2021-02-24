import { useRef, useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, loremArray } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

// TODO: use arrow pads to direct around as well, keyCode fucntion I think

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

// instance.defaults.headers.get.range = ;

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = ({ username }) => {  
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

  const numRendersRef = useRef(1);

  // useEffect(() => {
  //   if (initalMeme && viewIndex.count === 0){
  //     isInitial(false);
  //   }
  // },[initalMeme, viewIndex.count])

  // top buttons
  const signIn = [<button key={-1} onClick={() => history.push("/u/sign-in")}>Sign in</button>];
  const myAccount = [<button key={-1}>{username}</button>];

  // bottom buttons
  const directionalButtons = [
    <div key={-1} className={'direct'}>
      <button onClick={() => changeIndex({type: 'increment' })}>Next</button>
      <button onClick={() => changeIndex({type: 'decrement' })}>Previous</button>
    </div>
  ];
  const comments = [
    <div key={-1} className='make-comment'>
      <button>Say a thing</button>
    </div>
  ];

  const lorem = loremArray().map((val, indx) => {
    let likes = Math.floor(Math.random() * 10000)
    if (likes > 999) {
      likes = String(Math.round(((likes / 1000) * 10)) / 10 ) + 'k';
    } else if (likes === 0){
      likes = "";
    } else {
      likes = String(likes);
    }
    return(
      <div className="comment-object" key={indx}>
        <div className="like-object">
          <div className="like-symbol"/>
          <div className="likes">{likes}</div>
        </div>
        <div className="comment">
          {val}
        </div>
      </div>
    );
  })

  const otherVids = [
    <div key={-4} className="popular"></div>, <div key={-3} className="otherUserStuff"></div>, <div key={-2} className="rising"></div>, <div key={-1} className="interactions"></div>
  ]

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}`);

        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.names.map((name) => `${url}/m/meme/${name}`)]);

        changeFormat([
          ...formatList,
          ...result.data.memeExport.formats]);

      } catch(err) {
        console.log(err);
     }
  },[memeUrls, formatList]);

  // TODO: figure out how to address memory leak
  useEffect(() => {
    if (numRendersRef.current < 2){
      handleImportMemes(6);
    }
    numRendersRef.current++;
  },[numRendersRef, handleImportMemes]);

  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1 && memeUrls.length) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);

  // TODO: pre-render memes
  return(
  <div className='viewer'>
    <TopNav buttons={ username ? myAccount : signIn} />
    <div className="memeRend">
      <div className="memeInfo">
        <h1 className="description">
          The funny decription someone wrote
        </h1>

        <div className="other-vids">
          {otherVids.map((vid) => vid)}
        </div>

        <BottomNav buttons={directionalButtons} />
      </div>
      <div className="memeDiv">
        {
          memeUrls.length
            && memeUrls[viewIndex.count]
            && false
          ?
            renderMemes(memeUrls[viewIndex.count], formatList[viewIndex.count], viewIndex.count, initalMeme)
          :
            loadingSVG()
        }
      </div>
      <div className="comments">
        <h1 className="comments-header">Comments</h1>
        <div className="the-line" />
        <div className="comment-section">
          {lorem}
        </div>
        <BottomNav buttons={comments} />
      </div>
    </div>
  </div>
  )
};

export default Viewer;
