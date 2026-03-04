# 3x3 OLL examples
> [!info]+ OLL: Orientation of Last Layer

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
alg:R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3
```

2. OLL-2 Dot
```rubikCubeOLL
.111.
00000
10101
10001
.010.
alg:r U r' U2 r U2 R' U2 R U' r' == 2+4,6+8,1+9,3+7
alg:L F U F' U' L' l F U F' U' l' == 2+6,4+8
alg:L F U F' U' M F U F' U' l' == 2+6,4+8
```

3. OLL-3 Dot
```rubikCubeOLL
.110.
00001
10101
01000
.011.
alg:r' R2 U R' U r U2 r' U M'
alg:R U B U' B' R' U R B U B' U' R'
alg:l F U F' U' l' U' L F U F' U' L'
```

4. OLL-4 Dot
```rubikCubeOLL
.011.
10000
10101
00010
.110.
alg:M U' r U2 r' U' R U' R' M'
alg:R U B U' B' R' U' R B U B' U' R'
alg:l F U F' U' l' U L F U F' U' L'
```

5. OLL-5 Square Shape
```rubikCubeOLL
.000.
01101
01101
10000
.011.
alg:l' U2 L U L' U l
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
alg:l U L' U L U' L' U' l' L U L U' L'
```

11. OLL-11 Small Lightning Bolt
```rubikCubeOLL
.100.
00110
01101
10000
.011.
alg:r U R' U R' F R F' R U2 r'
alg:l' L2 U L' U L U2 L' U M
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
alg:F U R U' R2 F' R U R U' R' == 2-8,8-6,6-2,1-7,7-9,9-1
alg:r U' r' U' r U r' y' R' U R == 2-8,8-4,4-2,1-9,9-3,3-1
```

14. OLL-14 Knight Move Shape
```rubikCubeOLL
.011.
10000
01110
00010
.110.
alg:R' F R U R' F' R F U' F' == 2-6,6-8,8-2,1-3,3-7,7-1
```

15. OLL-15 Knight Move Shape
```rubikCubeOLL
.010.
01001
01110
10000
.011.
alg:l' U' l L' U' L U l' U l == 2-8,8-4,4-2,1+9,3+7
```

16. OLL-16 Knight Move Shape
```rubikCubeOLL
.010.
10010
01110
00001
.110.
alg:r U r' R U R' U' r U' r' == 1+9,3+7,2-8,8-6,6-2
```

17. OLL-17 Dot
```rubikCubeOLL
.010.
01001
10101
00010
.110.
alg:F R' F' R2 r' U R U' R' U' M' == 3+9,2-6,6-8,8-4,4-2
alg:L U L' U L' B L B' U2 L' B L B' == 1-9,9-7,7-1,2-4,4-6,6-2
```

18. OLL-18 Dot
```rubikCubeOLL
.010.
01010
10101
00000
.111.
alg:r U R' U R U2 r2 U' R U' R' U2 r == 2+4,6+8
alg:B U2 B2 R B R' U2 S' U B U' b' == 2+4,6+8,1+3,7+9
```

19. OLL-19 Dot
```rubikCubeOLL
.010.
01010
10101
10001
.010.
alg:r' R U R U R' U' M' R' F R F' == 2-4,4-8,8-6,6-2,3+9
```

20. OLL-20 Dot
```rubikCubeOLL
.010.
01010
10101
01010
.010.
alg:r U R' U' M2 U R U' R' U' M' == 1-7,7-9,9-3,3-1,2-6,6-8,8-4,4-2
alg:r' R U R U R' U' M2 U R U' r' == 1-3,3-9,9-7,7-1,2-4,4-8,8-6,6-2
```

21. OLL-21 Cross
```rubikCubeOLL
.101.
00100
01110
00100
.101.
alg:R U2 R' U' R U R' U' R U' R'
alg:B U B' U B U' B' U B U2 B'
```

22. OLL-22 Cross
```rubikCubeOLL
.001.
10100
01110
10100
.001.
alg:R U2 R2 U' R2 U' R2 U2 R
```

23. OLL-23 Cross
```rubikCubeOLL
.101.
00100
01110
01110
.000.
alg:R2 D' R U2 R' D R U2 R
alg:L2 D L' U2 L D' L' U2 L'
```

24. OLL-24 Cross
```rubikCubeOLL
.100.
00110
01110
00110
.100.
alg:r U R' U' r' F R F'
alg:B U B D B' U' B D' B2
```

25. OLL-25 Cross
```rubikCubeOLL
.000.
10110
01110
01100
.001.
alg:F' r U R' U' r' F R
alg:F' L F R' F' L' F R
```

26. OLL-26 Cross
```rubikCubeOLL
.000.
10110
01110
00101
.100.
alg:R U2 R' U' R U' R'
alg:F' U' F U' F' U2 F
```

27. OLL-27 Cross
```rubikCubeOLL
.100.
00101
01110
01100
.001.
alg:R U R' U R U2 R'
alg:F' U2 F U F' U F
```

28. OLL-28 Corners Oriented
```rubikCubeOLL
.000.
01110
01101
01010
.010.
alg:r U R' U' r' R U R U' R'
```

29. OLL-29 Awkward Shape
```rubikCubeOLL
.100.
00110
01101
00010
.110.
alg:R U R' U' R U' R' F' U' F R U R'
```

30. OLL-30 Awkward Shape
```rubikCubeOLL
.000.
10101
01101
01010
.010.
alg:F R' F R2 U' R' U' R U R' F2
alg:F U R U2 R' U' R U2 R' U' F'
```

31. OLL-31 P Shape
```rubikCubeOLL
.100.
00110
10110
00010
.110.
alg:R' U' F U R U' R' F' R
```

32. OLL-32 P Shape
```rubikCubeOLL
.001.
01100
01101
01000
.011.
alg:L U F' U' L' U L F L'
alg:S' L U L' U' L' B L b'
```

33. OLL-33 T Shape
```rubikCubeOLL
.110.
00010
01110
01010
.110.
alg:R U R' U' R' F R F'
```

34. OLL-34 C Shape
```rubikCubeOLL
.010.
10001
01110
01010
.010.
alg:R U R2 U' R' F R U R U' F'
alg:R U R' U' B' R' F R F' B
```

35. OLL-35 Fish Shape
```rubikCubeOLL
.010.
01001
10110
00110
.100.
alg:R U2 R2 F R F' R U2 R'
```

36. OLL-36 W Shape
```rubikCubeOLL
.001.
01100
10110
10010
.010.
alg:L' U' L U' L' U L U L F' L' F
```

37. OLL-37 Fish Shape
```rubikCubeOLL
.000.
01101
01101
00010
.110.
alg:F R' F' R U R U' R'
alg:F R U' R' U' R U R' F'
```

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
```rubikCubeOLL
.110.
00010
01110
01001
.010.
alg:L F' L' U' L U F U' L'
```

40. OLL-40 Big Lightning Bolt
```rubikCubeOLL
.011.
01000
01110
10010
.010.
alg:R' F R U R' U' F' U R
```

41. OLL-41 Awkward Shape
```rubikCubeOLL
.101.
00100
01101
01010
.010.
alg:R U R' U R U2 R' F R U R' U' F'
```

42. OLL-42 Awkward Shape
```rubikCubeOLL
.010.
01010
01101
00100
.101.
alg:R' U' R U' R' U2 R F R U R' U' F'
```

43. OLL-43 P Shape
```rubikCubeOLL
.000.
10110
10110
10010
.010.
alg:F' U' L' U L F
alg:R' U' F R' F' R U R
```

44. OLL-44 P Shape
```rubikCubeOLL
.000.
01101
01101
01001
.010.
alg:F U R U' R' F'
alg:b L U L' U' b'
```

45. OLL-45 T Shape
```rubikCubeOLL
.010.
10010
01110
10010
.010.
alg:F R U R' U' F'
```

46. OLL-46 C Shape
```rubikCubeOLL
.000.
01101
10101
01101
.000.
alg:R' U' R' F R F' U R
```

47. OLL-47 Small L Shape
```rubikCubeOLL
.100.
00101
10110
00001
.110.
alg:R' U' R' F R F' R' F R F' U R
alg:F' L' U' L U L' U' L U F
alg:L U F U' F' L' F U F' U F U2 F'
```

48. OLL-48 Small L Shape
```rubikCubeOLL
.001.
10100
01101
10000
.011.
alg:F R U R' U' R U R' U' F'
```

49. OLL-49 Small L Shape
```rubikCubeOLL
.001.
10100
10110
10000
.011.
alg:r U' r2 U r2 U r2 U' r
```

50. OLL-50 Small L Shape
```rubikCubeOLL
.011.
10000
10110
10100
.001.
alg:r' U r2 U' r2 U' r2 U r'
```

51. OLL-51 I Shape
```rubikCubeOLL
.110.
00001
01110
00001
.110.
alg:F U R U' R' U R U' R' F'
alg:b L U L' U' L U L' U' b'
```

52. OLL-52 I Shape
```rubikCubeOLL
.100.
00101
10101
00101
.100.
alg:R U R' U R U' B U' B' R'
alg:L' B' U' B U' L U L' U L
alg:R U R' U R U' y R U' R' F'
```

53. OLL-53 Small L Shape
```rubikCubeOLL
.101.
00100
10110
00000
.111.
alg:l' U2 L U L' U' L U L' U l
alg:b' U' B U' B' U B U' B' U2 b
```

54. OLL-54 Small L Shape
```rubikCubeOLL
.101.
00100
01101
00000
.111.
alg:r U2 R' U' R U R' U' R U' r'
alg:b U B' U B U' B' U B U2 b'
```

55. OLL-55 I Shape
```rubikCubeOLL
.111.
00000
01110
00000
.111.
alg:R' F R U R U' R2 F' R2 U' R' U R U R'
alg:B U2 B2 U' B U' B' U2 R B R'
```

56. OLL-56 I Shape
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