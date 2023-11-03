import { Box, FormControl, FormLabel, FormControlLabel, TextField, Button, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate } from 'react-router-dom';
import PopoverButton from './PopoverButton';
import { CONTAINER_COLOR } from '../constants/colors';

const AddJobForm = ({ onSubmitAddForm, addErrorMessage }) => {
  const [schedule, setSchedule] = useState('');
  const [name, setJobName] = useState('');
  const [command, setCommand] = useState('');
  const [tolerableRuntime, setTolerableRuntime] = useState('');
  const [type, setJobType] = useState('solo');
  const navigate = useNavigate();

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
    return onSubmitAddForm(jobData);
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: CONTAINER_COLOR,
    borderRadius: '8px',
    maxWidth: '90%', 
  }

  return (
    <div style={{marginTop: '20px', marginLeft: '5%'}}>
      <Link to="/">
        <Button sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      </Link>       
      <div style={divStyle}>
      <FormControl  margin="normal" variant="outlined" sx={{margin: '20px' }}>
        <FormLabel sx={{fontSize:'20px'}}>New Job</FormLabel>
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
            placeholder="* * * * *"
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value)}}
          />
          <TextField
            sx={{padding: '5px'}}
            id="outlined-basic"
            label="Name"
            value={name}
            placeholder='Test Job'
            onChange={(e) => setJobName(e.target.value)}
          />
          <TextField
            sx={{padding: '5px'}}
            id="outlined-basic"
            label="Command"
            value={command}
            placeholder='test-job.sh'
            onChange={(e) => setCommand(e.target.value)}
          />
          <TextField
            sx={{padding: '5px'}}
            id="outlined-basic"
            label='Tolerable Runtime (s)'
            value={tolerableRuntime}
            placeholder='0'
            onChange={(e) => setTolerableRuntime(e.target.value)}
          />
          <RadioGroup
            sx={{padding: '10px'}}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={type}
            onChange={(e) => setJobType(e.target.value)}
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
            <PopoverButton variant='contained' onValidate={handleValidateForm} onAction={handleSubmitForm} buttonName={'Submit'} heading={"Are you sure of the changes you've made?"}></PopoverButton>
          </Box>
        </Box>
      </FormControl>
      </div>
    </div>
  )
}

export default AddJobForm;
