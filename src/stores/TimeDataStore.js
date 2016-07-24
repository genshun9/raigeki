import I from 'immutable'
import {isNil} from 'lodash'
import If from 'ifx'
import {getTimeDataFromAction, editGenreTimes, editRestTime} from '../models/TimeDataModel.js'

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

export function updateRestTime(id, updatedRestTime) {
  var targetData = timeDatas.get(id);
  timeDatas = timeDatas.set(id, editRestTime(targetData, updatedRestTime));
  return timeDatas;
}

export function getDetailsFromStore(id) {
  var details = [];
  timeDatas.forEach(t => {
    // 土日のデータを削除する
    if (isNil(t.genreTimes.toArray()[id - 1])) {
      details.push(`${t.date} ${'00:00'}\n`);
    } else if (t.genreTimes.toArray()[id - 1].time === '') {
      details.push(`${t.date} ${'00:00'}\n`);
    } else if (!isNil(t.genreTimes.toArray()[id - 1].time)) {
      details.push(`${t.date} ${t.genreTimes.toArray()[id - 1].time}\n`);
    }
  });

  // カンマ区切りになっているので、カンマを削除する。
  return String(details).replace(/,/g, '');
}