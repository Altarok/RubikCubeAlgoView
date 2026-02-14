# Visualization of Rubik Cube algorithms: OLL & PLL
Obsidian plugin you can use to visualize Rubik Cubes algorithms.
The plugin interprets code blocks and visualizes Rubik Cubes and some errors, defined by you.

Ever wondered how an algorithm would look like after turning a cube?
Well with this you will be able to once finished.

Right now, it is able to show changs done by PLL and OLL algorithms only. F2L to come.

<img width="381" height="356" alt="image" src="https://github.com/user-attachments/assets/768f0602-750f-4a62-93f2-3b44b513e6ac" />
<img width="260" height="270" alt="image" src="https://github.com/user-attachments/assets/d3499efc-5142-4b95-9b18-317fa641d939" />


The left image is created by writing the following codeblock (named 'rubikCubePLL'):
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
