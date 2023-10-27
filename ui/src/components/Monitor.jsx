import { ListItem, ListItemButton, ListItemText, Typography, Grid } from '@mui/material';
import DeleteButton from './DeleteButton';
import nextRun from '../utils/nextRun';
import formatTime from "../utils/formatTime";

export const Monitor = ({ monitor, onDelete, onDisplayRuns }) => {
  const okay = {
    backgroundColor: '#DCE775',
    color: '#616161',
  };
  
  const alert = {
    backgroundColor: '#e64a19',
    color: 'white',
  };

  const colorByState = monitor.failing? alert : okay;

  const listStyle = {
    maxWidth: '95%', 
    width: '100%',
    padding: '10px',
    margin: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: colorByState,
    borderRadius: '8px' 
  }

  return ( 
    <ListItem>
      <ListItemButton onClick={() => onDisplayRuns(monitor.id)} sx={listStyle}>
        <ListItemText
          primary={
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{fontWeight:'bold', paddingLeft:'10px'}}>{monitor.name || "Nameless Monitor"}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">Next Expected Time:{formatTime(nextRun(monitor.schedule))}</Typography>
              </Grid>
            </Grid>
          }
        />
      </ListItemButton>
      <DeleteButton onClick={() => onDelete(monitor.id)}/>
    </ListItem>
  );
}
