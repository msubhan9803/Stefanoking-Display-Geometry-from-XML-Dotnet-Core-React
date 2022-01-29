import React, { useEffect, useState } from 'react';
import { Button, Card, Image, Grid } from 'semantic-ui-react';
import { Job } from '../../../app/models/job';
import CanvasView from '../../../app/components/CanvasView.jsx';
import { Link } from "react-router-dom";
interface Props {
    job: Job;
    cancelSelectJob: () => void;
}

export default function JobDetails({ job, cancelSelectJob }: Props) {
    const [xmlStringState, setXmlStringState] = useState("");
    const [xmlLoading, setXmlLoading] = useState(false);

    useEffect(() => {
        setXmlLoading(true);
        // Load XML
        const url = 'http://localhost:5000/Example';
        var xhr = new XMLHttpRequest;
        xhr.open('GET', url);

        // If specified, responseType must be empty string or "document"
        xhr.responseType = 'document';

        // Force the response to be parsed as XML
        xhr.overrideMimeType('text/xml');

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.responseXML) {
                // console.log(xhr.response);
                // console.log(xhr.responseXML);
                const serializer = new XMLSerializer();
                const xmlStr = serializer.serializeToString(xhr.responseXML);

                setXmlStringState(xmlStr)
                setXmlLoading(false);
            }
        };

        xhr.send();
    }, []);

    return (
        <Card fluid>
            <Card.Header>
                <Link to="/geometry-view">
                    <Grid columns={3} style={{
                        margin: "0px"
                    }}>
                        <Grid.Row>
                            {[0, 1, 2, 3, 4].map(item => (
                                <Grid.Column style={{ paddingBottom: "4px" }}>
                                    <CanvasView
                                        canvasWidth={100}
                                        canvasHeight={100}
                                        sideCanvasWidth={50}
                                        sideCanvasHeight={100}
                                        xmlStringState={xmlStringState}
                                        loading={xmlLoading}
                                        canvasColor="#fff"
                                    />
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                </Link>
            </Card.Header>
            {/* <Image src={`/assets/categoryImages/${job.title}.png`} /> */}
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
                <Button.Group widths='2'>
                    <Button onClick={cancelSelectJob} basic color='black' content='Go Back' />

                </Button.Group>

            </Card.Content>
        </Card>
    )
}