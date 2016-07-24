import React from 'react'
import {Button} from 'react-bootstrap'
import DropZone from 'react-dropzone'
import CopyToClipboard from 'react-copy-to-clipboard'
import request from 'superagent'
import {isNil} from 'lodash'
import List from './List.jsx'
//import TimeModal from './TimeModal.jsx'
import {getDatas, addGenreTimes, updateRestTime, getDetailsFromStore, getRestTimeDetailsFromStore} from './stores/TimeDataStore.js'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: null,
      //datas: {},
      uploadFinish: false,
      timeCardDatas: null,
      genreName: '',
      additionalHeaders: [],
      modalOpen: false,
      targetGenreId: null
    }
  };

  componentWillMount() {
    this.loadDatas();
  }

  render() {
    const headers = ['date', 'startTime', 'endTime', 'workTime'].concat(this.state.additionalHeaders);

    const genreAddPanel = (<div>
      <input value={this.state.genreName} onChange={e => this.setState({genreName: e.target.value})} type="text"
             placeholder="ジャンルを入力してください"/>
      <button onClick={this.addGenre.bind(this)} disabled={this.state.genreName === ''}>{'追加'}</button>
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
            {(<td><input defaultValue='restTime'/>
              <CopyToClipboard text={isNil(this.state.timeCardDatas) ? '' : getRestTimeDetails()} onCopy={() => {}}>
                <button>{'コピー'}</button>
              </CopyToClipboard>
            </td>)}
          </tr>
        </div>);

    //const getTitle = id => this.state.additionalHeaders[id];
    //
    //const timeModalElm = this.state.additionalHeaders.length === 0 ? null :
    //    (<TimeModal show={this.state.modalOpen} title={getTitle(this.state.targetGenreId - 1)}
    //                genreId={this.state.targetGenreId} onHide={this.setState({modalOpen: !this.state.modalOpen})}/>);

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
                {this.state.timeCardDatas.map((t, i) =>
                    <List data={t} key={i} header={headers} addGenreTimes={this.addGenreTimes.bind(this)}
                          updateRestTime={this.updateRestTime.bind(this)}/>)}
              </div>}
        </div>
    );
  }

  loadDatas() {
    // 読み込み時に、ローカル内のファイルを取得するメソッドである。
    //request
    //    .get('/data')
    //    .end(function (err, res) {
    //      this.setState({datas: res.body});
    //    }.bind(this));
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

          var timeDatas = getDatas(res.text.split(/\r\n|\r|\n/));

          this.setState({uploadFile: null, uploadFinish: true, timeCardDatas: timeDatas});
        }.bind(this));
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