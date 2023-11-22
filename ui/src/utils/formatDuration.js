export const formatDuration = (timeObject) => {
  const { hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = timeObject;

  const totalTimeInMilliseconds = hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  const pad = (num, size) => ('000' + num).slice(size * -1);

  const hoursString = pad(Math.floor(totalTimeInMilliseconds / 3600000), 2);
  const minutesString = pad(Math.floor((totalTimeInMilliseconds % 3600000) / 60000), 2);
  const secondsString = pad(Math.floor((totalTimeInMilliseconds % 60000) / 1000), 2);
  const millisecondsString = pad(totalTimeInMilliseconds % 1000, 3);

  return `${hoursString}:${minutesString}:${secondsString}.${millisecondsString}`;
}