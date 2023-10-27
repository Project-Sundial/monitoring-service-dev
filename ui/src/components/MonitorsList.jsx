import {Box, List, Typography, Button, Divider, Grid } from '@mui/material';
import { Monitor } from './Monitor';

const MonitorsList = ({ monitors, onDelete, onDisplayRuns, displayAddForm, onAddNewMonitor }) => {
  const boxStyle = {
    maxWidth: '80%', 
    width: '100%',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: "white",
    borderRadius: '8px' 
  };

  return (
    <div style={{ marginTop: '20px', marginLeft: '30px'}}>
      <Box sx={boxStyle}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4" sx={{margin: '30px'}}>All Monitors</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button sx={{ fontSize: '18px', margin: '30px' }} open={displayAddForm} variant='contained' onClick={onAddNewMonitor}>Add New</Button>
          </Grid>
        </Grid>
        <Divider />
        <List>
          {monitors.map((monitor) => (
            <Monitor monitor={monitor} onDelete={onDelete} onDisplayRuns={onDisplayRuns}/>
          ))}
        </List>
      </Box>
    </div>
  );
}

export default MonitorsList;