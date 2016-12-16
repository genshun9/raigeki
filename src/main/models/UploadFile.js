import I from 'immutable'

function getValue(str) {
  return str.substr(1, str.length - 2);
}

const uploadFile = {
  id: null,
  date: null,
  startTime: null,
  endTime: null,
  workTime: null,
  restTime: null,
  genreTimes: I.List()
};

export default class UploadFile extends I.Record(uploadFile) {
  // id: number;
  // date;
  // startTime;
  // endTime;
  // workTime;
  // restTime;
  // genreTimes;
  
  static getUploadFileFromAction(id, data) {
    let props;
    props.id = id;
    props.date = getValue(data.split(',')[4]);
    props.startTime = getValue(data.split(',')[16]);
    props.endTime = getValue(data.split(',')[17]);
    props.workTime = getValue(data.split(',')[19]);
    props.restTime = getValue(data.split(',')[19]);
    props.genreTimes = I.List();
    return new UploadFile(props);
  }
  
  static editGenreTimes(targetData, targetGenreTimes) {
    var timeData = targetData;
    delete timeData.genreTimes;
    timeData.genreTimes = targetGenreTimes;
    return timeData
  }
  
  static editRestTime(targetData, restTime) {
    var timeData = targetData;
    delete timeData.restTime;
    timeData.restTime = restTime;
    return timeData;
  }
}