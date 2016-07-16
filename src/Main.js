import React from 'react'
import DropZone from 'react-dropzone'

var Excel = require('exceljs');

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null,
      validFile: false
    }
  }

  render() {
    return (
        <div>
          <DropZone
              onDrop={this.onSelectFile.bind(this)}
              accept="image/jpeg,image/png,image/jpg">
            <div>
              ファイルを選択またはドラッグ&ドロップしてください
              <p>形式: gif/png/jpeg/jpg</p>
            </div>
          </DropZone>
          {this.state.validFile ? <div>{'ファイルの選択完了です'}</div> : null}

        </div>
    );
  }

  onSelectFile(file) {
    this.setState({file: file, validFile: true})
  }
}