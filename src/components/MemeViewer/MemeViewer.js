import Video from "../Video/Video";
import Image from "../Image/Image";
import Audio from "../Audio/Audio";

import constants from '../../constants/vars.json';

const renderMemes = (url, format, index) => {
  let meme = null;
  if (constants.formats.VIDEO.includes(format)) {
    meme = Video(url, format, index);
  } else if (constants.formats.PHOTO.includes(format)) {
    meme = Image(url, index);
  } else if (constants.formats.AUDIO.includes(format)) {
    meme = Audio(url, format, index);
  } else {
    meme = "incompatible";
  }
  return meme;
}

export default renderMemes;
