import { ListItem, ListItemText } from '@mui/material';

const Run = ({ run }) => {
  const okay = {
    backgroundColor: '#DCE775',
    color: '#616161',
  };
  
  const alert = {
    backgroundColor: '#EF5350',
    color: 'white',
  };
  
  const warning = {
    backgroundColor: '#FFA000',
  };

  let itemColorStyle = okay;
  if (run.state === 'failed' || run.state === 'missed') {
    itemColorStyle = alert;
  } else if (run.state === 'unresolved' || run.state === 'no_start') {
    itemColorStyle = warning;
  }
  

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

  const getStateDescription = (state) => {
    const stateMap = {
      started: "A start ping was received",
      completed: "The job ran successfully",
      failed: "The job ran but encountered an error when executing",
      unresolved: "A start ping was received but no end ping",
      no_start: "Only an end ping was received",
      solo_completed: "The job ran",
      missed: "The job did not run",
    };
  
    return stateMap[state]
  }

  return ( 
    <ListItem
      style={{
        ...itemColorStyle,
        borderRadius: '8px',
        margin: '8px 0',
        display: 'flex',
        alignItems: 'center',
      }}
    >
    <ListItemText
      primary={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>{formatTime(run.time)}</span>
          <span style={{ margin: '0 8px' }}>|</span>
          <span>{getStateDescription(run.state)}</span>
          <span style={{ margin: '0 8px' }}>|</span>
          <span>{'State: ' + run.state }</span> {/*for testing */}
          {run.duration && (
            <>
              <span style={{ margin: '0 8px' }}>|</span>
              <span>{'Duration: ' + run.duration}</span>
            </>
          )}
        </div>
      }
    />
  </ListItem>
  );
}
 
export default Run;