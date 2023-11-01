import React from 'react';
import { useState, useEffect } from 'react';
import { List, Box, Typography, Button, Divider, Grid, Pagination } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Run from './Run'
import DeleteButton from './DeleteButton';
import { getRuns } from '../services/monitors';
import { PAGE_LIMIT } from '../constants/pagination';
import calculateOffset from '../utils/calculateOffset';
import { getSse } from '../services/sse';


const RunsList = ({ monitors, onDelete, onError }) => {
  const { id } = useParams();
  const [runs, setRuns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [sse, setSse] = useState(null);
  const [listening, setListening] = useState(false);

  const monitor = monitors.find(monitor => String(monitor.id) === id );

  useEffect(() => {
    if (!listening && sse === null) {
      const newSse = getSse();

      newSse.onerror = (error) => {
        console.log('An error occured establishing an SSE connection.');
        newSse.close();
        setSse(null);
        setTimeout(() => {
          setListening(false);
        }, 5000);
      };
  
      newSse.addEventListener('newRun', (event) => {
        if (page !== 1) return;

        const newRun = JSON.parse(event.data);
        console.log('New run:', newRun);

        setRuns(runs => {
          if (monitor && monitor.id === newRun.monitor_id && !runs.find(run => run.id === newRun.id)) {
            const newRunData = [newRun].concat(runs);
            if (newRunData.length > PAGE_LIMIT) {
              newRunData.length = PAGE_LIMIT;
            }
            return newRunData;
          } else {
            return runs;
          }
        });
      });
  
      newSse.addEventListener('updatedRun', (event) => {
        const updatedRun = JSON.parse(event.data);
        console.log('Updated run:', updatedRun);
  
        setRuns(runs => {
          if (monitor && monitor.id === updatedRun.monitor_id) {
            return runs.map(run => {
                if (run.id === updatedRun.id) {
                  return updatedRun;
                } else {
                  return run;
                }
              });
          } else {
            return runs;
          }
        });
      });

      setListening(true);
      setSse(newSse);
    }

    return () => {
      if (sse) {
        sse.close();
        setSse(null);
        setListening(false);
      }
    }
  }, [sse, listening, page]);

  useEffect(() => {
    const fetchRuns = async () => {
      try { 
        const data = await getRuns(monitor.id, PAGE_LIMIT, calculateOffset(page, PAGE_LIMIT));
        setRuns(data.runs);
        setTotalPages(data.totalPages);
      } catch (error) {
        onError(error);
      }
    }

    if (monitor) {
      fetchRuns();
    }
  }, [page]);
  
  const handleDelete= () => {
    navigate("/");
    onDelete(monitor.id);
  }

  const onPageChange = (_, newPage) => {
    setPage(newPage);
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
    <div style={{ marginTop: '20px', marginLeft: '5%'}}>
      <Link to="/">
        <Button sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      </Link>
      <div style={divStyle}>
        <Box sx={boxStyle}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography variant="h4">Monitor: {monitor.name || 'A Monitor'}</Typography>
            </Grid>
            <Grid item xs={2}>
            <Link to={`/edit/${monitor.id}`}>
              <Button sx={{ fontSize: '18px', margin: '5px' }} variant="contained">EDIT</Button>
            </Link>
            </Grid>
            <Grid item xs={2}>
              <DeleteButton onDelete={handleDelete} />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Schedule:</Typography>
            </Grid>
            <Grid item xs={3}>
              {monitor.command && (
              <Typography variant="body2">Command:</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Endpoint:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Status:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.schedule}</Typography>
            </Grid>
            <Grid item xs={3}>
              {monitor.command && (
              <Typography variant="body1">{monitor.command}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.endpoint_key}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{monitor.failing ? 'Failing.' : 'All Sunny!'}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <List>
            {runs.map((run) => (
            <Run run={run} key={run.id}/>
            ))}
          </List>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Pagination count={totalPages} size="large" page={page} onChange={onPageChange} />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default RunsList;
