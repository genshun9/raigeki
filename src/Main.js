import React from 'react'
import {Button} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import request from 'superagent'
import {isNil} from 'lodash'
import List from './List.jsx'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: null,
      datas: {},
      uploadFinish: false,
      timeCardDatas: null,
      genreName: '',
      additionalHeaders: []
    }
  };

  componentWillMount() {
    this.loadDatas();
  }

  render() {
    const headers = ['date', 'startTime', 'endTime', 'workTime'].concat(this.state.additionalHeaders);

    const genreAddPanel = (<div>
      <input value={this.state.genreName} onChange={e => this.setState({genreName: e.target.value})} type="text" placeholder="ジャンルを入力してください"/>
      <button onClick={this.addGenre.bind(this)} disabled={this.state.genreName === ''}>{'追加'}</button>
    </div>);

    const headerElm = (<div>{headers.map((h, i) => <input defaultValue={h} key={i}/>)}{(<input defaultValue='restTime'/>)}</div>);

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
          {!isNil(this.state.uploadFile) ? <div>{'ファイルの選択完了です'}</div> : null}
          <button onClick={this.uploadCsvFile.bind(this)} disabled={isNil(this.state.uploadFile)}>{'送信する'}</button>
          {isNil(this.state.timeCardDatas) ? null :
              <div>{genreAddPanel}
                {headerElm}
                {this.state.timeCardDatas.map((t, i) => <List data={t} key={i} header={headers}/>)}
              </div>}
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
    this.setState({uploadFile: file, timeCardDatas: null, additionalHeaders: []})
  }

  uploadCsvFile() {
    var formData = new FormData();
    formData.append("userfile", this.state.uploadFile[0]);

    request
        .post('/upload')
        .send(formData)
        .end(function (err, res) {
          var dataArray = res.text.split(/\r\n|\r|\n/);
          // 現在文字コードの変換が上手く行かず、ヘッダーの文字列（日本語）が文字化けしているので、1行目を削除する。
          dataArray.shift();
          var sumTime = dataArray[0].split(',')[19];

          // 文字化けするため、2行目の合計時間を取得した後、2行目を削除する。
          dataArray.shift();

          // 何故か最後に空行を認識してしまうので、削除する。
          dataArray.pop();

          this.setState({uploadFile: null, uploadFinish: true, timeCardDatas: dataArray});
        }.bind(this));
  }

  addGenre() {
    this.setState({genreName: '', additionalHeaders: this.state.additionalHeaders.concat(this.state.genreName)})
  }
}