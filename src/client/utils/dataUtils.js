export function convertMinutesFromData(data) {
  const hourPart = data.split(':')[0];
  const minutePart = data.split(':')[1];
  return Number(hourPart) * 60 + Number(minutePart);
}

export function convertMinutsToData(minute) {
  const hourPart = Math.floor(minute / 60);
  const minutePart = minute - hourPart * 60;
  return `${addDigits(hourPart)}:${addDigits(minutePart)}`;
}

export function addDigits(input) {
  if(String(input).length === 1) {
    return `0${String(input)}`;
  }
  return String(input);
}