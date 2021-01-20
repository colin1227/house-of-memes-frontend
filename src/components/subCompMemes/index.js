import VideoPlayer from "./VideoPlayer";
import ImageViewer from "./ImageViewer";
import AudionOnlyPlayer from "./AudioPlayer";

import constants from '../../constants/vars.json';
import "./allStyle.scss";

const renderMemes = (url, format, index) => {
  let meme = null;
  if (constants.formats.VIDEO.includes(format)) {
    meme = VideoPlayer(url, format, index);
  } else if (constants.formats.PHOTO.includes(format)) {
    meme = ImageViewer(url, index);
  } else if (constants.formats.AUDIO.includes(format)) {
    meme = AudionOnlyPlayer(url, format, index);
  } else {
    meme = "incompatible";
  }
  return meme;
}

export default renderMemes;

