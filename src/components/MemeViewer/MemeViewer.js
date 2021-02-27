import VideoViewer from "../Video/Video";
import Image from "../Image/Image";
import Audio from "../Audio/Audio";

import constants from '../../constants/vars.json';

const renderMemes = ({ index, url, format, muted, autoplay, loaded }) => {
  let meme = null;
  if (constants.formats.VIDEO.includes(format)) {
    meme = <VideoViewer memeUrl={url} indx={index} url={url} format={format} muted={muted} autoplay={autoplay} loaded={loaded} />
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
