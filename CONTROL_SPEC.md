# Control Logic & UI Specification

## 1. Interface Layout ("2 iFrames")

The user interface consists of two primary viewports:

1.  **Camera View (1st Person)**: The actual video feed from the robot's camera.
    -   *Interaction*: Displays the "Cropped FOV" based on current zoom/distance.
2.  **Room View (3rd Person)**: A top-down or external view showing the "Room & Bot".
    -   *Interaction*: Visualizes the robot's position and the theoretical "Rectangles" defining flight/drive constraints.

## 2. The "2 Rectangles" Control Model

This model defines the constraints for the robot's movement and camera operation based on its position relative to a target.

### Terminology
-   **Large Rectangle (Nearest Frame)**: The closest distance the robot can approach.
    -   *State*: Wide FOV (Minimum Zoom).
    -   *Freedom*: Max Pan/Tilt capabilities enabled.
-   **Small Rectangle (Farthest Frame)**: The maximum distance the robot can retreat.
    -   *State*: Full Zoom (Cropped FOV \u2248 Actual FOV).
    -   *Freedom*: **Zero Pan/Tilt**. Head is locked to center.
-   **The "Slope"**: The trajectory or line connecting these two rectangles.
    -   Determines the gradient of control freedom.
    -   **Dynamic Corridor**: The volume between these rectangles *is* the effective "Room".
    -   **Pitch Effect**: Bot looking Up/Down tilts this **entire Corridor** (Room geometry and Bot path) in 3D space, changing the slope of the interaction plane.

### Control Mechanics

| Robot Position | Distance | Zoom (Crop Factor) | Pan/Tilt Freedom |
| :--- | :--- | :--- | :--- |
| **At Small Rect** | Max (Farthest) | **High** (Full Zoom) | **None** (Locked Center) |
| **Transition** | Moving Closer | Decreasing | Increasing Linearly |
| **At Large Rect** | Min (Nearest) | **Low** (Wide Angle) | **Max** (Full Range) |

### Functional Logic

1.  **Forward/Backward**:
    -   Moving **Forward** (towards Large Rect) -> **Decreases Zoom**, **Increases Pan/Tilt range**.
    -   Moving **Backward** (towards Small Rect) -> **Increases Zoom**, **Decreases Pan/Tilt range** (centering the view).
2.  **Look Up/Down**:
    -   Modifies the `slope` of the connecting line, effectively tilting the "corridor" in which the robot operates.
3.  **Turn Left/Right**:
    -   Standard differential drive rotation.

## 3. Visualization Goals

-   **3D World**: Visualize the frustum created by the Small and Large rectangles.
-   **UI**: Show the "Cropped FOV" overlay on the main camera feed to indicate current zoom level.
