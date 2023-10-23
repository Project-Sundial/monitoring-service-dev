import { BASE_URL, CREATE_PING } from "../constants/routes";

const generateCurl = (monitor) => {
  const command = monitor.command ? 
    monitor.command : '<COMMAND>';

  return `${monitor.schedule} ${command} ` +
    `&& curl -X POST ${BASE_URL + CREATE_PING + '/' + monitor.endpoint_key}`;
};

export default generateCurl;
