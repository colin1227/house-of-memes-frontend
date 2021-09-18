import "./Image.scss";

const Image = (memeUrl, viewIndex) => {
  return (
    <div className="image-container" key={viewIndex}>
      <img src={memeUrl} alt={`the meme`} />
    </div>
  )
}

export default Image;
