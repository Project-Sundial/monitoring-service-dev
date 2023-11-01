import { useState, useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useTemporaryMessages from './hooks/useTemporaryMessages';
import { createMonitor, getMonitors, deleteMonitor, updateJob } from './services/jobs';
import MonitorsList from './components/MonitorsList';
import Header from './components/Header';
import AddMonitorForm from './components/AddMonitorForm';
import EndpointWrapper from './components/EndpointWrapper';
import PaddedAlert from './components/PaddedAlert';
import RunsList from './components/RunsList'
import EditForm from './components/EditForm';
import generateWrapper from './utils/generateWrapper';
import { getSse } from './services/sse';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Lato, sans-serif',
    },
    body1: {
      color: "#1a237e",
      fontSize: 21,
    },
    body2: {
      color: "#1a237e",
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#ffd54f',
    }
  }
});

const App = () => {
  const [monitors, setMonitors] = useState([]);
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayWrapper, setDisplayWrapper] = useState(false);
  const [wrapper, setWrapper] = useState('');
  const [errorMessages, addErrorMessage] = useTemporaryMessages(3000);
  const [successMessages, addSuccessMessage] = useTemporaryMessages(3000);

  const handleAxiosError = (error) => {
    console.log(error);

    let message = 'Something went wrong: ';
    if (error.response) {
      message += error.response.data.message;
    } else {
      message += error.message;
    }

    addErrorMessage(message);
  };

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const data = await getMonitors();
        setMonitors(data);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchMonitors();
  }, []);

  useEffect(() => {
    const newSse = getSse();

    newSse.onerror = (error) => {
      console.log('An error occured establishing an SSE connection.');
      newSse.close();

    };

    newSse.addEventListener('newMonitor', (event) => {
      const newMonitor = JSON.parse(event.data);
      console.log('New Monitor:', newMonitor);

      setMonitors(monitors => {
        if (!monitors.find(monitor => monitor.id === newMonitor.id)) {
          return monitors.concat(newMonitor)
        } else {
          return monitors;
        }
      });
    });

    newSse.addEventListener('updatedMonitor', (event) => {
      const updatedMonitor = JSON.parse(event.data);
      console.log('Updated monitor:', updatedMonitor);

      setMonitors(monitors => monitors.map(monitor => {
        if (monitor.id === updatedMonitor.id) {
          return updatedMonitor;
        } else {
          return monitor;
        }
      }));
    });

    return () => {
      if (newSse) {
        console.log('closing monitor sse')
        newSse.close();
      }
    }
  }, []);

  const handleClickSubmitNewMonitor = async (monitorData) => {
    try { 
      const newMonitor = await createMonitor(monitorData);
      const wrapper = generateWrapper(newMonitor);
      setMonitors(monitors.concat(newMonitor))
      setWrapper(wrapper);
      setDisplayWrapper(true);
      addSuccessMessage('Monitor created successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClosePopover = () => {
    setDisplayWrapper(false);
    setWrapper('');
    setDisplayAddForm(false);
  };

  const handleClickDeleteMonitor = async (monitorId) => {
    try {
      await deleteMonitor(monitorId);
      setMonitors(monitors.filter(({ id }) => id !== monitorId));
      addSuccessMessage('Monitor deleted successfully')
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClickSubmitEditJob = async (jobData) => {
    try {
      // const updatedJob = await updateJob(jobData);
      // const updatedJob = jobData;
      // setMonitors(() => {
      //   return monitors.map(job => job.id === updateJob.id ? updatedJob : job)
      // })
      addSuccessMessage('Monitor updated successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        {Object.keys(successMessages).map((message) => (
          <PaddedAlert key={message} severity="success" message={message} />
        ))}
        {Object.keys(errorMessages).map((message) => (
          <PaddedAlert key={message} severity="error" message={message} />
        ))}
        <Routes>
          <Route path="/" element={
            <MonitorsList 
              monitors={monitors} 
              onDelete={handleClickDeleteMonitor} 
            />} />
          <Route path="/add" element={
            <AddMonitorForm 
              onSubmitAddForm={handleClickSubmitNewMonitor} 
              addErrorMessage={addErrorMessage} />} />
          <Route path="/edit/:id" element={
            <EditForm 
              onSubmitEditForm={handleClickSubmitEditJob} 
              addErrorMessage={addErrorMessage}
              monitors={monitors}
            />} />
          <Route path="/jobs/:id" element={
            <RunsList 
              monitors={monitors}
              onDelete={handleClickDeleteMonitor} 
              onError={handleAxiosError}/>} />
        </Routes>
        <EndpointWrapper
          wrapper={wrapper}
          open={displayWrapper}
          onClose={handleClosePopover}
        />
      </ThemeProvider>
    </Router>
  );
}

export default App;
