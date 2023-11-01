import { Box, FormControl, FormLabel, FormControlLabel, TextField, Button, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditForm = ({ onSubmitEditForm, addErrorMessage, monitors }) => {
  const { id } = useParams();
  const job = monitors.find(monitor => String(monitor.id) === id );
  const [schedule, setSchedule] = useState(job.schedule);
  const [name, setJobName] = useState(job.name);
  const [command, setCommand] = useState(job.command);
  const [tolerableRuntime, setTolerableRuntime] = useState(job.tolerableRuntime);
  const [type, setMonitorType] = useState(job.type);
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
    return onSubmitEditForm(monitorData);
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
              <Button variant='contained' onClick={handleSubmitForm}>Submit</Button>
            </Box>
          </Box>
        </FormControl>
      </div>
    </div>
  )
}

export default EditForm;
