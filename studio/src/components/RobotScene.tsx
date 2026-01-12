import { useRef } from 'react'
import { PerspectiveCamera, OrbitControls, Grid, Line } from '@react-three/drei'
import { Group } from 'three'
import { RobotModel } from './RobotModel'
import { useRobotStore } from '../store/robotStore'

interface SceneProps {
    viewMode: 'global' | 'camera';
}

export function RobotScene({ viewMode }: SceneProps) {
    const distance = useRobotStore(state => state.distance)
    const slope = useRobotStore(state => state.slope)
    const roomPan = useRobotStore(state => state.roomPan)

    const pivotRef = useRef<Group>(null)

    // CORRIDOR GEOMETRY
    const LENGTH = 500; // Far Clip Distance
    const LARGE_W = 250; const LARGE_H = 150; // Entrance (Near)
    const SMALL_W = 100; const SMALL_H = 75;  // Exit (Far)

    // LOGIC: 
    // Entrance at Z=0. Exit at Z=-LENGTH.
    // Distance 0 (Exit) -> Z = -LENGTH
    // Distance 1 (Entrance) -> Z = 0
    // Note: Previous logic was 0=Far, 1=Near. 
    // Let's check store: "distance: 0.0, // Start at Exit (Far)"
    // So:
    // dist 0 -> Z = -LENGTH
    // dist 1 -> Z = 0
    const robotZ = (-1 + distance) * LENGTH;

    // Slope Logic:
    // Pitching the entire corridor around the "Window" (Entrance Frame)
    const slopeRad = slope * (Math.PI / 180);

    // Window Pan Logic:
    // If I look Left (Robot Pan > 0), the "Window" into the world should shift Right?
    // Or the Corridor rotates Right?
    // User: "look left/right pans The Corridor... oppositely"
    // Decoupled from Robot Head. Now controlled by roomPan.
    const panInverseRad = -roomPan * (Math.PI / 180);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[100, 200, 100]} intensity={2} castShadow />

            {/* Global Pivot (The "Slope" & "Window Pan") */}
            <group ref={pivotRef} rotation={[slopeRad, panInverseRad, 0]}>

                {/* CORRIDOR WIREFRAME */}
                <group>
                    {/* Entrance (Large) at Z=0 - Fixed Frame */}
                    <Line points={[[-LARGE_W / 2, -LARGE_H / 2, 0], [LARGE_W / 2, -LARGE_H / 2, 0], [LARGE_W / 2, LARGE_H / 2, 0], [-LARGE_W / 2, LARGE_H / 2, 0], [-LARGE_W / 2, -LARGE_H / 2, 0]]} color="#00ff00" lineWidth={3} />

                    {/* Exit (Small) at Z=-LENGTH */}
                    <Line points={[[-SMALL_W / 2, -SMALL_H / 2, -LENGTH], [SMALL_W / 2, -SMALL_H / 2, -LENGTH], [SMALL_W / 2, SMALL_H / 2, -LENGTH], [-SMALL_W / 2, SMALL_H / 2, -LENGTH], [-SMALL_W / 2, -SMALL_H / 2, -LENGTH]]} color="#ff0000" lineWidth={3} />

                    {/* Frustum Lines */}
                    <Line points={[[-LARGE_W / 2, LARGE_H / 2, 0], [-SMALL_W / 2, SMALL_H / 2, -LENGTH]]} color="gray" dashed />
                    <Line points={[[LARGE_W / 2, LARGE_H / 2, 0], [SMALL_W / 2, SMALL_H / 2, -LENGTH]]} color="gray" dashed />
                    <Line points={[[-LARGE_W / 2, -LARGE_H / 2, 0], [-SMALL_W / 2, -SMALL_H / 2, -LENGTH]]} color="gray" dashed />
                    <Line points={[[LARGE_W / 2, -LARGE_H / 2, 0], [SMALL_W / 2, -SMALL_H / 2, -LENGTH]]} color="gray" dashed />

                    {/* Floor Grid inside Corridor */}
                    <Grid position={[0, -LARGE_H / 2, -LENGTH / 2]} args={[LARGE_W, LENGTH]} sectionSize={50} cellColor="#333" sectionColor="#555" fadeDistance={500} />
                </group>

                {/* ROBOT */}
                <group position={[0, -LARGE_H / 2 + 32.5, robotZ]}>
                    <RobotModel />
                </group>

            </group>

            {/* VIEW CAMERAS */}

            {/* 1. ROOM VIEW (God View / Fixed Entrance View) */}
            {/* User wants to look THROUGH the large rectangle. */}
            {viewMode === 'global' && (
                <>
                    {/* Fixed Camera looking down the corridor */}
                    <PerspectiveCamera makeDefault position={[0, 0, 400]} fov={60} />
                    <OrbitControls enableZoom={true} enablePan={true} />
                </>
            )}

            {/* 2. ROBOT CAMERA (First Person) */}
            {/* Attached to the robot's head (Conceptual) */}
            {/* In reality, we sync this camera to the robot's position/rotation logic */}
            {viewMode === 'camera' && (
                <PerspectiveCamera makeDefault position={[0, 0, 400]} fov={75} />
                // Wait, 'camera' mode is likely overridden by the Webcam feed in App.tsx?
                // If showing 3D, we should place it AT the robot head.
                // Let's position it roughly where the robot is.
                // position={[0, 0, robotZ + 100]}
            )}
        </>
    )
}
