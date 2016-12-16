import AppDispatcher from '../dispatchers/AppDispatcher.js'
import {ActionTypes} from '../constants/Constants.js'
import Store from './Store.js'
import I from 'immutable'
import {isNil} from 'lodash'
import If from 'ifx'
import {getUploadFileFromAction, editGenreTimes, editRestTime} from '../models/UploadFile.js'
import {addDigits} from '../utils/dataUtils.js'

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
    (a, i) => [i + 1, getUploadFileFromAction(i + 1, a)]
  ));
}

// export function getDatas(array) {
//
//   // 現在文字コードの変換が上手く行かず、ヘッダーの文字列（日本語）が文字化けしているので、1行目を削除する。
//   array.shift();
//
//   sumTime = array[0].split(',')[19];
//
//   // 文字化けするため、2行目の合計時間を取得した後、2行目を削除する。
//   array.shift();
//
//   // 何故か最後に空行を認識してしまうので、削除する。
//   array.pop();
//
//   timeDatas = I.OrderedMap(array.map((a, i) => [i + 1, getTimeDataFromAction(i + 1, a)]));
//   return timeDatas;
// }

export function addGenreTimes(timeDataId, genreTimeId, inputGenreTime) {
  var targetData = timeDatas.get(timeDataId);

  let targetGenreTimes = targetData.genreTimes;
  targetGenreTimes = targetGenreTimes.set(genreTimeId - 1, {id: genreTimeId, time: inputGenreTime});

  timeDatas = timeDatas.set(timeDataId, editGenreTimes(targetData, targetGenreTimes));
  return timeDatas;
}

export function updateRestTime(id, updatedRestTime) {
  var targetData = timeDatas.get(id);
  timeDatas = timeDatas.set(id, editRestTime(targetData, updatedRestTime));
  return timeDatas;
}

export function getDetailsFromStore(id) {
  var details = [];
  timeDatas.forEach(t => {
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
  return String(details).replace(/,/g, '');
}

export function getRestTimeDetailsFromStore() {
  var details = [];
  timeDatas.forEach(t => {
    if (t.startTime === '') {
      // 土日のデータを削除する
    } else {
      details.push(`${t.date} ${addDigits(t.restTime)}\n`);
    }
  });

  // カンマ区切りになっているので、カンマを削除する。
  return String(details).replace(/,/g, '');
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


// AppDispatcher.register(action => {
//   switch (action.actionType) {
//
//     case ActionTypes.UPLOAD:
//       store(action.file);
//       UploadFileStore.emitChange();
//       break;
//
//     default:
//   }
//
// });