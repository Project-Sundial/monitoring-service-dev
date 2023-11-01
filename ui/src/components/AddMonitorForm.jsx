import { Box, FormControl, FormLabel, FormControlLabel, TextField, Button, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate } from 'react-router-dom';

const AddMonitorForm = ({ onSubmitAddForm, addErrorMessage }) => {
  const [schedule, setSchedule] = useState('');
  const [name, setMonitorName] = useState('');
  const [command, setCommand] = useState('');
  const [tolerableRuntime, setTolerableRuntime] = useState('');
  const [type, setMonitorType] = useState('solo');
  const navigate = useNavigate();

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!schedule) {
      addErrorMessage("Must have a schedule.");
      return;
    }
    const parsedSchedule = scheduleParser(schedule);

    if (!parsedSchedule.valid) {
      addErrorMessage(parsedSchedule.error);
      return;
    }

    const monitorData = {
      schedule: schedule,
      name: name || undefined,
      command: command || undefined,
      tolerableRuntime: tolerableRuntime || undefined,
      type: type
    };

    navigate('/');
    return onSubmitAddForm(monitorData);
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
      <Link to="/">
        <Button sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      </Link>       
      <div style={divStyle}>
      <FormControl  margin="normal" variant="outlined" sx={{margin: '20px' }}>
        <FormLabel sx={{fontSize:'20px'}}>New Monitor</FormLabel>
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
            onChange={(e) => setMonitorName(e.target.value)}
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
            <Button variant='contained' onClick={handleSubmitForm}>Submit</Button>
          </Box>
        </Box>
      </FormControl>
      </div>
    </div>
  )
}

export default AddMonitorForm;
