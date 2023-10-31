import { useState, useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import useTemporaryMessages from './hooks/useTemporaryMessages';
import { createMonitor, getMonitors, deleteMonitor, getRuns } from './services/monitors';
import MonitorsList from './components/MonitorsList';
import Header from './components/Header';
import AddMonitorForm from './components/AddMonitorForm';
import EndpointWrapper from './components/EndpointWrapper';
import PaddedAlert from './components/PaddedAlert';
import RunsList from './components/RunsList'
import generateWrapper from './utils/generateWrapper';
import { getSse } from './services/sse';
import { PAGE_LIMIT } from './constants/pagination';
import calculateOffset from './utils/calculateOffset';

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
  const [currMonitor, setCurrMonitor] = useState(null);
  const [runs, setRuns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayWrapper, setDisplayWrapper] = useState(false);
  const [displayRunsList, setDisplayRunsList] = useState(false);
  const [wrapper, setWrapper] = useState('');
  const [errorMessages, addErrorMessage] = useTemporaryMessages(3000);
  const [successMessages, addSuccessMessage] = useTemporaryMessages(3000);
  const [sse, setSse] = useState(null);
  const [listening, setListening] = useState(false);

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

      newSse.addEventListener('newMonitor', (event) => {
        const newMonitor = JSON.parse(event.data);
        console.log('New Monitor:', newMonitor);

        setMonitors(monitors => monitors.concat(newMonitor));
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
        
        setCurrMonitor(currMonitor => {
          if (currMonitor && currMonitor.id === updatedMonitor.id) {
            return updatedMonitor;
          } else {
            return currMonitor;
          }
        })
      });
  
      newSse.addEventListener('newRun', (event) => {
        if (page !== 1) return;

        const newRun = JSON.parse(event.data);
        console.log('New run:', newRun);

        setRuns(runs => {
          if (currMonitor && currMonitor.id === newRun.monitor_id && !runs.find(run => run.id === newRun.id)) {
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
          if (currMonitor && currMonitor.id === updatedRun.monitor_id) {
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
  }, [sse, listening, currMonitor, page]);

  useEffect(() => {
    const fetchRuns = async () => {
      try { 
        const data = await getRuns(currMonitor.id, PAGE_LIMIT, calculateOffset(page, PAGE_LIMIT));
        setRuns(data.runs);
        setTotalPages(data.totalPages);
      } catch (error) {
        handleAxiosError(error);
      }
    }

    if (currMonitor) {
      fetchRuns();
    }
  }, [currMonitor, page]);

  const handleClickNewMonitorButton = (e) => {
    setDisplayAddForm(true);
  };

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
    setPage(1);
    setCurrMonitor(findMonitor(monitorId));
    setDisplayRunsList(true);
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  let componentToRender;

  if (displayAddForm) {
    componentToRender = <AddMonitorForm onSubmitForm={handleClickSubmitNewMonitor} onBack={handleClickBackButton} addErrorMessage={addErrorMessage} />;
  } else if (displayRunsList) {
    componentToRender = <RunsList
      monitor={currMonitor}
      runs={runs}
      onDeleteMonitor={handleClickDeleteMonitor}
      closeRuns={() => setDisplayRunsList(false)}
      page={page}
      onPageChange={handlePageChange}
      totalPages={totalPages} />;
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
      <EndpointWrapper wrapper={wrapper} open={displayWrapper} onClose={handleClosePopover} />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
