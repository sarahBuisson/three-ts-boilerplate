import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import React, { useRef } from 'react'
import { BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, TextureLoader, Vector3 } from 'three'
import { Cube } from './components/Cube'
import { Sphere } from './components/Sphere'
import { Physics } from "@react-three/rapier";
import { Player } from './components/Player';
import { useMouseCapture } from './components/useMouseCapture';
import { useKeyboard } from './components/useKeyboard';
import { Ground5 } from './components/Ground5';
import { useTexture } from '@react-three/drei';
import { Labyrinth } from './service/labGenerator';
import { buildPassingMap, Kase2D, NormalTableau } from './service/tableau';
import { GroundHeight } from './components/GroundHeight';

function getInput(keyboard: any, mouse: { x: number, y: number }) {
    let [x, y, z] = [0, 0, 0];
    let running = false
    // Checking keyboard inputs to determine movement direction
    if (keyboard.get("s")) z += 1.0; // Move backward
    if (keyboard.get("z")) z -= 1.0; // Move forward
    if (keyboard.get("d")) x += 1.0; // Move right
    if (keyboard.get("q")) x -= 1.0; // Move left
    if (keyboard.get(" ")) y += 1.0; // Jump

    // Returning an object with the movement and look direction

    return {
        move: [x, y, z],
        look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
        running: keyboard.get("Shift"), // Boolean to determine if the player is running (Shift key pressed)
    };
}

let kses:Kase2D[][]=[];
for(let i=0;i<10;i++){
    kses[i]=[]
    for(let j=0;j<10;j++){
        kses[i][j]=new Kase2D(i,j)
    }
}

let l =new Labyrinth(new NormalTableau(kses));
l.fillLab()

const passingMap = buildPassingMap(l.tableau,3,3)

const heightMap:number[][]=passingMap.map(i=>i.map(j=>j?0:1));
const stuffMap=passingMap.map(i=>i.map(j=>j?undefined:"./assets/tree.svg"   ));
heightMap[0][0]=20;

function Scene() {
    const keyboard = useKeyboard(); // Hook to get keyboard input
    const mouse = useMouseCapture(); // Hook to get mouse input

    const {performance} = useControls('Monitoring', {
        performance: false,
    })

    const {animate} = useControls('Cube', {
        animate: true,
    })

    const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)


    useFrame((_, delta) => {
        if (animate) {
            cubeRef.current!.rotation.y += delta / 3
        }
    })

   // let texture = useTexture('/assets/vite.svg');
    let geo= new BufferGeometry()

    let textureStar=  new TextureLoader().load("./assets/star.png");
    let sprites = [];

    for(let i=0;i<100;i++){
        for (let j=0;j<100;j++){
            let sprite =  <sprite position={[i*20-10, 10, j*20-10]} key={`${i}-${j}`} >
                <spriteMaterial map={textureStar} />
            </sprite>;

            sprites.push(sprite);
        }
    }


    return (
        //camera orbitale <OrbitControls makeDefault />-->
        <>
            {performance && <Perf position='top-left'/>}


            <directionalLight
                position={[-2, 2, 3]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024 * 2, 1024 * 2]}
            />
            <ambientLight intensity={0.2}/>
            <Physics debug>
                <Cube ref={cubeRef}/>
                <Sphere/>
                <Ground5></Ground5>
                <GroundHeight  heightField={heightMap}
                               position={new Vector3(0, 0 , 0)}
                               spriteMap={stuffMap}></GroundHeight>
                <Player walk={2} jump={5} input={() => getInput(keyboard, mouse)}/>
                {sprites}
            </Physics>
        </>
    )
}

export { Scene }
