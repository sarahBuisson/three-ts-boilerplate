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
                public sand3: BufferGeometry,
                public debug?: {
                    surfaceBox?: BufferGeometry,
                    sandBox1?: BufferGeometry,
                    sandBox2?: BufferGeometry,
                    sandBox3?: BufferGeometry,
                    smallinsideSphere?: BufferGeometry
                }) {
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
    let radius = props.radius;
    let diametre = radius * 2;
    const openingSphere = new Mesh(new SphereGeometry(radius, radius, radius));
    const openingView = new Mesh(new SphereGeometry(radius, radius, radius));
    const insideSphere = new Mesh(new SphereGeometry(radius - props.epaisseur, radius, radius));
    const smallinsideSphere = new Mesh(new SphereGeometry(radius - props.epaisseur - 1, radius, radius));

    const surfaceBox = new Mesh(new BoxGeometry(diametre, diametre, diametre, radius, radius));

    const sandBox1 = new Mesh(deform(new BoxGeometry(diametre, diametre, diametre, radius / 2, 3, radius / 2), radius));
    const sandBox2 = new Mesh(deform(new BoxGeometry(diametre, diametre, diametre, radius / 2, 3, radius / 2), radius,1));
    const sandBox3 = new Mesh(deform(new BoxGeometry(diametre, diametre, diametre, radius / 2, 3, radius / 2), radius,2));


    //sphere1.position.set(15, -20, 15); // Position de la première sphère
    // sphere1.translateOnAxis(new Vector3(10, 10, 10), 1)
    // Créer la deuxième sphère
    const outsideSphere = new Mesh(new SphereGeometry(radius, radius, radius));
    // sphere2.translateOnAxis(new Vector3(1, 1, 0), 10) // Position de la deuxième sphère
    surfaceBox.applyMatrix4(new Matrix4().makeTranslation(
        0,
        (props.waterLevel || radius),
        0
    ));
    openingSphere.applyMatrix4(new Matrix4().makeTranslation(
        0,
        3 * radius / 2,
        0
    ))
    openingView.applyMatrix4(new Matrix4().makeTranslation(
        0,
        radius /3,
        - radius
    ))

    sandBox1.applyMatrix4(new Matrix4().makeTranslation(
        0,
        Math.round(5 - radius  *1.5),
        0
    ))
    sandBox2.applyMatrix4(new Matrix4().makeTranslation(
        0,
        Math.round(3 - radius *1.5),
        0
    ))
    sandBox3.applyMatrix4(new Matrix4().makeTranslation(
        0,
        Math.round(1 - radius  *1.5),
        0
    ))
    console.log(outsideSphere.position)
    // Appliquer la soustraction
    const openingCsg = CSG.fromMesh(openingSphere);
    const outsideCsg = CSG.fromMesh(outsideSphere);
    const insideCsg = CSG.fromMesh(insideSphere);
    const smallinsideCsg = CSG.fromMesh(smallinsideSphere);
    const openingViewCsg = CSG.fromMesh(openingView);
    const subtractedCSG = outsideCsg.subtract(openingCsg).subtract(insideCsg).subtract(openingViewCsg);
    const sandCsg1 = CSG.fromMesh(smallinsideSphere).intersect( CSG.fromMesh(sandBox1)).subtract(CSG.fromMesh(sandBox3)).subtract(CSG.fromMesh(sandBox2));
    const sandCsg2 = CSG.fromMesh(smallinsideSphere).intersect( CSG.fromMesh(sandBox2)).subtract(CSG.fromMesh(sandBox3));
    const sandCsg3 = CSG.fromMesh(smallinsideSphere).intersect( CSG.fromMesh(sandBox3));

    // Retourner la géométrie résultante
    // return sphere2.geometry//
    return {
        bocal: subtractedCSG.toGeometry(outsideSphere.matrix),
        water: smallinsideCsg.subtract(CSG.fromMesh(surfaceBox)).subtract(sandCsg1).subtract(sandCsg2).subtract(sandCsg3).toGeometry(insideSphere.matrix),

        sand1: sandCsg1.toGeometry(insideSphere.matrix),
        sand2: sandCsg2.toGeometry(insideSphere.matrix),
        sand3: sandCsg3.toGeometry(insideSphere.matrix),
        debug: {
            surfaceBox: surfaceBox.geometry,
            smallinsideSphere: smallinsideSphere.geometry,
            sandBox1: sandBox1.geometry,
            sandBox2: sandBox2.geometry,
            sandBox3: sandBox3.geometry,
        }
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
                                      roughness={0.5}
                                      side={DoubleSide}/>

            </mesh>
            <mesh geometry={geometries?.water} castShadow>

                <meshStandardMaterial color="lightblue" transparent={true}
                                      opacity={0.4} metalness={0.5} roughness={0}
                                      side={DoubleSide}/>

            </mesh>


            <mesh geometry={geometries?.sand1} castShadow receiveShadow>

                <meshPhysicalMaterial color="yellow"
                                      metalness={0.5}
                                      roughness={0}
                                      side={DoubleSide}/>


            </mesh>

            <mesh geometry={geometries?.sand2} castShadow receiveShadow>
                <meshPhysicalMaterial color="white"
                                      metalness={0.5}
                                      roughness={0}
                                      side={DoubleSide}/>


            </mesh>
            <mesh geometry={geometries?.sand3} castShadow receiveShadow>

                <meshPhysicalMaterial color="orange"
                                      metalness={0.5}
                                      roughness={0}
                                      side={DoubleSide}/>


            </mesh>
            {/*
            <>
                <mesh geometry={geometries?.debug?.surfaceBox} castShadow receiveShadow
                      position={[props.radius * 3,  (props.waterLevel || props.radius), props.radius * 3]}>

                    <meshPhysicalMaterial color="blue"

                                          side={DoubleSide}/>


                </mesh>
                <mesh geometry={geometries?.debug?.sandBox1} castShadow receiveShadow
                      position={[props.radius * 3, 3 - props.radius *1.5, props.radius * 3]}>
                    <meshPhysicalMaterial color="red"
                                          side={DoubleSide}/>


                </mesh>   <mesh geometry={geometries?.debug?.sandBox2} castShadow receiveShadow
                      position={[props.radius * 3+5, 2- props.radius *1.5, props.radius * 3]}>
                    <meshPhysicalMaterial color="pink"
                                          side={DoubleSide}/>


                </mesh>

            </>*/}


        </>

    );

}
