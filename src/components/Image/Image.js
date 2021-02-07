import "./Image.scss";

const Image = (memeUrl, viewIndex) => {
  return (
    <div className="ImageContainer" key={viewIndex}>
      <img className="Image" src={memeUrl} alt={`PogU type beat`} />
    </div>
  )
}

export default Image;
