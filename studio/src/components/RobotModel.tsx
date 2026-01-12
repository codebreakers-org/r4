import { useRef, useLayoutEffect } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
// @ts-ignore
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'
import { Group, MathUtils } from 'three'
import { useRobotStore } from '../store/robotStore'

export function RobotModel() {
    // Load 3MF files to preserve OpenSCAD Colors
    const base = useLoader(ThreeMFLoader, '/assets/base.3mf')
    const panLink = useLoader(ThreeMFLoader, '/assets/pan_link.3mf')
    const tiltLink = useLoader(ThreeMFLoader, '/assets/tilt_link.3mf')
    const wheelL = useLoader(ThreeMFLoader, '/assets/wheel_left.3mf')
    const wheelR = useLoader(ThreeMFLoader, '/assets/wheel_right.3mf')

    const panGroup = useRef<Group>(null)
    const tiltGroup = useRef<Group>(null)
    const wheelLRef = useRef<Group>(null)
    const wheelRRef = useRef<Group>(null)

    const panAngle = useRobotStore(state => state.pan)
    const tiltAngle = useRobotStore(state => state.tilt)
    const velocity = useRobotStore(state => state.velocity)
    const omega = useRobotStore(state => state.omega)

    useLayoutEffect(() => {
        if (panGroup.current) {
            panGroup.current.rotation.z = MathUtils.degToRad(panAngle)
        }
        if (tiltGroup.current) {
            // Tilt rotates around X.
            tiltGroup.current.rotation.x = MathUtils.degToRad(tiltAngle)
        }
    }, [panAngle, tiltAngle])

    // Material Fix: Ensure Vertex Colors are enabled for 3MF
    const applyMaterial = (obj: Group) => {
        obj.traverse((child: any) => {
            if (child.isMesh) {
                // 3MF from OpenSCAD often puts color in vertex attributes
                if (child.geometry.attributes.color) {
                    child.material.vertexColors = true
                    child.material.color.setHex(0xffffff) // Reset tint
                }
            }
        })
    }

    // Apply to all loaded assets
    useLayoutEffect(() => {
        applyMaterial(base)
        applyMaterial(panLink)
        applyMaterial(tiltLink)
        applyMaterial(wheelL)
        applyMaterial(wheelR)
    }, [base, panLink, tiltLink, wheelL, wheelR])

    // Simple wheel spin animation based on velocity
    useFrame(() => {
        // Differential Drive Logic
        // Left = V - W, Right = V + W
        const speedL = (velocity - omega) * 0.1;
        const speedR = (velocity + omega) * 0.1;

        if (wheelLRef.current) wheelLRef.current.rotation.x += speedL;
        if (wheelRRef.current) wheelRRef.current.rotation.x += speedR;
    })

    // Rotate entire robot to align SCAD Z-up with Three Y-up
    // AND Rotate 180 (Math.PI) around Z to face the Entrance (Camera)
    // Original: [-Math.PI / 2, 0, 0] maps +Y (Scad Forward) to -Z (Three Away).
    // New: [-Math.PI / 2, 0, Math.PI] maps +Y to +Z (Three Towards).
    return (
        <group rotation={[-Math.PI / 2, 0, Math.PI]}>
            {/* BODY (Base) */}
            <primitive object={base} />

            {/* LEGS (Wheels) */}
            {/* 3MF export centers the wheel at (0,0,0). We need to position them. */}
            {/* In export_assets, we exported them AT their position? No, we centered them. */}
            {/* Check export_assets: Export_Wheel_L calls Detailed_Wheel() at origin. */}
            {/* But in assembly they are at +/-70 etc. */}

            <group position={[70, 0, 32.5]} ref={wheelRRef}>
                <primitive object={wheelR} />
            </group>

            <group position={[-70, 0, 32.5]} ref={wheelLRef}>
                <primitive object={wheelL} />
            </group>

            {/* HEAD (Pan Link) */}
            <group position={[0, 55, 127.6]} ref={panGroup}>
                <primitive object={panLink} />

                {/* HEAD (Tilt Link) */}
                <group position={[7, 0, 28]} ref={tiltGroup}>
                    <primitive object={tiltLink} />
                </group>
            </group>
        </group>
    )
}
