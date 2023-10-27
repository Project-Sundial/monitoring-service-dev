const generateCli = (monitor) => {
  const command = monitor.command ? 
    monitor.command : '<COMMAND>';

  return `${monitor.schedule} sundial run ${monitor.endpoint_key} ${command}`;
};

export default generateCli;
