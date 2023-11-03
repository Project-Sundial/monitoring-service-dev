import {Box, List, Typography, Button, Divider, Grid } from '@mui/material';
import { Job } from './Job';
import { Link } from 'react-router-dom';
import { CONTAINER_COLOR } from '../constants/colors';

const JobsList = ({ jobs, onAddNewJob, onDelete }) => {
  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: CONTAINER_COLOR,
    borderRadius: '8px',
    maxWidth: '90%'
  }

  return (
    <div style={{ marginTop: '5%', marginLeft: '5%'}}>
      <div style={divStyle}>
      <Box sx={boxStyle}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4" sx={{margin: '30px'}}>All Cron Jobs</Typography>
          </Grid>
          <Grid item xs={3}>
            <Link to="/add">
              <Button sx={{ fontSize: '18px', margin: '30px' }} variant='contained' onClick={onAddNewJob}>Add New
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Divider />
        <List>
          {jobs.map((job) => (
            <Job key={job.id} job={job} onDelete={() => onDelete(job.id)}/>
          ))}
        </List>
      </Box>
    </div>
    </div>
  );
}

export default JobsList;