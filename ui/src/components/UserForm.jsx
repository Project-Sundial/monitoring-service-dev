import { Box, FormControl, FormLabel, TextField, Button} from '@mui/material';
import { CONTAINER_COLOR } from '../constants/colors';

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

const UserForm = ({ username, setUsername, password, setPassword, onSubmit, formName }) => {
    return (
        <div style={{marginTop: '20px', marginLeft: '5%'}}>
            <div style={divStyle}>
                <FormControl margin="normal" variant="outlined" sx={{margin: '20px' }} >
                        <FormLabel sx={{fontSize:'20px'}}>{formName}</FormLabel>
                        <Box
                            component="form"
                            sx={boxStyle}
                            autoComplete="off"
                            onSubmit={onSubmit}
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
                            id="outlined-basic"
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
                            <Button variant='contained' type='submit'>Submit</Button>
                        </Box>
                        </Box>
                </FormControl>
            </div>
        </div>
    )
};

export default UserForm;