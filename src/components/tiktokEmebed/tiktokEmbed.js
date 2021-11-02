import React, {useState} from 'react';

const TiktokEmbed = (props) => {

  const [username] = useState(props.username);
  const [description] = useState(props.description);
  const [soundTitle] = useState(props.soundTitle);
  const [soundIdentifier] = useState(props.sound);
  
  const createDescription = (oldDescription) => {
    // desc: "almost time for official sad girl hours. #fyp"

    const splitOnHashtags = oldDescription.split('#');

    let newDescription = splitOnHashtags[0];

    for(let i = 1; i < splitOnHashtags.length; i++) {
      let splitString = splitOnHashtags[i].split(' ');

      let replacement =
        <a
          rel="noreferrer"
          title={splitString[0]}
          target="_blank"
          href={`https://www.tiktok.com/tag/${splitString[0]}`}>##{splitString[0]}</a>
      newDescription = newDescription + replacement + splitString.shift();
    }
    
    return <p>{newDescription}</p>;
  }
  return (
    <div className="tiktok-embed">
      {/* embeded video e.g. 7025188214902230277 */}
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@arie.loo/video/${props.videoIdentifier}`}
        data-video-id={props.videoIdentifier}
        style={{maxWidth: "605px", minWidth: "325px"}}
        >
        
        {/* data */}
        <section>
          {/* user @arie.loo */}
          <a
            rel="noreferrer"
            target="_blank"
            title={username}
            href={`https://www.tiktok.com/${username}`}>{username}</a>
          {/* description and hashtags */}
          <p>frog holding a staff like gandalf</p>
          {/* sound */}
          <a
            rel="noreferrer"
            target="_blank"
            title={soundTitle}
            href={`https://www.tiktok.com/music/${soundTitle.includes('original sound') ?
            `original-sound-${soundIdentifier}`
            : soundIdentifier}`}>♬
            {soundTitle.includes('original sound') ?
            `${soundTitle} - ${username}` :
            soundTitle}
          </a>
        </section>
      </blockquote>
    </div>
  )
}

export default TiktokEmbed;