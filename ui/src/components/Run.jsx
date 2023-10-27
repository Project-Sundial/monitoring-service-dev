import { ListItem, ListItemText, Grid, Typography } from '@mui/material';
import formatTime from '../utils/formatTime';

const Run = ({ run }) => {
  const okay = {
    backgroundColor: '#DCE775',
    color: '#616161',
  };
  
  const warning = {
    backgroundColor: '#fb8c00',
    color: 'white'
  };

  const alert = {
    backgroundColor: '#e64a19',
    color: 'white',
  };

  let colorByState = okay;
  if (run.state === 'failed' || run.state === 'missed') {
    colorByState = alert;
  } else if (run.state === 'unresolved' || run.state === 'no_start') {
    colorByState = warning;
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

  const listStyle = {
    maxWidth: '80%', 
    width: '100%',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: colorByState,
    borderRadius: '8px' 
  }

  return ( 
    <ListItem sx={listStyle}>
    <ListItemText
      primary={
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography variant="body1" sx={{fontWeight:'bold'}}>{formatTime(run.time)}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body1">{getStateDescription(run.state)}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">{'State: ' + run.state}</Typography>
          </Grid>
          {run.duration && (
            <Grid item xs={2}>
              <Typography variant="body1">{run.duration}</Typography>
            </Grid>
          )}
        </Grid>
      }
    />
  </ListItem>
  );
}
 
export default Run;