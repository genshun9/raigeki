import React from 'react';
import ReactDom from 'react-dom';
import Main from './Main.js';

window.App = {
  render:  () => {
    ReactDom.render(
        <Main />,
        document.getElementById('root')
    );
  }
};