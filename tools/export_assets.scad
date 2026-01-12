// FILE: tools/export_assets.scad
include <../config.scad>;
use <../parts/gimbal_parts.scad>;
use <../parts/hardware.scad>;
use <../parts/motion.scad>;
use <../assemblies/structure.scad>;
use <../assemblies/electronics_layer.scad>;
use <../assemblies/sensors_layer.scad>;

// 1. BASE MESH (Static)
// Everything EXCEPT Wheels and Moving Gimbal parts.
module Export_Base() {
    // A. Structure Layer (Sans Wheels)
    Layer_1_Drive_Unit_StaticOnly(); // Need to define this or modify L1
    L1_Standoffs();
    L1_Top_Plate();
    L1_Motor_Bolts();

    // B. Other Static Layers
    translate([0,0,0]) Layer_2_Sensors();
    translate([0,0,0]) Layer_4_Electronics();
    
    // C. Gimbal Static Base
    translate(pos_gimbal) rotate([0, 0, 90]) translate([-6, -6.25, 0]) {
        Base_Mount();
        translate([0, 0, 3.0]) color("dodgerblue", 0.3) SG90_Servo(0, "double");
    }
}

// Helper: Structure without Wheels
module Layer_1_Drive_Unit_StaticOnly() {
    L1_Bottom_Plate();
    translate([pos_caster_xy.x, pos_caster_xy.y, 0]) Detailed_Caster_Assembly();
    // Wheels are EXCLUDED here.
}

// 2. LEFT WHEEL (Rotates X)
module Export_Wheel_L() {
    // Detailed_Wheel is centered at (0,0,0) by default? 
    // Let's check: "translate([0,0,0]) rotate([0,90,0]) Cylinder..."
    // In assembly: "rotate([0, 90, 0]) Detailed_Wheel()"
    // So Detailed_Wheel ALIGNS with Y axis? Or Z?
    // Usually wheels are cylinders along one axis.
    // Ideally we export it such that X-axis rotation spins it like a wheel.
    // If we export default Detailed_Wheel, we can rotate it in ThreeJS.
    rotate([0, 90, 0]) Detailed_Wheel(); 
}

// 3. RIGHT WHEEL (Rotates X)
module Export_Wheel_R() {
    // Same geometry, maybe mirrored?
    // Detailed_Wheel() is just the wheel.
    rotate([0, -90, 0]) Detailed_Wheel(); 
}

// 4. NECK / PAN LINK (Rotates Z)
// Origin = Pivot Axis (Pan Servo Horn)
module Export_Pan_Link() {
    // The U-Bracket (The "Neck Bone")
    U_Bracket_Fixed();
    
    // Pan Servo Horn and Tilt Servo Horn (Fixed Recesses) are part of U-Bracket geometry.
    // We do NOT put the Tilt Servo BODY here anymore.
}

// 5. FACE / TILT LINK (Rotates X/Y)
// Origin = Pivot Axis (Tilt Servo Horn)
module Export_Tilt_Link() {
    union() {
        // The C-Cradle (The "Skull")
        rotate([180, 0, 0]) C_Cradle_Fixed(); 
        
        // The Eyes (Camera)
        rotate([90, 0, 90]) translate([27.5, 0, 0]) rotate([0, 90, 0]) translate([10, 0, 5]) {
            Part_PiCam_Head(); 
        }
        
        // The Tilt Muscles (Servo Body) - NOW MOVING WITH FACE
        // Centered at Pivot (0,0,0)
        rotate([0,0,0]) rotate([90, 0, 90]) color("dodgerblue", 0.5) SG90_Servo_Centered(0, "single");
    }
}
