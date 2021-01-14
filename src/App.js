// const axios = require("axios");
// const thingy = async(e) => {
//   try {

//     const move = await axios.post("http://localhost:9000/upload", e.target.files[0], {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     console.log(move);

//   } catch (err) {
//     console.log(err.message)
//   }
// }

function App() {
  return (
    <div className="App">

      <form
      id='uploadForm' 
      action='http://localhost:9000/upload' 
      method='post' 
      name="pogU"
      encType="multipart/form-data">
        <input type="file" name="sampleFile" />
        <input type='submit' value='Upload!' />
      </form>  
      {/* <input type="file" name="PogU" id="fileUpload" onInput={(e) => thingy(e)} /> */}
    </div>
  );
}

export default App;
