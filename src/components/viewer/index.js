import React, { useRef, useEffect, useState } from 'react';

import axios from "axios";

import { blobToDataURL } from "blob-util";


const Viewer = ({ props }) => {
  const videoInput = useRef(null);
  
  const [haveMeme, boolmeme] = useState(false);
  const [meme, changeMeme] = useState(null);


  useEffect(() => {
    return axios.get("http://localhost:9000/m/meme").then( async(result) => {
      try {
        // let memeInt = new File([result.data.meme.data], 'dying.mp4', { type: "video/mp4"})
        
        boolmeme(true);
        let blob = new Blob( [ result.data.meme.data ], { type: "video/mp4" } );
        const vid = document.getElementById("_video");
        // const buf = result.data.meme.data || await blob.arrayBuffer();
        // vid.src = URL.createObjectURL( new Blob( [ buf ] ) );
        // console.log(vid.src);
        // changeMeme(vid.src);
        // return vid.play();

      } catch(err) {
        console.log(err)
        console.log("fucked sumn up")
      }
      
    });
  }, []);
  return(
    <div>
      {true ? 
        <div>
            <video ref={videoInput} className="video-container video-container-overlay" autoPlay={true} loop muted={false}>
              <source id="_video" src='http://localhost:9000/m/4b27b5a6824778a4368eacc6d8f57883.mp4' type="video/mp4"/>
            </video>
        </div>
      :
        <h1 style={{ color: "orange" }}>no text</h1>
      }
    </div>
  )
};

export default Viewer;