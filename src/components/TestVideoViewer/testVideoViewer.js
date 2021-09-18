import "./testVideoViewer.scss";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles(() => ({
  modal: {
    position: 'absolute',
    height: "fit-content",
    width: 400,
    backgroundColor: "rgb(255, 255, 255)",
    border: '2px solid #000',
    margin: 'auto',
    padding: '3%',
    color: "white",
    fontFamily: 'Quicksand',
    outline: 0
  },
}));
const TestVideoviewer = () => {

  // playback bar variables
  let length = 0;
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  // current video info
  const [playing, togglePlayBack]  = useState(false);
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
    <div v={length} className={`VideoViewer`}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className={classes.modal}
        >
          <div className="no-outline">
            <div>Links</div>
            <div>
              <div>OP: </div><div>John Cena</div>
              <div>YT: </div><div>https://www.youtube.com/watch?v=dQw4w9WgXcQ</div>
              <div>TikTok: </div><div>N/A</div>
            </div>
          </div>
        </Modal>
      <div className="bar-container" >
        <div className="playback-background-bar"/>
        <div className="playback-black-bar"
          style={{
            background: "rgb(20, 20, 20)",
            width: `${currentTime ?
              String(100 - (currentTime/currentLength * 100))
              : "100"}%`,
            right: 0
            }}  />
        {/* <div className="seek-point" /> */}

      </div>
      <div className="left-container">
        <div className="username">@username</div>
        {
          false ?
          <div className="description">This is a description</div>
          :
          <div className="description">This is a much longer description with more words and turns of phrase or something</div>
        }
      </div>

      <div className="all-links">
        <img
          alt="internet links to find creator around the web"
          src="https://img.icons8.com/fluency-systems-filled/24/000000/dots-loading.png"
          onClick={() => handleOpen(true)}
          />
      </div>
      <div
        className={`video-container video-container-overlay`}
      >
        <video
          className="fadeIn"
          onClick={(e) => handlePlayState(e)}
          onTimeUpdate={(e) => handleCurrentTime(e)}
          onCanPlay={(e) => {
            length = length + 1;
            setCurrentVideo(e.target);
            setCurrentLength(e.target.duration);
          }}
          src="kitty.mp4"
          loop
          muted={true}
        />
        {/* <img
          className={true ? 'fadeIn' : ''}
          alt="default to se what Im doing"
          src="cat.png" /> */}
      </div>
    </div>
  )
}

export default TestVideoviewer;
