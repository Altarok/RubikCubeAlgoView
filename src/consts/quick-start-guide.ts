/** Ready-to-use quick start guide as complete Markdown file */
export const quickStartGuide: string = `
# Quick Start Guide: Rubik's Cube algorithms plugin
Welcome! This guide will walk you through creating your first algorithm visualization in Obsidian.

> [!info]+ Before you read any further, feel free to copy complete OLL and PLL algorithm example files.
> - You can insert them to any note with in-built commands \`'Add complete PLL (or OLL) algorithm list ...'\`.
> - You can download them in the plugin repo, in the folder \`'examples'\`.

# 1. The Core Concept
The plugin searches for **Markdown Code Blocks** and transforms them into a 2D cube.
A code block is created by wrapping instructions between three backticks and a special keyword.
The plugin looks for the following keywords (**more are planned**):
1. \`rubikCubePLL\`
2. \`rubikCubeOLL\`

Once the cube is rendered in your note, you can interact with it:
1. **Rotate:** Use the **Rotate** buttons to turn the cube and see the back or sides.
2. **Dynamic Notation:** Notice that as you rotate the cube, the \`algo\` text displayed beneath the cube **changes** to match your new perspective. This helps you learn how to perform the same algorithm from different angles.
3. **Reset:** Click **Reset** to return to the default orientation defined in your code block.

# 2. Generic code block properties
Copy and paste this snippet into any Obsidian note. It will create a blank 3x3 cube with buttons.
\`\`\`\`
\`\`\`rubikCubePLL
# this is a comment, it does nothing to your cube
\`\`\`
\`\`\`\`

> [!info]- Expand for screenshot
> ![Screenshot: blank PLL Cube 230x250px](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/PllCubeExample_1_Blank_230x250.png)

To add some life to it you may add some of the following properties:

| **Property**              | **Short description**                          | **Range / Format**                                                                                  | Example            | Default (if not set) |
| ------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------ | -------------------- |
| [[#Dimension\\|dimension]] | Sets the visual size of the cube.              | 2 to 10                                                                                             | \`dimension:2,2\`    | \`3,3\`                |
| [[#Colors\\|cubeColor]]    | The color of the stickers.                     | Hex code (3 or 6 digits)                                                                            | \`cubeColor:ff0\`    | \`#ffff00\`            |
| [[#Colors\\|arrowColor]]   | The color of the arrows.                       | Hex code (3 or 6 digits)                                                                            | \`arrowColor:08f\`   | \`#0088ff\`            |
| [[#Arrows\\|arrows]]       | Displays arrows between stickers.              | (see description)                                                                                   | \`arrows:1+3,2+8\`   | n/a                  |
| [[#Flags\\|flags]]         | Use for special options.                       | no-buttons                                                                                          | \`flags:no-buttons\` | n/a                  |
| alg                       | A classic Rubik's cube algorithm               | ***Differs!*** See [[#3.1.1. Property *Algorithms*\\|PLL]] or [[#3.2.2. Property *Algorithms*\\|OLL]] | \`alg:F R U\`        | n/a                  |
| [[#rubikCubeOLL\\|id]]     | ***OLL only!*** Saves the user a lot of input. | (see description)                                                                                   | \`id:oll-46\`        | n/a                  |

## 2.1. Property: *Arrows*
- ***key***: "arrows"
- ***value***: 1-n comma-separated arrow definitions (normal/double-sided/chained), see below

Arrows point from one sticker to another. For a standard 3x3 cube, the squares would be numbered 1-3 (top row), 4-6 (middle), and 7-9 (bottom).

### 2.1.1.  *Normal arrows*
Define unidirectional arrows like this: \`[number]-[number]\`.
This creates a simple arrow going from the face with the first number to the face with the second number.

> [!info]- Expand for example with screenshot
> Copy this anywhere to get what you see in the screenshot.
> Note that changing \`1-3\` to \`3-1\` would reverse the direction of the first arrow.
> \`\`\`\`
> \`\`\`rubikCubePLL
> arrows:1-3,4-6 // this is an in-line commment
> \`\`\`
> \`\`\`\`
> ![Screenshot for given example](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/PllCubeExample_3_SingleArrows_230x250.png)

### 2.1.2. *Double-sided arrows*
Define double-sided arrows like this: \`[number]+[number]\`.
This creates two simple arrows going to and fro two faces with the respective numbers.

> [!info]- Expand for example with screenshot
> Copy this anywhere to get what you see in the screenshot.
> \`\`\`\`
> \`\`\`rubikCubePLL
> arrows:3+9,4+6
> \`\`\`
> \`\`\`\`
> ![Screenshot for given example](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/PllCubeExample_4_DoubleSidedArrows_230x250.png)

### 2.1.3. *Chained arrows*
Define chained arrows like this: \`[number]-[number]-[number](-[number])\`.
This creates 3 (or 4) arrows with the last one ending where the first one started.

> [!info]- Expand for example with screenshot
> Copy this anywhere to get what you see in the screenshot.
> \`\`\`\`
> \`\`\`rubikCubePLL
> arrows:1-3-7
> \`\`\`
> \`\`\`\`
> ![Screenshot for given example](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/PllCubeExample_5_ChainedArrows_230x250.png)

## 2.2. Properties: *Cube color* and *Arrow color*
- ***key***: "cubeColor" & "arrowColor"
- ***value***: 3- or 6-digit hex value, without '#'-prefix

The plugin has 2 default colors:
- cube - yellow (\`#ffff00\`)
- arrows - sky blue (\`#0088ff\`)

You can override the colors on a global level as well as on a per-cube basis.
- For global overrides see plugin settings.
- For single cube changes copy the following example:

\`\`\`\`
\`\`\`rubikCubePLL
arrowColor:f00 // red, no '#'-prefix !
cubeColor:0f0 // green
arrows:3+9,4+6
\`\`\`
\`\`\`\`

> [!info]- Expand for screenshot
> ![Screenshot for given example](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/PllCubeExample_6_GreenCubeWithRedArrows_230x250.png)
## 2.3. Property: *Dimension*
- ***key***: "dimension"
- **value**: 2 numbers for "width,height"

Each cube is a 3x3 cube if you don't say otherwise.
You can override the dimensions with the line \`[width],[height]\`. Each width and height range from 2 to 10.

This snippet would create a 2x2 cube:
\`\`\`\`
\`\`\`rubikCubePLL
arrows:1-2-3
dimension:2,2
\`\`\`
\`\`\`\`
## 2.4. Property: *Flags*
- ***key***: "flags"
- ***value***: comma-separated flags

Flags define special behaviour. At the moment (plugin version 0.2.2) there is only 1 option:
- '**no-buttons**' - tells the plugin to display a cube without buttons

This snippet would create a cube without buttons:
\`\`\`\`
\`\`\`rubikCubePLL
arrows:1-2-3
flags:no-buttons
\`\`\`
\`\`\`\`

# 3. *Specific code block properties*
The following contains properties only valid for specific code blocks.
## 3.1. Code block: *rubikCubePLL*
### 3.1.1. Property: *Algorithms*
- ***key***: "alg"
- ***value***: Any Rubik's cube algorithm. e.g.: "R' U' R' F R F' U R U2" 
## 3.2. Code block: *rubikCubeOLL*
### 3.2.1. Property: *Algorithms*
- ***key***: "alg"
- ***value***: Any Rubik's cube algorithm followed by optional arrows separated by \`' == '\`
\t- Example: "R' U' R' F R F' U R U2 == 1+9,3+7"
### 3.2.2. Property: *Id*
- ***key***: "id"
- ***value***: "oll-1" .. "oll-57", related to the 57 OLL algorithms.
This was added to save the user the very complicated input of a oll cube by hand. See the following menu point for an example of manual input.
### 3.2.3. *Manual OLL-cube input*
Don't, just don't! ;) See [[#3.2.2. Property *Id*| Property Id]] for shortcut.
But if you really want to, look at these examples and what they do.
Letters (r, g, b, y, o, w) represent face colors; numbers 0 and 1 toggle stickers off or on.

Copy this snippet anywhere:
\`\`\`\`
\`\`\`rubikCubeOLL
.rrg. // red red green
bwwrw // blue white white red white
wgwbw
owwbw
.goo. // green orange orange
\`\`\`

\`\`\`rubikCubeOLL
.000. // grey grey grey
01101 // grey default default grey default
10101
01101
.000.
\`\`\`
\`\`\`\`

> [!info]- Expand for screenshot
> ![Screenshot for given example](https://raw.githubusercontent.com/Altarok/RubikCubeAlgoView/master/screenshots/OllCubeExample_1_ManualInput_230x520.png)

# 4. *Tips for Obsidian Users*
- **Templates:** Don't type these blocks from scratch. Press \`Cmd/Ctrl + P\`, type **"Rubik"**, and select \`Insert Template\` to get a pre-filled block with all options listed as comments.
# 5. *Troubleshooting*
If a cube is not rendering, the plugin should be able to tell you what went wrong.
A bright orange bar saying "Code block interpretation failed:" will try to get your attention while your line containing invalid input will be marked red.

- **Cube not rendering?** Ensure there are no redundant spaces.
- **Invalid Color?** Ensure your hex codes do not start with a \`#\` (e.g., \`f00\` or \`ff0000\`).

**Happy Cubing!** If you create a cool library of algorithms, consider sharing your Markdown files with the community!
`
