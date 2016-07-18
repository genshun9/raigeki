import React from 'react'
import DropZone from 'react-dropzone'
import request from 'superagent';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null,
      validFile: false,
      datas: {}
    }
  };

  componentWillMount() {
    this.loadDatas();
  }

  render() {
    return (
        <div>
          <DropZone
              onDrop={this.onSelectFile.bind(this)}
              accept="text/csv,text/plain">
            <div>
              ファイルを選択またはドラッグ&ドロップしてください
              <p>形式: csv/excel</p>
            </div>
          </DropZone>
          {this.state.validFile ? <div>{'ファイルの選択完了です'}</div> : null}
          {Object.keys(this.state.datas).length ? this.state.datas.map(d => <div key={d.name}>{d.name}</div>) : null}

        </div>
    );
  }

  loadDatas() {
    request
        .get('/data')
        .end(function (err, res) {
          this.setState({datas: res.body});
        }.bind(this));
  }

  onSelectFile(file) {
    this.setState({file: file, validFile: true})
  }
}