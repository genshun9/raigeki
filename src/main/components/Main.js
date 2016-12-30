import React from 'react'
// import {Button} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import CopyToClipboard from 'react-copy-to-clipboard'
import {isNil} from 'lodash'
import List from './List.jsx'
// import {getDatas, addGenreTimes, updateRestTime, getDetailsFromStore, getRestTimeDetailsFromStore} from '../stores/TimeDataStore.js'
import UploadFileStore from '../stores/UploadFileStore.js'
import UploadFileActionCreators from '../actions/UploadFileActionCreators.js'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFile: null,
      uploadFileDatas: null,
      genreName: '',
      additionalHeaders: []
    };
    
    this._onChangeUploadFile = this.onChangeUploadFile.bind(this);
  };
  
  componentWillMount() {
    UploadFileStore.addChangeListener(this._onChangeUploadFile);
  }
  
  componentWillUnmount() {
    UploadFileStore.removeChangeListener(this._onChangeUploadFile);
  }
  
  render() {
    if (isNil(this.state.uploadFileDatas)) {
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
          {!isNil(this.state.selectFile) ? <p>{'csvファイルの選択完了です'}</p> : null}
          <button onClick={this.onClickUploadFile.bind(this)} disabled={isNil(this.state.selectFile)}>
            {'データを表示する'}
          </button>
        </div>
      )
    } else {
      const initialHeaders = ['日', '開始時刻', '終了時刻', '勤怠時間'];
      const headers = initialHeaders.concat(this.state.additionalHeaders);
      
      const genreAddPanel = (
        <div>
          <input value={this.state.genreName} onChange={e => this.setState({genreName: e.target.value})}
                 type="text" placeholder="ジャンル名を入力"/>
          <button onClick={this.onClickAddGenre.bind(this)} disabled={this.state.genreName === ''}>{'ジャンルの追加'}</button>
        </div>
      );
      
      const getDetails = id => UploadFileStore.getDetails(id);

      const headerElm = (
        <div>
          <tr>
            {initialHeaders.map((h, i) =>
              <td key={i}>
                <input defaultValue={h}/>
              </td>
            )}
            {this.state.additionalHeaders.map((h, i) =>
              <td key={i}>
                <input defaultValue={h}/>
                <CopyToClipboard
                  text={this.state.additionalHeaders === 0 ? '' : getDetails(i - 3)}
                  onCopy={() => {
                  }}>
                  <button >{'コピー'}</button>
                </CopyToClipboard>
              </td>
            )}
            {(<td>
              <input defaultValue='残りの時間'/>
              <CopyToClipboard
                text={UploadFileStore.getRestTimeDetails()}
                onCopy={() => {
                }}>
                <button>{'コピー'}</button>
              </CopyToClipboard>
            </td>)}
          </tr>
        </div>);
      
      return (
        <div>
          {genreAddPanel}
          {headerElm}
          {this.state.uploadFileDatas.map(t =>
            <List data={t} key={t.id} header={headers}
                  addGenreTimes={this.addGenreTimes.bind(this)}
                  updateRestTime={this.updateRestTime.bind(this)}/>
          )}
        </div>
      )
    }
  }
  
  onSelectFile(file) {
    this.setState({selectFile: file})
  }
  
  onClickUploadFile() {
    UploadFileActionCreators.uploadFile(this.state.selectFile[0]);
  }
  
  onChangeUploadFile() {
    this.setState({selectFile: null, uploadFileDatas: UploadFileStore.getAllFileDatas()});
  }
  
  onClickAddGenre() {
    this.setState({genreName: '', additionalHeaders: this.state.additionalHeaders.concat(this.state.genreName)})
  }
  
  
  addGenreTimes(id, genreTimeId, value) {
    var timeDatas = addGenreTimes(id, genreTimeId, value);
    this.setState({uploadFileDatas: timeDatas});
  }
  
  updateRestTime(id, updatedRestTime) {
    var timeDatas = updateRestTime(id, updatedRestTime);
    this.setState({uploadFileDatas: timeDatas});
  }
}