import React, { Component } from 'react';

import Viewer from "./viewer/index";
import Upload from "./upload/index";

class Container extends Component {
  render() {
    return (
      <div>
        <Viewer />
      </div>
    )
  }
}

export default Container;