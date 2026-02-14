# Visualization of Rubik Cube algorithms: OLL & PLL
Obsidian plugin you can use to visualize Rubik Cubes algorithms.

Ever wondered how an algorithm would look like after turning a cube?
Well with this you will be able to once finished.

Right now, it is able to show PLL and OLL algorithms only. F2L to come.

<img width="381" height="356" alt="image" src="https://github.com/user-attachments/assets/768f0602-750f-4a62-93f2-3b44b513e6ac" />
<img width="343" height="292" alt="image" src="https://github.com/user-attachments/assets/3ca9e76c-17f4-4c20-9354-a17f230e01e6" />

The left image is created by writing the following codeblock (named 'rubikCubePLL'):
```
dimension:3,3
arrows:4+8,3+9
```
## Where to start?
Use Obsidian commands to insert some OLL or PLLL code block templates. The rest is up to you.


# Configuration
## Code block configuration
- the cube's size, width and height from 2 to 10
- the cube's color, 3- or 6- digit hex-value
- the arrows' color, 3- or 6- digit hex-value
- arrow coordinates
### Default values
```rubikCubePLL
dimension:3,3 // width, height
cubeColor:ff0 // yellow background 
arrowColor:08f // sky blue arrows
// no arrows
```
## Plugin configuration
- the cubes' default color, 3- or 6- digit hex-value
- the arrows' default color, 3- or 6- digit hex-value

---

# Things that will come
- OLL visualization
- F2L visualization
- size configuration

---

This is my first public repository and plugin, please be gentle :)

Feedback welcome

---

## Some Examples
```
dimension:2,2 // width, height
arrows:1.1-1.2
```
Would create a 2x2 Cube with a fixed-coordinates arrow from the first to the second rectangle in the first row.

Arrow coordinates go from top-left to bottom-right. First integer is row, second integer is column.

Arrows with fixed coordinates do not change position when resizing the cube.
```
dimension:2,2
arrows:1-2 // "lazy" coordinates
```
Would create the same. Notice the "lazy" arrow coordinates.

It just gives each rectangle an integer.

Arrows with lazy coordinates do change position when resizing the cube.
```
dimension:2,2
arrows:1+2 // "+" makes this a double-sided arrow
```
Would create the same, but with a double-sided arrow.
```
dimension:2,2
cubeColor:0f0 // green, no "#" for hex value
arrowColor:f00 // red, "ff0000" is also possible
arrows:1-2
```
Would create the same, but with a red arrow on a green cube.

