/* eslint-disable no-loop-func */
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { allowedFormats as af } from "../../helper/index";
import constants from '../../constants/vars.json';
import axios from 'axios';
import './Upload.scss';

const myStorage = window.localStorage;
const allowedFormats = af();
const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

/* TODO'S: 
  - CSS upgrades
    - more animations
  - modal for canceling meme
  - error text
  - preview

  - multi-page meme
*/


const Upload = (props) => {
  const history = useHistory();
  let [rename, changeName] = useState(''); // rename
  let [desc, changeDesc] = useState(''); // description
  let [memes, changeMemes] = useState([]); // files
  let [error, changeError] = useState(''); // error
  let [theValue, changeValue] = useState('');  // sometimes if the same file is uploaded onChange doesn't fire

  useEffect(() => {
    if(memes.length > 0) {
      memes.forEach((_, i) => {
        setTimeout(() => {
          document.querySelector(`.file--${i}`).querySelector(".progress").classList.remove('active');
          document.querySelector(`.file--${i}`).querySelector(".done").classList.add('anim');
        }, Math.random() / 2 * 350 + 1000);
      });
    }
  },[memes])

  const submittens = async(e) => {
    await sendFile(e).then((res) => {
      // res.data.meme
      // history.push(`/m/`);
    }).catch(err => changeError(err.message));
  }

  const handleMeme = async(val) => {
    let files = [];
    let invalid = false;
    let c = 0;
    // conditional on the basis that it's not explicit or malicious
    // - image clasifier; RapidAPI

    // check that all files submitted are valid.
    while (c < val.target.files.length) {
      if (allowedFormats.filter( fmt => val.target.files[c].type.includes(fmt)).length > 0) {
        files[c] = val.target.files[c];
      } else {
        invalid = true;
        break;
      }
      c++;
    }

    if(!invalid) {
      changeMemes(files);
      changeError('');
    } else changeError('Invalid File type');
  };

  const handleName = (val) => changeName(val);
  const handleDesc = (val) => changeDesc(val);

  const sendFile = async(e) => {
    e.preventDefault();
    try {
      if (!memes) throw changeError('gimme meme');

      const formData = new FormData();

      if (props.username) formData.append("username", props.username);
      else if (myStorage.getItem("loggedIn")) formData.append("username", myStorage.getItem("loggedIn"));

      if (!props.username && !myStorage.getItem("loggedIn")) history.push("/u/sign-in");


      /*
        2/9/21

        I just spent an entire day trying to figure out why the FUCK my files stoped sending.
        What I was negecting to acknoledge was I was sending a diffrent data type for multiple files.
        I was too concerned with moving on I couldn't move.
        It is hard to even remember the exact moment things shifted but I will always remember the relief.
        Thank you god.
        
        TL;DR(but not really): sending multipart/form-data to the API requires a package express-fileupload.
        things worked well at first but when I made the switch to sending multiple files,
        the original syntax stopped working as I was sending an array.
      
        There isn't enough time for me to perfect this idea... and it sucks,
        but I will inspire and mentor others to finish what I can't.

      */

      memes.map((file, indx) => {
        return formData.append(`${indx}`, file);
      })

      if (desc) {
        formData.append("description", desc);
      }
      if (rename) {
        formData.append("memeRename", rename);
      }


      let memeSaved = await axios.request({
        method: 'POST',
        url: `${url}/m/upload`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      });
      return memeSaved;
    } catch (err) {
      if (false) console.log('err ', err.message);
    }
  }


  const handleFind = (e) => {
    changeMemes([]);
    e.preventDefault();
    document.querySelector('input.ffs').click();
  }

  return (
    <div className='uppy'>
      <form className="meme-forum" onSubmit={(e) => submittens(e)}>
        <div className="file-form">
          <div className="upload-files">
            <header>
              <p>
                <i className="fa fa-cloud-upload" aria-hidden="true"></i>
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
                      <div key={i} className={`file file--${i}`}>
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
                <span className="error">{error}</span>
            }
          </div>
        </div>

        <div className='bottom'>
          <input type='text' className='rename' cols="40" rows="2" name='rename' onChange={(e) => handleName(e.target.value)} placeholder='Rename meme?' />
          {/* <div className='tag-container'>
            <textarea type='text' className='tags' cols="40" rows="5" name='tags' onChange={(e) => handleTags(e.target.value)} placeholder='Tagsription?' />
          </div> */}
          <div className='desc-container'>
            <textarea type='text' className='desc' cols="40" rows="5" name='desc' onChange={(e) => handleDesc(e.target.value)} placeholder='Description?' />
          </div>
        </div>
        <div className="bottomNav">
        <button /* are you sure modal */ onClick={() => history.push("/m/")}>Cancel</button>
          <input className={`sendit${!Boolean(memes.length) ? ' disabled': ' abled'}`} disabled={!Boolean(memes.length)} type='submit' value='submit meme'/>
      </div>
      </form>
      {/* <BottomNav className="upload-nav" buttons={[<input key={1} className={`sendit${!Boolean(meme) ? ' disabled': ' abled'}`} disabled={!Boolean(meme)} type='submit' value='Send It!'/>]} /> */}
    </div>
  ) 
}

export default Upload;