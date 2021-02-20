import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";

import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, loadingSVG } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, BottomNav } from "./../../components/index";

// TODO: use arrow pads to direct around as well, keyCode fucntion I think

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

// instance.defaults.headers.get.range = ;

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = () => {  
  const history = useHistory();
  const [mounted, mountState] = useState(false);

  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);

  // TODO: useState instead
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
  // TODO: pre-render memes
  return(
  <div className='preiver'>
    <div className="viewer">
      <div className="memeRend">
        {
          memeUrls.length
            && memeUrls[viewIndex.count]
          ?
            renderMemes(memeUrls[viewIndex.count], formatList[viewIndex.count], viewIndex.count)
          :
            loadingSVG()
        }
      </div>
      <div className="space" />
      {/* <BottomNav className="bottomNav" buttons={[<button key={"cap"} onClick={() => history.push("/m/upload")}>Upload</button>,<button key={'toe'} onClick={() => handleClick()}> Next Meme </button>]} /> */}
    </div>
  </div>
  )
};

export default Viewer;
