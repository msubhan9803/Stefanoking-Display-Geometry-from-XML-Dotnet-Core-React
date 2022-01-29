import React, { useState, useEffect, useRef, createRef } from 'react';
import CanvasView from '../../app/components/CanvasView';

function GeometryDetailView() {
    const [xmlStringState, setXmlStringState] = useState("");
    const [xmlLoading, setXmlLoading] = useState(false);
    const [height, setHeight] = useState(0)
    const rootRef = useRef({
        clientHeight: 0
    });

    useEffect(() => {
        setHeight(rootRef.current.clientHeight)

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
        <div id="container" style={{
            width: "100%",
            height: "auto"
        }}>
            <CanvasView
                canvasWidth={window.innerWidth / 3}
                canvasHeight={window.innerWidth / 3}
                sideCanvasWidth={window.innerWidth / 3}
                sideCanvasHeight={window.innerWidth / 3}
                xmlStringState={xmlStringState}
                loading={xmlLoading}
                canvasColor="#fff"
                column={3}
                shapeText={true}
            />
        </div>
    )
}

export default GeometryDetailView
