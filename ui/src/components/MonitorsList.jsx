import {Box, List, Typography, Button, Divider, Grid } from '@mui/material';
import { Monitor } from './Monitor';

const MonitorsList = ({ monitors, onDelete, onDisplayRuns, displayAddForm, onAddNewMonitor }) => {
  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: "#f9fbe7",
    borderRadius: '8px',
    maxWidth: '90%'
  }

  return (
    <div style={{ marginTop: '5%', marginLeft: '5%'}}>
      <div style={divStyle}>
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
            <Monitor key={monitor.id} monitor={monitor} onDelete={onDelete} onDisplayRuns={onDisplayRuns}/>
          ))}
        </List>
      </Box>
    </div>
    </div>
  );
}

export default MonitorsList;