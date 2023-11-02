import { Box, FormControl, FormLabel, TextField} from '@mui/material';
import { CONTAINER_COLOR } from '../constants/colors';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopoverButton from './PopoverButton';

const CreateUserForm = ({onSubmitCreateUserForm, addErrorMessage}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleValidateForm = () => {
        if (!username) {
          addErrorMessage("Must have a username.");
          return false;
        }
    
        if (!password) {
          addErrorMessage("Must have a password");
          return false;
        }
        return true;
      }
    
      const handleSubmitForm = () => {
        const userData = {
            username: username,
            password: password
        };
    
        navigate('/');
        return onSubmitCreateUserForm(userData);
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
            <div style={divStyle}>
                <FormControl margin="normal" variant="outlined" sx={{margin: '20px' }}>
                    <FormLabel sx={{fontSize:'20px'}}>Create User</FormLabel>
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
                        label="Username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value)}}
                    />
                    <TextField 
                        required
                        sx={{padding: '5px'}}
                        id="outlined-required"
                        label="Password"
                        placeholder="*******"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value)}}
                    />
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
        </div>
    )
};

export default CreateUserForm;