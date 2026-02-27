# Basic OLL examples
> [!info]+ OLL: Orient Last Layer

Algorithms taken from:
- https://jperm.net/algs/oll
Alternative data:
- https://www.cubeskills.com/uploads/pdf/tutorials/oll-algorithms.pdf
- https://www.cubeskills.com/uploads/pdf/tutorials/pll-algorithms.pdf

1. OLL-1 Dot
```rubikCubeOLL
.010.
10001
10101
10001
.010.
alg:R U2 R2 F R F' U2 R' F R F'
```
2. OLL-2 Dot
```rubikCubeOLL
.111.
00000
10101
10001
.010.
alg:r U r' U2 r U2 R' U2 R U' r'
alg:y' F R U R' U' F' f R U R' U' f'
alg:y' F R U R' U' S R U R' U' f'

```
3. OLL-3 Dot
```rubikCubeOLL
.110.
00001
10101
01000
.011.
alg:r' R2 U R' U r U2 r' U M'
alg:y F U R U' R' F' U F R U R' U' F'
alg:y' f R U R' U' f' U' F R U R' U' F'
```
4. OLL-4 Dot
```rubikCubeOLL
.011.
10000
10101
00010
.110.
alg:M U' r U2 r' U' R U' R' M'
alg:y F U R U' R' F' U' F R U R' U' F'
alg:y' f R U R' U' f' U F R U R' U' F'
```
5. OLL-5 Square Shape
```rubikCubeOLL
.000.
01101
01101
10000
.011.
alg:l' U2 L U L' U l
alg:y2 r' U2 R U R' U r
```
6. OLL-5 Square Shape
```rubikCubeOLL
.000.
10110
10110
00001
.110.
alg:r U2 R' U' R U' r'
```
7. OLL-7 Small Lightning Bolt
```rubikCubeOLL
.100.
00101
01101
01000
.011.
alg:r U R' U R U2 r'
```
8. OLL-8 Small Lightning Bolt
```rubikCubeOLL
.001.
10100
10110
00010
.110.
alg:l' U' L U' L' U2 l
alg:R U2 R' U2 R' F R F'
alg:y2 r' U' R U' R' U2 r
```
9. OLL-9 Fish Shape
```rubikCubeOLL
.001.
10100
01101
00010
.110.
alg:R U R' U' R' F R2 U R' U' F'
```
10. OLL-10 Fish Shape
```rubikCubeOLL
.110.
00010
01101
10100
.001.
alg:R U R' U R' F R F' R U2 R'
alg:y2 r U R' U R U' R' U' r' R U R U' R'
```
11. OLL-11 Small Lightning Bolt
```rubikCubeOLL
.100.
00110
01101
10000
.011.
alg:r U R' U R' F R F' R U2 r'
alg:y2 r' R2 U R' U R U2 R' U M'
```
12. OLL-12 Small Lightning Bolt
```rubikCubeOLL
.000.
01100
10110
00001
.110.
alg:M' R' U' R U' R' U2 R U' R r'
```
13. OLL-13 Knight Move Shape
```rubikCubeOLL
.110.
00001
01110
01000
.011.
alg:F U R U' R2 F' R U R U' R'
alg:r U' r' U' r U r' y' R' U R
```
14. OLL-14 Knight Move Shape
```rubikCubeOLL
.011.
10000
01110
00010
.110.
alg:R' F R U R' F' R F U' F'
```
15. OLL-15 Knight Move Shape
```rubikCubeOLL
.010.
01001
01110
10000
.011.
alg:l' U' l L' U' L U l' U l
alg:y2 r' U' r R' U' R U r' U r
```
16. OLL-16 Knight Move Shape
17. OLL-17 Dot
18. OLL-18 Dot
19. OLL-19 Dot
20. OLL-20 Dot
21. OLL-21 Cross
22. OLL-22 Cross
23. OLL-23 Cross
24. OLL-24 Cross
25. OLL-25 Cross
26. OLL-26 Cross
27. OLL-27 Cross
28. OLL-28 Corners Oriented
29. OLL-29 Awkward Shape
30. OLL-30 Awkward Shape
31. OLL-31 P Shape
32. OLL-32 P Shape
33. OLL-33 T Shape
34. OLL-34 C Shape
35. OLL-35 Fish Shape
36. OLL-36 W Shape
37. OLL-37 Fish Shape
38. OLL-38 W Shape
```rubikCubeOLL
.100.
00110
01101
01001
.010.
alg:R U R' U R U' R' U' R' F R F'
```
39. OLL-39 Big Lightning Bolt
40. OLL-40 Big Lightning Bolt
41. OLL-41 Awkward Shape
42. OLL-42 Awkward Shape
43. OLL-43 P Shape
44. OLL-44 P Shape
45. OLL-45 T Shape
46. OLL-46 C Shape
47. OLL-47 Small L Shape
48. OLL-48 Small L Shape
49. OLL-49 Small L Shape
50. OLL-50 Small L Shape
51. OLL-51 I Shape
52. OLL-52 I Shape
53. OLL-53 Small L Shape
54. OLL-54 Small L Shape
```rubikCubeOLL
.101.
00100
01101
00000
.111.
alg:r U2 R' U' R U R' U' R U' r'
alg:y r U R' U R U' R' U R U2 r'
```
39. OLL-55 I Shape
```rubikCubeOLL
.111.
00000
01110
00000
.111.
alg:R' F R U R U' R2 F' R2 U' R' U R U R'
alg:y R U2 R2 U' R U' R' U2 F R F'
```
39. OLL-56 I Shape
```rubikCubeOLL
.010.
10001
01110
10001
.010.
alg:r' U' r U' R' U R U' R' U R r' U r
alg:r U r' U R U' R' U R U' R' r U' r'
alg:r U r' U R U' R' U R U' M' U' r'
```
 57. OLL-57 Corners Oriented
```rubikCubeOLL
.010.
01010
01110
01010
.010.
alg:R U R' U' M' U R U' r'
```