import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import xml2js from 'xml2js';
import degrees_to_radians from '../../helpers/convertDegToRad.ts';
import { useThree } from '@react-three/fiber';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import Line from './Line.jsx';
import CircleGeometry from './Circle.jsx';
import ChildCanvas from './ChildCanvas.jsx';
import './style.css';
import { arrayMin, arrayMax } from '../../helpers/arrayHelper';

export default function CanvasView(props) {
  const {
    canvasWidth,
    canvasHeight,
    xmlStringState,
    loading,
    canvasColor,
    sideCanvasWidth,
    sideCanvasHeight
  } = props;
  const [geometryListState, setGeometryListState] = useState([]);
  const [individualShapeState, setIndividualShape] = useState([]);
  const [viewPortState, setViewPortState] = useState({
    center: {
      X: 0,
      Y: 0
    },
    zoom: 0
  });
  const [sizes, setSizes] = useState({
    width: canvasWidth,
    height: canvasHeight
  });

  useEffect(() => {
    if (xmlStringState != "") {
      parseFile(xmlStringState)
    }
  }, [xmlStringState]);

  const parseFile = xmlString => {
    var parser = new xml2js.Parser();

    parser.parseStringPromise(xmlString).then(function (result) {
      let parts = result["Sheet"]["Parts"][0]["Part"];

      let tempList = [];// contains parsed each geometry individual
      let shapeList = []; // contains parsed shapes
      let contoursList = []; // contains parsed shapes with in each contour
      for (let contoursIndex = 0; contoursIndex < parts.length; contoursIndex++) {
        const contours = parts[contoursIndex]["Contours"];

        for (let contourIndex = 0; contourIndex < contours.length; contourIndex++) {
          const contour = contours[contourIndex]["Contour"];
          console.log("contour: " + contourIndex, contour)
          let contourArr = [];

          for (let shapeIndex = 0; shapeIndex < contour.length; shapeIndex++) {
            const shape = contour[shapeIndex]["Path"][0];
            console.log("shape: " + shapeIndex, shape)
            let shapeArr = []
            if (shapeIndex == 0) {
              if (Object.keys(shape).every(val => val == "Line")) {
                for (let lineIndex = 0; lineIndex < shape["Line"].length; lineIndex++) {
                  const line = shape["Line"][lineIndex];
                  let temp = {
                    type: "line",
                    start: {
                      X: line["Start"][0]['$']['X'],
                      Y: line["Start"][0]['$']['Y'],
                      Z: line["Start"][0]['$']['Z'],
                    },
                    end: {
                      X: line["End"][0]['$']['X'],
                      Y: line["End"][0]['$']['Y'],
                      Z: line["End"][0]['$']['Z'],
                    }
                  }

                  shapeArr.push(temp)
                  tempList.push(temp)
                }
              } else {
                for (let arcIndex = 0; arcIndex < shape["Arc"].length; arcIndex++) {
                  const arc = shape["Arc"][arcIndex];
                  let temp = {
                    type: "arc",
                    angle: parseFloat(arc["Angle"][0]),
                    center: {
                      X: arc["Center"][0]['$']['X'],
                      Y: arc["Center"][0]['$']['Y'],
                      Z: arc["Center"][0]['$']['Z'],
                    },
                    radius: parseFloat(arc["Radius"][0])
                  }

                  shapeArr.push(temp)
                  tempList.push(temp)
                }
              }
            } else if (shapeIndex > 0) {
              // Here we will calculate center point of child shapes
              let parentShape = null;
              console.log("here shapeList: ", shapeList)
              for (let index = 0; index < shapeList.length; index++) {
                const shape = shapeList[index];
                if (
                  shape.contourIndex == contourIndex &&
                  shape.contoursIndex == contoursIndex &&
                  shape.shapeIndex == (shapeIndex - 1)
                ) {
                  parentShape = shape;
                }
              }
              let parentCoordinates = [];
              for (let index = 0; index < parentShape.list.length; index++) {
                const element = parentShape.list[index];
                if (element.type == "line") {
                  parentCoordinates.push([
                    parseInt(element.start.X),
                    parseInt(element.start.Y),
                    parseInt(element.start.Z),
                  ])
                  parentCoordinates.push([
                    parseInt(element.end.X),
                    parseInt(element.end.Y),
                    parseInt(element.end.Z),
                  ])
                } else {
                  parentCoordinates.push([
                    parseInt(element.center.X),
                    parseInt(element.center.Y),
                    parseInt(element.center.Z),
                  ])
                }
              }
              console.log("parentCoordinates: ", parentCoordinates)
              let parentCenterCoordinates = getCenterCoord(parentCoordinates)

              if (Object.keys(shape).every(val => val == "Line")) {
                for (let lineIndex = 0; lineIndex < shape["Line"].length; lineIndex++) {
                  const line = shape["Line"][lineIndex];
                  let startX = parseInt(line["Start"][0]['$']['X']);
                  let startY = parseInt(line["Start"][0]['$']['Y']);
                  let startZ = parseInt(line["Start"][0]['$']['Z']);
                  let endX = parseInt(line["End"][0]['$']['X']);
                  let endY = parseInt(line["End"][0]['$']['Y']);
                  let endZ = parseInt(line["End"][0]['$']['Z']);

                  console.log('startX: ', startX)
                  console.log('endX: ', endX)
                  let distanceX = (startX + endX) / 2;
                  let distanceY = (startY + endY) / 2;
                  let distanceZ = (startZ + endZ) / 2;

                  let temp = {
                    type: "line",
                    // start: {
                    //   X: parseInt(parentCenterCoordinates[0]) - distanceX,
                    //   Y: parseInt(parentCenterCoordinates[1]) - distanceY,
                    //   Z: parseInt(parentCenterCoordinates[2]) - distanceZ,
                    // },
                    // end: {
                    //   X: parseInt(parentCenterCoordinates[0]) + distanceX,
                    //   Y: parseInt(parentCenterCoordinates[1]) + distanceY,
                    //   Z: parseInt(parentCenterCoordinates[2]) + distanceZ,
                    // },
                    start: {
                      X: line["Start"][0]['$']['X'],
                      Y: line["Start"][0]['$']['Y'],
                      Z: line["Start"][0]['$']['Z'],
                    },
                    end: {
                      X: line["End"][0]['$']['X'],
                      Y: line["End"][0]['$']['Y'],
                      Z: line["End"][0]['$']['Z'],
                    },
                    center: {
                      X: parentCenterCoordinates[0],
                      Y: parentCenterCoordinates[1],
                      Z: parentCenterCoordinates[2],
                    }
                  }

                  console.log("temp: ", temp)

                  shapeArr.push(temp)
                  tempList.push(temp)
                }
              } else {
                for (let arcIndex = 0; arcIndex < shape["Arc"].length; arcIndex++) {
                  const arc = shape["Arc"][arcIndex];
                  let temp = {
                    type: "arc",
                    angle: parseFloat(arc["Angle"][0]),
                    center: {
                      X: parentCenterCoordinates[0],
                      Y: parentCenterCoordinates[1],
                      Z: parentCenterCoordinates[2],
                    },
                    radius: parseFloat(arc["Radius"][0])
                  }

                  shapeArr.push(temp)
                  tempList.push(temp)
                }
              }
            }

            shapeList.push({
              contourIndex: contourIndex,
              contoursIndex: contoursIndex,
              shapeIndex: shapeIndex,
              list: shapeArr
            })
            contourArr.push(shapeArr)
          }

          contoursList.push(contourArr)
        }
      }

      let x = [];
      let y = [];
      let z = [];
      for (let index = 0; index < tempList.length; index++) {
        const elem = tempList[index];
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
      // Set Min max
      setViewPortState(temp);

      console.log("contoursList: ", contoursList)
      console.log("shapeList: ", shapeList)
      console.log("tempList: ", tempList)

      setIndividualShape(contoursList);
      setGeometryListState(tempList)

      // for (let index = 0; index < contoursList.length; index++) {
      //   const contours = contoursList[index];
      //   for (let index = 0; index < contours.length; index++) {
      //     const shape = contours[index];
      //     for (let index = 0; index < shape.length; index++) {
      //       const geometry = shape[index];
      //       console.log(geometry)
      //     }
      //   }
      // }
    }).catch(function (err) {
      // Failed
    });
  }

  const getCenterCoord = function (arr) {
    var minX, maxX, minY, maxY, minZ, maxZ;
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i][0], y = arr[i][1], z = arr[i][2];
      minX = (x < minX || minX == null) ? x : minX;
      maxX = (x > maxX || maxX == null) ? x : maxX;
      minY = (y < minY || minY == null) ? y : minY;
      maxY = (y > maxY || maxY == null) ? y : maxY;
      if (minZ > 0 && maxZ > 0) {
        minZ = (y < minZ || minZ == null) ? y : minZ;
        maxZ = (y > maxZ || maxZ == null) ? y : maxZ;
      } else {
        minZ = 0;
        maxZ = 0;
      }
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
  };

  return (
    <>
      {/* Main Canvas */}
      <div className="parent" style={{
        height: sizes.height,
        width: sizes.width,
        backgroundColor: canvasColor,
        display: "flex",
        flexDirection: "row",
        float: "left"
      }}>
        {
          !loading ?
            <Canvas orthographic camera={{ zoom: viewPortState.zoom }} className="canvas">
              <mesh visible
                position={[
                  viewPortState.center.X,
                  viewPortState.center.Y,
                  0
                ]}
              >
                {
                  geometryListState.map((child, index) => (
                    <>
                      {
                        child.type == "line" ?
                          child.center ?
                            <Line
                              key={index}
                              start={[
                                child.start.X,
                                child.start.Y,
                                child.start.Z
                              ]}
                              end={[
                                child.end.X,
                                child.end.Y,
                                child.end.Z
                              ]}
                              center={child.center}
                            />
                            :
                            <Line
                              key={index}
                              start={[
                                child.start.X,
                                child.start.Y,
                                child.start.Z
                              ]}
                              end={[
                                child.end.X,
                                child.end.Y,
                                child.end.Z
                              ]}
                            />
                          :
                          <CircleGeometry
                            key={index}
                            radius={child.radius}
                            center={child.center}
                            angle={degrees_to_radians(child.angle)}
                          />
                      }
                    </>
                  ))
                }
              </mesh>
            </Canvas >
            : (
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: "center",
                height: "100%"
              }}>
                <Loader active inline />
              </div>
            )
        }
      </div>

      {/* Side Canvas */}

      <div style={{
        // height: sideCanvasHeight,
        // width: sideCanvasWidth,
        // backgroundColor: canvasColor,
        display: "flex",
        flexDirection: "column",
        float: "left"
      }}>
        {
          !loading ?
            <>
              {
                individualShapeState.map((shape, stIndex) => (
                  <>
                    {
                      shape.map((element, sIndex) => (
                        <>
                          <ChildCanvas
                            state={element}
                            canvasWidth={100}
                            canvasHeight={100}
                            sideCanvasWidth={window.innerWidth / 3 / 2}
                            sideCanvasHeight={window.innerWidth / 3}
                            xmlStringState={xmlStringState}
                            canvasColor="#fff"
                          />
                        </>
                      ))
                    }
                  </>
                ))
              }
            </>
            : (
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: "center",
                height: "100%"
              }}>
                <Loader active inline />
              </div>
            )
        }
      </div>
    </>
  );
}