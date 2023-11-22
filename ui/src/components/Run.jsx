import { ListItem, ListItemText, Grid, Typography } from '@mui/material';
import formatTime from '../utils/formatTime';
import { formatDuration } from '../utils/formatDuration';
import { ALERT_COLOR, WARNING_COLOR, OPERATIONAL_COLOR, BACKGROUND_COLOR } from "../constants/colors.js"

const Run = ({ run }) => {
  let colorByState = OPERATIONAL_COLOR;
  if (run.state === 'failed' || run.state === 'missed' || run.state === 'solo_missed') {
    colorByState = ALERT_COLOR;
  } else if (run.state === 'unresolved' || run.state === 'no_start' || run.state === 'overran') {
    colorByState = WARNING_COLOR;
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
      solo_missed: "The job did not run",
      overran: "The job completed but took longer than the tolerable runtime",
    };
  
    return stateMap[state]
  }

  const listStyle = {
    maxWidth: '95%', 
    width: '100%',
    height: '100px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    border: `3px solid ${colorByState}`,
    borderRadius: '8px' 
  }

  return ( 
    <ListItem sx={listStyle}>
      <ListItemText
        primary={
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1" sx={{fontFamily: 'Courier New, monospace'}}>{formatTime(run.time)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{getStateDescription(run.state)}</Typography>
            </Grid>
            {run.duration && (
              <Grid item xs={3}>
                <Typography variant="body1">
                  Duration:{' '}
                  <span style={{ fontFamily: 'Courier New, monospace' }}>{formatDuration(run.duration)}
                  </span>
               </Typography>
              </Grid>
            )}
          </Grid>
        }
      />
    </ListItem>
  );
}
 
export default Run;