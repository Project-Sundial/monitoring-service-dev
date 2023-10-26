const formatTime = (timestamp) => {
  const entireDate = new Date(timestamp);
  const options = {
    hour: "numeric",
    minute: "numeric",
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  
  const [date, time]= entireDate.toLocaleDateString(undefined, options).split(',');
  return [time, date].join(',  ')
}

export default formatTime;