import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

// import BottomNav from "../../components/BottomNav/BottomNav";
import constants from '../../constants/vars.json';
import axios from 'axios';
import './Upload.scss';

const myStorage = window.localStorage;

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
  let [memes, changeMemes] = useState([]);

  useEffect(() => {
    console.log(memes);
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
      history.push(`/m/`);
    });
  }

  // State changes
  const handleMeme = async(val) => {
    let files = [];
    for (let l = 0; l < val.target.files.length; l++) {
      files[l] = val.target.files[l];
    }
    changeMemes(files);
  };
  const handleName = (val) => changeName(val);
  const handleDesc = (val) => changeDesc(val);

  const sendFile = async(e) => {
    e.preventDefault();
    try {
      if (!memes) throw Error('gimme meme');
      const formData = new FormData();
      if (props.username) formData.append("username", props.username);
      else if (myStorage.getItem("loggedIn")) formData.append("username", myStorage.getItem("loggedIn"));      
      if (!props.username && !myStorage.getItem("loggedIn")) history.push("/u/sign-in");
      let memeSaved;
      // conditional on the basis that it's not explicit or malicious
      // - image clasifier
      // - extention check
      memes.forEach(meme => {
        if (!meme.type.includes("video") && !meme.type.includes("audio") && !meme.type.includes("image")){
          return Error('invalid File type, try again');
        }
      })
      formData.append("meme", memes);

      if (desc) {
        formData.append("description", desc);
      }
      if (rename) {
        formData.append("memeRename", rename);
      }

      memeSaved = await axios.request({
        method: 'POST',
        url: `${url}/m/upload`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      });
      return memeSaved;
    } catch (err) {
      console.log('err ', err.message);
    }
  }


  const handleFind = (e) => {
    // document.querySelector('.divider')
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
              <input type="file" onChange={(e) => handleMeme(e)} className='ffs' multiple="multiple" />
            </div>

            <footer className={memes.length >= 1 ? 'hasFiles': ''}>
              <div className="divider">
                <span><b>FILES</b></span>
              </div>
              <div className="list-files" >
                {memes.length >= 1 && memes.map((file, i) => {
                return <div key={i} className={`file file--${i}`}>
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
                })}
              </div>
              <button onClick={(e) => handleFind(e)} className={`importar${memes.length >= 1 ? ' active' : ''}`}>UPDATE FILES</button>
            </footer>
          </div>
        </div>

        <div className='popatity'>
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