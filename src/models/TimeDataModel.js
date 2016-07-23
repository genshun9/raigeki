function getValue(str) {
  return str.substr(1, str.length - 2);
}

function TimeData(id, data) {
  this.id = id;
  this.date = getValue(data.split(',')[4]);
  this.startTime = getValue(data.split(',')[16]);
  this.endTime = getValue(data.split(',')[17]);
  this.workTime = getValue(data.split(',')[19])
}

export function getTimeDataFromAction(id, data) {
  var timeData = new TimeData(id, data);
  return timeData;
}