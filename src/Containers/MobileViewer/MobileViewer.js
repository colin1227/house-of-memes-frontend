import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";
import { Button, IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import "./MobileViewer.scss";

import constants from '../../constants/vars.json';
import { reducer, signOut } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
// TODO: use arrow pads to direct to new memes, keyCode fucntion I think
// TODO: figure out how to address memory leak
// TODO: pre-render memes
const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const myStorage = window.localStorage;

const Viewer = () => { 
  const classes = useStyles(); 
  const history = useHistory();
  // const ac = new AbortController();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);
  const [initalMeme, isInitial] = useState(true);
  const [muted, toggleMute] = useState(true);
  const [capped, isCapped] = useState(false);

  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });
  const [signingOut, isHovering] = useState(false);
  const [loaded, loadVid] = useState(false);
  
  const changeMeme = (dir) => {
    if (dir === 1 && memeUrls.length - 1 > viewIndex.count) {
      changeIndex({type: 'increment' });
    } else if (dir === -1 && viewIndex.count > 0) {
      changeIndex({type: 'decrement' });
    }
  }

  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;

  const signIn = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' key={-2} onClick={() => history.push("/u/sign-in")}>Sign in</Button>
    </div>,
    <div key={-3} className="mobile-buttons" >
      {muteButton}
      <div className="mobile-direct">
        <IconButton disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton  disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  ];

  const myMobileAccount = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' onClick={() => history.push('/m/upload')} className="upload">upload</Button>
      <Button color="primary" variant='contained' onMouseLeave={() => isHovering(false)} onMouseOver={() => isHovering(true)} onClick={() => signOut()} className="main-nav-button">{signingOut ? "sign out?" : myStorage.getItem('loggedIn')}</Button>
    </div>,
    <div key={-1} className="mobile-buttons" >
      {muteButton}
      <div className="mobile-direct">
        <IconButton disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton  disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  ];

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}`);
        if (result.status === 204 && result.data.memeExport.names) isCapped(true);
        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.names.map((name) => `${url}/m/meme/${name}`)
        ]);

        changeFormat([
          ...formatList,
          ...result.data.memeExport.formats
        ]);

        changeDescription([
          ...descriptions,
          ...result.data.memeExport.description
        ]);

      } catch(err) {
        console.log(err);
     }
  },[memeUrls, formatList, descriptions]);

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls])

  useEffect(() => {
    try {
      if (memeUrls.length <= viewIndex.count + 1) {
        handleImportMemes(4);
      }
    } catch(err) {
      console.log('shit:', err.message);
      // return ac.abort();
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);

  if (memeUrls && memeUrls.length) {
    setTimeout(() => {
      loadVid(true);
    }, 1250);
  }

  const memeAttributes = {
    index: viewIndex.count,
    url: memeUrls[viewIndex.count],
    format: formatList[viewIndex.count], 
    muted,
    autoplay: !initalMeme,
    loaded
  }

  return(
  <div className='viewer'>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={capped}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={capped}>
        <div className={classes.paper + " upload-modal"}>
          <h2 className="quicksand" id="transition-modal-title">FeelsBadMan</h2>
          <p className="quicksand" id="transition-modal-description">you've seen it all so far</p>
        </div>
      </Fade>
    </Modal>
    <TopNav variant='contained' buttons={myStorage.getItem("loggedIn") ? myMobileAccount : signIn} />
    <div className="memeRend">
      <div className="memeDiv">
        {
          memeUrls && memeUrls.length ? 
            renderMemes(memeAttributes)
          : 
            loadingSVG()
        }
      </div>
    </div>
  </div>
  )
};

export default Viewer;
