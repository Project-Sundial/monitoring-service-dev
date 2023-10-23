import { useState, useEffect } from 'react';
import useTemporaryMessages from './hooks/useTemporaryMessages';
import { Button, Box } from '@mui/material';
import { createMonitor, getMonitors } from './services/monitors';
import MonitorsList from './components/MonitorsList';
import Header from './components/Header';
import AddMonitorForm from './components/AddMonitorForm';
import WrapperPopover from './components/WrapperPopover';
import PaddedAlert from './components/PaddedAlert';
import generateCurl from './utils/generateCurl';

const App = () => {
  const [monitors, setMonitors] = useState([]);
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayString, setDisplayString] = useState(false);
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
  }

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

  const onClickNewMonitorButton = (e) => {
    setDisplayAddForm(true);
  }

  const onClickSubmitNewMonitor = async (monitorData) => {
    try { 
      const newMonitor = await createMonitor(monitorData);
      const wrapper = generateCurl(newMonitor);
      setMonitors(monitors.concat(newMonitor))
      setWrapper(wrapper);
      setDisplayString(true);
      addSuccessMessage('Monitor created successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  }

  const onClosePopover = () => {
    setDisplayString(false);
    setWrapper('');
    setDisplayAddForm(false);
  }

  const onClickBackButton = () => {
    setDisplayAddForm(false);
  }

  return (
    <div>
      <Header />
      {Object.keys(successMessages).map(message => 
        <PaddedAlert key={message} severity="success" message={message} />
      )}
      {Object.keys(errorMessages).map(message =>
        <PaddedAlert key={message} severity="error" message={message} />
      )}
      {displayAddForm ? 
        null : 
        <Box display="flex" justifyContent="left" mt={2}>
          <Button 
            open={displayAddForm} 
            variant="contained" 
            onClick={onClickNewMonitorButton}>Add Monitor
          </Button> 
        </Box>}
      {displayAddForm ? 
        <AddMonitorForm 
          handleSubmitForm={onClickSubmitNewMonitor}
          handleBack={onClickBackButton}
          addErrorMessage={addErrorMessage}/> : 
        <MonitorsList monitors={monitors}/> }
      <WrapperPopover 
        wrapper={wrapper} 
        open={displayString} 
        handleClose={onClosePopover}
      />
    </div>
  );
}

export default App;
