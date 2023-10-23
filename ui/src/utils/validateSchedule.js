const parser = require('cron-parser') ;

const scheduleParser = (scheduleStr) => {
  let returnObj = {valid: null, error:null};
  try {
    parser.parseExpression(scheduleStr);
    returnObj.valid = true;
    return returnObj;
  } catch (err) {
    returnObj.valid = false;
    returnObj.error = err.message;
    return returnObj;
  }
}


module.exports ={scheduleParser};