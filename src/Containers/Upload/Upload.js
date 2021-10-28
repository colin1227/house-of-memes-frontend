/* eslint-disable no-loop-func */
/* eslint-disable no-use-before-define */

import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { allowedFormats as af, checkUrl } from "../../helper/index";
import vars from '../../constants/vars.js';
import axios from 'axios';
import { Button } from '@material-ui/core';

import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { LoadingSVG } from '../../components/index';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './Upload.scss';

const myStorage = window.localStorage;
const allowedFormats = af();

const useStyles0 = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

const useStyles1 = makeStyles((theme) => ({
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
  const classes0 = useStyles0();
  const classes1 = useStyles1();
  const history = useHistory();
  let [memes, changeMeme] = useState([]); 
  let [preview, changePreviewMedia] = useState();
  let [isUploadingMeme, changeUploadFormat] = useState(true);
  let [groups, changegroups] = useState([]);
  let [mediaUrl, changeUrl] = useState('');
  const [firstRender, changeRenderOccurrence] = useState(true);
  let [groupOptions] = useState([]);

  let [desc, changeDesc] = useState('');
  let [error, changeError] = useState('');
  let [initalTime, setInitalTime] = useState(0);

  useEffect(() => {
    if (firstRender) {
      changeRenderOccurrence(false);
    }
  }, [firstRender]);

  useEffect(() => {
    if (!myStorage.getItem("HoMCookie")) {
      history.push({
        pathname: "/users/sign-in",
        state: { lastUrl: window.location.pathname }
      });
    }
  }, [history])

  const submittens = async(e) => {   
    if (isUploadingMeme) {
      await sendFile(e).then((res) => {
        if (res.status === 201){
          setInitalTime(0);
          history.push(`/memes/`);
        }
      })
      .catch((err) => {
        console.log(error);
        changeError('something didn\'t work ');
      });
    } else {
      await sendLink(e).then((res) => {
        if (res.status === 201){
          setInitalTime(0);
          history.push(`/memes/`);
        }
      })
      .catch((err) => {
        console.log(err);
        changeError('something didn\'t work ');
      });
    }
  }

  const handleMeme = async(val) => {
    let files = [];
    let invalid = false;
    let r = 0;
    console.log(val.target.files[0]);

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
      changeMeme(files);

      changeError('');
    } else {
      changeError('Invalid File type');
    }
  };

  const handlePreviewMedia = async(val) => {

    let files = val.target.files;
    if (files.length > 1) {
      changeError('Only one file');
      return null;
    }

    const { type } = files[0];

    if(vars.formats['PHOTO'].includes(type)) {
      changePreviewMedia(files[0]);
      changeError('');
    } else changeError('Invalid File type');
  }

  const handleDesc = (val) => {
    changeDesc(val);
  }

  const handleGroupChange = (val) => {
    let newgroups = val.map(o => o.title).join(',');
    changegroups(newgroups);
  }

  // TODO: seperate into diffrent allowed file types

  const sendFile = async(e) => {
    e.preventDefault();
    try {
      if (!memes) throw changeError('gimme meme');

      const formData = new FormData();

      if (myStorage.getItem("loggedIn")) {
        formData.append("username", myStorage.getItem("loggedIn"));
      } else {
        history.push("/users/sign-in");
      }
      

      memes.map((file, indx) => {
        setInitalTime(c => {
          return c + Math.round(file.size / 288619 * 100) / 100
        });
        return formData.append(`${indx}`, file);
      })

      if (desc) {
        formData.append("desc", desc);
      }

      const memeSaved = await axios.request({
        method: 'POST',
        url: `${vars.apiURL}/memes/upload-meme?token=${myStorage.getItem("HoMCookie")}`,
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        data: formData
      });

      console.log(memeSaved);
      return memeSaved;
    } catch (err) {
      if (err) { 
        console.log(err);
        changeError('something didn\'t work');
      }
    }
  }

  const sendLink = async(e) => {
    e.preventDefault();
    try {
      checkUrl(mediaUrl);
      const requestData = new FormData();

      if (mediaUrl.length < 1) {
        changeError('Link Required');
        return null;
      } else {
        requestData.append("link", mediaUrl);
      }

      if (myStorage.getItem("loggedIn")) {
        requestData.append("username", myStorage.getItem("loggedIn"));
      } else {
        history.push("/users/sign-in");
      }

      if (preview) {
        requestData.append('preview', preview);
        setInitalTime(c => {
          return c + Math.round(preview.size / 288619 * 100) / 100
        });
      }
      if (groups) {
        requestData.append('groups', groups);
      }
      if (desc) {
        requestData.append('desc', desc);
      }

      const memeSaved = await axios.request({
        method: 'POST',
        url: `${vars.apiURL}/memes/upload-link?token=${myStorage.getItem("HoMCookie")}`,
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        data: requestData
      });
      return memeSaved;

    } catch (err) {
      if (err) console.log(err);
      if (err) changeError('something didn\'t work');
    }
  }

  const handleFind = (e) => {
    changeMeme([]);
    e.preventDefault();
    document.querySelector('input.ffs').click();
  }

  const handleSwitchToFile = () => {
    changeUploadFormat(false);
    changePreviewMedia(0);
  }

  const handleSwitchToLink = () => {
    changeMeme([]);
    changeUploadFormat(true);
  }

  return (
    <div className='Upload-web-page'>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes0.modal}
        open={Boolean(initalTime)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={Boolean(initalTime)}>
          <div className={classes1.paper + " upload-modal"}>
            <h2 className="default-font-black" id="transition-modal-title">Uploading..</h2>
            {<LoadingSVG />}
            <p className="default-font-black" id="transition-modal-description">time: {initalTime}s</p>
          </div>
        </Fade>
      </Modal>
      <form className="meme-forum" onSubmit={(e) => submittens(e)}>
        <header className="upload-head">
          <p>
            <i className="fa fa-cloud-upload" aria-hidden="true"/>
            <span className="load">Upload</span>
          </p>
        </header>
        <div className="upload-files">
          {
            isUploadingMeme ?
              <div className={`file-prompt${memes.length >= 1 ? ' hidden' : ''}`} id="drop">
                <div>
                  {/* TODO: narrow */}
                  <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
                  <p className="pointer-none"><a href="nuffinHere" onClick={(e) => handleFind(e)} id="triggerFile">browse</a> to begin the upload</p>
                  <input type="file" onChange={(e) => handleMeme(e)} className='ffs' multiple="multiple" />
                </div>
              </div>
              :
              <div className="link-field">
              <textarea
                rows={1}
                id="-9"
                type="text"
                onChange={(e) => changeUrl(e.target.value)}
                className='mediaUrl'
                placeholder="enter url"
                label="link url here"
                required
              />
              {
                preview ?
                  // show preview
                  // present the option to change the preview
                  <div className="inital-preview-display">
                    <img
                      alt='this is the preview img'
                      src={URL.createObjectURL(preview)}
                    />
                    <input
                      type="file"
                      onChange={(e) => handlePreviewMedia(e)}
                      className='preview-input' />
                    <p
                      className="pointer-none">
                      <a
                        href="nuffinHere"
                        onClick={(e) => handleFind(e)}
                        id="triggerFile">click here</a>
                         to change preview
                    </p>
                  </div>
                :
                  // present the option to choose a preview
                <div>
                  <i className="fa fa-file-text-o pointer-none"
                  aria-hidden="true"/>
                  <p className="pointer-none">
                    <a
                      href="nuffinHere"
                      onClick={(e) => handleFind(e)}
                      id="triggerFile"
                    >choose</a> a preview image or gif(optional)
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handlePreviewMedia(e)}
                    className='ffs'
                  />
                </div>
              }
                  </div>
          }
          {
            // TODO: revisit this
            !error.length && !isUploadingMeme ?
              <footer className={`upload-display ${memes.length >= 1 ? 'hasFiles': ''}`}>
                <div className="divider">
                  <span><b>FILES</b></span>
                </div>
                <div className="list-files">
                  {memes.length >= 1 && memes.map((file, i) => {
                  return (
                    <div key={i} className={`files file--${i}`}>
                      <div className="name"><span>{file.name}</span></div>
                      {/* <div className="progress active"/> */}
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
                <button onClick={(e) => handleFind(e)}  className={`importar${memes.length >= 1 ? ' active' : ''}`}>UPDATE FILES</button>
              </footer>
            :
              <span className="upload-display upload-error">{error}</span>
          }
          <div className="type-button-container">
            <Button
              variant="contained"
              className="type-file"
              disabled={isUploadingMeme}
              onClick={() => handleSwitchToFile()}
              >File</Button>
            <Button
              variant="contained"
              className="type-link"
              disabled={!isUploadingMeme}
              onClick={() => handleSwitchToLink()}
              >Link</Button>
          </div>
        </div>
        <div className='meme-details'>
          <Autocomplete
            className="groups"
            multiple
            id="groups-outlined"
            options={groupOptions}
            groupBy={o => o.type}
            getOptionLabel={(option) => option.title}

            // wrong somehow, log it out
            onChange={(_, value) => handleGroupChange(value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="groups"
                placeholder="describe it"
              />
            )}
          />
          <div className='desc-container'>
            <textarea
              type='text'
              className='desc'
              cols="40"
              rows="5"
              name='desc'
              onChange={(e) => handleDesc(e.target.value)}
              placeholder='Description(optional)'
            />
          </div>
        </div>
        <div className="buttons-container">
          {
            preview ?
              <div className="test-div">
                <Button
                  variant="contained"
                  className="test-meme"
                  onClick={() => console.log('maybe make a new page for testing what the meme will look like idk rn')}
                >Test It
                </Button>
              </div>
            :
              false
          }
          <div className="upload-buttons-container">
            <Button
              className="cancel"
              onClick={() => history.push("/memes/")}
            >Cancel
            </Button>
            <Button
            className={`sendit ${!Boolean(memes.length)
              &&
              !Boolean(mediaUrl.length)
              ? 'disabled'
              : 'abled'}`}
            disabled={!Boolean(memes.length)
              && !Boolean(mediaUrl.length)}
            type='submit'
          >Upload Meme
          </Button>
          </div>
        </div>
      </form>
    </div>
  ) 
}

export default Upload;