import React from 'react';
import { List, Box, Typography, Button, Divider, Grid, Pagination } from '@mui/material';
import Run from './Run'
import DeleteButton from './DeleteButton';

const RunsList = ({ monitor, runs, onDeleteMonitor, closeRuns, page, onPageChange }) => {
  const handleDeleteMonitor = () => {
    onDeleteMonitor(monitor.id);
    closeRuns();
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: "#f9fbe7",
    borderRadius: '8px',
    maxWidth: '90%', 
  }

  return (
    <div style={{ marginTop: '20px', marginLeft: '5%'}}>
      <Button sx={{marginBottom: '20px', marginLeft: '10px'}}onClick={closeRuns} variant="contained">Back</Button>
      <div style={divStyle}>
        <Box sx={boxStyle}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <Typography variant="h4">Monitor: {monitor.name || 'A Monitor'}</Typography>
            </Grid>
            <Grid item xs={2}>
              <DeleteButton onDelete={() => handleDeleteMonitor()} />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Schedule:</Typography>
            </Grid>
            <Grid item xs={3}>
              {monitor.command && (
              <Typography variant="body2">Command:</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Endpoint:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Status:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.schedule}</Typography>
            </Grid>
            <Grid item xs={3}>
              {monitor.command && (
              <Typography variant="body1">{monitor.command}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.endpoint_key}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.failing ? 'Failing.' : 'All Sunny!'}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <List>
            {runs.map((run) => (
            <Run run={run} key={run.id}/>
            ))}
          </List>
          <Pagination count={5} size="large" page={page} onChange={onPageChange} />
        </Box>
      </div>
    </div>
  );
};

export default RunsList;
