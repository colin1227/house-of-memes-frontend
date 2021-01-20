const ImageViewer = (memeUrl, viewIndex) => {
  return (
    <div className="ImageViewer" key={viewIndex}>
      <img className="Image" src={memeUrl} alt={`PogU type beat`} />
    </div>
  )
}

export default ImageViewer;