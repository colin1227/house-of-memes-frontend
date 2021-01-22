// import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

// import constants from '../../constants/vars.json';
// import axios from 'axios';

// const instance = axios.create({
//   proxyHeaders: false,
//   credentials: false
// });

const Upload = () => {
  const v = useHistory();

  const handleFile = async(e) => {
  
    try {
      console.log(e);
      // instance.post('http://localhost:9000/m/upload')

      let memeMade = 'manage' || 'ductape.jpg';

      e.preventDefault();
      console.log('widePeepoHappy');
      v.push(`/m/${memeMade}`)

    } catch (err) {
      console.log('err ', err.message);
    }
  }




  return (
    <div>
      <form
        id='uploadForm' 
        name="pogU"
        onSubmit={(e) => handleFile(e)}
        encType="multipart/form-data">
        <input className='file' type="file" name="sampleFile" />
        <input className='upload' type='submit' value='Upload!' />
      </form>  
    </div>
  ) 
}

export default Upload;