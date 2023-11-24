import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const MachineSelect = ({ machines, machine, onChange }) => {
  return (
    <Box sx={{ margin: '30px' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="machine-label">Machine</InputLabel>
        <Select
          labelId="machine-label"
          value={machine || 'all'}
          label="Machine"
          onChange={onChange}
        >
          <MenuItem value={'all'}>All Machines</MenuItem>
          {machines.map(machine => 
            <MenuItem key={machine.id} value={machine}>{machine.name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MachineSelect;
