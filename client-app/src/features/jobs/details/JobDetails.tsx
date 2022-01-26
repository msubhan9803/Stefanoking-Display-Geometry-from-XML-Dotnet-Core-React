import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Job } from '../../../app/models/job';

interface Props {
    job:Job;
    cancelSelectJob: () => void;
}

export default function JobDetails({job , cancelSelectJob}:Props){

    return(
       <Card fluid>
           <Image src={`/assets/categoryImages/${job.title}.png`} />
           <Card.Content >
               <Card.Header>{job.title}</Card.Header>
               <Card.Meta>
                   <span> {job.date} </span>
               </Card.Meta>
               <Card.Description>
                   {job.description}
                   
               </Card.Description>
           </Card.Content>
           <Card.Content extra>
               <Button.Group widths ='2'>
                   <Button onClick ={cancelSelectJob} basic color = 'black' content ='Go Back' />

               </Button.Group>

           </Card.Content>
       </Card> 
    )
}