import { Box, FormControl, FormLabel, TextField, Button } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';

const AddMonitorForm = ({ onSubmitForm, onBack, addErrorMessage }) => {
  const [schedule, setSchedule] = useState('');
  const [name, setMonitorName] = useState('');
  const [command, setCommand] = useState('');
  const [notifyTime, setNotifyTime] = useState('');

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
      gracePeriod: notifyTime || undefined,
    };

    return onSubmitForm(monitorData);
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: "white",
    borderRadius: '8px',
    maxWidth: '95%', 
  }

  return (

    <div style={{marginTop: '20px', marginLeft: '30px'}}>
       <Button sx={{marginBottom: '20px', marginLeft: '10px'}}onClick={onBack} variant="contained">Back</Button>
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
            label='Grace Period (s)'
            value={notifyTime}
            placeholder='0'
            onChange={(e) => setNotifyTime(e.target.value)}
          />
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
