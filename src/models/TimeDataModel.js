import I from 'immutable'

function getValue(str) {
  return str.substr(1, str.length - 2);
}

function TimeData(id, data) {
  this.id = id;
  this.date = getValue(data.split(',')[4]);
  this.startTime = getValue(data.split(',')[16]);
  this.endTime = getValue(data.split(',')[17]);
  this.workTime = getValue(data.split(',')[19]);
  this.restTime = getValue(data.split(',')[19]);
  this.genreTimes = I.List();
}

export function getTimeDataFromAction(id, data) {
  var timeData = new TimeData(id, data);
  return timeData;
}

export function editGenreTimes(targetData, targetGenreTimes) {
  var timeData = targetData;
  delete timeData.genreTimes;
  timeData.genreTimes = targetGenreTimes;
  return timeData
}

export function editRestTime(targetData, restTime) {
  var timeData = targetData;
  delete timeData.restTime;
  timeData.restTime = restTime;
  return timeData;
}