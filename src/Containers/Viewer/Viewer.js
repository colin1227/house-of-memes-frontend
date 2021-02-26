import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, loremArray } from "../../helper/index";

// import renderMemes from "../../components/MemeViewer/MemeViewer";
/* renderMemes(memeUrls[viewIndex.count], formatList[viewIndex.count], viewIndex.count, initalMeme) */

import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

// TODO: use arrow pads to direct to new memes, keyCode fucntion I think
// TODO: figure out how to address memory leak
// TODO: pre-render memes
const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = ({ username }) => {  
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [currentComment, updateComment] = useState('');
  const [commenting, toggleComments] = useState(false);

  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

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

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls])

  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1 && memeUrls.length && false) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);

  const signIn = [
  <button key={-1} onClick={() => history.push("/u/sign-in")}>Sign in</button>
  ];
  const myAccount = [
  <button className="myAccount" key={-1}>{username}</button>
  ];
  const directionalButtons = [
    <div key={-1} className={'direct'}>
      <button onClick={() => changeIndex({type: 'increment' })}>Next</button>
      <button onClick={() => changeIndex({type: 'decrement' })}>Previous</button>
    </div>
  ];
  const makeComment = [
    <div key={-1} onClick={() => toggleComments(true)} className='make-comment'>
      <button>Say a thing</button>
    </div>
  ];
  const commentInput = [
    <div className='make-comment'>
      <input type="text" value={currentComment} onChange={(e) => updateComment(e)} />
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
    let replies = Math.floor(Math.random * 1000);

    if (replies === 1) {

    } else if (replies > 1) {

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
        <div className="triple">
            <div/>
            <div/>
            <div/>
          </div>
      </div>
    );
  })

  const moreVideos = [
    <div key={-4} className="popular"></div>,
    <div key={-3} className="otherUserStuff"></div>,
    <div key={-2} className="rising"></div>,
    <div key={-1} className="interactions"></div>
  ];

  const fadeIn = memeUrls.length || true ? ' fade-in' : '';
  return(
  <div className='viewer'>
    <TopNav buttons={ username ? myAccount : signIn} />
    <div className="memeRend">
      <div className={`memeInfo${fadeIn}`}>
        <h1 className="description">
          The funny decription someone wrote
        </h1>
        <div className="space-taker-uper"/>
        <BottomNav buttons={directionalButtons} />
      </div>
      <div className={`memeDiv${fadeIn}`}>
        <div className="VideoViewer">
          <div className="dawgs">
            <div className="tdawg" />
            <div className="ddawg" />
          </div>
        </div>
        {loadingSVG()}
      </div>
      <div className={`comments${fadeIn}`}>
        <h1 className="comments-header">Comments</h1>
        <div className="the-line" />
        <div className="comment-section">
          {lorem}
        </div>
        <BottomNav buttons={commenting ? commentInput : makeComment} />
      </div>
    </div>
  </div>
  )
};

export default Viewer;
