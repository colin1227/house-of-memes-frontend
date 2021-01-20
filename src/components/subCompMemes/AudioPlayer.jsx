
// /* ".a.mp4" to be included */

const AudionOnlyPlayer = (memeUrl, format, viewIndex) => {
  return (
    <figure key={viewIndex}>
        <figcaption>Listen to {memeUrl.split(".")[0]}</figcaption>
        <audio
            controls
            >
              <source id="_video" src={memeUrl} type={"audio/" + format}/>
                Your browser does not support the
                <code>audio</code> element.
        </audio>
    </figure>
  )
}

export default AudionOnlyPlayer;