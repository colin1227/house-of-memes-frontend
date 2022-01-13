import React from 'react';

const TiktokEmbed = (props) => {
  
  return (
    <div className="tiktok-embed">
      {/* embeded video e.g. 7025188214902230277 */}
      <blockquote
        className="tiktok-embed"
        cite={props.videoIdentifier}
        data-video-id={props.videoIdentifier.split("/")[props.videoIdentifier.split("/").length -1]}
        style={{maxWidth: "605px", minWidth: "325px"}}
        >
        
        {/* data */}
        <section>
          {/* user @arie.loo */}
          
          {/* description and hashtags */}
          <p> </p>
          {/* sound */}
          
        </section>
      </blockquote>
    </div>
  )
}

export default TiktokEmbed;