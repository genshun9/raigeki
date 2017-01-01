import I from 'immutable'

const defaultUploadFile = {
  id: null,
  dateTime: null,
  startTime: null,
  endTime: null,
  workTime: null,
  restTime: null,
  genreTimes: I.Map()
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
  
  set(key, value) {
    return super.set(key, value);
  }
  
  updateGenreTimes(genreId, value) {
    let targetGenreTimes = this.genreTimes;
    targetGenreTimes = targetGenreTimes.set(genreId, value);
    return this.set('genreTimes', targetGenreTimes);
  }
  
  updateRestTime(value) {
    return this.set('restTime', value);
  }
}