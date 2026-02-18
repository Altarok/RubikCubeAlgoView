# Visualization of Rubik's Cube algorithms: OLL & PLL
Obsidian plugin you can use to visualize Rubik's Cubes algorithms.
The plugin interprets code blocks and visualizes Rubik's Cubes and some errors, defined by you.

Ever wondered how an algorithm would look like after turning a cube?
Well with this you will be able to.

Right now, it is able to show changes done by PLL and OLL algorithms. F2L to come.

<img width="550" height="639" alt="image" src="https://github.com/user-attachments/assets/b086de19-16d7-456b-a753-79d7dc5c3d40" />

The image's lower cube is created by writing the following codeblock (named 'rubikCubePLL'):
```
dimension:3,3
arrows:4+8,3+9
```
## Where to start?
Use Obsidian commands to insert some OLL or PLLL code block templates. The rest is up to you.

---

# Configuration
## Single Code Block Configuration
- this cube's size, width and height from 2 to 10, independently
- this cube's color, 3- or 6- digit hex-value
- this arrows' color, 3- or 6- digit hex-value
- this cube's arrow
## General Plugin Configuration
- the cubes' default color, 3- or 6- digit hex-value
- the arrows' default color, 3- or 6- digit hex-value

---

# Things to come
- F2L visualization
- size configuration
- turning of cubes inclufing auto-change of algorithms


## Some Examples
```
dimension:2,2 // comments are allowed
cubeColor:0f0 // no "#" for hex value
arrowColor:f00 // red; "ff0000" is also possible
arrows:1.1-1.2 // arrow from row1-column1 to row1-column2
```
Would create a 2x2 Cube with a fixed-coordinates arrow from the first to the second rectangle in the first row.
Arrow coordinates go from top-left to bottom-right. First integer is row, second integer is column.
Arrows with fixed coordinates do not change position when resizing the cube.
```
arrows:1-2 // "lazy" coordinates
```
Would create the same. Notice the "lazy" arrow coordinates. It just gives each rectangle an integer. 
Arrows with lazy coordinates do change position when resizing the cube.
```
arrows:1+2 // "+" makes this a double-sided arrow
```
Would create the same, but with a double-sided arrow.
