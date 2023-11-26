import { useEffect, useState } from 'react';
import {Box, List, Typography, Button, Divider, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { Job } from './Job';
import { Link } from 'react-router-dom';
import { ACCENT_COLOR, THEME_COLOR } from '../constants/colors';

const JobsList = ({ jobs, machines, onAddNewJob, onDelete }) => {
  const [machine, setMachine] = useState();
  const [jobsToDisplay, setJobsToDisplay] = useState(jobs);
  const machineSelectDefault = 'All Machines';

  useEffect(() => {
    if (machine === undefined) {
      setJobsToDisplay(jobs);
      return;
    }

    setJobsToDisplay(jobs.filter(job => job.machine_id === machine.id));
  }, [machine, jobs]);

  const handleChangeMachine = (e) => {
    if (e.target.value === machineSelectDefault) {
      setMachine(undefined);
      return;
    }

    setMachine(e.target.value);
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: THEME_COLOR,
    borderRadius: '8px',
    maxWidth: '90%'
  }

  return (
    <div style={{ marginTop: '5%', marginLeft: '5%'}}>
      <div style={divStyle}>
      <Box sx={boxStyle}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="h4" sx={{margin: '30px'}}>All Cron Jobs</Typography>
          </Grid>
          <Grid item xs={5}>
          <InputLabel id="machine-label">Machine</InputLabel>
          <Select
            labelId="machine-label"
            value={machine || 'All Machines'}
            label="Machine"
            onChange={handleChangeMachine}
            sx={{ color: ACCENT_COLOR }}
          >
          <MenuItem value={'All Machines'}>All Machines</MenuItem>
          {machines.map(machine => 
            <MenuItem key={machine.id} value={machine}>{machine.name}</MenuItem>
          )}
        </Select>
          </Grid>
          <Grid item xs={2}>
            <Link to="/jobs/add">
              <Button sx={{ fontSize: '18px', margin: '30px' }} variant='contained' onClick={onAddNewJob}>Add New
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Divider />
        <List>
          {jobsToDisplay.map((job) => (
            <Job key={job.id} job={job} onDelete={() => onDelete(job.id)}/>
          ))}
        </List>
      </Box>
    </div>
    </div>
  );
}

export default JobsList;