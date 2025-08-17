import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import React, { useRef } from 'react'
import { BoxGeometry, Camera, BufferGeometry, Mesh, MeshBasicMaterial, TextureLoader } from 'three'
import { Physics } from "@react-three/rapier";
import { Aquarium } from '../aquarium/Aquarium';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export function AquariumScene() {

    const {performance} = useControls('Monitoring', {
        performance: false,
    })

    const {animate} = useControls('Cube', {
        animate: true,
    })

    const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)




    return (
        //camera orbitale <OrbitControls makeDefault />-->
        <>
            <OrbitControls makeDefault  scale={[40,40,40]} />
        <!    <PerspectiveCamera
                makeDefault
                position={[500, 0.9, 0]}
                fov={60}
                zoom={0.9}
            />
            {performance && <Perf position='top-left'/>}


            <directionalLight
                position={[-2, 2, 3]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024 * 2, 1024 * 2]}
            />
            <ambientLight intensity={0.2}/>
            <Physics debug>

                <Aquarium radius={20} epaisseur={1} waterLevel={7}></Aquarium>
            </Physics>
        </>
    )
}
