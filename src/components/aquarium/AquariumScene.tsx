import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import React, { useRef } from 'react'
import { BoxGeometry, Camera, BufferGeometry, Mesh, MeshBasicMaterial, TextureLoader ,Vector3} from 'three'
import { Physics } from "@react-three/rapier";
import { Aquarium } from '../aquarium/Aquarium';
import { PositionPointer } from '../common/position';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const aquariumRadius = 20
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
            <OrbitControls makeDefault  scale={[aquariumRadius*2,aquariumRadius*2,aquariumRadius*2]} 
			target={[0,-aquariumRadius,0]} />
     
            {performance && <Perf position='top-left'/>}


            <directionalLight
                position={[-2, 2, 3]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024 * 2, 1024 * 2]}
            />
            <ambientLight intensity={0.2}/>
            <Physics >
                <Aquarium radius={aquariumRadius} epaisseur={1} waterLevel={aquariumRadius*1.65}></Aquarium>
            </Physics>
			
			
			<PositionPointer position={new Vector3(100,100,100)}/>
        </>
    )
}
