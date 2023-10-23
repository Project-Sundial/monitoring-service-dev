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
      grace_period: notifyTime || undefined,
    };

    return onSubmitForm(monitorData);
  }

  return (
    <>
      <div>
        <Button sx={{ width: '120px', margin: '10px' }} onClick={onBack}>Back</Button>
      </div>
      <FormControl margin="normal" variant="outlined" sx={{margin: '30px' }} >
        <FormLabel>New Monitor</FormLabel>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch'},
          }}
          noValidate
          autoComplete="off"
          >
          <TextField
            required
            id="outlined-required"
            label="Schedule (required)"
            helperText="The cron schedule string."
            placeholder="* * * * *"
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value)}}
          />
          <TextField
            id="outlined-basic"
            label="Name"
            value={name}
            placeholder='Test Job'
            onChange={(e) => setMonitorName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Command"
            value={command}
            placeholder='test-job.sh'
            onChange={(e) => setCommand(e.target.value)}
          />
          <TextField
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
            }}
            >
            <Button sx={{ width: '100%' }} onClick={handleSubmitForm}>Submit</Button>
          </Box>
        </Box>
      </FormControl>
    </>
  )
}

export default AddMonitorForm;
