import { useRef, useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG } from "./../../components/index";

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
  // TODO: useState instead
  const [viewIndex, ] = useReducer(reducer, { count: 0 });

  const numRendersRef = useRef(1);

  const signIn = [<button key={-1} onClick={() => history.push("/u/sign-in")}>Sign in</button>];
  const myAccount = [<button key={-1}>{username}</button>];

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

  // useEffect(() => {
  //   if (!memeUrls.length){
  //     handleImportMemes(7);
  //     return true;
  //   }

  // }, [memeUrls, handleImportMemes])


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
      <div className="comments">
      </div>
      {
        memeUrls.length
          && memeUrls[viewIndex.count]
        ?
          renderMemes(memeUrls[viewIndex.count], formatList[viewIndex.count], viewIndex.count)
        :
          loadingSVG()
      }
      <div about={numRendersRef} className="memeInfo">
      </div>
    </div>
  </div>
  )
};

export default Viewer;
