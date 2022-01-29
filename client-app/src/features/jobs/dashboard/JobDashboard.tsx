import React from 'react';
import { Grid} from 'semantic-ui-react';
import { Job } from '../../../app/models/job';
import JobDetails from '../details/JobDetails';
import JobList from './JobList';



interface Props {

    jobs: Job[];
    selectedJob : Job | undefined;
    selectJob : (id:string) => void;
    cancelSelectJob:() => void;

}
export default function JobDashboard({jobs , selectJob , selectedJob , cancelSelectJob}:Props){

    return(

        <Grid>

            <Grid.Column width = '4'>
                <JobList jobs ={jobs} selectJob ={selectJob}/>
                
            </Grid.Column>
            <Grid.Column width = '8'>
                {selectedJob &&
                <JobDetails job = {selectedJob} cancelSelectJob={cancelSelectJob}/>}
            </Grid.Column>
        </Grid>
    )
}