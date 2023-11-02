import { useState, useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useTemporaryMessages from './hooks/useTemporaryMessages';
import { createJob, getJobs, deleteJob, updateJob } from './services/jobs';
import JobsList from './components/JobsList';
import Header from './components/Header';
import AddJobForm from './components/AddJobForm';
import EndpointWrapper from './components/EndpointWrapper';
import PaddedAlert from './components/PaddedAlert';
import RunsList from './components/RunsList'
import EditForm from './components/EditForm';
import CreateUserForm from './components/CreateUserForm';
import generateWrapper from './utils/generateWrapper';
import { getSse } from './services/sse';
import { THEME_COLOR, FONT_COLOR } from './constants/colors';
import { createUser } from './services/users';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Lato, sans-serif',
    },
    body1: {
      color: FONT_COLOR,
      fontSize: 21,
    },
    body2: {
      color: FONT_COLOR,
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: THEME_COLOR,
    }
  }
});

const App = () => {
  const [jobs, setJobs] = useState([]);
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
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const newSse = getSse();

    newSse.onerror = (error) => {
      console.log('An error occured establishing an SSE connection.');
      newSse.close();
    };

    newSse.addEventListener('newMonitor', (event) => {
      const newJob = JSON.parse(event.data);
      console.log('New Job:', newJob);

      setJobs(jobs => {
        if (!jobs.find(job => job.id === newJob.id)) {
          return jobs.concat(newJob)
        } else {
          return jobs;
        }
      });
    });

    newSse.addEventListener('updatedMonitor', (event) => {
      const updatedJob = JSON.parse(event.data);
      console.log('Updated monitor:', updatedJob);

      setJobs(jobs => jobs.map(job => {
        if (job.id === updatedJob.id) {
          return updatedJob;
        } else {
          return job;
        }
      }));
    });

    return () => {
      if (newSse) {
        console.log('closing job sse')
        newSse.close();
      }
    }
  }, []);

  const handleClickSubmitNewJob = async (jobData) => {
    try { 
      const newJob = await createJob(jobData);
      const wrapper = generateWrapper(newJob);
      setJobs(() => jobs.concat(newJob))
      setWrapper(wrapper);
      setDisplayWrapper(true);
      addSuccessMessage('Job created successfully');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClosePopover = () => {
    setDisplayWrapper(false);
    setWrapper('');
  };

  const handleClickDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(() => jobs.filter(({ id }) => id !== jobId));
      addSuccessMessage('Job deleted successfully')
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClickEditJob = async (id, jobData) => {
    try {
      const updatedJob = await updateJob(id, jobData);
      
      setJobs(() => {
        console.log('jobs:', jobs[0].id, updatedJob.id)
        return jobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      })
      addSuccessMessage('Job updated successfully.');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      console.log(userData);
      // await createUser(userData);
      addSuccessMessage('User added');
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
            <JobsList 
              jobs={jobs}
              onDelete={handleClickDeleteJob} 
              onSubmit={handleClickEditJob}
            />} />
          <Route path='/create-user' element={
            <CreateUserForm
              onSubmitCreateUserForm={handleCreateUser} 
              addErrorMessage={addErrorMessage}
            />
          }/>
          <Route path="/add" element={
            <AddJobForm 
              onSubmitAddForm={handleClickSubmitNewJob} 
              addErrorMessage={addErrorMessage} />} />
          <Route path="/jobs/edit/:id" element={
            <EditForm 
              onSubmitEditForm={handleClickEditJob} 
              addErrorMessage={addErrorMessage}
            />} />
          <Route path="/jobs/:id" element={
            <RunsList 
              onDelete={handleClickDeleteJob} 
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
