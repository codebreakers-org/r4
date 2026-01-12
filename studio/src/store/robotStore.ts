import { create } from 'zustand';
import { MathUtils } from 'three';

interface RobotState {
    // Primary Inputs
    distance: number; // 0 (Exit/Far) to 1 (Entrance/Near)
    slope: number;    // Pitch of the "Corridor" (-30 to +30 deg)
    roomPan: number;  // Yaw of the "Corridor" (-45 to +45 deg)
    velocity: number; // -1 (Back) to +1 (Forward)
    omega: number;    // -1 (Left) to +1 (Right)

    // Config
    minZoom: number; // Target zoom at Entrance (default 0.4)

    // Derived Control Limits (The "2 Rectangles" Logic)
    zoom: number;      // Crop Factor: 1.0 (Full/Far) -> 0.4 (Crop/Near)
    panLimit: number;  // Max Pan Angle: 0 (Far) -> 45 (Near)
    tiltLimit: number; // Max Tilt Angle: 0 (Far) -> 30 (Near)

    // Current Head State
    pan: number;
    tilt: number;

    // Actions
    setDistance: (d: number) => void;
    setSlope: (s: number) => void;
    setRoomPan: (p: number) => void;
    setMinZoom: (z: number) => void;
    setDrive: (v: number, w: number) => void;
    setHead: (p: number, t: number) => void;
}

export const useRobotStore = create<RobotState>((set, get) => ({
    distance: 0.0, // Start at Exit (Far)
    slope: 0,
    roomPan: 0,
    velocity: 0,
    omega: 0,

    minZoom: 0.4,

    zoom: 1.0,     // Start with Full View
    panLimit: 0,   // Start Locked
    tiltLimit: 0,

    pan: 0,
    tilt: 0,

    setDistance: (d) => {
        // Clamp 0 (Exit/Far) to 1 (Entrance/Near)
        const dist = MathUtils.clamp(d, 0, 1);

        // LOGIC REVISED:
        // At Distance 0 (Exit/Far):
        // - Zoom = 1.0 (Full FOV, seeing everything)
        // - Freedom = 0 (Locked head)

        // At Distance 1 (Entrance/Near):
        // - Zoom = minZoom (High Crop / Digital Zoom)
        // - Freedom = Max (Pan 45, Tilt 30)

        // Interpolation:
        const { minZoom } = get();
        const zoom = MathUtils.lerp(1.0, minZoom, dist);
        const panLim = MathUtils.lerp(0, 45, dist);
        const tiltLim = MathUtils.lerp(0, 30, dist);

        // Auto-center head if limits shrink (moving backward to Exit)
        const current = get();
        const newPan = MathUtils.clamp(current.pan, -panLim, panLim);
        const newTilt = MathUtils.clamp(current.tilt, -tiltLim, tiltLim);

        set({
            distance: dist,
            zoom,
            panLimit: panLim,
            tiltLimit: tiltLim,
            pan: newPan,
            tilt: newTilt
        });
    },

    setSlope: (s) => set({ slope: s }),
    setRoomPan: (p) => set({ roomPan: p }),
    setMinZoom: (z) => {
        set({ minZoom: z });
        // Recalculate current zoom based on current distance
        const { distance } = get();
        const newZoom = MathUtils.lerp(1.0, z, distance);
        set({ zoom: newZoom });
    },

    setDrive: (v, w) => set({ velocity: v, omega: w }),

    setHead: (p, t) => {
        const { panLimit, tiltLimit } = get();
        set({
            pan: MathUtils.clamp(p, -panLimit, panLimit),
            tilt: MathUtils.clamp(t, -tiltLimit, tiltLimit)
        });
    }
}));
