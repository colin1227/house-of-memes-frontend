import "./Video.scss";
import { useEffect, useCallback, useRef } from "react";

const videoElement = (memeUrl, format, key) => {
  return (
    <video key={key} className="video-container video-container-overlay" autoPlay={true} loop muted={true}>
      <source id="_video" src={memeUrl} type={format}/>
    </video>
  )
}

const Video = (memeUrl, format, key, initalMeme) => {
  // const vcRef = useRef({});
  let video = videoElement(memeUrl,format,key);



  return (
    <div className="VideoViewer">
      {/* {initalMeme ? video : video} */}
    </div>
  )
}

export default Video;
