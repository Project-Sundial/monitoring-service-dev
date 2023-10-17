// const parse = (cronJob) => {
//   const arr = cronJob.split(' ');
//   const schedule = arr.slice(0, 5).join(' ');
//   const command = arr.slice(5).join(' ');
//   return { schedule, command };
// };

// const createWrapper = (endpoint_id, schedule, command) => {
//   return `${schedule} sundial exec ${endpoint_id} ${command}`;
// };

// export default { createWrapper, parse };