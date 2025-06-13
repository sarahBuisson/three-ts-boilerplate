import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { Cube } from './components/Cube'
import { Plane } from './components/Plane'
import { Sphere } from './components/Sphere'
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Player } from './components/Player';
import { useMouseCapture } from './components/useMouseCapture';
import { useKeyboard } from './components/useKeyboard'; // Components for handling physics.


function getInput(keyboard:any, mouse:{x:number,y:number}) {
    let [x, y, z] = [0, 0, 0];
    let running = false
    // Checking keyboard inputs to determine movement direction
    if (keyboard.get("s")) z += 1.0; // Move backward
    if (keyboard.get("z")) z -= 1.0; // Move forward
    if (keyboard.get("d")) x += 1.0; // Move right
    if (keyboard.get("q")) x -= 1.0; // Move left
    if (keyboard.get(" ")) y += 1.0; // Jump

    // Returning an object with the movement and look direction
    console.log(keyboard,keyboard["s"],x,y,z
    )
    return {
        move: [x, y, z],
        look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
        running: keyboard.get("Shift"), // Boolean to determine if the player is running (Shift key pressed)
    };
}

function Scene() {
    const keyboard = useKeyboard(); // Hook to get keyboard input
    const mouse = useMouseCapture(); // Hook to get mouse input

    const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const { animate } = useControls('Cube', {
    animate: true,
  })

  const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)



  useFrame((_, delta) => {
    if (animate) {
      cubeRef.current!.rotation.y += delta / 3
    }
  })

  return (
    //camera orbitale <OrbitControls makeDefault />-->
    <>
      {performance && <Perf position='top-left' />}



      <directionalLight
        position={[-2, 2, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
      />
      <ambientLight intensity={0.2} />
        <Physics debug>
      <Cube ref={cubeRef} />
      <Sphere />
      <Plane />
            <Player walk={2} jump={5} input={() => getInput(keyboard, mouse)} />
        </Physics>
    </>
  )
}

export { Scene }
