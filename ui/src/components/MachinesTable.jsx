import { useState, useEffect } from 'react';
import {Box, Typography, Button, Divider, Grid } from '@mui/material';
import { getMachines, addMachine, updateMachineName, deleteMachine } from '../services/machines';
import { 
  DataGrid, 
  GridActionsCellItem, 
  GridCellModes,
  useGridApiRef,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { THEME_COLOR } from '../constants/colors';
import Popover from './Popover';

const MachinesTable = ({ onAxiosError, addSuccessMessage, addErrorMessage }) => {
  const [machines, setMachines] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [cellModesModel, setCellModesModel] = useState({});

  const handleEditClick = (id) => {
    setCellModesModel({ ...cellModesModel, [id]: { name: { mode: GridCellModes.Edit } } });
  };

  const handleSaveClick = (id) => {
    setCellModesModel({ ...cellModesModel, [id]: { name: { mode: GridCellModes.View } } });
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteMachine(id);
      addSuccessMessage('Machine deleted successfully');
      setMachines(machines.filter((row) => row.id !== id));
    } catch (error) {
      onAxiosError(error);
    }
  };

  const handleCancelClick = (id) => {
    setCellModesModel({ ...cellModesModel, [id]: { name: { mode: GridCellModes.View, ignoreModifications: true } } });
  };

  const processRowUpdate = async (newRow) => {
    const newMachine = await updateMachineName(newRow);
    addSuccessMessage('Machine updated successfully.')
    return newMachine;
  }

  const onProcessRowUpdateError = (error) => {
    console.log(error);
    onAxiosError(error);
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    { field: 'ip', headerName: 'IP', flex: 1 },
    { field: 'prefix', headerName: 'API Key Prefix', flex: 1 },
    { field: 'created_at', headerName: 'Created On', flex: 1 },
    { field: 'actions', 
      type: 'actions', 
      headerName: 'Actions',
      getActions: ({ id }) => {
        const isInEditMode = cellModesModel[id]?.name.mode === GridCellModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
  ];

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await getMachines();
        setMachines(list);
      } catch(error) {
        onAxiosError(error);
      }
    };
    fetchList();
  }, []);

  const handleClickAddKey = async () => {
    try {
      const newMachine = await addMachine();
      setMachines((machines) => machines.concat(newMachine));
      setCurrentKey(newMachine.apiKey);
      setIsConfirmOpen(true);
    } catch (error) {
      onAxiosError(error);
    }
  };
  
  const handleClickCopy = () => {
    navigator.clipboard.writeText(currentKey);
    setIsConfirmOpen(false);
  };
  
  const handleClose= () => {
    setIsConfirmOpen(false);
  };

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: THEME_COLOR,
    borderRadius: '8px',
    maxWidth: '95%'
  };
  
  const popoverText = () => {
    return `This is your new key: \n ${currentKey} \n Please copy it because it will only be shown once.`
  };

  return (
    <div>
      <div style={{ marginTop: '5%', marginLeft: '5%' }}>
        <div style={divStyle}>
          <Box sx={boxStyle}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Typography variant="h4" sx={{margin: '30px'}}>Machines</Typography>
              </Grid>
              <Grid item xs={3}>
                <Button sx={{ fontSize: '18px', margin: '30px'}} variant='contained' onClick={handleClickAddKey}>
                  Add New Key
                </Button>
                <Popover 
                  content={popoverText()}
                  open={isConfirmOpen}
                  onClose={handleClose}
                  primaryButtonLabel="Copy"
                  secondaryButtonLabel="Close"
                  onPrimaryButtonClick={handleClickCopy}
                  onSecondaryButtonClick={handleClose}/>
              </Grid>
            </Grid>
            <Divider />
          </Box>
        </div>
      </div>
      <div style={{ marginTop: '5%', marginLeft: '10%', marginRight: '10%'}}>
        <DataGrid
          columns={columns}
          rows={machines}
          onCellEditStop={(params, event) => event.defaultMuiPrevented = true}
          onCellEditStart={(params, event) => event.defaultMuiPrevented = true}
          cellModesModel={cellModesModel}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
        />
      </div>
    </div>
  );
};

export default MachinesTable;
