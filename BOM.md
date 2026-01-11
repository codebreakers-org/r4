# Bill of Materials (BOM)

This document lists all components required to build the Pan-Tilt Mobile Robot.

## 1. Electronics & Compute

| Component | Quantity | Description |
| :--- | :---: | :--- |
| **Raspberry Pi 4 Model B** | 1 | Main compute unit. |
| **L298N Motor Driver** | 1 | Controls the two DC motors. |
| **LM2596 (or similar) Buck Converter** | 1 | Steps down battery voltage for the Pi (5V). |
| **IMU (MPU6050/BNO055)** | 1 | Inertial Measurement Unit for orientation. |
| **Battery Pack** | 1 | Power source (e.g., 2S Li-Ion/LiPo, ~7.4V). |
| **Raspberry Pi Camera Module v2** | 1 | Video input for the Gimbal. |

## 2. Motion & Actuation

| Component | Quantity | Description |
| :--- | :---: | :--- |
| **TT Gear Motor (Yellow)** | 2 | DC Motors for differential drive. |
| **Wheel (65mm Dia)** | 2 | Standard yellow/black robot wheels. |
| **Caster Wheel** | 1 | Passive omnidirectional front wheel (Ball caster). |
| **SG90 Micro Servo** | 2 | 1x Pan Axis, 1x Tilt Axis. |

## 3. Sensors

| Component | Quantity | Description |
| :--- | :---: | :--- |
| **HC-SR04 Ultrasonic Sensor** | 1 | Front-facing obstacle distance measurement. |
| **IR Obstacle Sensor Module** | 4 | Proximity sensors (Front-Left, Front-Right, Rear-Left, Rear-Right). |

## 4. Hardware & Fasteners

| Component | Quantity | Notes |
| :--- | :---: | :--- |
| **M3 Standoffs (45mm)** | 4 | Separates the Chassis Bottom and Top plates. |
| **M3 Bolts & Nuts** | ~50 | For mounting motors, sensors, electronics, and standoffs. |
| **M2.5 Bolts & Nuts** | ~8 | For mounting Raspberry Pi and Camera. |
| **Jumper Wires** | Set | Male-Male, Male-Female, Female-Female for connections. |

## 5. 3D Printed / Cut Parts

All STL/SCAD files are located in the `parts/` and `assemblies/` directories.

| Part Name | Quantity | Material |
| :--- | :---: | :--- |
| **Chassis Bottom Plate** | 1 | Laser Cut Acrylic or 3D Printed PLA. |
| **Chassis Top Plate** | 1 | Laser Cut Acrylic or 3D Printed PLA. |
| **TT Motor Mount ("Fang")** | 2 | 3D Printed PLA (Vertical brackets). |
| **Gimbal Base Mount** | 1 | 3D Printed PLA. |
| **Gimbal U-Bracket** | 1 | 3D Printed PLA. |
| **Gimbal C-Cradle** | 1 | 3D Printed PLA. |
| **Pi Camera Head Case** | 1 | 3D Printed PLA. |
| **IR Sensor Mounts** | 4 | 3D Printed PLA. |
