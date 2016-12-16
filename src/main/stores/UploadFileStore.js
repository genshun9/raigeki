import AppDispatcher from '../dispatchers/AppDispatcher.js'
import {ActionTypes} from '../constants/Constants.js'
import Store from './Store.js'
import UploadFile from '../models/UploadFile.js'

let totalTime = null;
let fileDatas = null;

function store(array) {
  // 現在文字コードの変換が上手く行かず、ヘッダーの文字列（日本語）が文字化けしている
  // 初めに1行目を削除する。
  array.shift();
  
  // 2行目の合計時間を取得した後、2行目を削除する。
  totalTime = array[0].split(',')[19];
  array.shift();
  
  // 最後に空行を認識してしまうので、削除する。
  array.pop();
  
  fileDatas = I.OrderedMap(array.map(
    (a, i) => [i + 1, UploadFile.getUploadFileFromAction(i + 1, a)]
  ));
}

export class UploadFileStore extends Store {
  getAll() {
    return fileDatas;
  }
  
  getTotalTime() {
    return totalTime;
  }
}

export default new UploadFileStore();

AppDispatcher.register(action => {
  switch (action.actionType) {
    case ActionTypes.UPLOAD:
      store(action.file);
      UploadFileStore.emitChange();
      break;
    
    default:
  }
});