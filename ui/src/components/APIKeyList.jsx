import { useState, useEffect } from 'react';
import { getAPIKeys, addAPIKey, addAPIKeyName } from '../services/keys';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(prefix, name, created_at) {
    return { prefix, name, created_at };
  }

const APIKeyList = (onError) => {
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const list = await getAPIKeys();
                setKeys(list);
                console.log(keys);
            } catch(error) {
                onError(error);
            }
        };
        fetchList();
    }, []);

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>API Key Prefix</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Created on</TableCell>
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
    );

};

export default APIKeyList;