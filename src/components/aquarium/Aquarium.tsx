import React, { useState } from 'react';
import { BoxGeometry, DoubleSide, Material, Matrix4, Mesh, SphereGeometry } from 'three';
import { CSG } from 'three-csg-ts';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { deform } from './DeformedBox';

class AquariumGeometrie {
    constructor(public bocal: BufferGeometry,
                public water: BufferGeometry,
                public sand1: BufferGeometry,
                public sand2: BufferGeometry,
                public sand3: BufferGeometry) {
    }

}

function generateAquariumGeometrie(props: {
    radius: number;
    epaisseur: number;
    waterLevel?: number;
    material?: Material
}): AquariumGeometrie {

console.log("generateAquariumGeometrie")
    // Créer la première sphère
    const openingSphere = new Mesh(new SphereGeometry(props.radius, 32, 32));
    const openingView = new Mesh(new SphereGeometry(props.radius, 32, 32));
    const insideSphere = new Mesh(new SphereGeometry(props.radius - props.epaisseur, 32, 32));
    const surfaceBox = new Mesh(new BoxGeometry(props.radius * 2, props.radius * 2, props.radius * 2, 32, 32));

    const sandBox1 = new Mesh(deform(new BoxGeometry(props.radius * 2,  4, props.radius * 2, 32, 32)));
    const sandBox2 = new Mesh(deform(new BoxGeometry(props.radius * 2, 4, props.radius * 2, 32, 32)));
    const sandBox3 = new Mesh(deform(new BoxGeometry(props.radius * 2, 4, props.radius * 2, 32, 32)));


    //sphere1.position.set(15, -20, 15); // Position de la première sphère
    // sphere1.translateOnAxis(new Vector3(10, 10, 10), 1)
    // Créer la deuxième sphère
    const outsideSphere = new Mesh(new SphereGeometry(props.radius, 32, 32));
    // sphere2.translateOnAxis(new Vector3(1, 1, 0), 10) // Position de la deuxième sphère
    surfaceBox.applyMatrix4(new Matrix4().makeTranslation(
        0,
        (props.waterLevel || props.radius),
        0
    ));
    openingSphere.applyMatrix4(new Matrix4().makeTranslation(
        0,
        3 * props.radius / 2,
        0
    ))
    openingView.applyMatrix4(new Matrix4().makeTranslation(
        0,
        0,
        -3 * props.radius / 2
    ))
    sandBox1.applyMatrix4(new Matrix4().makeTranslation(
        0,
        3,
        0
    ))
    sandBox2.applyMatrix4(new Matrix4().makeTranslation(
        0,
        2,
        0
    ))
    sandBox3.applyMatrix4(new Matrix4().makeTranslation(
        0,
        1,
        0
    ))
    console.log(outsideSphere.position)
    // Appliquer la soustraction
    const openingCsg = CSG.fromMesh(openingSphere);
    const outsideCsg = CSG.fromMesh(outsideSphere);
    const insideCsg = CSG.fromMesh(insideSphere);
    const openingViewCsg = CSG.fromMesh(openingView);
    const subtractedCSG = outsideCsg.subtract(openingCsg).subtract(insideCsg).subtract(openingViewCsg);
    const sandCsg1 = CSG.fromMesh(sandBox1).intersect(insideCsg).subtract( CSG.fromMesh(sandBox3)).subtract( CSG.fromMesh(sandBox2));
    const sandCsg2 = CSG.fromMesh(sandBox2).intersect(insideCsg).subtract( CSG.fromMesh(sandBox3));
    const sandCsg3 = CSG.fromMesh(sandBox3).intersect(insideCsg);

    // Retourner la géométrie résultante
    // return sphere2.geometry//
    return {
        bocal: subtractedCSG.toGeometry(outsideSphere.matrix),
        water: insideCsg.subtract(CSG.fromMesh(surfaceBox)).toGeometry(insideSphere.matrix),
        sand1: sandCsg1.toGeometry(insideSphere.matrix),
        sand2: sandCsg2.toGeometry(insideSphere.matrix),
        sand3: sandCsg3.toGeometry(insideSphere.matrix),
    };

}


export function Aquarium(props: { radius: number, epaisseur: number, waterLevel?: number, material?: Material }) {


    const [geometries, setGeometries] = useState<AquariumGeometrie>()
    if (geometries == null)
        setGeometries(generateAquariumGeometrie(props))


    return (
        <>
            <mesh geometry={geometries?.bocal} castShadow>
                <meshStandardMaterial color="white" transparent={true}
                                      opacity={0.4} metalness={0.5}
                                      roughness={0}
                                      side={DoubleSide}/>

            </mesh>
            <mesh geometry={geometries?.water} castShadow>

                <meshStandardMaterial color="lightblue" transparent={true}
                                      opacity={0.4} metalness={0.5} roughness={0}
                                      side={DoubleSide}/>

            </mesh>
            <mesh geometry={geometries?.sand1} castShadow receiveShadow>

                <meshPhysicalMaterial color="orange"
                                      metalness={0.5}
                                      roughness={0}
                                      side={DoubleSide}/>

            </mesh>
            <mesh geometry={geometries?.sand2} castShadow receiveShadow>

                <meshPhysicalMaterial color="yellow" metalness={0.5} roughness={0} side={DoubleSide}/>

            </mesh>
            <mesh geometry={geometries?.sand3} castShadow receiveShadow>

                <meshPhysicalMaterial color="darkyellow" metalness={0.5} roughness={0} side={DoubleSide}/>

            </mesh>
        </>

    );

}

export function Aquarium2() {
    const waterRef = React.useRef<Mesh>(null);

    // Animate the water surface
    useFrame(() => {
        if (waterRef.current) {
            waterRef.current.rotation.z += 0.001; // Slight rotation for a ripple effect
        }
    });

    return (
        <>
            {/* Aquarium walls */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[10, 5, 10]}/>
                <meshStandardMaterial
                    color="lightblue"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Water surface */}
            <mesh ref={waterRef} position={[0, 2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[9.8, 9.8]}/>
                <meshStandardMaterial color="blue" transparent opacity={0.5}/>
            </mesh>

            {/* Example fish or decoration */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]}/>
                <meshStandardMaterial color="orange"/>
            </mesh>
        </>
    );
}
