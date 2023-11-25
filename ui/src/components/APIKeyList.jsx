import { useState, useEffect } from 'react';
import {Box, Typography, Button, Divider, Grid } from '@mui/material';
import { getAPIKeys, addAPIKey, addAPIKeyName } from '../services/keys';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { THEME_COLOR, ACCENT_COLOR } from '../constants/colors';
import Popover from './Popover';

const APIKeyList = (onError) => {
    const [keys, setKeys] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState('');

    useEffect(() => {
        const fetchList = async () => {
            try {
                const list = await getAPIKeys();
                setKeys(list);
            } catch(error) {
                onError(error);
            }
        };
        fetchList();
    }, []);

    const handleClickAddKey = async () => {
        try {
            const newKey = await addAPIKey();
            setKeys(() => keys.concat(newKey));
            setCurrentKey(newKey.apiKey);
            setIsConfirmOpen(true);
        } catch (error) {
            onError(error);
        }
    }
    
    const handleClickCopy = () => {
        navigator.clipboard.writeText(currentKey);
        // setIsConfirmOpen(false);
    }
    
    const handleClose= () => {
    setIsConfirmOpen(false);
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
        maxWidth: '90%'
      }
    
    const popoverText = () => {
        return `This is your new key: \n ${currentKey} \n Please copy it because it will only be shown once.`
    }

    return (
        <div>
            <div style={{ marginTop: '5%', marginLeft: '5%'}}>
                <div style={divStyle}>
                <Box sx={boxStyle}>
                    <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h4" sx={{margin: '30px'}}>My Machines</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button sx={{ fontSize: '18px', margin: '30px'}} variant='contained' onClick={handleClickAddKey}>New Machine API Key
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
            <div style={{ marginTop: '5%', marginLeft: '20%', marginRight: '20%'}}>
                    <TableContainer component={Paper} sx={{ backgroundColor: ACCENT_COLOR }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    <TableCell style={{fontWeight:'bold'}}>API Key Prefix</TableCell>
                                    <TableCell style={{fontWeight:'bold'}} align="right">Name</TableCell>
                                    <TableCell style={{fontWeight:'bold'}} align="right">Created on</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {keys.map((key) => (
                                <TableRow
                                key={key.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {key.prefix}
                                </TableCell>
                                <TableCell align="right">{key.name}</TableCell>
                                <TableCell align="right">{key.created_at}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </div>
        </div>
    );

};

export default APIKeyList;
