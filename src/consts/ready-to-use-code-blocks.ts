/* OLL CodeBlock template for a normal Rubik's Cube. */
const template_3x3_oll = `
\`\`\`rubikCubeOLL
.000.
01101
10101
01101
.000.
\`\`\`
    
\`\`\`rubikCubeOLL
.rrg.
bwwrw
wgwbw
owwbw
.goo. 
\`\`\`
`

/* PLL CodeBlock template for a normal Rubik's Cube. */
const template_3x3_pll: string = `
\`\`\`rubikCubePLL
dimension:3,3 // width,height
cubeColor:ff0 // yellow cube, optional parameter
arrowColor:08f // sky blue arrows, optional parameter
arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row
\`\`\`
`

/* 4 PLL algorithms for a Domino Cube (3x3x2) (partial list) */
const dominoCube_4_PllAlgorithms: string = `
# Domino Cube (3x3x2): 4 PLL algorithms

\`\`\`rubikCubePLL
arrows:6+8
alg:R2 U R2 U R2 U2 R2 U2 R2 U R2 U' R2
\`\`\`

\`\`\`rubikCubePLL
arrows:3+9,4-6,6-8,8-4
alg:R2 U R2 U R2 U2 R2 U2 F2 U' F2 U F2 U'
\`\`\`

\`\`\`rubikCubePLL
arrows:9-1,1-7,7-9
alg:R2 U R2 U R2 U2 R2 F2 U2 F2 U F2 U F2 U2
\`\`\`

\`\`\`rubikCubePLL
arrows:9-7,7-3,3-9
alg:L2 U' L2 U' L2 U2 L2 F2 U2 F2 U' F2 U' F2 U2
\`\`\`
`

/* 21 PLL algorithms for a Rubik's Cube (complete list) */
const rubikCube_21_PllAlgorithms: string = `
# PLL algorithms for Rubik's Cubes
This is complete list with 21 code blocks.

1. PLL-Aa Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-3,3-7,7-1
alg:x L2 D2 L' U' L D2 L' U L'
alg:z' B' U B' D2 B U' B' D2 B2
\`\`\`

2. PLL-Ab Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-7,7-9,9-1
alg:x' L2 D2 L U L' D2 L U' L
alg:z B U' B D2 B' U B D2 B2
\`\`\`

3. PLL-F Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:2+8,3+9
alg:R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R
\`\`\`

4. PLL-Ga Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-3,3-7,7-1,2-4,4-6,6-2
alg:R2 U R' U R' U' R U' R2 U' D R' U R D'
alg:R2 u R' U R' U' R u' R2 y' R' U R
\`\`\`

5. PLL-Gb Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-7,7-3,3-1,2-6,6-4,4-2
alg:R' U' R U D' R2 U R' U R U' R U' R2 D
alg:R' U' R B2 u B' U B U' B u' B2
\`\`\`

6. PLL-Gc Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-7,7-9,9-1,4-6,6-8,8-4
alg:R2 U' R U' R U R' U R2 U D' R U' R' D
alg:L2 B2 L U2 L U2 L' B L U L' U' L' B L2
alg:R2 u' R U' R U R' u R2 y R U' R'
\`\`\`

7. PLL-Gd Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:1-3,3-7,7-1,2-4,4-8,8-2
alg:R U R' U' D R2 U' R U' R' U R' U R2 D'
alg:R U R' y' R2 u' R U' R' U R' u R2
\`\`\`

8. PLL-Ja Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:2+6,3+9
alg:x R2 F R F' R U2 r' U r U2
alg:R' U' R B R' U' R U R B' R2 U R
alg:F' U B' U2 F U' F' U2 F B
\`\`\`

9. PLL-Jb Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:6+8,3+9
alg:R U R' F' R U R' U' R' F R2 U' R'
\`\`\`

10. PLL-Ra Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:2+4,3+9
alg:R U' R' U' R U R D R' U' R D' R' U2 R'
alg:R U R' F' R U2 R' U2 R' F R U R U2 R'
alg:B U2 B' U2 B L' B' U' B U B L B2
\`\`\`

11. PLL-Rb Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:4+8,3+9
alg:R2 F R U R U' R' F' R U2 R' U2 R
alg:F' U2 F U2 F' L F U F' U' F' L' F2
alg:R' U2 R' D' R U' R' D R U R U' R' U' R
\`\`\`

12. PLL-T Adjacent Corner Swap
\`\`\`rubikCubePLL
arrows:4+6,3+9
alg:R U R' U' R' F R2 U' R' U' R U R' F'
\`\`\`

13. PLL-E Diagonal Corner Swap
\`\`\`rubikCubePLL
arrows:1+7,3+9
alg:x' L' U L D' L' U' L D L' U' L D' L' U L D
alg:x' R U' R' D R U R' D' R U R' D R U' R' D'
\`\`\`

14. PLL-Na Diagonal Corner Swap
\`\`\`rubikCubePLL
arrows:3+7,4+6
alg:R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'
alg:z U R' D R2 U' R D' U R' D R2 U' R D'
\`\`\`

15. PLL-Nb Diagonal Corner Swap
\`\`\`rubikCubePLL
arrows:1+9,4+6
alg:R' U R U' R' F' U' F R U R' F R' F' R U' R
alg:z D' R U' R2 D R' U D' R U' R2 D R' U
\`\`\`

16. PLL-V Diagonal Corner Swap
\`\`\`rubikCubePLL
arrows:1+9,2+6
alg:R' U R' U' y R' F' R2 U' R' U R' F R F
alg:R' U R' U' R D' R' D R' U D' R2 U' R2 D R2
alg:z D' R2 D R2 U R' D' R U' R U R' D R U' z'
alg:R U2 R' D R U' R U' R U R2 D R' U' R D2
alg:x' R' F R F' U R U2 R' U' R U' R' U2 R U R' U'
\`\`\`

17. PLL-Y Diagonal Corner Swap
\`\`\`rubikCubePLL
arrows:1+9,2+4
alg:F R U' R' U' R U R' F' R U R' U' R' F R F'
alg:F R' F R2 U' R' U' R U R' F' R U R' U' F'
\`\`\`

18. PLL-H Edges Only
\`\`\`rubikCubePLL
arrows:2+8,4+6
alg:M2 U M2 U2 M2 U M2
alg:M2 U' M2 U2 M2 U' M2
\`\`\`

19. PLL-Ua Edges Only
\`\`\`rubikCubePLL
arrows:4-8,8-6,6-4
alg:M2 U M U2 M' U M2
alg:R U' R U R U R U' R' U' R2
alg:L2 U' L' U' L U L U L U' L
\`\`\`

20. PLL-Ub Edges Only
\`\`\`rubikCubePLL
arrows:4-6,6-8,8-4
alg:M2 U' M U2 M' U' M2
alg:R2 U R U R' U' R' U' R' U R'
alg:L' U L' U' L' U' L' U L U L2
\`\`\`

21. PLL-Z Edges Only
\`\`\`rubikCubePLL
arrows:2+6,4+8
alg:M' U M2 U M2 U M' U2 M2
alg:S' U' S2 U' S2 U' S' U2 S2
alg:S2 U S2 U S' U2 S2 U2 S'
alg:M2 U' M2 U' M' U2 M2 U2 M'
\`\`\`
`

/* 57 OLL algorithms for a Rubik's Cube (complete list) */
const rubikCube_57_OllAlgorithms: string = `
# OLL algorithms for Rubik's Cubes
This is complete list with 57 code blocks.

1. OLL-1 Dot
\`\`\`rubikCubeOLL
.010.
10001
10101
10001
.010.
alg:R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3
\`\`\`

2. OLL-2 Dot
\`\`\`rubikCubeOLL
.111.
00000
10101
10001
.010.
alg:r U r' U2 r U2 R' U2 R U' r' == 2+4,6+8,1+9,3+7
alg:L F U F' U' L' l F U F' U' l' == 2+6,4+8
alg:L F U F' U' M F U F' U' l' == 2+6,4+8
\`\`\`

3. OLL-3 Dot
\`\`\`rubikCubeOLL
.110.
00001
10101
01000
.011.
alg:r' R2 U R' U r U2 r' U M' == 2-6-8-4,1-7-9-3
alg:R U B U' B' R' U R B U B' U' R' == 2-8-6-4,1-7-9-3
alg:l F U F' U' l' U' L F U F' U' L' == 1-3-9-7,4+8
\`\`\`

4. OLL-4 Dot
\`\`\`rubikCubeOLL
.011.
10000
10101
00010
.110.
alg:M U' r U2 r' U' R U' R' M' == 1-3-9-7,2-4-8-6
alg:R U B U' B' R' U' R B U B' U' R' == 1-3-9-7,2-4-6-8
alg:l F U F' U' l' U L F U F' U' L' == 1-7-9-3,2+6
\`\`\`

5. OLL-5 Square Shape
\`\`\`rubikCubeOLL
.000.
01101
01101
10000
.011.
alg:l' U2 L U L' U l == 1+9,3+7,4-6-8
\`\`\`

6. OLL-5 Square Shape
\`\`\`rubikCubeOLL
.000.
10110
10110
00001
.110.
alg:r U2 R' U' R U' r' == 1+9,3+7,4-8-6
\`\`\`

7. OLL-7 Small Lightning Bolt
\`\`\`rubikCubeOLL
.100.
00101
01101
01000
.011.
alg:r U R' U R U2 r' == 1+9,3+7,4-6-8
\`\`\`

8. OLL-8 Small Lightning Bolt
\`\`\`rubikCubeOLL
.001.
10100
10110
00010
.110.
alg:l' U' L U' L' U2 l == 1+9,3+7,4-8-6
alg:R U2 R' U2 R' F R F' == 1-9-7,4-8-6
\`\`\`

9. OLL-9 Fish Shape
\`\`\`rubikCubeOLL
.001.
10100
01101
00010
.110.
alg:R U R' U' R' F R2 U R' U' F' == 1-9-7,2-6-8
\`\`\`

10. OLL-10 Fish Shape
\`\`\`rubikCubeOLL
.110.
00010
01101
10100
.001.
alg:R U R' U R' F R F' R U2 R' == 1+3,7+9
alg:l U L' U L U' L' U' l' L U L U' L' == 1+9,3+7,2+6,4+8
\`\`\`

11. OLL-11 Small Lightning Bolt
\`\`\`rubikCubeOLL
.100.
00110
01101
10000
.011.
alg:r U R' U R' F R F' R U2 r' == 1+3,7+9
alg:l' L2 U L' U L U2 L' U M == 1-7-9-3,6+8
\`\`\`

12. OLL-12 Small Lightning Bolt
\`\`\`rubikCubeOLL
.001.
01100
10110
00001
.110.
alg:M' R' U' R U' R' U2 R U' R r' == 1-3-9-7,4+8
\`\`\`

13. OLL-13 Knight Move Shape
\`\`\`rubikCubeOLL
.110.
00001
01110
01000
.011.
alg:F U R U' R2 F' R U R U' R' == 2-8,8-6,6-2,1-7,7-9,9-1
alg:r U' r' U' r U r' y' R' U R == 2-8,8-4,4-2,1-9,9-3,3-1
\`\`\`

14. OLL-14 Knight Move Shape
\`\`\`rubikCubeOLL
.011.
10000
01110
00010
.110.
alg:R' F R U R' F' R F U' F' == 2-6,6-8,8-2,1-3,3-7,7-1
\`\`\`

15. OLL-15 Knight Move Shape
\`\`\`rubikCubeOLL
.010.
01001
01110
10000
.011.
alg:l' U' l L' U' L U l' U l == 2-8,8-4,4-2,1+9,3+7
\`\`\`

16. OLL-16 Knight Move Shape
\`\`\`rubikCubeOLL
.010.
10010
01110
00001
.110.
alg:r U r' R U R' U' r U' r' == 1+9,3+7,2-8,8-6,6-2
\`\`\`

17. OLL-17 Dot
\`\`\`rubikCubeOLL
.010.
01001
10101
00010
.110.
alg:F R' F' R2 r' U R U' R' U' M' == 3+9,2-6,6-8,8-4,4-2
alg:L U L' U L' B L B' U2 L' B L B' == 1-9,9-7,7-1,2-4,4-6,6-2
\`\`\`

18. OLL-18 Dot
\`\`\`rubikCubeOLL
.010.
01010
10101
00000
.111.
alg:r U R' U R U2 r2 U' R U' R' U2 r == 2+4,6+8
alg:B U2 B2 R B R' U2 S' U B U' b' == 2+4,6+8,1+3,7+9
\`\`\`

19. OLL-19 Dot
\`\`\`rubikCubeOLL
.010.
01010
10101
10001
.010.
alg:r' R U R U R' U' M' R' F R F' == 2-4,4-8,8-6,6-2,3+9
\`\`\`

20. OLL-20 Dot
\`\`\`rubikCubeOLL
.010.
01010
10101
01010
.010.
alg:r U R' U' M2 U R U' R' U' M' == 1-7,7-9,9-3,3-1,2-6,6-8,8-4,4-2
alg:r' R U R U R' U' M2 U R U' r' == 1-3,3-9,9-7,7-1,2-4,4-8,8-6,6-2
\`\`\`

21. OLL-21 Cross
\`\`\`rubikCubeOLL
.101.
00100
01110
00100
.101.
alg:R U2 R' U' R U R' U' R U' R' == 2-4-6
alg:B U B' U B U' B' U B U2 B' == 2-8-4
\`\`\`

22. OLL-22 Cross
\`\`\`rubikCubeOLL
.001.
10100
01110
10100
.001.
alg:R U2 R2 U' R2 U' R2 U2 R == 1+9,3+7,2-4-8
\`\`\`

23. OLL-23 Cross
\`\`\`rubikCubeOLL
.101.
00100
01110
01110
.000.
alg:R2 D' R U2 R' D R U2 R == 1-9-3
alg:L2 D L' U2 L D' L' U2 L' == 1-3-7
\`\`\`

24. OLL-24 Cross
\`\`\`rubikCubeOLL
.100.
00110
01110
00110
.100.
alg:r U R' U' r' F R F' == 1-7-3
alg:B U B D B' U' B D' B2 == 1-7-3
\`\`\`

25. OLL-25 Cross
\`\`\`rubikCubeOLL
.000.
10110
01110
01100
.001.
alg:F' r U R' U' r' F R == 1-9-3
alg:F' L F R' F' L' F R == 1-9-3
\`\`\`

26. OLL-26 Cross
\`\`\`rubikCubeOLL
.000.
10110
01110
00101
.100.
alg:R U2 R' U' R U' R' == 1+9,3+7,2-4-6
alg:F' U' F U' F' U2 F == 1+9,3+7,2-8-4
alg:F' U B U' F U B' U' == 9-7-1
\`\`\`

27. OLL-27 Cross
\`\`\`rubikCubeOLL
.100.
00101
01110
01100
.001.
alg:R U R' U R U2 R' == 1+9,3+7,2-4-6
alg:F' U2 F U F' U F == 1+9,3+7,2-4-8
alg:R U' L' U R' U' L U == 1-9-3
\`\`\`

28. OLL-28 Corners Oriented
\`\`\`rubikCubeOLL
.000.
01110
01101
01010
.010.
alg:r U R' U' r' R U R U' R' == 2-6-8
\`\`\`

29. OLL-29 Awkward Shape
\`\`\`rubikCubeOLL
.100.
00110
01101
00010
.110.
alg:R U R' U' R U' R' F' U' F R U R' == 1-9-7-3,6+8
\`\`\`

30. OLL-30 Awkward Shape
\`\`\`rubikCubeOLL
.000.
10101
01101
01010
.010.
alg:F R' F R2 U' R' U' R U R' F2 == 1-7-9-3,2-4-6-8
alg:F U R U2 R' U' R U2 R' U' F' == 1-9-3-7,2-6-8-4
\`\`\`

31. OLL-31 P Shape
\`\`\`rubikCubeOLL
.100.
00110
10110
00010
.110.
alg:R' U' F U R U' R' F' R == 1+3,2+4
\`\`\`

32. OLL-32 P Shape
\`\`\`rubikCubeOLL
.001.
01100
01101
01000
.011.
alg:L U F' U' L' U L F L' == 1+3,2+6
alg:S' L U L' U' L' B L b' == 2-6-8,3-7-9
\`\`\`

33. OLL-33 T Shape
\`\`\`rubikCubeOLL
.110.
00010
01110
00010
.110.
alg:R U R' U' R' F R F' == 1-7-3,2-8-6
\`\`\`

34. OLL-34 C Shape
\`\`\`rubikCubeOLL
.010.
10001
01110
01010
.010.
alg:R U R2 U' R' F R U R U' F' == 1-3-7,2-8-6
alg:R U R' U' B' R' F R F' B == 1-3-7,2-8-6
\`\`\`

35. OLL-35 Fish Shape
\`\`\`rubikCubeOLL
.010.
01001
10110
00110
.100.
alg:R U2 R2 F R F' R U2 R' == 1+7,3+9,2-6-4
\`\`\`

36. OLL-36 W Shape
\`\`\`rubikCubeOLL
.001.
01100
10110
10010
.010.
alg:L' U' L U' L' U L U L F' L' F == 2+4,6+8,3-7-9
\`\`\`

37. OLL-37 Fish Shape
\`\`\`rubikCubeOLL
.000.
01101
01101
00010
.110.
alg:F R' F' R U R U' R' == 1-3-7,2-4-6
alg:F R U' R' U' R U R' F' == 1-9-3-7,2-4-6-8
\`\`\`

38. OLL-38 W Shape
\`\`\`rubikCubeOLL
.100.
00110
01101
01001
.010.
alg:R U R' U R U' R' U' R' F R F' == 1-9-7,2+4,6+8
\`\`\`

39. OLL-39 Big Lightning Bolt
\`\`\`rubikCubeOLL
.110.
00010
01110
01001
.010.
alg:L F' L' U' L U F U' L' == 1+3,2+6
\`\`\`

40. OLL-40 Big Lightning Bolt
\`\`\`rubikCubeOLL
.011.
01000
01110
10010
.010.
alg:R' F R U R' U' F' U R == 1+3,2+4
\`\`\`

41. OLL-41 Awkward Shape
\`\`\`rubikCubeOLL
.101.
00100
01101
01010
.010.
alg:R U R' U R U2 R' F R U R' U' F' == 1+7,3+9,2+4,6+8
\`\`\`

42. OLL-42 Awkward Shape
\`\`\`rubikCubeOLL
.010.
01010
01101
00100
.101.
alg:R' U' R U' R' U2 R F R U R' U' F' == 1+7,3+9,2-8-4
\`\`\`

43. OLL-43 P Shape
\`\`\`rubikCubeOLL
.000.
10110
10110
10010
.010.
alg:F' U' L' U L F == 1+3,7+9,2-4-8
alg:R' U' F R' F' R U R == 1+3,7+9,4-6-8
\`\`\`

44. OLL-44 P Shape
\`\`\`rubikCubeOLL
.000.
01101
01101
01001
.010.
alg:F U R U' R' F' == 1+3,7+9,2-6-8
alg:b L U L' U' b' == 1+3,7+9,2-4-8
\`\`\`

45. OLL-45 T Shape
\`\`\`rubikCubeOLL
.010.
10010
01110
10010
.010.
alg:F R U R' U' F' == 1+3,7+9,2-8-6
\`\`\`

46. OLL-46 C Shape
\`\`\`rubikCubeOLL
.000.
01101
10101
01101
.000.
alg:R' U' R' F R F' U R == 1+3,7+9,4-8-6
\`\`\`

47. OLL-47 Small L Shape
\`\`\`rubikCubeOLL
.100.
00101
10110
00001
.110.
alg:R' U' R' F R F' R' F R F' U R == 4-8-6
alg:F' L' U' L U L' U' L U F == 2-4-8
alg:L U F U' F' L' F U F' U F U2 F' == 1+3,7+9,2-8-4
\`\`\`

48. OLL-48 Small L Shape
\`\`\`rubikCubeOLL
.001.
10100
01101
10000
.011.
alg:F R U R' U' R U R' U' F' == 2-4-8
\`\`\`

49. OLL-49 Small L Shape
\`\`\`rubikCubeOLL
.001.
10100
10110
10000
.011.
alg:r U' r2 U r2 U r2 U' r == 1+9,3+7,2-8-4
\`\`\`

50. OLL-50 Small L Shape
\`\`\`rubikCubeOLL
.011.
10000
10110
10100
.001.
alg:r' U r2 U' r2 U' r2 U r' == 1+9,3+7,2-4-8
\`\`\`

51. OLL-51 I Shape
\`\`\`rubikCubeOLL
.110.
00001
01110
00001
.110.
alg:F U R U' R' U R U' R' F' == 2-8-6
alg:b L U L' U' L U L' U' b' == 2-8-6
\`\`\`

52. OLL-52 I Shape
\`\`\`rubikCubeOLL
.100.
00101
10101
00101
.100.
alg:R U R' U R U' B U' B' R' == 1+3,7+9
alg:L' B' U' B U' L U L' U L == 1+3,7+9
alg:R U R' U R U' y R U' R' F' == 1+3,7+9
\`\`\`

53. OLL-53 Small L Shape
\`\`\`rubikCubeOLL
.101.
00100
10110
00000
.111.
alg:l' U2 L U L' U' L U L' U l == 4-6-8
alg:b' U' B U' B' U B U' B' U2 b == 2-8-6
\`\`\`

54. OLL-54 Small L Shape
\`\`\`rubikCubeOLL
.101.
00100
01101
00000
.111.
alg:r U2 R' U' R U R' U' R U' r' == 4-6-8
alg:b U B' U B U' B' U B U2 b' == 2-8-4
\`\`\`

55. OLL-55 I Shape
\`\`\`rubikCubeOLL
.111.
00000
01110
00000
.111.
alg:R' F R U R U' R2 F' R2 U' R' U R U R' == 1-7-9-3,2-8-6-4
alg:B U2 B2 U' B U' B' U2 R B R' == 3-9-7,4-8-6
\`\`\`

56. OLL-56 I Shape
\`\`\`rubikCubeOLL
.010.
10001
01110
10001
.010.
alg:r' U' r U' R' U R U' R' U R r' U r == 2-4-8
alg:r U r' U R U' R' U R U' R' r U' r' == 2-8-6
alg:r U r' U R U' R' U R U' M' U' r' == 2-8-6
\`\`\`

 57. OLL-57 Corners Oriented
\`\`\`rubikCubeOLL
.010.
01010
01110
01010
.010.
alg:R U R' U' M' U R U' r' == 2-8-6
\`\`\`
`

/* Ready-to-use code blocks */
export const CodeBlocks = {
  template_3x3_oll,
  template_3x3_pll,
  dominoCube_4_PllAlgorithms,
  rubikCube_21_PllAlgorithms,
  rubikCube_57_OllAlgorithms
} as const


