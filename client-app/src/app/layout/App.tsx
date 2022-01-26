import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Job } from '../models/job';
import NavBar from './NavBar';
import JobDashboard from '../../features/jobs/dashboard/JobDashboard';
import HomePage from '../../features/home/HomePage';
import { Route } from 'react-router-dom';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

  useEffect(() => {
    axios.get<Job[]>('http://localhost:5000/api/jobs').then(response => {
      setJobs(response.data);

    });
  }, []);  //runs only one time ,[] so it doesn't loop

  function handleSelectJob(id: string) {
    setSelectedJob(jobs.find(x => x.id === id));
  }


  function handleCancelSelectJob() {
    setSelectedJob(undefined);
  }

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '9em' }}>
        <Container fluid>
          <Route exact path='/' component={HomePage} />
        </Container>

        <Route
          path='/jobs'
          render={(props) => (
            <JobDashboard jobs={jobs}
              selectedJob={selectedJob}
              selectJob={handleSelectJob}
              cancelSelectJob={handleCancelSelectJob} />
          )}
        />

      </Container>
    </div>
  );
}

export default App;
