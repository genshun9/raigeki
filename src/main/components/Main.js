import React from 'react'
import {Button, Table} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import CopyToClipboard from 'react-copy-to-clipboard'
import {isNil} from 'lodash'
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
          <button onClick={this.onClickAddGenre.bind(this)} disabled={this.state.genreName === ''}>{'ジャンルの追加'}</button>
        </div>
      );
  
      const additionalInputElms = headers.map((h, i) =>
        (i > 3) ?
          <td>
            <div>
              <input type="text" placeholder={`${h}に関する時間を入力`} key={i}
                     onChange={e => this.props.addGenreTimes(this.state.id, i - 3, e.target.value)}/>
            </div>
          </td> : null
      );
      
      // const headerElm = (
      //   <div>
      //     <Table condensed hover>
      //       <thead>
      //       <tr key="initial-header">
      //         {initialHeaders.map((h, i) => <td>{h}</td>)}
      //         {this.state.additionalHeaders.map((h, i) =>
      //           <td>
      //             {h}
      //             <CopyToClipboard
      //               text={UploadFileStore.getDetails(i - 3)}
      //               onCopy={() => {}}>
      //               <Button >{'コピー'}</Button>
      //             </CopyToClipboard>
      //           </td>
      //         )}
      //         {(<td>
      //           {'残りの時間'}
      //           <CopyToClipboard
      //             text={UploadFileStore.getRestTimeDetails()}
      //             onCopy={() => {
      //             }}>
      //             <Button>{'コピー'}</Button>
      //           </CopyToClipboard>
      //         </td>)}
      //       </tr>
      //       </thead>
      //       <tbody>
      //       {this.state.uploadFileDatas.map(t =>
      //         <tr>
      //           <td>{t.dateTime}</td>
      //           <td>{t.startTime}</td>
      //           <td>{t.endTime}</td>
      //           <td>{t.workTime}</td>
      //           {additionalInputElms}
      //           <td>{t.restTime}
      //             <Button disabled={t.genreTimes.size === 0} onClick={this.updateRestTime.bind(this)}>
      //               {'残りの時間を更新'}
      //             </Button>
      //           </td>
      //         </tr>
      //       )}
      //       </tbody>
      //     </Table>
      //   </div>
      // );
      
      return (
        <div>
          {genreAddPanel}
          <div>
            <Table striped bordered condensed hover>
              <thead>
              <tr key="initial-header">
                {initialHeaders.map((h, i) => <td>{h}</td>)}
                {this.state.additionalHeaders.map((h, i) =>
                  <td>
                    {h}
                    <CopyToClipboard
                      text={UploadFileStore.getDetails(i - 3)}
                      onCopy={() => {}}>
                      <Button >{'コピー'}</Button>
                    </CopyToClipboard>
                  </td>
                )}
                {(<td>
                  {'残りの時間'}
                  <CopyToClipboard
                    text={UploadFileStore.getRestTimeDetails()}
                    onCopy={() => {
                    }}>
                    <Button>{'コピー'}</Button>
                  </CopyToClipboard>
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
                  {additionalInputElms}
                  <td>{t.restTime}
                    <Button disabled={t.genreTimes.size === 0} onClick={this.updateRestTime.bind(this)}>
                      {'残りの時間を更新'}
                    </Button>
                  </td>
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