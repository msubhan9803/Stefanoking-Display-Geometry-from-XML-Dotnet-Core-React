import * as THREE from "three";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import xml2js from 'xml2js';
import degrees_to_radians from '../../helpers/convertDegToRad.js';

function Line({ start, end, center }) {
  console.log("center: ", center)
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      [start, end].map((point) => new THREE.Vector3(...point))
    );
  }, [start, end]);

  return (
    // <>
    //   {
    //     center ?
    //       <mesh visible userData={{ test: "hello" }} position={[
    //         center.X,
    //         center.Y,
    //         center.Z
    //       ]}>
    //         <line ref={ref}>
    //           <bufferGeometry />
    //           <lineBasicMaterial color="hotpink" />
    //         </line>
    //       </mesh>
    //       :
    //       <line ref={ref}>
    //         <bufferGeometry />
    //         <lineBasicMaterial color="hotpink" />
    //       </line>
    //   }
    // </>
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>

  );
}

function Sphere() {
  return (
    <mesh visible userData={{ test: "hello" }} position={[5 - Math.random() * 10, 5 - Math.random() * 10, 5 - Math.random() * 10]}>
      <sphereGeometry attach="geometry" args={[5, 16, 16]} />
      {/* <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      /> */}
    </mesh>
  );
}

function CircleGeometry(props) {
  const { radius, center, angle } = props;

  return (
    <mesh visible userData={{ test: "hello" }} position={[
      center.X,
      center.Y,
      center.Z
    ]}>
      <circleGeometry attach="geometry" args={[radius, 78, 0, angle]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function CanvasView() {
  const NUM = 30;
  const spheres = new Array(NUM).fill();
  const [geometryList, setGeometryList] = useState([]);

  var coords = [
    [0, 0, 0],
    [100, 0, 0],
    [100, 100, 0],
    // [0, 100, 0],
  ];

  const center = function (arr) {
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

  useEffect(() => {
    const url = 'http://localhost:5000/Example';
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url);

    // If specified, responseType must be empty string or "document"
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        // console.log(xhr.response);
        // console.log(xhr.responseXML);
        const serializer = new XMLSerializer();
        const xmlStr = serializer.serializeToString(xhr.responseXML);

        parseFile(xmlStr)
      }
    };

    xhr.send();
  }, []);

  const parseFile = xmlString => {
    var parser = new xml2js.Parser();

    parser.parseStringPromise(xmlString).then(function (result) {
      console.dir(result);
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
              let parentCenterCoordinates = center(parentCoordinates)

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

      console.log("contoursList: ", contoursList)
      console.log("shapeList: ", shapeList)

      setGeometryList(tempList)
    }).catch(function (err) {
      // Failed
    });
  }

  return (
    <div style={{ position: "relative", width: 1200, height: 1200, float: "left" }}>
      <Canvas orthographic camera={{ zoom: 3 }} style={{ backgroundColor: "white", float: "left", width: 600, height: 600 }}>
        {/* <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} /> */}
        {/* <Line start={[2, 0, 0]} end={[10, 0, 0]} />
      <Line start={[2, 0, 0]} end={[2, 2, 0]} /> */}

        {/* <a.mesh>
      <sphereBufferGeometry start={[2, 0, 0]} attach="geometry" args={[1, 32, 32]} />
    </a.mesh> */}

        {/* <Sphere /> */}
        {/* <CircleGeometry /> */}

        {
          geometryList.map((child, index) => (
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
      </Canvas >
    </div>
  );
}
