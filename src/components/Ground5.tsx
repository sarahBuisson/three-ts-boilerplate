

import { useTexture } from "@react-three/drei";
import { CuboidCollider, HeightfieldCollider, RigidBody } from "@react-three/rapier";
import { PlaneGeometry, Texture } from 'three';
import React from 'react';

const heightFieldHeight = 100;
const heightFieldWidth = 100;
const heightField = Array.from({
    length: heightFieldHeight * heightFieldWidth
}).map((_, index) => {
    return Math.random()*2-2;
});

const heightFieldGeometry = new PlaneGeometry(
    heightFieldWidth,
    heightFieldHeight,
    heightFieldWidth - 1,
    heightFieldHeight - 1
);

heightField.forEach((v, index) => {
    heightFieldGeometry.attributes.position.array[index * 3 + 2] = v;
});
heightFieldGeometry.scale(1, -1, 1);
heightFieldGeometry.rotateX(-Math.PI / 2);
heightFieldGeometry.rotateY(-Math.PI / 2);
heightFieldGeometry.computeVertexNormals();

export function Ground5(){
    let args = [
        heightFieldWidth - 1,
        heightFieldHeight - 1,
        heightField,
        { x: heightFieldWidth, y: 1, z: heightFieldHeight }
    ];
    console.log(args)
    return  <RigidBody colliders={false} position={[0, -8, 0]}>
    <mesh geometry={heightFieldGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial color="orange" side={2} />
    </mesh>
    <HeightfieldCollider
        args={args}
    />
</RigidBody>}
