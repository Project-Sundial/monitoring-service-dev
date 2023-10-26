import React from 'react';
import { List, Box, Typography, Button } from '@mui/material';
import Run from './Run'
import DeleteButton from './DeleteButton';

const RunsList = ({ runData, onDeleteMonitor, closeRuns }) => {
  const { monitor, runs } = runData;

  const handleDeleteMonitor = () => {
    onDeleteMonitor(monitor.id);
    closeRuns();
  }

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
    <div style={{ marginTop: '20px', marginLeft: '20px'}}>    <Button onClick={closeRuns} variant="outlined">Back</Button>
    <div style={containerStyle}>
      <Box component="div" style={boxStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography variant="h4">{monitor.name || 'Monitor'}</Typography>
            <Typography variant="body1">Schedule: {monitor.schedule}
            </Typography>
            {monitor.command && (
              <Typography variant="body1">
                Command: {monitor.command}
              </Typography>
            )}
            <Typography variant="body1">Endpoint: {monitor.endpoint_key}</Typography>
            <Typography variant="body1">Failing: {monitor.failing ? 'Yes' : 'No'}</Typography>
          </div>
          <DeleteButton style={{ marginLeft: '20px' }} onDelete={() => handleDeleteMonitor()} />
        </div>
        <List>
          {runs.map((run) => (
           <Run run={run} key={run.id}/>
          ))}
        </List>
      </Box>
    </div>
    </div>
  );
};

export default RunsList;
