import React, { useEffect, useState, useReducer } from 'react';

// import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

import axios from "axios";
import "./style.css";

// const slider = (
//   <AwesomeSlider
//     media={[
//       {
//         source: '/path/to/image-0.png',
//       },
//       {
//         source: '/path/to/image-1.png',
//       },
//       {
//         source: '/path/to/image-2.png',
//       },
//     ]}
//   />
// );

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
const VideoPlayer = (memeUrl, format, key) => {
  return (
    <div>
      <div className="VideoViewer">
        {/* look in to modding out this video player */}
        <video key={key} controls className="video-container video-container-overlay" autoPlay={true} loop muted={true}>
          <source id="_video" src={memeUrl} type={'video/' + format}/>
        </video>
      </div>
    </div>
  )
}


const AudionOnlyPlayer = (memeUrl, format, viewIndex) => {
  return (
    <figure key={viewIndex}>
        <figcaption>Listen to {memeUrl.split(".")[0]}</figcaption>
        <audio
            controls
            >
              <source id="_video" src={memeUrl} type={"audio/" + format}/>
                Your browser does not support the
                <code>audio</code> element.
        </audio>
    </figure>
  )
}

const ImageViewer = (memeUrl, format, viewIndex) => {
  return (
    <div key={viewIndex}>
      <img className="ImageViewer" src={memeUrl} type={format} alt={`PogU type beat`} />
    </div>
  )
}

const Viewer = ({ props }) => {  
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [viewIndex, dIndex] = useReducer(reducer, { count: 0 });
  const [lastViewed, dViewed] = useReducer(reducer, { count: 0 });
  const [mounted, mountState] = useState(false);


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
            const result = await instance.get(`http://localhost:9000/m/${n}`);
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
  }, [mounted, memeUrls, formatList]);

  /* -~-~-~-~-~-~- Component/State will update -~-~-~-~-~-~- */
  useEffect(() => {
    let gate = false;
    // Current index
    if (viewIndex.count > lastViewed.count) {
      // dViewed({ type: 'increment' });
      console.log(viewIndex.count);
      gate = true;
    };

    if (memeUrls.length <= viewIndex.count + 5 && ((viewIndex.count === lastViewed.count) || gate)) {
      const handleImportMemes = async(n=2) => {
        try {
            const result = await instance.get(`http://localhost:9000/m/${2}`);

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
  }, [memeUrls, lastViewed.count, viewIndex.count, formatList])


  const handleClick = async() => {
    dIndex({ type: 'increment' }); // viewIndex.count + 1
    if (memeUrls.length <= viewIndex.count + 5 && memeUrls.length) {
      const handleImportMemes = async(n=2) => {
        try {
          const result = await instance.get(`http://localhost:9000/m/${n}`);
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
        ImageViewer(memeUrls[lastViewed.count], formatList[lastViewed.count], lastViewed.count)
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
    
    <button onClick={() => handleClick()}> :) </button>
  </div>
  )
};

export default Viewer;
