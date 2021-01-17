import React, { useEffect, useState } from 'react';

import axios from "axios";
import "./style.css";

// const instance = axios.create({
//   proxyHeaders: false,
//   credentials: false
// })

const Manage = ({ props }) => {  
  const [haveMeme, boolmeme] = useState(false);
  const [memeUrl, changeMeme] = useState([]);
  const [formats, changeFormat] = useState([]);
  const [watchIndex, changeIndex] = useState(0);

  const handleImportValidationMemes = async() => {
    try {
      // const backSave = 0
      // when to req new memes, NOTE: measure by space
      // if (memeUrl.length > watchIndex + backSave){
      //   const val = Promise.all(instance.get(`http://localhost:9000/m/verify/ ${backSave}`));
      //   return val;
      // }
    } catch(err) {
      console.log(err);
    }
  };

  const next = () => {
    changeIndex(watchIndex + 1);
    handleImportValidationMemes();
  }

  useEffect(() => {
    return axios.get("http://localhost:9000/m/1").then( async(result) => {
      try {
        // wait till memes load
        boolmeme(true);
        changeMeme(currentMemes => [...currentMemes, ...result.data.memeExport.map((name) => `http://localhost:9000/m/meme/${name}`)]);
        changeFormat(currentFormats => [...currentFormats, ...result.data.memeExport.map((name) => name.split('.')[name.split('.').length - 1])]);
        
      } catch(err) {
        console.log(err)
        console.log("fucked sumn up")
      }
      
    });
  }, []);
  return(
  <div className="colur">
    <h1 className="p4">Manage</h1>
    {haveMeme && memeUrl.length && memeUrl[watchIndex] && formats[watchIndex] === 'mp4' ?
      <div>
        <div className="VideoViewer">
            {/* look in to modding out this video player */}
            <video controls className="video-container video-container-overlay" autoPlay={true} loop muted={false}>
              <source id="_video" src={memeUrl[watchIndex]} type={(formats[watchIndex] === "mp4" ? "video/mp4": formats[watchIndex] === "oog" ?  "video/oog" : "video/webm")}/>
            </video>
        </div>
      </div>
    :
    haveMeme && memeUrl.length && memeUrl[watchIndex] && formats[watchIndex] === 'img' ?
      <a class="imageAnchor" href="spotify.com"> 
        <img className="ImageViewer" alt={` type beat`} src={memeUrl[watchIndex]}/>
      </a>
    :
      <h1 style={{ color: "orange" }}>Loading..</h1>
    }
    <button onClick={next}> :) </button>
  </div>
  )
};

export default Manage;
