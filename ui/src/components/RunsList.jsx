import React from 'react';
import { List, Box, Typography } from '@mui/material';
import Run from './Run'

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginTop: '20px',
  maxWidth: '80%',
  padding: '40px',
};

const boxStyle = {
  width: '100%', 
  padding: '40px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderRadius: '8px',
  backgroundColor: '#BDBDBD'
};

const RunsList = ({ runData }) => {
  const { monitor, runs } = runData;

  return (
    <div style={containerStyle}>
      <Box component="div" style={boxStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">{monitor.name || 'Monitor'}</Typography>
        <Typography variant="body1" style={{ marginLeft: '20px' }}>
          Schedule: {monitor.schedule}
        </Typography>
        {monitor.command && (
          <Typography variant="body1" style={{ marginLeft: '20px' }}>
            Command: {monitor.command}
          </Typography>
        )}
        <Typography variant="body1" style={{ marginLeft: '20px' }}>
          Endpoint: {monitor.endpoint_key}
        </Typography>
        <Typography variant="body1" style={{ marginLeft: '20px' }}>
          Failing: {monitor.failing ? 'Yes' : 'No'}
        </Typography>
      </div>
        <List>
          {runs.map((run) => (
           <Run run={run} key={run.id}/>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default RunsList;
