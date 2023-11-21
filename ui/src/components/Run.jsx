import { ListItem, ListItemText, Grid, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formatTime from '../utils/formatTime';
import { ALERT_COLOR, WARNING_COLOR, OPERATIONAL_COLOR } from "../constants/colors.js"

const Run = ({ run }) => {

  const okay = {
    backgroundColor: OPERATIONAL_COLOR,
    color: 'white',
  };
  
  const warning = {
    backgroundColor: WARNING_COLOR,
    color: 'white'
  };

  const alert = {
    backgroundColor: ALERT_COLOR,
    color: 'white',
  };

  let colorByState = okay;
  if (run.state === 'failed' || run.state === 'missed' || run.state === 'solo_missed') {
    colorByState = alert;
  } else if (run.state === 'unresolved' || run.state === 'no_start' || run.state === 'overran') {
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
      solo_missed: "The job did not run",
      overran: "The job completed but took longer than the tolerable runtime",
    };
  
    return stateMap[state]
  }

  const listStyle = {
    maxWidth: '95%', 
    width: '100%',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: colorByState,
    borderRadius: '8px' 
  }

  const accordionStyle = {
    width: '100%',
    padding: '5px',
    margin: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: colorByState,
    borderRadius: '8px' 
  }

  return ( 
    <div>
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
                      <Typography variant="body1">{run.duration ? 'Duration (s): ' + run.duration.milliseconds : 'Duration (s): '+ null}</Typography>
                    </Grid>
                  )}
                  {colorByState !== okay ?                   
                  <Accordion sx={accordionStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      See Error Logs
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography> 
                        {run.error_log}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  : null}
                </Grid>
          }
        />
      </ListItem>
    </div>
  );
}
 
export default Run;