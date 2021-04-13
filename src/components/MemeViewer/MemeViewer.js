import VideoViewer from "../Video/Video";
import MobileVideoViewer from "../MobileVideoViewer/MobileVideoViewer";
import Image from "../Image/Image";
import Audio from "../Audio/Audio";

import LinkWithPreview from "../LinkWithPreview/LinkWithPreview";
import LinkWithoutPreview from "../LinkWithoutPreview/LinkWithoutPreview";

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


/*

  currentIndex: Integer
  renderCount: Integer
  memes: Array of urls*
  formats: Array of format types of media*
  previews: Array of urls*
  muted: Boolean
  autoplay: Boolean

*/


// should just add memes to the page.
const renderMemesv2 = ({ currentIndex, renderCount = 3, memes, descriptions, formats, previews, muted, autoplay, LinkWithPreviewFunctions }) => {
  let memesToDisplay = [];

  for (let i = currentIndex; i < renderCount; i++) {
    if (vars.formats.VIDEO.includes(formats[i])) {
      memesToDisplay.push(<VideoViewer 
        memeUrl={memes[i]} 
        indx={i} 
        format={formats[i]} 
        muted={muted} 
        autoplay={autoplay} 
        />
      );
    } else if (vars.formats.PHOTO.includes(formats[i])) {
      memesToDisplay.push(Image(memes[i], i));
    } else if (vars.formats.AUDIO.includes(formats[i])) {
      memesToDisplay.push(Audio(memes[i], formats[i], i));
    } else if (!memes[i].hostname.includes(vars.apiURL)) {
      // I dont think this conditional statement works yet..
      if (previews[i]) {
        memesToDisplay.push(
          <LinkWithPreview
            link={memes[i]}
            description={descriptions[i] ? descriptions[i] : false}
            preview={previews[i]}
            changeMouseOverId={LinkWithPreviewFunctions.changeMouseOverId}
            handleMouseOut={LinkWithPreviewFunctions.handleMouseOut}
            mouseOverId={LinkWithPreviewFunctions.mouseOverId}
            lastMouseOverId={LinkWithPreviewFunctions.lastMouseOverId}
          />
        );
      } else {
        memesToDisplay.push(
        <LinkWithoutPreview
          link={memes[i]}
          description={descriptions[i] ? descriptions[i] : false}
        />
        );
      }
    }
     else {
      memesToDisplay.push("incompatible");
    }
  }

  return memesToDisplay
}

const renderMemesMobile = ({ index, url, format, muted, autoplay, loaded, background }) => {
  let meme = null;
  if (vars.formats.VIDEO.includes(format)) {
    meme = <MobileVideoViewer memeUrl={url} indx={index} url={url} format={format} muted={muted} autoplay={autoplay} loaded={loaded} background={background} />
  } else if (vars.formats.PHOTO.includes(format)) {
    meme = Image(url, index);
  } else if (vars.formats.AUDIO.includes(format)) {
    meme = Audio(url, format, index);
  } else {
    meme = "incompatible";
  }
  return meme;
}

const renderFunctions = {
  renderMemesMobile, 
  renderMemes,
  renderMemesv2
};

export default renderFunctions;
