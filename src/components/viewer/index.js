import React, { useEffect, useState, useReducer } from 'react';

import axios from "axios";
import "./style.scss";

import ImageViewer from "../subCompMemes/ImageViewer.jsx";
import VideoPlayer  from "../subCompMemes/VideoPlayer.jsx";
import AudionOnlyPlayer from '../subCompMemes/AudioPlayer.jsx';

const myStorage = window.localStorage;

myStorage.setItem('lastCategory', '');

const backgroundGroups = ['Twitter', 'Facebook', 'Intagram', 'Pintrest', 'None', 'N/A'];

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
})

// const myStorage = window.localStorage;

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}


const formies = {
  VIDEO: ['mp4', 'oog', 'webm'],
  AUDIO: [/* '.a.mp4', */ 'mp3', 'oog'],
  PHOTO: ['gif', 'png', 'jpg', 'jpeg']
}

// Needs homes

const Viewer = ({ props }) => {  
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [viewIndex, dIndex] = useReducer(reducer, { count: 0 });
  const [lastViewed, dViewed] = useReducer(reducer, { count: 0 });
  const [mounted, mountState] = useState(false);

  const lastCategory = localStorage.getItem('lastCategory')
  const [category,  ] = useState(backgroundGroups[backgroundGroups.indexOf(lastCategory)]);


  // debug
  useEffect(() => {
    let gate = false;
    // Current index
    if (viewIndex.count > lastViewed.count) {
      dViewed({ type: 'increment' });
      console.log(viewIndex.count);
      gate = true;
    }
    if ((!gate && viewIndex.count !== lastViewed.count) || (gate && memeUrls.length && formatList.length && memeUrls.length === formatList.length)) {
      console.log(`
        url: ${memeUrls[viewIndex.count]},
        format: ${formatList[viewIndex.count]}; 
        ${Object.keys(formies).filter((formi) => formies[formi].includes(formatList[viewIndex.count]))[0]} --
      `);
    }
  }, [viewIndex, formatList, memeUrls, lastViewed.count]);
  

  /* -~-~-~-~-~-~- Component Mounted, State Defined -~-~-~-~-~-~- */

  useEffect(() => {
    if (!mounted) {
      console.log("Viewer Mounted")
      mountState(true);
      const handleImportMemes = async(n=2) => {
        try {
            const result = await instance.get(`http://localhost:9000/m/imports/${n}?category=${category}`);
            changeMemes([...memeUrls,
              ...result.data.memeExport.map((name) => `http://localhost:9000/m/meme/${name}`)]);
            changeFormat([...formatList,
              ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);
        } catch(err) {
            console.log(err);
        }
      };
      handleImportMemes(5);

    }
  }, [category, mounted, memeUrls, formatList]);

  /* -~-~-~-~-~-~- Component/State will update -~-~-~-~-~-~- */
  useEffect(() => {
    let gate = false;

    // Current index
    if (viewIndex.count > lastViewed.count) {
      // dViewed({ type: 'increment' });
      console.log(viewIndex.count);
      gate = true;
    };

    if (['None', 'N/A'].includes(category) && memeUrls.length <= viewIndex.count + 5 && ((viewIndex.count === lastViewed.count) || gate)) {
      const handleImportMemes = async(n=2) => {
        try {
            const result = await instance.get(`http://localhost:9000/m/imports/${n}?category=${category}`);

            changeMemes([...memeUrls, 
              ...result.data.memeExport.map((name) => `http://localhost:9000/m/meme/${name}`)]);

            changeFormat([...formatList,
              ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);

          } catch(err) {
            console.log(err);
         }
      };
      handleImportMemes();

    }
  }, [category, memeUrls, lastViewed.count, viewIndex.count, formatList])


  const handleClick = async() => {
    dIndex({ type: 'increment' }); // viewIndex.count + 1
    if (memeUrls.length <= viewIndex.count + 5 && memeUrls.length) {
      const handleImportMemes = async(n=2) => {
        try {
          const result = await instance.get(`http://localhost:9000/m/import/${n}`);
          changeMemes([...memeUrls, 
            ...result.data.memeExport.map((name) => `http://localhost:9000/m/meme/${name}`)]);
          
          changeFormat([...formatList,
            ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);
         } catch(err) {
            console.log(err);
         }
      };
      handleImportMemes()
    }
  }

  return(
  <div className="colur">
    { 
      memeUrls.length && memeUrls[lastViewed.count] &&
      (formies.VIDEO.indexOf(formatList[lastViewed.count]) >= 0) ?
        VideoPlayer(memeUrls[lastViewed.count], formatList[lastViewed.count], lastViewed.count)
      :
        null
    }
    {
      memeUrls.length && memeUrls[lastViewed.count] &&
      (formies.PHOTO.indexOf(formatList[lastViewed.count]) >= 0)  ?
        ImageViewer(memeUrls[lastViewed.count], lastViewed.count)
      :
        null
    }
    {
      memeUrls.length && memeUrls[lastViewed.count] &&
      (formies.AUDIO.indexOf(formatList[lastViewed.count]) >= 0) ?
        AudionOnlyPlayer(memeUrls[lastViewed.count], formatList[lastViewed.count], lastViewed.count)
      :
        null
    }   
    
    { false ? <button onClick={() => handleClick()}> :) </button> : false}
  </div>
  )
};

export default Viewer;
