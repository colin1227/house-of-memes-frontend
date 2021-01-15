import React, { Component } from 'react';
class Upload extends Component {

  render() {

    return (
      <div>
        <form
          id='uploadForm' 
          action='http://localhost:9000/m/upload' 
          method='post' 
          name="pogU"
          encType="multipart/form-data">
          <input type="file" name="sampleFile" />
          <input type='submit' value='Upload!' />
        </form>  
      </div>
    ) 
  }
}

export default Upload;