import I from 'immutable'
import {isNil} from 'lodash'
import AppDispatcher from '../dispatchers/AppDispatcher.js'
import {ActionTypes} from '../constants/Constants.js'
import Store from './Store.js'
import UploadFile from '../models/UploadFile.js'
import {convertMinutesFromData, convertMinutsToData} from '../utils/dataUtils.js'

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
  
  getAllGenreTimesByGenreId(genreId) {
    let details = [];
    uploadFileDatas.forEach(d => details.push(d.genreTimes.get(genreId)));
    
    // カンマ区切りになっているので、カンマを改行に置き換える
    return String(details).replace(/,/g, '\n');
  }
  
  getAllRestTime() {
    let details = [];
    uploadFileDatas.forEach(d => details.push(d.restTime));
  
    // カンマ区切りになっているので、カンマを改行に置き換える
    return String(details).replace(/,/g, '\n');  }
  
  getTotalTime() {
    return totalTime;
  }
  
  updateAllRestTime() {
    uploadFileDatas.forEach(d => {
      let restTime = convertMinutesFromData(d.restTime);
      let workTime = convertMinutesFromData(d.workTime);
      d.genreTimes.map(t => {
        restTime = workTime - convertMinutesFromData(t);
      });
      uploadFileDatas = uploadFileDatas.set(d.id, d.updateRestTime(convertMinutsToData(restTime)));
    });
    
    // Actionを通過せずに、ここでemitChangeする
    this.emitChangeRestTime();
  }
  
  addChangeGenreListener(callback) {
    this.on('change-genre', callback);
  }
  
  emitChangeGenre() {
    this.emit('change-genre');
  }
  
  removeChangeGenreListener(callback) {
    this.off('change-genre', callback);
  }
  
  addChangeRestTimeListener(callback) {
    this.on('change-rest-time', callback);
  }
  
  emitChangeRestTime() {
    this.emit('change-rest-time');
  }
  
  removeChangeRestTimeListener(callback) {
    this.off('change-rest-time', callback);
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