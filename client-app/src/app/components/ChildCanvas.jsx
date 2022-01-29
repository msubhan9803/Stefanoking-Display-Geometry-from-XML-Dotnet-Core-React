import React from 'react';
import { Canvas } from "@react-three/fiber";
import Line from './Line.jsx';
import CircleGeometry from './Circle.jsx';
import { useState } from 'react';
import degrees_to_radians from '../../helpers/convertDegToRad.ts';
import { useEffect } from 'react';
import { arrayMin, arrayMax } from '../../helpers/arrayHelper';

export default function ChildCanvas(props) {
    const {
        state,
        canvasWidth,
        canvasHeight,
        xmlStringState,
        loading,
        canvasColor,
        sideCanvasWidth,
        sideCanvasHeight
    } = props;
    const [viewPortState, setViewPortState] = useState({
        center: {
            X: 0,
            Y: 0
        },
        zoom: 0
    });
    const [tempState, setTempstate] = useState([
        {
            type: "line",
            start: {
                X: "0",
                Y: "0",
                Z: "0"
            },
            end: {
                X: "100",
                Y: "0",
                Z: "0"
            }
        },
        {
            type: "line",
            start: {
                X: "100",
                Y: "0",
                Z: "0"
            },
            end: {
                X: "100",
                Y: "100",
                Z: "0"
            }
        },
        {
            type: "line",
            start: {
                X: "100",
                Y: "100",
                Z: "0"
            },
            end: {
                X: "0",
                Y: "100",
                Z: "0"
            }
        },
        {
            type: "line",
            start: {
                X: "0",
                Y: "100",
                Z: "0"
            },
            end: {
                X: "0",
                Y: "0",
                Z: "0"
            }
        }
    ]);
    const [sizes, setSizes] = useState({
        width: canvasWidth,
        height: canvasHeight
    });

    useEffect(() => {
        console.log(state)
        let x = [];
        let y = [];
        let z = [];
        for (let index = 0; index < state.length; index++) {
            const shape = state[index];
            for (let index = 0; index < shape.length; index++) {
                const elem = shape[index];
                if (elem.type == "line") {
                    x.push(parseFloat(elem.start.X))
                    x.push(parseFloat(elem.end.X))
                    y.push(parseFloat(elem.start.Y))
                    y.push(parseFloat(elem.end.Y))
                    z.push(parseFloat(elem.start.Z))
                    z.push(parseFloat(elem.end.Z))
                } else {
                    x.push(parseFloat(elem.center.X))
                    y.push(parseFloat(elem.center.Y))
                    z.push(parseFloat(elem.center.Z))
                }
            }
        }
        let xMin = arrayMin(x)
        let xMax = arrayMax(x)

        let yMin = arrayMin(y)
        let yMax = arrayMax(y)

        let zMin = arrayMin(z)
        let zMax = arrayMax(z)
        let zoom = parseFloat((sizes.width / (xMax + 5)).toFixed(2));

        let temp = {
            center: {
                X: (xMin + xMax) > 0 ? -(xMin + xMax) / 2 : (xMin + xMax) / 2,
                Y: (yMin + yMax) > 0 ? -(yMin + yMax) / 2 : (yMin + yMax) / 2
            },
            zoom: zoom
        }
        console.log("temp: ", temp)
        // Set Min max
        setViewPortState(temp);
    }, []);

    return (
        <div className="parent" style={{
            height: canvasHeight,
            width: canvasWidth,
            backgroundColor: canvasColor,
            display: "flex",
            flexDirection: "row",
            float: "left"
        }}>
            <Canvas orthographic camera={{ zoom: viewPortState.zoom }} className="canvas">
                <mesh visible
                    position={[
                        viewPortState.center.X,
                        viewPortState.center.Y,
                        0
                    ]}
                >
                    {
                        state.map((shape, gIndex) => (
                            <>
                                {
                                    shape.map((geometry, index) => (
                                        <>
                                            {
                                                geometry.type == "line" ?
                                                    geometry.center ?
                                                        <Line
                                                            key={`${gIndex}`}
                                                            start={[
                                                                geometry.start.X,
                                                                geometry.start.Y,
                                                                geometry.start.Z
                                                            ]}
                                                            end={[
                                                                geometry.end.X,
                                                                geometry.end.Y,
                                                                geometry.end.Z
                                                            ]}
                                                            center={geometry.center}
                                                        />
                                                        :
                                                        <Line
                                                            key={`${gIndex}`}
                                                            start={[
                                                                geometry.start.X,
                                                                geometry.start.Y,
                                                                geometry.start.Z
                                                            ]}
                                                            end={[
                                                                geometry.end.X,
                                                                geometry.end.Y,
                                                                geometry.end.Z
                                                            ]}
                                                        />
                                                    :
                                                    <CircleGeometry
                                                        key={`${gIndex}`}
                                                        radius={geometry.radius}
                                                        center={geometry.center}
                                                        angle={degrees_to_radians(geometry.angle)}
                                                    />
                                            }
                                        </>
                                    ))
                                }
                            </>
                        ))
                    }
                </mesh>
            </Canvas>
        </div>
    )
}
