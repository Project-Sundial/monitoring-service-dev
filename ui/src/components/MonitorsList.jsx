import {Box, List, Typography, Button } from '@mui/material';
import { Monitor } from './Monitor';


const MonitorsList = ({ monitors, onDelete, onDisplayRuns, displayAddForm, onAddNewMonitor }) => {

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '20px',
    maxWidth: '80%',
    paddingLeft: '20px',
  };

  const boxStyle = {
    width: '100%', 
    padding: '40px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    borderRadius: '8px',
    backgroundColor: '#BDBDBD'
  };

  return (
    <div style={{ marginTop: '20px', marginLeft: '20px'}}>
      <div style={containerStyle}>
        <Box component="div" style={boxStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Typography variant="h4">{"All Monitors"}</Typography>
            </div>
            <Button open={displayAddForm} variant="outlined" onClick={onAddNewMonitor}>Add New</Button>
          </div>
          <List>
            {monitors.map((monitor) => (
              <Monitor monitor={monitor} onDelete={onDelete} onDisplayRuns={onDisplayRuns}/>
            ))}
          </List>
        </Box>
      </div>
    </div>
  );

}

export default MonitorsList;