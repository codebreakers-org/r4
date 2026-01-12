// Root level export debug
include <config.scad>;
use <assemblies/structure.scad>;
use <assemblies/sensors_layer.scad>;
use <assemblies/electronics_layer.scad>;
use <parts/gimbal_parts.scad>;
use <parts/hardware.scad>;

module Export_Base_Root() {
    Layer_1_Structure();
    // Add other static layers
    translate([0,0,0]) Layer_2_Sensors();
    translate([0,0,0]) Layer_4_Electronics();
    
    // Gimbal Base
    translate(pos_gimbal) rotate([0, 0, 90]) translate([-6, -6.25, 0]) {
        Base_Mount();
        translate([0, 0, 3.0]) SG90_Servo(0, "double");
    }
}

Export_Base_Root();
