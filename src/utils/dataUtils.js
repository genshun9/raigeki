export function convertMinutesFromData(time) {
  var hourPart = time.split(':')[0];
  var minutePart = time.split(':')[1];
  var minutes = Number(hourPart) * 60 + Number(minutePart);
  return minutes;
}

export function convertDataFromMinutes(workTime, sumGenreTime) {
  var restTime = workTime - sumGenreTime;
  var hourPart = Math.floor(restTime / 60);
  var minutePart = restTime - hourPart * 60;
  var timeData = `${addDigits(hourPart)}:${addDigits(minutePart)}`;
  return timeData;
}

export function addDigits(input) {
  if(String(input).length === 1) {
    return `0${String(input)}`;
  }
  return String(input);
}