import "./Video.scss";
import { useState } from "react";

const VideoViewer = (props) => {
  const { memeUrl, format, memeNumber, muted, autoplay, loaded } = props;

  // playback bar vars
  let length = 0;
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);

  // current video info
  const [playing, togglePlayBack]  = useState(autoplay);
  const [, setCurrentVideo] = useState({});

  const handleCurrentTime = (e) => {
    setCurrentTime(e.target.currentTime);
  }

  const handlePlayState = (e) => {
    if (playing) {
      togglePlayBack(false);
      e.target.pause();
    } else {
      togglePlayBack(true);
      e.target.play();
    }
  }
  return (
    <div key={memeNumber} v={length} className={`VideoViewer`}>
      {
        memeUrl ?
          <div className="bar-container" >
            <div className="playback-background-bar"/>
            <div className="playback-black-bar"
            style={{
              width: `${currentTime ?
                String(100 - (currentTime/currentLength * 100))
                : "100"}%`,
              right: 0
              }} />
          </div>
        :
          false
      }
      {
        memeUrl ?
          <video
            onTimeUpdate={(e) => handleCurrentTime(e)}
            onCanPlay={(e) => {
              length = length + 1;
              setCurrentVideo(e.target);
              setCurrentLength(e.target.duration);
            }}
            onClick={(e) => handlePlayState(e)}
            className={`video-container video-container-overlay
            ${memeNumber === 0 ? 'fadeIn' : ''}`}
            autoPlay={autoplay}
            loop
            muted={muted}
          >
            <source
              id="_video"
              src={memeUrl}
              type={format}/>
          </video>
        :
          false
      }
    </div>
  )
}

export default VideoViewer;
