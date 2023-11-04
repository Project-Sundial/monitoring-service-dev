import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import JobsList from './JobsList';
import AddJobForm from './AddJobForm';
import EditForm from './EditForm';
import RunsList from './RunsList';
import EndpointWrapper from './EndpointWrapper';
import { getJobs, createJob, deleteJob, updateJob } from '../services/jobs';
import { getSse } from '../services/sse';
import generateWrapper from '../utils/generateWrapper';

const MainPage = ({ onAxiosError, addErrorMessage, addSuccessMessage }) => {
  const [jobs, setJobs] = useState([]);
  const [displayWrapper, setDisplayWrapper] = useState(false);
  const [wrapper, setWrapper] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        onAxiosError(error);
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
      onAxiosError(error);
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
      onAxiosError(error);
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
      onAxiosError(error);
    }
  };

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <JobsList 
              jobs={jobs}
              onDelete={handleClickDeleteJob} 
              onSubmit={handleClickEditJob}
            />} 
        />
        <Route 
          path="/add" 
          element={
            <AddJobForm 
              onSubmitAddForm={handleClickSubmitNewJob} 
              addErrorMessage={addErrorMessage} 
            />} 
        />
        <Route 
          path="/edit/:id" 
          element={
            <EditForm 
              onSubmitEditForm={handleClickEditJob} 
              addErrorMessage={addErrorMessage}
            />} 
        />
        <Route 
          path="/:id" 
          element={
            <RunsList 
              onDelete={handleClickDeleteJob} 
              onError={onAxiosError}
            />} 
        />
      </Routes>
      <EndpointWrapper
        wrapper={wrapper}
        open={displayWrapper}
        onClose={handleClosePopover}
      />
    </>
  );
};

export default MainPage;
