import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

// import constants from '../../constants/vars.json';
import axios from 'axios';

import './Upload.scss';
// const url = true ? 'http://localhost:9000': 'http://parasocial-media.com';

const myStorage = window.localStorage;

const Upload = (props) => {
  const history = useHistory();
  let [rename, changeName] = useState(''); // rename
  let [desc, changeDesc] = useState(''); // description
  let [meme, changeMeme] = useState(null);


  useEffect(() => {
    // console.log(meme && meme.target.files[0].type);
  },[meme]);

  const submittens = async(e) => {
    await sendFile(e).then((res) => {
      console.log(res.data);
      // console.log(`widePeepoHappy forwarding to: /m/${res}`);
      // history.push(`/m/${res}`);
    });
  }

  const handleMeme = (val) => {
    changeMeme(val);
    return true;
  }

  const handleName = (val) => {
    changeName(val);
  }

  const handleDesc = (val) => {
    changeDesc(val);
  }

  const sendFile = async(e) => {
    e.preventDefault();
    try {
      if (!meme) throw Error('gimme meme');
      const formData = new FormData();
      if (props.username)                formData.append("username", props.username);
      if (myStorage.getItem("loggedIn")) formData.append("username", myStorage.getItem("loggedIn"));      
      if (!props.username && !myStorage.getItem("loggedIn")) history.push("/u/sign-in");
      let memeSaved;
      console.log(meme);
      // conditional on the basis that it's not porn or malicious
      // - image clasifier
      // - extention check
      formData.append("meme", meme.target.files[0]);
      if (props.username) {

      }
      if (desc) {
        formData.append("description", desc);
      }
      if (rename) {
        formData.append("memeRename", rename);
      }

      memeSaved = await axios.request({
        method: 'POST',
        url: `http://localhost:9000/m/upload`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
        files: {
          sampleFile: meme.target.files[0]
        }
      });
      console.log(memeSaved)
      return memeSaved;
    } catch (err) {
      console.log('err ', err.message);
    }
  }


  const handleFind = (e) => {
    e.preventDefault();

    document.querySelector('input.ffs').click();
    console.log("PogO");
  }

  return (
    <div className='uppy'>

      <form className="daForm" onSubmit={(e) => submittens(e)}>
        <div className="upload">
          <div className="upload-files">
            <header>
              <p>
                <i className="fa fa-cloud-upload" aria-hidden="true"></i>
                <span /*removed class up */ className="load">upload</span> 
              </p>
            </header>
            <div className="body" id="drop">
              <i className="fa fa-file-text-o pointer-none" aria-hidden="true"></i>
              <p className="pointer-none"><b>Drag and drop</b> files here <br /> or <a href="nuffinHere" onClick={(e) => handleFind(e)} id="triggerFile">browse</a> to begin the upload</p>
              <input type="file" onChange={(e) => handleMeme(e)} className='ffs' multiple="multiple" />
            </div>
            <footer>
            <div className="divider">
              <span><b>FILES</b></span>
            </div>
            <div /* onChange={(e) => console.log(`e: ${e}`)} */ className="list-files">
            </div>
              <button className="importar">UPDATE FILES</button>
            </footer>
          </div>
        </div>

          <div className='popatity'>
            {/* <label for='rename'>optional</label> */}
            <input type='text' className='rename' name='rename' onChange={(e) => handleName(e.target.value)} placeholder='Rename meme?' />
            <div>
              {/* <label for='desc'>also optional</label> */}
              <input type='text' className='desc' name='desc' onChange={(e) => handleDesc(e.target.value)} placeholder='Description' />
            </div>
            <input className={`sendit${!Boolean(meme) ? ' disabled': ''}`} disabled={!Boolean(meme)} type='submit' value='Send It!'/>
        </div>
      </form>
    </div>
  ) 
}

export default Upload;