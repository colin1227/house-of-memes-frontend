import "./Video.scss";

const Video = (memeUrl, format, key) => {
  return (
    <div className="VideoViewer">
      <video key={key} controls className="video-container video-container-overlay" autoPlay={true} loop muted={true}>
        <source id="_video" src={memeUrl} type={'video/' + format}/>
      </video>
    </div>
  )
}

export default Video;