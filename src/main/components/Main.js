import React from 'react'
// import {Button} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import CopyToClipboard from 'react-copy-to-clipboard'
import request from 'superagent'
import {isNil} from 'lodash'
import List from './List.jsx'
//import TimeModal from './TimeModal.jsx'
// import {getDatas, addGenreTimes, updateRestTime, getDetailsFromStore, getRestTimeDetailsFromStore} from '../stores/TimeDataStore.js'
import UploadFileStore from '../stores/UploadFileStore.js'
import UploadFileActionCreators from '../actions/UploadFileActionCreators.js'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: null,
      uploadFinish: false,
      timeCardDatas: null,
      genreName: '',
      additionalHeaders: [],
      modalOpen: false,
      targetGenreId: null
    }
    
    this._onChangeFile = this.onChangeFile.bind(this);
  };

  componentWillMount() {
    UploadFileStore.addChangeListener(this._onChangeFile);
  }
  
  componentWillUnmount() {
    UploadFileStore.removeChangeListener(this._onChangeFile);
  }

  render() {
    const headers = ['日', '開始時刻', '終了時刻', '勤務時間'].concat(this.state.additionalHeaders);

    const genreAddPanel = (<div>
      <input value={this.state.genreName} onChange={e => this.setState({genreName: e.target.value})} type="text"
             placeholder="カテゴリー名を入力"/>
      <button onClick={this.addGenre.bind(this)} disabled={this.state.genreName === ''}>{'カテゴリーの追加'}</button>
    </div>);

    const getDetails = id => getDetailsFromStore(id);

    const getRestTimeDetails = () => getRestTimeDetailsFromStore();

    const headerElm = (
        <div>
          <tr>{headers.map((h, i) =>
              (i > 3) ? <td><input defaultValue={h} key={i}/>
                <CopyToClipboard text={this.state.additionalHeaders === 0 ? '' : getDetails(i - 3)} onCopy={() => {}}>
                  <button >{'コピー'}</button>
                </CopyToClipboard>
              </td>
                  : <td><input defaultValue={h} key={i}/></td>)}
            {(<td><input defaultValue='残りの時間'/>
              <CopyToClipboard text={isNil(this.state.timeCardDatas) ? '' : getRestTimeDetails()} onCopy={() => {}}>
                <button>{'コピー'}</button>
              </CopyToClipboard>
            </td>)}
          </tr>
        </div>);
    
    return (
        <div>
          <DropZone
              onDrop={this.onSelectFile.bind(this)}
              accept="text/csv">
            <div>
              ファイルを選択またはドラッグ&ドロップしてください
              <p>形式: csv</p>
            </div>
          </DropZone>
          {!isNil(this.state.uploadFile) ? <div>{'csvファイルの選択完了です'}</div> : null}
          <button onClick={this.uploadCsvFile.bind(this)} disabled={isNil(this.state.uploadFile)}>{'データを表示する'}</button>
          {isNil(this.state.timeCardDatas) ? null :
              <div>{genreAddPanel}
                {headerElm}
                {this.state.timeCardDatas.map((t, i) =>
                    <List data={t} key={i} header={headers} addGenreTimes={this.addGenreTimes.bind(this)}
                          updateRestTime={this.updateRestTime.bind(this)}/>)}
              </div>}
        </div>
    );
  }

  onSelectFile(file) {
    this.setState({uploadFile: file, timeCardDatas: null, additionalHeaders: []})
  }

  uploadCsvFile() {
    // var formData = new FormData();
    // formData.append("userfile", this.state.uploadFile[0]);
    //
    // request
    //     .post('/upload')
    //     .send(formData)
    //     .end(function (err, res) {
    //
    //       var timeDatas = getDatas(res.text.split(/\r\n|\r|\n/));
    //
    //       this.setState({uploadFile: null, uploadFinish: true, timeCardDatas: timeDatas});
    //     }.bind(this));
    UploadFileActionCreators.uploadFile(this.state.uploadFile[0]);
  }
  
  onChangeFile() {
    this.setState({uploadFile: null, uploadFinish: true, timeCardDatas: null});
  }

  addGenre() {
    this.setState({genreName: '', additionalHeaders: this.state.additionalHeaders.concat(this.state.genreName)})
  }

  addGenreTimes(id, genreTimeId, value) {
    var timeDatas = addGenreTimes(id, genreTimeId, value);
    this.setState({timeCardDatas: timeDatas});
  }

  updateRestTime(id, updatedRestTime) {
    var timeDatas = updateRestTime(id, updatedRestTime);
    this.setState({timeCardDatas: timeDatas});
  }
}