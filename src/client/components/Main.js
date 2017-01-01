import React from 'react'
import {Button, Table} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import CopyToClipboard from 'react-copy-to-clipboard'
import {isNil} from 'lodash'
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
    this._onChangeAddGenre = this.onChangeAddGenre.bind(this);
    this._onChangeRestTime = this.onChangeRestTime.bind(this);
  };
  
  componentWillMount() {
    UploadFileStore.addChangeListener(this._onChangeUploadFile);
    UploadFileStore.addChangeGenreListener(this._onChangeAddGenre);
    UploadFileStore.addChangeRestTimeListener(this._onChangeRestTime);
  }
  
  componentWillUnmount() {
    UploadFileStore.removeChangeListener(this._onChangeUploadFile);
    UploadFileStore.removeChangeGenreListener(this._onChangeAddGenre);
    UploadFileStore.removeChangeRestTimeListener(this._onChangeRestTime);
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
          <Button onClick={this.onClickUploadFile.bind(this)} disabled={isNil(this.state.selectFile)}>
            {'データを表示する'}
          </Button>
        </div>
      )
    } else {
      const initialHeaders = ['日', '開始時刻', '終了時刻', '勤怠時間'];
      const headers = initialHeaders.concat(this.state.additionalHeaders);
      
      const genreAddPanel = (
        <div>
          <input value={this.state.genreName} onChange={e => this.setState({genreName: e.target.value})}
                 type="text" placeholder="ジャンル名を入力"/>
          <Button onClick={this.onClickAddGenre.bind(this)} disabled={this.state.genreName === ''}>{'ジャンルの追加'}</Button>
        </div>
      );
  
      const additionalInputElms = (dataId) => headers.map((h, i) =>
        (i > 3) ?
          <td>
            <div>
              <input
                id={i} type="text" placeholder={`${h}に関する時間を入力`}
                onChange={e => this.updateGenreTime(dataId, i - 3, e.target.value)}
                value={UploadFileStore.getOneFileDataById(dataId).genreTimes.get(i - 3)} />
            </div>
          </td> : null
      );
      
      return (
        <div>
          {genreAddPanel}
          <div>
            <Table striped bordered condensed hover>
              <thead>
              <tr key="initial-header">
                {initialHeaders.map(h => <td>{h}</td>)}
                {this.state.additionalHeaders.map((h, i) =>
                  <td>
                    {h}
                    <CopyToClipboard
                      text={UploadFileStore.getAllGenreTimesByGenreId(i + 1)}
                      onCopy={() => {}}>
                      <Button >{'コピー'}</Button>
                    </CopyToClipboard>
                  </td>
                )}
                {(<td>
                  {'残りの時間'}
                  <CopyToClipboard
                    text={UploadFileStore.getAllRestTime()}
                    onCopy={() => {
                    }}>
                    <Button>{'コピー'}</Button>
                  </CopyToClipboard>
                  <Button disabled={this.state.additionalHeaders.length === 0}
                          onClick={this.updateAllRestTime.bind(this)}>
                    {'残りの時間を更新'}
                  </Button>
                </td>)}
              </tr>
              </thead>
              <tbody>
              {this.state.uploadFileDatas.map(t =>
                <tr>
                  <td>{t.dateTime}</td>
                  <td>{t.startTime}</td>
                  <td>{t.endTime}</td>
                  <td>{t.workTime}</td>
                  {additionalInputElms(t.id)}
                  <td>{t.restTime}</td>
                </tr>
              )}
              </tbody>
            </Table>
          </div>        </div>
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
  
  onChangeAddGenre() {
    const additionalHeaders = this.state.additionalHeaders.concat(this.state.genreName);
    this.setState({genreName: '', additionalHeaders: additionalHeaders, uploadFileDatas: UploadFileStore.getAllFileDatas()});
  }
  
  onChangeRestTime() {
    this.setState({uploadFileDatas: UploadFileStore.getAllFileDatas()});
  }
  
  onClickAddGenre() {
    const additionalHeaders = this.state.additionalHeaders.concat(this.state.genreName);
    UploadFileActionCreators.addGenre(additionalHeaders.length);
  }
  
  updateGenreTime(dataId, genreTimeId, value) {
    const targetFileData = UploadFileStore.getOneFileDataById(dataId);
    const editedTargetFileData = targetFileData.updateGenreTimes(genreTimeId, value);
    UploadFileActionCreators.editFile(editedTargetFileData.id, editedTargetFileData);
  }
  
  updateAllRestTime() {
    UploadFileStore.updateAllRestTime();
  }
}