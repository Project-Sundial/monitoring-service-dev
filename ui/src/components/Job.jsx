import { ListItem, ListItemButton, ListItemText, Typography, Grid, Button } from '@mui/material';
import PopoverButton from './PopoverButton';
import nextRun from '../utils/nextRun';
import formatTime from "../utils/formatTime";
import { Link } from 'react-router-dom';
import { ALERT_COLOR, OPERATIONAL_COLOR } from '../constants/colors';

export const Job = ({ job, onDelete }) => {
  const okay = {
    backgroundColor: OPERATIONAL_COLOR,
    color: 'white',
  };
  
  const alert = {
    backgroundColor: ALERT_COLOR,
    color: 'white',
  };

  const colorByState = job.failing? alert : okay;

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: colorByState,
    borderRadius: '8px',
    maxWidth: '95%', 
    padding: '10px',
    margin: '10px',
  }

  return ( 
    <ListItem sx={divStyle}>
      <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', width: '100%' }}>
        <ListItemButton sx={{ borderRadius: '8px' }}>
          <ListItemText
            primary={
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="body1" sx={{fontWeight:'bold', paddingLeft:'10px'}}>{job.name || "Nameless Job:/"}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" sx={{paddingBottom: '0px'}}>Next Expected Time: {formatTime(nextRun(job.schedule))}</Typography>
                </Grid>
              </Grid>
            }
          />
        </ListItemButton>
      </Link>
      <Link to={`/jobs/edit/${job.id}`}>
        <Button sx={{ fontSize: '14px', fontWeight: 'bold', margin: '5px' }} variant="contained">EDIT</Button>
      </Link>
      <PopoverButton onAction={() => onDelete(job.id)} buttonName={"DELETE"} heading={"Are you sure you want to delete this job?"}/>
    </ListItem>
  );
}
