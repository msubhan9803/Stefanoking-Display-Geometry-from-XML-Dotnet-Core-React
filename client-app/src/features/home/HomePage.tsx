import React from "react";
import { Container } from "semantic-ui-react";
import CanvasView from '../../app/components/CanvasView.jsx';

export default function HomePage(){
    return(
        <Container fluid style ={{marginTop: '9em'} }>
            <h1 style={{ color: 'white' }}>Welcome</h1>

            <CanvasView />
        </Container>
    )
}