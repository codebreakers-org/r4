// FILE: parts/hardware.scad
module Part_Bolt_M3() { color("silver") { cylinder(d=5.5, h=2); translate([0,0,-15]) cylinder(d=3, h=15); } }

module SG90_Servo(ang, style) { 
    cube([23, 12.5, 22.5]); 
    translate([-5.5, 0, 18]) cube([34, 12.5, 2.5]); 
    translate([6, 6.25, 22.5]) rotate([0, 0, ang]) { 
        cylinder(h = 4.5, d = 5); 
        color("white") translate([0, 0, 4.5]) { 
            if (style == "double") hull() { cylinder(h=1.5, d=7); translate([15, 0, 0]) cylinder(h=1.5, d=4); translate([-15, 0, 0]) cylinder(h=1.5, d=4); } 
            if (style == "single") hull() { cylinder(h=1.5, d=7); translate([15, 0, 0]) cylinder(h=1.5, d=4); } 
        } 
    } 
}

module SG90_Servo_Centered(ang, style) { translate([-6.0, -6.25, -27.0]) SG90_Servo(ang, style); }

module Servo_Horn_Recess(style) { 
    d_hub=7.2; d_arm=4.2; arm_dist=15.0; 
    union() { 
        hull() { cylinder(h=1.8, d=d_hub, center=true); if (style == "double" || style == "single") translate([arm_dist, 0, 0]) cylinder(h=1.8, d=d_arm, center=true); if (style == "double") translate([-arm_dist, 0, 0]) cylinder(h=1.8, d=d_arm, center=true); } 
        cylinder(h=6, d=3.2, center=true); 
    } 
}
