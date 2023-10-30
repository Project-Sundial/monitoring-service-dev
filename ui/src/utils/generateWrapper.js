import { BASE_URL, CREATE_PING } from "../constants/routes";

const generateCli = (monitor) => {
  const command = monitor.command ? 
    monitor.command : '<COMMAND>';

  return `${monitor.schedule} sundial run ${monitor.endpoint_key} ${command}`;
};

const generateCurl = (monitor) => {
  const command = monitor.command ? 
    monitor.command : '<COMMAND>';

  return `${monitor.schedule} ${command} ` +
    `&& curl -X POST ${BASE_URL + CREATE_PING + '/' + monitor.endpoint_key}?event=solo`;
};

const generateWrapper = (monitor) => {
  return (monitor.type === "solo") ? generateCurl(monitor) : generateCli(monitor)
}

export default generateWrapper;