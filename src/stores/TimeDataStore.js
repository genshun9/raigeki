import I from 'immutable'
import {getTimeDataFromAction, editGenreTimes} from '../models/TimeDataModel.js'

let sumTime = null;
let timeDatas = null;

export function getDatas(array) {

  // 現在文字コードの変換が上手く行かず、ヘッダーの文字列（日本語）が文字化けしているので、1行目を削除する。
  array.shift();

  sumTime = array[0].split(',')[19];

  // 文字化けするため、2行目の合計時間を取得した後、2行目を削除する。
  array.shift();

  // 何故か最後に空行を認識してしまうので、削除する。
  array.pop();

  timeDatas = I.OrderedMap(array.map((a, i) => [i + 1, getTimeDataFromAction(i + 1, a)]));
  return timeDatas;
}

export function addGenreTimes(timeDataId, genreTimeId, inputGenreTime) {
  var targetData = timeDatas.get(timeDataId);

  let targetGenreTimes = targetData.genreTimes;
  targetGenreTimes = targetGenreTimes.set(genreTimeId - 1, {id: genreTimeId, time: inputGenreTime});

  timeDatas = timeDatas.set(timeDataId, editGenreTimes(targetData, targetGenreTimes));
  return timeDatas;
}