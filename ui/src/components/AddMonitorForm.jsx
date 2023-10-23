import { Box, FormControl, FormLabel, TextField, Button } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';

const AddMonitorForm = ({ handleSubmitForm, handleBack, addErrorMessage }) => {
  const [schedule, setSchedule] = useState('');
  const [name, setMonitorName] = useState('');
  const [command, setCommand] = useState('');
  const [notifyTime, setNotifyTime] = useState('');

  const onClickSubmitForm = (e) => {
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

    return handleSubmitForm(monitorData);
  }

  return (
    <>
      <div>
        <Button sx={{ width: '120px', margin: '10px' }} onClick={handleBack}>Back</Button>
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
            label="Schedule Required"
            helperText="The cron schedule string."
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value)}}
          />
          <TextField
            id="outlined-basic"
            label="Name"
            value={name}
            onChange={(e) => setMonitorName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label='Time to Notify'
            helperText="The amount of time you expect your job to take."
            value={notifyTime}
            onChange={(e) => setNotifyTime(e.target.value)}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            >
            <Button sx={{ width: '100%' }} onClick={onClickSubmitForm}>Submit</Button>
          </Box>
        </Box>
      </FormControl>
    </>
  )
}

export default AddMonitorForm;
