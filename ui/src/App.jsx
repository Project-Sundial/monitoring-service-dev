import { useState, useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import useTemporaryMessages from './hooks/useTemporaryMessages';
import { createMonitor, getMonitors, deleteMonitor, getRuns } from './services/monitors';
import MonitorsList from './components/MonitorsList';
import Header from './components/Header';
import AddMonitorForm from './components/AddMonitorForm';
import EndpointWrappers from './components/EndpointWrappers';
import PaddedAlert from './components/PaddedAlert';
import RunsList from './components/RunsList'
import generateCurl from './utils/generateCurl';
import generateCli from './utils/generateCli';

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
  const [runData, setRunData] = useState([]);
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayWrappers, setDisplayWrappers] = useState(false);
  const [displayRunsList, setDisplayRunsList] = useState(false);
  const [curlWrapper, setCurlWrapper] = useState('');
  const [cliWrapper, setCliWrapper] = useState('');
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

  const handleClickNewMonitorButton = (e) => {
    setDisplayAddForm(true);
  };

  const handleClickSubmitNewMonitor = async (monitorData) => {
    try { 
      const newMonitor = await createMonitor(monitorData);
      const curlWrapper = generateCurl(newMonitor);
      const cliWrapper = generateCli(newMonitor);
      setMonitors(monitors.concat(newMonitor))
      setCurlWrapper(curlWrapper);
      setCliWrapper(cliWrapper);
      setDisplayWrappers(true);
      addSuccessMessage('Monitor created successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClosePopover = () => {
    setDisplayWrappers(false);
    setCurlWrapper('');
    setCliWrapper('');
    setDisplayAddForm(false);
  };

  const handleClickBackButton = () => {
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

  const findMonitor = (id)=> {
    return monitors.find(monitor => monitor.id === id);
  }

  const handleDisplayRuns = async (monitorId) => {
    try { 
      const runs = await getRuns(monitorId);
      setRunData({monitor: findMonitor(monitorId), runs: runs});
      setDisplayRunsList(true);
    } catch (error) {
      handleAxiosError(error);
    }
  }

  let componentToRender;

  if (displayAddForm) {
    componentToRender = <AddMonitorForm onSubmitForm={handleClickSubmitNewMonitor} onBack={handleClickBackButton} addErrorMessage={addErrorMessage} />;
  } else if (displayRunsList) {
    componentToRender = <RunsList runData={runData} onDeleteMonitor={handleClickDeleteMonitor} closeRuns={() => setDisplayRunsList(false)}/>;
  } else {
    componentToRender = (
      <MonitorsList 
        monitors={monitors} 
        onDelete={handleClickDeleteMonitor} 
        onDisplayRuns={handleDisplayRuns}
        onAddNewMonitor={handleClickNewMonitorButton}
        displayAddForm={displayAddForm}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
      <Header />
      {Object.keys(successMessages).map(message => 
        <PaddedAlert key={message} severity="success" message={message} />
      )}
      {Object.keys(errorMessages).map(message =>
        <PaddedAlert key={message} severity="error" message={message} />
      )}
      {componentToRender}
      <EndpointWrappers curlWrapper={curlWrapper} cliWrapper={cliWrapper} open={displayWrappers} onClose={handleClosePopover} />
      <EndpointWrappers curlWrapper={curlWrapper} cliWrapper={cliWrapper} open={displayWrappers} onClose={handleClosePopover} />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
