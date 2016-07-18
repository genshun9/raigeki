import React from 'react'
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
      timeCardDatas: null
    }
  };

  componentWillMount() {
    this.loadDatas();
  }

  render() {
    const header = [];
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
              this.state.timeCardDatas.map((t, i) => <List data={t} key={i} header={header}/>)
          }
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
    this.setState({uploadFile: file, timeCardDatas: null})
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
}