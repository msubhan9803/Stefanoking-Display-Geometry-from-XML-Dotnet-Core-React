import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import CanvasView from '../../app/components/CanvasView';
import './style.css';

const ParentView = () => {
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
        <div>
            <Grid columns={4} className="grid" padded='vertically' style={{
                height: "100%",
                width: "100%",
                border: "3px solid rgb(68 93 154)",
                // margin: "4px"
            }}>
                {/* <Grid.Row> */}
                {[0, 1].map(item => (
                    <Grid.Column>
                        <div style={{
                            border: "3px solid rgb(68 93 154)",
                            width: "100%",
                            minHeight: "150px",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <div style={{padding: "16px", backgroundColor: "#fff"}}>
                                <CanvasView
                                    canvasWidth={100}
                                    canvasHeight={100}
                                    sideCanvasWidth={100}
                                    sideCanvasHeight={100}
                                    xmlStringState={xmlStringState}
                                    loading={xmlLoading}
                                    canvasColor="#fff"
                                    column={3}
                                    shapeText={false}
                                />
                            </div>
                            <div>
                                <Link to="/geometry-detial-view">
                                    <Button style={{
                                        color: "#fff !important",
                                        backgroundColor: "transparent",
                                        border: "2px solid rgb(68 93 154)",
                                        float: "right",
                                        padding: "5px",
                                        marginTop: "8px",
                                        marginBottom: "8px",
                                        marginRight: "4px"
                                    }}>
                                        More Info
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Grid.Column>
                ))}
                {/* </Grid.Row> */}
            </Grid>
        </div>
    )
};

export default ParentView;
