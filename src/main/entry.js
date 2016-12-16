import React from 'react';
import ReactDom from 'react-dom';
import Main from './Components/Main.js';

window.App = {
  render:  () => {
    ReactDom.render(
        <Main />,
        document.getElementById('contents')
    );
  }
};