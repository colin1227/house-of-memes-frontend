import VideoViewer from "../Video/Video";
import Image from "../Image/Image";
import Audio from "../Audio/Audio";

import vars from '../../constants/vars.js';

const renderMemes = ({ index, url, format, muted, autoplay, loaded, background }) => {
  let meme = null;
  if (vars.formats.VIDEO.includes(format)) {
    meme = <VideoViewer memeUrl={url} indx={index} url={url} format={format} muted={muted} autoplay={autoplay} loaded={loaded} background={background} />
  } else if (vars.formats.PHOTO.includes(format)) {
    meme = Image(url, index);
  } else if (vars.formats.AUDIO.includes(format)) {
    meme = Audio(url, format, index);
  } else {
    meme = "incompatible";
  }
  return meme;
}

export default renderMemes;
