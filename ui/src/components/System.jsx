import { Box, FormControl, FormLabel, TextField, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate } from 'react-router-dom';
import PopoverButton from './PopoverButton';
import { ACCENT_COLOR, THEME_COLOR } from '../constants/colors';
import { scheduleString } from '../utils/scheduleString';

const System = ({ onSubmitSystemIP, addErrorMessage }) => {
  const [systemIP, setSystemIP] = useState('');
  // const navigate = useNavigate();

  // const schedule = '';
  // const handleValidateForm = () => {
  //   if (!schedule) {
  //     addErrorMessage("Must have a schedule.");
  //     return false;
  //   }

  //   const parsedSchedule = scheduleParser(schedule);
  //   if (!parsedSchedule.valid) {
  //     addErrorMessage(parsedSchedule.error);
  //     return false;
  //   }

  //   if (!machine) {
  //     addErrorMessage("Must select a machine.");
  //     return false;
  //   }

  //   return true;
  // }

  const handleSubmitForm = () => {
    try { 
      const systemData = {
        ip: systemIP
      };

      const newJob = await createIP(jobData, token);
      const wrapper = generateWrapper(newJob);
      setJobs(() => jobs.concat(newJob))
      setWrapper(wrapper);
      setDisplayWrapper(true);
      addSuccessMessage('Job created successfully');
      } catch (error) {
        onAxiosError(error);
      }
    };
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
      <div style={divStyle}>
      <FormControl  margin="normal" variant="outlined" sx={{margin: '20px' }}>
        <FormLabel sx={{fontSize:'20px'}}>System IP</FormLabel>
        <Box
          component="form"
          sx={boxStyle}
          noValidate
          autoComplete="off"
          >
          <TextField
            sx={{padding: '5px'}}
            label='Set System Hub Private IP address'
            value={systemIP}
            placeholder=''
            onChange={(e) => setSystemIP(e.target.value)}
            inputProps={{ style: { color: ACCENT_COLOR } }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '5px',
            }}
            >
            <Button variant='contained' onAction={handleSubmitForm} buttonName={'Submit'} heading={"Are you sure of the changes you've made?"}></Button>
          </Box>
        </Box>
      </FormControl>
      </div>
    </div>
  )
}

export default System;