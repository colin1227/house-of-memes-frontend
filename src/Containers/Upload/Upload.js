/* eslint-disable no-loop-func */
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { allowedFormats as af } from "../../helper/index";
import constants from '../../constants/vars.json';
import axios from 'axios';
import './Upload.scss';
import { Button } from 'semantic-ui-react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { loadingSVG } from '../../components';

const myStorage = window.localStorage;
const allowedFormats = af();
const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

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

/* TODO'S: 
  - CSS upgrades
    - more animations
  - modal for canceling meme
  - error text
  - preview

  - multi-page meme
*/


const Upload = (props) => {
  const classes = useStyles();
  const history = useHistory();
  let [memes, changeMemes] = useState([]); // files
  let [tags, changeTags] = useState([]);
  let [desc, changeDesc] = useState(''); // description
  let [error, changeError] = useState(''); // error
  let [theValue, changeValue] = useState('');  // sometimes if the same file is uploaded onChange doesn't fire
  let [initalTime, setInitalTime] = useState(0);

  useEffect(() => {
    if (!myStorage.getItem("cryptoMiner")) {
      history.push({
        pathname: "/u/sign-in",
        state: { lastUrl: props.location}
      });
    }
  }, [history])

  useEffect(() => {
    if(memes.length > 0) {
      memes.forEach((_, i) => {
        setTimeout(() => {
          document.querySelector(`.file--${i}`).querySelector(".progress").classList.remove('active');
          document.querySelector(`.file--${i}`).querySelector(".done").classList.add('anim');
        }, Math.random() / 2 * 350 + 1000);
      });
    }
  },[memes]);

  const submittens = async(e) => {
    await sendFile(e).then((res) => {
      if (res.status === 201){
        setInitalTime(0);
        history.push(`/memes/`);
      }
    })
    .catch(() => {
      changeError('something didn\'t work ');
    });
  }

  const handleMeme = async(val) => {
    let files = [];
    let invalid = false;
    let r = 0;


    if (val.target.files.length > 1) {
      changeError('one file at a time');
      return null;
    }

    while (r < val.target.files.length) {
      if (allowedFormats.filter(fmt => { 
        return val.target.files[r].type.includes(fmt)
        }).length > 0
      ) {
        files[r] = val.target.files[r];
      } else {
        invalid = true;
        break;
      }
      r++;
    }

    if(!invalid) {
      changeMemes(files);
      changeError('');
    } else changeError('Invalid File type');
  };

  const handleDesc = (val) => changeDesc(val);

  const sendFile = async(e) => {
    e.preventDefault();
    try {
      if (!memes) throw changeError('gimme meme');

      const formData = new FormData();

      if (myStorage.getItem("loggedIn")) {
        formData.append("username", myStorage.getItem("loggedIn"));
      } else {
        history.push("/u/sign-in");
      }
      memes.map((file, indx) => {
        setInitalTime(c => c + Math.round(file.size / 288619 * 100) / 100);
        return formData.append(`${indx}`, file);
      })

      if (desc) {
        formData.append("description", desc);
      }
      let memeSaved = await axios.request({
        method: 'POST',
        url: `${url}/m/upload?token=${myStorage.getItem("cryptoMiner")}`,
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        data: formData
      });
      return memeSaved;
    } catch (err) {
      if (err) changeError('something didn\'t work');
    }
  }

  const handleFind = (e) => {
    changeMemes([]);
    e.preventDefault();
    document.querySelector('input.ffs').click();
  }

  return (
    <div className='upload-web-page'>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={Boolean(initalTime)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={Boolean(initalTime)}>
          <div className={classes.paper + " upload-modal"}>
            <h2 className="quicksand" id="transition-modal-title">Uploading..</h2>
            {loadingSVG()}
            <p className="quicksand" id="transition-modal-description">Rough ETA: {initalTime} seconds, give or take</p>
          </div>
        </Fade>
      </Modal>
      <form className="meme-forum" onSubmit={(e) => submittens(e)}>
        <div className="file-display">
          <div className="upload-files">
            <header>
              <p>
                <i className="fa fa-cloud-upload" aria-hidden="true"/>
                <span className="load">upload</span> 
              </p>
            </header>

            <div className={`file-prompt${memes.length >= 1 ? ' hidden' : ''}`} id="drop">
              <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
              <p className="pointer-none">{/*  <b>Drag and drop</b> files here <br /> or  */ }<a href="nuffinHere" onClick={(e) => handleFind(e)} id="triggerFile">browse</a> to begin the upload</p>
              <input type="file" value={theValue} onChange={(e) => handleMeme(e)} className='ffs' multiple="multiple" />
            </div>
            {
              !error.length ?
                <footer className={memes.length >= 1 ? 'hasFiles': ''}>
                  <div className="divider">
                    <span><b>FILES</b></span>
                  </div>
                  <div className="list-files" >
                    {memes.length >= 1 && memes.map((file, i) => {
                    return (
                      <div key={i} className={`files file--${i}`}>
                        <div className="name"><span>{file.name}</span></div>
                        <div className="progress active"></div>
                        <div className="done">
                          <a href="nowhere" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000">
                              <g><path id="path" d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z" /></g>
                            </svg>
                          </a>
                        </div>
                      </div>
                      )})}
                  </div>
                  <button onClick={(e) => handleFind(e) && changeValue('')}  className={`importar${memes.length >= 1 ? ' active' : ''}`}>UPDATE FILES</button>
                </footer>
              :
                <span className="upload-error">{error}</span>
            }
          </div>
        </div>
        <div className='meme-details'>
          <div className='desc-container'>
            <textarea type='text' className='desc' cols="40" rows="5" name='desc' onChange={(e) => handleDesc(e.target.value)} placeholder='Description?' />
          </div>
        </div>
        <div className="upload-buttons">
          <Button className="cancel" onClick={() => history.push("/memes/")}>Cancel</Button>
          <Button className={`sendit${!Boolean(memes.length) ? ' disabled': ' abled'}`} disabled={!Boolean(memes.length)} type='submit'>Upload Meme</Button>
        </div>
      </form>
    </div>
  ) 
}

export default Upload;