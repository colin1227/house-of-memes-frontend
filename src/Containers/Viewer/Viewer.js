import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from 'react-router-dom';

import "./Viewer.scss";

import constants from '../../constants/vars.json';
import { reducer, signOut } from "../../helper/index";

import renderMemes from "../../components/MemeViewer/MemeViewer";

import { TopNav, loadingSVG, BottomNav } from "./../../components/index";

import muteImg from "../../media/mutedImg.png";
import unmutedImg from "../../media/unmutedImg.png";
// TODO: use arrow pads to direct to new memes, keyCode fucntion I think
// TODO: figure out how to address memory leak
// TODO: pre-render memes

const myStorage = window.localStorage;

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

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});

const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Viewer = () => {  
  const classes = useStyles();
  const history = useHistory();
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [descriptions, changeDescription] = useState([]);

  const [initalMeme, isInitial] = useState(true);

  const [currentComment, updateComment] = useState('');
  const [commenting, toggleComments] = useState(false);

  const [muted, toggleMute] = useState(true);
  // TODO: useState instead
  const [viewIndex, changeIndex] = useReducer(reducer, { count: 0 });

  const [hovering, isHovering] = useState(false);

  const [signingOut, isSigningOut] = useState(false);
  const [loaded, loadVid] = useState(false);
  const [capped, isCapped] = useState(false);


  const handleSignOut = () => {
    signOut();
    isSigningOut(true);
  }
  
  const changeMeme = (dir) => {
    if (dir === 1 && memeUrls.length - 1 > viewIndex.count) {
      changeIndex({type: 'increment' });
    } else if (dir === -1 && viewIndex.count > 0) {
      changeIndex({type: 'decrement' });
    }
  }

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/m/imports/${n}${myStorage.getItem('cryptoMiner') ? `?token=${myStorage.getItem('cryptoMiner')}` : ''}`);
        if (result.status === 204 && result.data.memeExport.names) isCapped(true);
        if (result.data.token) myStorage.setItem('cryptoMiner', result.data.token);
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
    if (signingOut) {
      isSigningOut(false);
      window.location.reload(false);
    }
  }, [signingOut])

  useEffect(() => {
    if (initalMeme && viewIndex.count === 1 && memeUrls.length > 0){
      isInitial(false);
    }
  },[initalMeme, viewIndex.count, memeUrls])

  useEffect(() => {
    if (memeUrls.length <= viewIndex.count + 1) {
      handleImportMemes(4);
    }
  }, [memeUrls, viewIndex.count, formatList, handleImportMemes]);
  
  const muteButton =
    <img key={-1} alt="sound toggle" className="sound-toggle" onClick={() => toggleMute(!muted)} type="image" src={muted ? muteImg : unmutedImg} />;

  const signIn = [
    <div key={-2} className="myAccount-options">
      <Button color="primary" variant='contained' key={-2} onClick={() => history.push("/u/sign-in")}>Sign in</Button>
    </div>,
    muteButton
  ];
  const myAccount = [
    <div key={-2} className="myAccount-options">
      <Button key={-4} color="primary" variant='contained' onClick={() => history.push('/m/upload')} className="upload">upload</Button>
      <Button key={-5} color="primary" variant='contained' onMouseLeave={() => isHovering(false)} onMouseOver={() => isHovering(true)} onClick={() => handleSignOut()} className="main-nav-button">{hovering ? "sign out?" : myStorage.getItem("loggedIn")}</Button>
    </div>,
    muteButton
  ];
  const directionalButtons = [
    <div key={-1} className='direct'>
      <Button variant='contained' disabled={memeUrls.length - 1 <= viewIndex.count} onClick={() => changeMeme(1)}>Next</Button>
      <Button variant='contained' disabled={viewIndex.count <= 0} onClick={() => changeMeme(-1)}>Previous</Button>
    </div>
  ];
  const makeComment = [
    <div key={-1} onClick={() => toggleComments(true)} className='make-comment'>
      <Button variant='contained'>Say a thing</Button>
    </div>
  ];
  const commentInput = [
    <div key={-1} className='make-comment'>
      <input type="text" value={currentComment} onChange={(e) => updateComment(e)} />
    </div>
  ];

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
    <TopNav variant='contained' buttons={ myStorage.getItem('loggedIn') ? myAccount : signIn} />
    <div className="memeRend">
      <div className="memeInfo">
        <h1 className="description">
          {descriptions[viewIndex.count]}
        </h1>
        <div className="space-taker-uper"/>
        <BottomNav variant='contained' buttons={directionalButtons} />
      </div>

      <div className="memeDiv">
        {
          memeUrls && memeUrls.length ? 
            renderMemes(memeAttributes)
          : 
            loadingSVG()
        }
      </div>
      <div className="space-taker-uper" />
      {
        false &&
        <div className="comments">
          <h1 className="comments-header">Comments</h1>
          <div className="the-line" />
          <div className="comment-section">
        </div>
        <BottomNav buttons={commenting ? commentInput : makeComment} />
      </div>
      }
    </div>
  </div>
  )
};

export default Viewer;
