import * as THREE from "three";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import xml2js from 'xml2js';
import degrees_to_radians from '../../helpers/convertDegToRad.js';


const xmlString = `<?xml version="1.0"?>
<Sheet material = "inox" thickness = "1.2" version ="1" dimx = "1200" dimy = "1200">

  <Parts>

        <Part code = "PartTest01" order = "Order1" customer = "Customer1" deliverydate = "28/01/2022">

            <!-- Geometric info of pieces i want to display -->
            <Contours>
                <Contour external = "1">
                    <Path>
                        <Line>
                            <Start X = "0" Y ="0" Z = "0"/>
                            <End X = "50" Y ="0" Z = "0"/>
                        </Line>
                        <Line>
                            <Start X = "50" Y ="0" Z = "0"/>
                            <End X = "50" Y ="50" Z = "0"/>
                        </Line>
                        <Line>
                            <Start X = "50" Y ="50" Z = "0"/>
                            <End X = "0" Y ="50" Z = "0"/>
                        </Line>
                        <Line>
                            <Start X = "0" Y ="50" Z = "0"/>
                            <End X = "0" Y ="0" Z = "0"/>
                        </Line>
                    </Path>
                </Contour>

                <Contour external = "0">
                    <Path>
                        <Arc>
                          <Center X = "5" Y ="5" Z = "0"/>
                          <Radius>10.0</Radius>
                          <Angle>360.0</Angle>
                        </Arc>
                    </Path>
                </Contour>
            </Contours>
        </Part>

        <Part code = "PartTest01" order = "Order1" customer = "Customer1" deliverydate = "28/01/2022">

        <!-- Geometric info of pieces i want to display -->
        <Contours>
            <Contour external = "1">
                <Path>
                    <Line>
                        <Start X = "10" Y ="10" Z = "0"/>
                        <End X = "40" Y ="10" Z = "0"/>
                    </Line>
                    <Line>
                        <Start X = "40" Y ="10" Z = "0"/>
                        <End X = "40" Y ="40" Z = "0"/>
                    </Line>
                    <Line>
                        <Start X = "40" Y ="40" Z = "0"/>
                        <End X = "10" Y ="10" Z = "0"/>
                    </Line>
                </Path>
            </Contour>

            <Contour external = "0">
                <Path>
                    <Arc>
                      <Center X = "25" Y ="25" Z = "0"/>
                      <Radius>5.0</Radius>
                      <Angle>180.0</Angle>
                    </Arc>
                </Path>
            </Contour>
        </Contours>
    </Part>

  </Parts>
  
  <PartReferences>
      <PartReference PartCode = "PartTest01"   posx = "100" posy = "100" angle = "0" mirror = "0"></PartReference>
      <PartReference PartCode = "PartTest01"   posx = "700" posy = "700" angle = "30" mirror = "0"></PartReference>
      <PartReference PartCode = "PartTest02"   posx = "300" posy = "300" angle = "0" mirror = "0"></PartReference>
      <PartReference PartCode = "PartTest03"   posx = "300" posy = "600" angle = "0" mirror = "0"></PartReference>
  </PartReferences>

</Sheet>
`;

function Line({ start, end }) {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      [start, end].map((point) => new THREE.Vector3(...point))
    );
  }, [start, end]);

  return (
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
  console.log("props: ", props)

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
    var parser = new xml2js.Parser();

    parser.parseStringPromise(xmlString).then(function (result) {
      console.dir(result);
      let parts = result["Sheet"]["Parts"][0]["Part"];

      let tempList = [];
      for (let contoursIndex = 0; contoursIndex < parts.length; contoursIndex++) {
        const contours = parts[contoursIndex]["Contours"];

        for (let contourIndex = 0; contourIndex < contours.length; contourIndex++) {
          const contour = contours[contourIndex]["Contour"];

          for (let shapeIndex = 0; shapeIndex < contour.length; shapeIndex++) {
            const shape = contour[shapeIndex]["Path"][0];
            console.log("shape: ", shape)

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

                tempList.push(temp)
              }
            }
          }
        }
      }


      // console.log("tempList: ", tempList)

      setGeometryList(tempList)
    }).catch(function (err) {
      // Failed
    });
  }, []);



  return (
    <div style={{ position: "relative", width: 1000, height: 1000 }}>
      <Canvas orthographic camera={{ zoom: 10, position: [0, 0, 100] }}>
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
