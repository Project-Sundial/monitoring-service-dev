import { useEffect, useState } from 'react';
import {Box, List, Typography, Button, Divider, Grid } from '@mui/material';
import { Job } from './Job';
import { Link } from 'react-router-dom';
import { THEME_COLOR } from '../constants/colors';
import MachineSelect from './MachineSelect';

const JobsList = ({ jobs, machines, onAddNewJob, onDelete }) => {
  const [machine, setMachine] = useState();
  const [jobsToDisplay, setJobsToDisplay] = useState(jobs);

  useEffect(() => {
    if (machine === undefined) {
      setJobsToDisplay(jobs);
      return;
    }

    setJobsToDisplay(jobs.filter(job => job.api_key_id === machine.id));
  }, [machine, jobs]);

  const handleChange = (e) => {
    if (e.target.value === 'all') {
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
            <MachineSelect machines={machines} machine={machine} onChange={handleChange} />
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