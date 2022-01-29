import React from 'react'
import * as THREE from "three";
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

export default function Line({ start, end, center }) {
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