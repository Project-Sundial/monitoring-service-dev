const formatDailyReport = (monitors) => {
  let message = 'Good Morning! Your daily cron job report includes the following failing jobs:\n\n';
  monitors.forEach(monitor => {
    message += `
      Name: ${monitor.name}\n
      Schedule: ${monitor.schedule}\n
      Command: ${monitor.command}\n
    `;
  });

  return message;
};

export default formatDailyReport;
