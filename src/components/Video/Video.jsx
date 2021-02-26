import "./Video.scss";
// import { useEffect, useCallback, useRef } from "react";

const videoElement = (memeUrl, format, key, muted, autoplay) => {
  return (
    <video key={key} className="video-container video-container-overlay" autoPlay={autoplay} loop muted={muted}>
      <source id="_video" src={memeUrl} type={format}/>
    </video>
  )
}

const VideoViewer = (memeUrl, format, key, muted, autoplay, initalMeme) => {
  let video = videoElement(memeUrl,format,key, muted, autoplay);

  return (
    <div className="VideoViewer">
      {
        initalMeme ?
          <div className="dawgs">
            <div className="tdawg" />
            <div className="ddawg" />
          </div>
        :
          false
      }
      {
        memeUrl ?
          video
        :
        <div className="white-text">No video :(</div>
      }
    </div>
  )
}

export default VideoViewer;
