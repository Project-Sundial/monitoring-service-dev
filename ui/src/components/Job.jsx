import { ListItem, ListItemButton, ListItemText, Typography, Grid, Button } from '@mui/material';
import PopoverButton from './PopoverButton';
import nextRun from '../utils/nextRun';
import formatTime from "../utils/formatTime";
import { Link } from 'react-router-dom';
import { ALERT_COLOR, OPERATIONAL_COLOR, THEME_COLOR, BACKGROUND_COLOR} from '../constants/colors';

export const Job = ({ job, onDelete }) => {
  const colorByState = job.failing? ALERT_COLOR : OPERATIONAL_COLOR;

  const divStyle = {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
    // border: `5px solid ${colorByState}`, 
    borderTop: `2px solid ${colorByState}`, 
    borderRight: `2px solid ${colorByState}`, 

    borderBottom: `8px solid ${colorByState}`, 
    borderLeft: `8px solid ${colorByState}`, 

    borderRadius: '8px',
    backgroundColor: job.failing ? BACKGROUND_COLOR : THEME_COLOR,
    maxWidth: '95%', 
    padding: '10px',
    margin: '20px',
  }

  return ( 
    <ListItem sx={divStyle}>
      <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', width: '100%' }}>
        <ListItemButton sx={{ borderRadius: '8px' }}>
          <ListItemText
            primary={
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{paddingLeft:'10px'}}>{job.name || "Nameless"}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{paddingBottom: '0px'}}>Next Expected:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{paddingBottom: '0px', fontFamily: 'Courier New, monospace'}}>{formatTime(nextRun(job.schedule))}</Typography>
                </Grid>
              </Grid>
            }
          />
        </ListItemButton>
      </Link>
      <Link to={`/jobs/edit/${job.id}`}>
        <Button sx={{ fontSize: '14px', margin: '5px' }} variant="contained">EDIT</Button>
      </Link>
      <PopoverButton onAction={() => onDelete(job.id)} buttonName={"DELETE"} heading={"Are you sure you want to delete this job?"}/>
    </ListItem>
  );
}
