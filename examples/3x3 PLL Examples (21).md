# 3x3 PLL examples
> [!info]+ PLL: Permutation of Last Layer

Algorithms taken from:
- https://jperm.net/algs/pll
Alternative data:
- https://www.cubeskills.com/uploads/pdf/tutorials/oll-algorithms.pdf
- https://www.cubeskills.com/uploads/pdf/tutorials/pll-algorithms.pdf
Min. Plugin version:
- 0.0.4

1. PLL-Aa Adjacent Corner Swap
```rubikCubePLL
arrows:1-3,3-7,7-1
alg:x L2 D2 L' U' L D2 L' U L'
alg:z' B' U B' D2 B U' B' D2 B2
```

2. PLL-Ab Adjacent Corner Swap
```rubikCubePLL
arrows:1-7,7-9,9-1
alg:x' L2 D2 L U L' D2 L U' L
alg:z B U' B D2 B' U B D2 B2
```

3. PLL-F Adjacent Corner Swap
```rubikCubePLL
arrows:2+8,3+9
alg:R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R
```

4. PLL-Ga Adjacent Corner Swap
```rubikCubePLL
arrows:1-3,3-7,7-1,2-4,4-6,6-2
alg:R2 U R' U R' U' R U' R2 U' D R' U R D'
alg:R2 u R' U R' U' R u' R2 y' R' U R
```

5. PLL-Gb Adjacent Corner Swap
```rubikCubePLL
arrows:1-7,7-3,3-1,2-6,6-4,4-2
alg:R' U' R U D' R2 U R' U R U' R U' R2 D
alg:R' U' R B2 u B' U B U' B u' B2
```

6. PLL-Gc Adjacent Corner Swap
```rubikCubePLL
arrows:1-7,7-9,9-1,4-6,6-8,8-4
alg:R2 U' R U' R U R' U R2 U D' R U' R' D
alg:L2 B2 L U2 L U2 L' B L U L' U' L' B L2
alg:R2 u' R U' R U R' u R2 y R U' R'
```

7. PLL-Gd Adjacent Corner Swap
```rubikCubePLL
arrows:1-3,3-7,7-1,2-4,4-8,8-2
alg:R U R' U' D R2 U' R U' R' U R' U R2 D'
alg:R U R' y' R2 u' R U' R' U R' u R2
```

8. PLL-Ja Adjacent Corner Swap
```rubikCubePLL
arrows:2+6,3+9
alg:x R2 F R F' R U2 r' U r U2
alg:R' U' R B R' U' R U R B' R2 U R
alg:F' U B' U2 F U' F' U2 F B
```

9. PLL-Jb Adjacent Corner Swap
```rubikCubePLL
arrows:6+8,3+9
alg:R U R' F' R U R' U' R' F R2 U' R'
```

10. PLL-Ra Adjacent Corner Swap
```rubikCubePLL
arrows:2+4,3+9
alg:R U' R' U' R U R D R' U' R D' R' U2 R'
alg:R U R' F' R U2 R' U2 R' F R U R U2 R'
alg:B U2 B' U2 B L' B' U' B U B L B2
```

11. PLL-Rb Adjacent Corner Swap
```rubikCubePLL
arrows:4+8,3+9
alg:R2 F R U R U' R' F' R U2 R' U2 R
alg:F' U2 F U2 F' L F U F' U' F' L' F2
alg:R' U2 R' D' R U' R' D R U R U' R' U' R
```

12. PLL-T Adjacent Corner Swap
```rubikCubePLL
arrows:4+6,3+9
alg:R U R' U' R' F R2 U' R' U' R U R' F'
```

13. PLL-E Diagonal Corner Swap
```rubikCubePLL
arrows:1+7,3+9
alg:x' L' U L D' L' U' L D L' U' L D' L' U L D
alg:x' R U' R' D R U R' D' R U R' D R U' R' D'
```

14. PLL-Na Diagonal Corner Swap
```rubikCubePLL
arrows:3+7,4+6
alg:R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'
alg:z U R' D R2 U' R D' U R' D R2 U' R D'
```

15. PLL-Nb Diagonal Corner Swap
```rubikCubePLL
arrows:1+9,4+6
alg:R' U R U' R' F' U' F R U R' F R' F' R U' R
alg:z D' R U' R2 D R' U D' R U' R2 D R' U
```

16. PLL-V Diagonal Corner Swap
```rubikCubePLL
arrows:1+9,2+6
alg:R' U R' U' y R' F' R2 U' R' U R' F R F
alg:R' U R' U' R D' R' D R' U D' R2 U' R2 D R2
alg:z D' R2 D R2 U R' D' R U' R U R' D R U' z'
alg:R U2 R' D R U' R U' R U R2 D R' U' R D2
alg:x' R' F R F' U R U2 R' U' R U' R' U2 R U R' U'
```

17. PLL-Y Diagonal Corner Swap
```rubikCubePLL
arrows:1+9,2+4
alg:F R U' R' U' R U R' F' R U R' U' R' F R F'
alg:F R' F R2 U' R' U' R U R' F' R U R' U' F'
```

18. PLL-H Edges Only
```rubikCubePLL
arrows:2+8,4+6
alg:M2 U M2 U2 M2 U M2
alg:M2 U' M2 U2 M2 U' M2
```

19. PLL-Ua Edges Only
```rubikCubePLL
arrows:4-8,8-6,6-4
alg:M2 U M U2 M' U M2
alg:R U' R U R U R U' R' U' R2
alg:L2 U' L' U' L U L U L U' L
```

20. PLL-Ub Edges Only
```rubikCubePLL
arrows:4-6,6-8,8-4
alg:M2 U' M U2 M' U' M2
alg:R2 U R U R' U' R' U' R' U R'
alg:L' U L' U' L' U' L' U L U L2
```

21. PLL-Z Edges Only
```rubikCubePLL
arrows:2+6,4+8
alg:M' U M2 U M2 U M' U2 M2
alg:S' U' S2 U' S2 U' S' U2 S2
alg:S2 U S2 U S' U2 S2 U2 S'
alg:M2 U' M2 U' M' U2 M2 U2 M'
```- S' U' S2 U' S2 U' S' U2 S2