import React from "react";

const LinkWithoutPreview = ({ link, description }) => {
  return (
    <a rel='noreferrer' target='_blank' href={link}>{description ? description: link}</a>
  )
}

export default LinkWithoutPreview;