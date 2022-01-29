import React from 'react';

export default function CircleGeometry(props) {
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