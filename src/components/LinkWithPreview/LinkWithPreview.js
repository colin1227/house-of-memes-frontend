import React from "react";

const LinkWithPreview = ({ link, description, preview, changeMouseOverId, handleMouseOut, mouseOverId, lastMouseOverId }) => {
  return (
    <a className="link-wp" rel='noreferrer' target='_blank' href={link}>
      <div
        className={`description-container ${mouseOverId === link ?
          'hovering'
        : 
          lastMouseOverId === link ?
            'unhovered'
              :
            ''}`}
        onMouseOver={() => changeMouseOverId(link)}
        onMouseLeave={() => handleMouseOut(link)}
      >
        {description} {`(click to open ${(new URL(link)).hostname} in new tab)`}
      </div>
      <img 
      className="preview-image"
      alt="ar-15's for 3 year olds"
      src={preview}
      />
    </a>
  )
}

export default LinkWithPreview;