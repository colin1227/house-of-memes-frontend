import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";


import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { /* TopNav, */ BottomNav } from "./../../components/index";

const myStorage = window.localStorage;
myStorage.setItem('lastCategory', '');

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = ({ props }) => {  

  // Lifecycle
  const [mounted, mountState] = useState(false);

  // data
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [categoryList, changeCategoryList] =
    useState(['Twitter', 'Twitter', 'Facebook', 'Intagram', 'Pintrest', 'None', 'N/A'])

  // locally stored data
  const lastCategory = myStorage.getItem('lastCategory') || 'N/A';

  // index of data
  const [viewIndex, dIndex] = useReducer(reducer, { count: 0 });
  const [lastViewed, dViewed] = useReducer(reducer, { count: 0 });
  
  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}`);

        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.map((name) => `${url}/m/meme/${name}`)]);

        changeFormat([
          ...formatList,
          ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);
        
        changeCategoryList([
          ...categoryList,
          'Twitter'
        ])
      } catch(err) {
        console.log(err);
     }
  },[memeUrls, formatList, categoryList]);

  // debug
  useEffect(() => {
    let gate = false;

    // Current view index
    if (viewIndex.count > lastViewed.count) {
      dViewed({ type: 'increment' });
      console.log(viewIndex.count);
      gate = true;
    }

    if ((!gate && viewIndex.count !== lastViewed.count) ||
      (gate &&
        memeUrls.length &&
        formatList.length &&
        memeUrls.length === formatList.length)
    ) {
      console.log(`
        url: ${memeUrls[viewIndex.count]},
        format: ${formatList[viewIndex.count]}; 
        ${Object.keys(constants.formats).filter((formi) => {
          return constants.formats[formi].includes(formatList[viewIndex.count])
        })[0]} --
      `);
    }
  }, [viewIndex, formatList, memeUrls, lastViewed.count]);


  /* -~-~-~-~-~-~- Component MOUNTED, State DEFINED -~-~-~-~-~-~- */

  useEffect(() => {
    if (!mounted) {
      console.log("Viewer Mounted")
      mountState(true);
      const handleImportMemes = async(n=2) => {
        try {
            // get memes
            const result = await instance.get(`${url}/m/imports/${n}?category=${lastCategory}`);

            /* update state */
            changeMemes([...memeUrls,
              ...result.data.memeExport.map((name) => `${url}/m/meme/${name}`)]);

            changeFormat([...formatList,
              ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);

            changeCategoryList([
              ...categoryList,
              'Twitter'
            ])
        } catch(err) {
            console.log(err);
        }
      };
      handleImportMemes(); // 5)
    }
  }, [mounted, memeUrls, formatList, categoryList, lastCategory]);


  /* -~-~-~-~-~-~- Component/State will UPDATE -~-~-~-~-~-~- */
  useEffect(() => {
    let gate = false;

    // Current index
    if (viewIndex.count > lastViewed.count) {
      dViewed({ type: 'increment' });
      console.log(viewIndex.count);
      gate = true;
    };

    if (categoryList[viewIndex.count] !== categoryList) {
      document.querySelector('.viewer').classList.remove(constants.MainStream.filter((r) => {
        return r !== categoryList[viewIndex.count]
      }
      ))
      myStorage.setItem('lastCategory', categoryList[viewIndex.count]);
    }

    if (memeUrls.length <= viewIndex.count /* + 5 */ && ((viewIndex.count === lastViewed.count) || gate)) {
      handleImportMemes();

    }
  }, [categoryList, memeUrls, lastViewed.count, viewIndex.count, formatList, handleImportMemes]);

  const handleClick = async() => {
    dIndex({ type: 'increment' });
    if (constants.MainStream[constants.MainStream.length - 1] &&
      memeUrls.length <= viewIndex.count // + 5
      && memeUrls.length) {
        handleImportMemes(2);
    }
  }

  // let TopViewer = document.getElementsByClassName('viewer');
  return(
  <div className="viewer">
    <div className="innerViewer">
      <div className="innestViewer">
        {
          memeUrls.length
            && memeUrls[viewIndex.count]
            && viewIndex.count <= lastViewed.count
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
      <BottomNav className="bottomNav" buttons={[<button key={'toe'} onClick={() => handleClick()}> widepeepoHappy </button>]} />
    </div>
  </div>
  )
};

export default Viewer;
