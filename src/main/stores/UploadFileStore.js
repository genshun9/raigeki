import I from 'immutable'
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
  
  // 2行目の合計時間を取得した後、2行目を削除する。
  totalTime = array[0].split(',')[19];
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
}

export class UploadFileStore extends Store {
  getAll() {
    return uploadFileDatas;
  }
  
  getTotalTime() {
    return uploadFileDatas;
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
    
    default:
  }
});