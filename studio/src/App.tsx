import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { RobotScene } from './components/RobotScene'
import { useRobotStore } from './store/robotStore'

function App() {
  const {
    distance, slope, zoom, roomPan,
    velocity, omega,
    pan, tilt, panLimit, tiltLimit,
    minZoom, setMinZoom,
    setDistance, setSlope, setRoomPan, setDrive, setHead
  } = useRobotStore()

  // Webcam Logic
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("No webcam found", err);
      }
    }
    setupCamera();
  }, []);

  // Handler for Distance Change (0=Exit/Far, 1=Entrance/Near)
  const handleDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(parseFloat(e.target.value))
  }

  return (
    <div className="flex w-full h-screen bg-black overflow-hidden">

      {/* LEFT: ROOM VIEW (Global) */}
      <div className="w-1/2 h-full relative border-r border-gray-800">
        <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs pointer-events-none">
          <h2 className="font-bold text-green-400">ROOM INTERFACE (The Entrance)</h2>
          <p>Distance (Proximity): {(distance * 100).toFixed(0)}%</p>
          <p>Corridor Pitch: {slope.toFixed(0)}°</p>
        </div>

        <Canvas shadows camera={{ position: [0, 0, 400], fov: 60 }}>
          <RobotScene viewMode="global" />
        </Canvas>
      </div>

      {/* RIGHT: CAMERA FEED (Actual) */}
      <div className="w-1/2 h-full relative flex items-center justify-center bg-gray-900">
        <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs pointer-events-none">
          <h2 className="font-bold text-red-500">ROBOT VISION</h2>
          <p>Digital Zoom: {zoom < 1.0 ? ((1 / zoom).toFixed(1) + "x") : "OFF"}</p>
          <p>View Mode: {distance > 0.9 ? "INSPECTION (Near)" : "NAVIGATION (Far)"}</p>
        </div>

        {/* WEBCAM FEED */}
        {/* We simulate "Crop" by scaling the video element based on 'zoom' */}
        {/* 'zoom' var in store is 1.0 (Far) -> 0.4 (Near). */}
        {/* So scale needs to be 1/zoom. */}
        <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay playsInline muted
            className="object-cover transition-transform duration-200"
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${1 / zoom}) translate(${-pan}px, ${-tilt}px)`
              // Note: Panning the video element simulates the head looking around?
              // Or rather, if Head PANS Right, image shifts Left.
              // This is a rough simulation of "invserse pan" on the feed.
            }}
          />

          {/* OVERLAY: Crop Box Visualization (Only visible if not zoomed in?) */}
          {/* Actually if we scale the video, we fill the screen. */}
        </div>
      </div>

      {/* HUD CONTROLS */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-900/95 border-t border-gray-700 z-30 p-4">
        <div className="max-w-4xl mx-auto flex gap-6 justify-center text-sm text-gray-300">

          {/* CONTROL GROUP 1: MOVEMENT */}
          <div className="bg-gray-800/50 p-3 rounded border border-gray-700 w-64">
            <div className="flex items-center justify-between mb-2 border-b border-gray-600 pb-1">
              <span className="font-bold text-green-400">LOCOMOTION</span>
              <span className="text-xs">{distance < 0.1 ? "NEAR" : "FAR"}</span>
            </div>

            {/* Distance */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>EXIT (100)</span>
                <span>ENTRANCE (0)</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.01"
                value={distance} onChange={handleDistance}
                className="w-full accent-green-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Velocity/Omega */}
            <div className="flex gap-2">
              <div className="w-1/2">
                <span className="block text-[10px] text-center mb-1">VELOCITY (v)</span>
                <input type="range" min="-1" max="1" step="0.1" value={velocity} onChange={e => setDrive(parseFloat(e.target.value), omega)} className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="w-1/2">
                <span className="block text-[10px] text-center mb-1">TURN (w)</span>
                <input type="range" min="-1" max="1" step="0.1" value={omega} onChange={e => setDrive(velocity, parseFloat(e.target.value))} className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>

          {/* CONTROL GROUP 2: ROOM */}
          <div className="bg-gray-800/50 p-3 rounded border border-gray-700 w-56">
            <div className="flex items-center justify-between mb-2 border-b border-gray-600 pb-1">
              <span className="font-bold text-blue-400">ROOM</span>
              <span className="text-xs">S:{slope}° / P:{roomPan}°</span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-1">
                  <span>Pitch</span>
                </div>
                <input
                  type="range" min="-30" max="30" step="1"
                  value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-1">
                  <span>Yaw</span>
                </div>
                <input
                  type="range" min="-45" max="45" step="1"
                  value={roomPan} onChange={(e) => setRoomPan(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* CONTROL GROUP 3: HEAD */}
          <div className="bg-gray-800/50 p-3 rounded border border-gray-700 w-64">
            <div className="flex items-center justify-between mb-2 border-b border-gray-600 pb-1">
              <span className="font-bold text-yellow-400">HEAD</span>
              <span className={panLimit > 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                {panLimit > 0 ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>

            <div className="flex gap-2 mb-2">
              <div className="w-1/2">
                <span className="block text-[10px] text-center mb-1">PAN</span>
                <input
                  type="range" min="-45" max="45" step="1"
                  value={pan} onChange={(e) => setHead(parseFloat(e.target.value), tilt)}
                  className="w-full accent-yellow-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  disabled={panLimit === 0}
                />
              </div>
              <div className="w-1/2">
                <span className="block text-[10px] text-center mb-1">TILT</span>
                <input
                  type="range" min="-30" max="30" step="1"
                  value={tilt} onChange={(e) => setHead(pan, parseFloat(e.target.value))}
                  className="w-full accent-orange-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  disabled={tiltLimit === 0}
                />
              </div>
            </div>
            <div className="text-center text-[10px] text-gray-500 mt-2">
              Auto-Limits: ±{panLimit.toFixed(0)}° / ±{tiltLimit.toFixed(0)}°
            </div>
          </div>

          {/* CONTROL GROUP 4: CAMERA */}
          <div className="bg-gray-800/50 p-3 rounded border border-gray-700 w-40">
            <div className="flex items-center justify-between mb-2 border-b border-gray-600 pb-1">
              <span className="font-bold text-purple-400">CAMERA</span>
              <span className="text-xs">{(zoom * 100).toFixed(0)}%</span>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Max Zoom</span>
              </div>
              <input
                type="range" min="0.1" max="1.0" step="0.1"
                value={minZoom} onChange={(e) => setMinZoom(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-[10px] text-gray-500 text-center mt-1">
                Crop Ratio: {minZoom}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
