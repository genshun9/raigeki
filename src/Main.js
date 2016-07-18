import React from 'react'
import DropZone from 'react-dropzone'
import request from 'superagent';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null,
      validFile: false,
      datas: {},
      cardData: {"name": "blue-eyes", "ids": [20, 30]},
      uploadFinish: false
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
          {this.state.uploadFinish ? <div>{'アップロード完了です'}</div> : null}
          <button onClick={this.uploadCsvFile.bind(this)} disabled={!this.state.validFile}>{'送信する'}</button>
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

  uploadCsvFile() {
    request
        .post('/upload')
        .send({'name': this.state.cardData.name, 'ids': this.state.cardData.ids})
        .end(function (err, res) {
          this.setState({uploadFinish: true});
        }.bind(this));
  }
}