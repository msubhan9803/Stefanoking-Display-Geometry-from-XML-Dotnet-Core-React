import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Job } from '../models/job';
import NavBar from './NavBar';
import JobDashboard from '../../features/jobs/dashboard/JobDashboard';
import ParentView from '../../features/Geometry/ParentView';
import HomePage from '../../features/home/HomePage';
import { Route } from 'react-router-dom';
import GeometryDetailView from '../../features/Geometry/GeometryDetailView';

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
        <Route
          path='/geometry-view'
          render={(props) => (
            <ParentView />
          )}
        />
        <Route
          path='/geometry-detial-view'
          render={(props) => (
            <GeometryDetailView />
          )}
        />
      </Container>
    </div>
  );
}

export default App;
