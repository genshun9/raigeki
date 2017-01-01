import I from 'immutable'
import {isNil} from 'lodash'
import AppDispatcher from '../dispatchers/AppDispatcher.js'
import {ActionTypes} from '../constants/Constants.js'
import Store from './Store.js'
import UploadFile from '../models/UploadFile.js'

let totalTime = null;
let uploadFileDatas = null;

function store(array) {
  // 現在文字コードの変換が上手く行かず、ヘッダーの文字列（日本語）が文字化けしている
  // 初めに1行目を削除する。
  array.shift();
  
  // 2行目のダブルクオーテーションを取り除いて合計時間を取得した後、2行目を削除する。
  const totalTimeStr = array[0].split(',')[19];
  totalTime = totalTimeStr.substr(1, totalTimeStr.length - 2);
  array.shift();
  
  // 最後に空行を認識してしまうので、削除する。
  array.pop();
  
  uploadFileDatas = I.OrderedMap(array.map(
    (a, i) => {
      // 各エクセルの行のデータからダブルクオーテーションを取り除いて配列化させる
      const convertedArrayData = a.split(',').map(a => a.substr(1, a.length - 2));
      return [i + 1, UploadFile.getUploadFileFromAction(i + 1, convertedArrayData)]
    }
  ));
  
  // 土日や休日のデータを削除する
  uploadFileDatas.forEach(d => {
    if (d.startTime === '') {
      uploadFileDatas = uploadFileDatas.delete(d.id);
    }
  });
}

function addGenre(genreId) {
  uploadFileDatas.forEach(d => {
    const targetDatas = d.updateGenreTimes(genreId, '00:00');
    uploadFileDatas = uploadFileDatas.set(d.id, targetDatas);
  });
}

function edit(id, data) {
  uploadFileDatas = uploadFileDatas.set(id, data);
}

export class UploadFileStore extends Store {
  
  getAllFileDatas() {
    return uploadFileDatas;
  }
  
  getOneFileDataById(id) {
    return uploadFileDatas.get(id);
  }
  
  getDetails(id) {
    var details = [];
    uploadFileDatas.forEach(t => {
      if (t.startTime === '') {
        // 土日のデータを削除する
      } else if (isNil(t.genreTimes.toArray()[id - 1])) {
        details.push(`${t.date} ${'00:00'}\n`);
      } else if (t.genreTimes.toArray()[id - 1].time === '') {
        details.push(`${t.date} ${'00:00'}\n`);
      } else if (!isNil(t.genreTimes.toArray()[id - 1].time)) {
        details.push(`${t.date} ${addDigits(t.genreTimes.toArray()[id - 1].time)}\n`);
      }
    });
    
    // カンマ区切りになっているので、カンマを削除する。
    console.log("中身", String(details).replace(/,/g, ''));
    return String(details).replace(/,/g, '');
  }
  
  getRestTimeDetails() {
    return null;
  }
  
  getTotalTime() {
    return totalTime;
  }
  
  addChangeGenreListener(callback) {
    this.on('change-genre', callback);
  }
  
  emitChangeGenre() {
    this.emit('change-genre');
  }
}

const uploadFileStore = new UploadFileStore();
export default uploadFileStore;

AppDispatcher.register(action => {
  switch (action.actionType) {
    case ActionTypes.UPLOAD:
      store(action.data);
      uploadFileStore.emitChange();
      break;
  
    case ActionTypes.ADD_GENRE:
      addGenre(action.genreId);
      uploadFileStore.emitChangeGenre();
      break;
  
    case ActionTypes.EDIT:
      edit(action.targetId, action.data);
      uploadFileStore.emitChange();
      break;
    default:
  }
});