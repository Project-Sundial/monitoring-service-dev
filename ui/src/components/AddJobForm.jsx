import { Box, FormControl, FormLabel, TextField, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate } from 'react-router-dom';
import PopoverButton from './PopoverButton';
import { ACCENT_COLOR, THEME_COLOR } from '../constants/colors';
import { scheduleString } from '../utils/scheduleString';

const AddJobForm = ({ machines, onSubmitAddForm, addErrorMessage }) => {
  const [machine, setMachine] = useState();
  const [schedule, setSchedule] = useState('');
  const [name, setJobName] = useState('');
  const [command, setCommand] = useState('');
  const [tolerableRuntime, setTolerableRuntime] = useState('');
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

    if (!machine) {
      addErrorMessage("Must select a machine.");
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
      type: 'dual',
      machineId: machine.id,
    };

    navigate('/jobs');
    onSubmitAddForm(jobData);
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
    maxWidth: '90%', 
  }

  return (
    <div style={{marginTop: '20px', marginLeft: '5%'}}>
      <Link to="/jobs">
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
            sx={{
              padding: '5px', 
              width: '25ch',
            }}
            select
            label="Machine"
            value={machine || ''}
            onChange={(e) => setMachine(e.target.value)}
          >
            { machines.filter(machine => {
              return machine.ip;
            }).map(machine => 
              <MenuItem key={machine.id} value={machine}>
                {machine.name}
              </MenuItem>
            )}
          </TextField>
          <TextField
            required
            sx={{padding: '5px'}}
            label="Schedule (required)"
            helperText={scheduleString(schedule)}
            placeholder="* * * * *"
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value)}}
            FormHelperTextProps={{ style: { color: ACCENT_COLOR } }}
            inputProps={{ style: { color: ACCENT_COLOR } }}
          />
          <TextField
            sx={{padding: '5px'}}
            label="Name"
            value={name}
            placeholder='Test Job'
            onChange={(e) => setJobName(e.target.value)}
            inputProps={{ style: { color: ACCENT_COLOR } }}
          />
          <TextField
            sx={{padding: '5px'}}
            label="Command"
            value={command}
            placeholder='test-job.sh'
            onChange={(e) => setCommand(e.target.value)}
            inputProps={{ style: { color: ACCENT_COLOR } }}
          />
          <TextField
            sx={{padding: '5px'}}
            label='Tolerable Runtime (s)'
            value={tolerableRuntime}
            placeholder='0'
            onChange={(e) => setTolerableRuntime(e.target.value)}
            inputProps={{ style: { color: ACCENT_COLOR } }}
          />
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
