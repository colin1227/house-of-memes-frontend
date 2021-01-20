const VideoPlayer = (memeUrl, format, key) => {
  return (
    <div className="VideoViewer">
      {/* look in to modding out this video player */}
      <video key={key} controls className="video-container video-container-overlay" autoPlay={true} loop muted={true}>
        <source id="_video" src={memeUrl} type={'video/' + format}/>
      </video>
    </div>
  )
}

export default VideoPlayer;