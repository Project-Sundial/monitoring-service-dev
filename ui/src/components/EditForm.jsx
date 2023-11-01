import { Box, FormControl, FormLabel, FormControlLabel, TextField, Button, Radio, RadioGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { useNavigate, useParams } from 'react-router-dom';
import PopoverButton from './PopoverButton';
import { getJob } from '../services/jobs';


const EditForm = ({ onSubmitEditForm, addErrorMessage, jobs }) => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [name, setJobName] = useState(null);
  const [command, setCommand] = useState(null);
  const [tolerableRuntime, setTolerableRuntime] = useState(null);
  const [type, setMonitorType] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try { 
        const currentJob = jobs.find(job => String(job.id) === id );
        console.log('fetching job:', currentJob)
        // const currentJob = await getJob(id);
        setJob(currentJob);
        setLoaded(true)
        setSchedule(currentJob.schedule);
        setJobName(currentJob.name);
        setCommand(currentJob.command);
        setTolerableRuntime(currentJob.tolerableRuntime);
        setMonitorType(currentJob.type);
      } catch (error) {
        console.log(error);
      }
    }

    fetchJob();
  }, []);

  const handleValidateForm = () => {
    if (!schedule) {
      addErrorMessage("Must have a schedule.");
      return false;
    }
    const parsedSchedule = scheduleParser(schedule);

    if (!parsedSchedule.valid) {
      addErrorMessage(parsedSchedule.error);
      return false;
    }
    return true;
  }

  const handleSubmitForm = () => {
    const jobData = {
      schedule: schedule,
      name: name || undefined,
      command: command || undefined,
      tolerableRuntime: tolerableRuntime || undefined,
      type: type
    };

    navigate('/');
    return onSubmitEditForm(jobData);
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
    <div style={{marginTop: '20px', marginLeft: '5%'}}>
      <Button onClick={() => navigate(-1)} sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      { loaded ? 
      <div style={divStyle}>
        <FormControl  margin="normal" variant="outlined" sx={{margin: '20px' }}>
          <FormLabel sx={{fontSize:'20px'}}>Job {job.name}</FormLabel>
          <Box
            component="form"
            sx={boxStyle}
            noValidate
            autoComplete="off"
            >
            <TextField
              required
              sx={{padding: '5px'}}
              id="outlined-required"
              label="Schedule (required)"
              helperText="The cron schedule string."
              value={schedule}
              onChange={(e) => { setSchedule(e.target.value)}}
            />
            <TextField
              sx={{padding: '5px'}}
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => setJobName(e.target.value)}
            />
            <TextField
              sx={{padding: '5px'}}
              id="outlined-basic"
              label="Command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <TextField
              sx={{padding: '5px'}}
              id="outlined-basic"
              label='Tolerable Runtime (s)'
              value={tolerableRuntime}
              onChange={(e) => setTolerableRuntime(e.target.value)}
            />
            <RadioGroup
              sx={{padding: '10px'}}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={type}
              onChange={(e) => setMonitorType(e.target.value)}
            >
              <FormControlLabel value="solo" control={<Radio />} label="Solo Ping" />
              <FormControlLabel value="dual" control={<Radio />} label="Dual Ping" />
            </RadioGroup>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '5px',
              }}
              >
              <PopoverButton variant='contained' onValidate={handleValidateForm} onAction={handleSubmitForm} buttonName={'Submit'}heading={"Are you sure of the changes you've made?"}></PopoverButton>
            </Box>
          </Box>
        </FormControl>
      </div>
      : <p>Loading...</p>}
    </div>
  )
}

export default EditForm;
