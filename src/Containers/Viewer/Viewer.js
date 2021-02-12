import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { /* TopNav, */ BottomNav } from "./../../components/index";

// TODO: use arrow pads to direct around as well, keyCode fucntion I think

const instance = axios.create({
  proxyHeaders: false,
  credentials: false,
  headers: {
    contentType: 'application/json'
  }
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = () => {  
  const history = useHistory();
  // Lifecycle
  const [mounted, mountState] = useState(false);

  // data
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  // ranks

  // index of data
  const [viewIndex, dIndex] = useReducer(reducer, { count: 0 });
  
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

  /* -~-~-~-~-~-~- Component MOUNTED, State DEFINED -~-~-~-~-~-~- */

  useEffect(() => {
    if (!mounted) {
      console.log("Viewer Mounted")
      mountState(true);
      handleImportMemes(5);
    }
  }, [mounted, memeUrls, formatList, handleImportMemes]);


  /* -~-~-~-~-~-~- Component/State will UPDATE -~-~-~-~-~-~- */
  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1 && memeUrls.length) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);

  const handleClick = async() => {
    dIndex({ type: 'increment' });
  }

  return(
  <div className="viewer">
    <div className="innerViewer">
      <div className="innestViewer">
        {
          memeUrls.length
            && memeUrls[viewIndex.count]
          ?
            renderMemes(memeUrls[viewIndex.count], formatList[viewIndex.count], viewIndex.count)
          :
          <div className="loader loader--style8 head5" title="7">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              width="24px" height="30px" viewBox="0 0 24 30" namename='svgLoad' xmlSpace="preserve">
              <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
              </rect>
              <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              </rect>
              <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              </rect>
            </svg>
          </div>
        }
      </div>
      <div className="space" />
      <BottomNav className="bottomNav" buttons={[<button key={"cap"} onClick={() => history.push("/m/upload")}>Upload</button>,<button key={'toe'} onClick={() => handleClick()}> Next Meme </button>]} />
    </div>
  </div>
  )
};

export default Viewer;
