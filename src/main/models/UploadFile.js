import I from 'immutable'

const defaultUploadFile = {
  id: null,
  dateTime: null,
  startTime: null,
  endTime: null,
  workTime: null,
  restTime: null,
  genreTimes: I.List()
};

export default class UploadFile extends I.Record(defaultUploadFile) {

  static getUploadFileFromAction(id, convertedArrayData) {
    let props = {};
    props.id = id;
    props.dateTime = convertedArrayData[4];
    props.startTime = convertedArrayData[16];
    props.endTime = convertedArrayData[17];
    props.workTime = convertedArrayData[19];
    props.restTime = convertedArrayData[19];
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