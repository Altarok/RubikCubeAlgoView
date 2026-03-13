import {describe, it, expect, beforeEach} from 'vitest';
import {Algorithm, Algorithms, AlgorithmStep, MappedAlgorithm, MappedAlgorithms} from "../src/model/algorithms";
import {Arrows} from "../src/model/geometry";

const validAlgorithm = ["F", "R", "U"] as AlgorithmStep[];

let alg1FRU = createAlgorithm(["F", "R", "U"]);
let alg2FLU = createAlgorithm(["F", "L", "U"]);

function createAlgorithm(steps: AlgorithmStep[]): Algorithm {
  return new Algorithm(steps);
}

describe('Algorithm', () => {

  beforeEach(() => {
    alg1FRU = createAlgorithm(["F", "R", "U"]);
    alg2FLU = createAlgorithm(["F", "L", "U"]);
  });

  it('should create distinct hash values on creation', () => {
    const alg1 = createAlgorithm(validAlgorithm);
    const alg2 = createAlgorithm(validAlgorithm);
    expect(alg1).toBeTruthy();
    expect(alg2).toBeTruthy();
    expect(alg1.initialHash).not.toMatch(alg2.initialHash);
  });

  it('should not pre-fill pointer to related algorithmLabel on creation', () => {
    const alg = createAlgorithm(validAlgorithm);
    expect(alg.algorithmLabel).toBeFalsy();
  });

  it('should create a readable string representation', () => {
    expect(alg1FRU.toString()).toBe('F R U');
  });

  it('should change on rotation', () => {
    const toStringBeforeRotation = alg1FRU.toString();

    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
    alg1FRU.rotate(1);
    expect(alg1FRU.toString()).not.toMatch(toStringBeforeRotation);
  });

  it('should not change on invalid rotation (0 degrees)', () => {
    const toStringBeforeRotation = alg1FRU.toString();

    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
    alg1FRU.rotate(0);
    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
  });


  it('should not change on full rotation (360 degrees)', () => {
    const toStringBeforeRotation = alg1FRU.toString();

    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
    alg1FRU.rotate(4);
    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
    alg1FRU.rotate(-4);
    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
  });

  it('should not change on reversed rotation (total = 0 degrees)', () => {
    const toStringBeforeRotation = alg1FRU.toString();

    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
    alg1FRU.rotate(2);
    alg1FRU.rotate(-4);
    alg1FRU.rotate(2);
    expect(alg1FRU.toString()).toMatch(toStringBeforeRotation);
  });

});

describe('Algorithms (Algorithm[] container)', () => {

  let algorithms: Algorithms;

  beforeEach(() => {
    alg1FRU = createAlgorithm(["F", "R", "U"]);
    alg2FLU = createAlgorithm(["F", "L", "U"]);
    algorithms = new Algorithms();
    algorithms.add(alg1FRU);
    algorithms.add(alg2FLU);
  });

  it('should do nothing on creation', () => {
    const newAlgorithms = new Algorithms();
    expect(newAlgorithms.items).toBeTruthy();
    expect(newAlgorithms.items.length).toBe(0);
    expect(newAlgorithms.length()).toBe(0);
  });

  it('should not fail when rotating empty container', () => {
    const newAlgorithms = new Algorithms();
    newAlgorithms.rotate(1);
  });

  it('should rotate all its children equally', () => {
    expect(algorithms.items.length).toBe(2);

    const alg1BeforeRotation = algorithms.items[0]!.toString();
    const alg2BeforeRotation = algorithms.items[1]!.toString();

    expect(alg1BeforeRotation).toBe('F R U');
    expect(alg2BeforeRotation).toBe('F L U');

    algorithms.rotate(1);

    const alg1AfterRotation = algorithms.items[0]!.toString();
    const alg2AfterRotation = algorithms.items[1]!.toString();

    expect(alg1AfterRotation).toBe('L F U');
    expect(alg2AfterRotation).toBe('L B U');
  });

});


describe('MappedAlgorithm (Algorithm-Arrow[] container)', () => {

  const noArrows: Arrows = [];

  beforeEach(() => {
    alg1FRU = createAlgorithm(["F", "R", "U"]);
    alg2FLU = createAlgorithm(["F", "L", "U"]);
  });

  it('should do nothing on creation', () => {
    const mappedAlgorithm = new MappedAlgorithm(alg1FRU, noArrows);
    expect(mappedAlgorithm.algorithm).toEqual(alg1FRU);
    expect(mappedAlgorithm.algorithm).not.toEqual(alg2FLU);
    expect(mappedAlgorithm.arrows).toEqual(noArrows);
  });

  it('should rotate its algorithm properly', () => {
    const mappedAlgorithm = new MappedAlgorithm(alg1FRU, noArrows);
    expect(mappedAlgorithm.algorithm).toEqual(alg1FRU);

    const beforeRotation = mappedAlgorithm.algorithm.toString();
    expect(beforeRotation).toBe('F R U');

    mappedAlgorithm.rotate(1);

    const afterRotation = mappedAlgorithm.algorithm.toString();
    expect(afterRotation).toBe('L F U');
  });

});

describe('MappedAlgorithms (string-MappedAlgorithm map)', () => {

  const noArrows: Arrows = [];
  const emptyAlgorithms = new MappedAlgorithms();
  let mappedAlgorithms: MappedAlgorithms;
  let mappedAlgorithm1: MappedAlgorithm;
  let mappedAlgorithm2: MappedAlgorithm;

  beforeEach(() => {
    alg1FRU = createAlgorithm(["F", "R", "U"]);
    alg2FLU = createAlgorithm(["F", "L", "U"]);
    mappedAlgorithm1 = new MappedAlgorithm(alg1FRU, noArrows);
    mappedAlgorithm2 = new MappedAlgorithm(alg2FLU, noArrows);

    mappedAlgorithms = new MappedAlgorithms();
    mappedAlgorithms.add(mappedAlgorithm1);
    mappedAlgorithms.add(mappedAlgorithm2);
  });

  it('should do nothing on creation', () => {
    expect(emptyAlgorithms.map.size).toBe(0);
  });

  it('should not fail when rotating empty container', () => {
    emptyAlgorithms.rotate(1);
  });

  it('should not provide data with wrong hash', () => {
    const mappedAlgorithm = mappedAlgorithms.get('asdf');
    expect(mappedAlgorithm).toBeUndefined();
  });

  it("should provide proper data with algorithm's hash", () => {
    expect(alg1FRU.initialHash).not.toBe(alg2FLU.initialHash);

    let mappedAlgorithm: MappedAlgorithm = mappedAlgorithms.get(alg1FRU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm1);

    mappedAlgorithm = mappedAlgorithms.get(alg2FLU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm2);
  });

  it("should provide proper data with algorithm's hash - after rotation", () => {
    expect(alg1FRU.initialHash).not.toBe(alg2FLU.initialHash);

    let mappedAlgorithm: MappedAlgorithm = mappedAlgorithms.get(alg1FRU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm1);

    mappedAlgorithm = mappedAlgorithms.get(alg2FLU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm2);

    mappedAlgorithms.rotate(1);

    mappedAlgorithm = mappedAlgorithms.get(alg1FRU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm1);

    mappedAlgorithm = mappedAlgorithms.get(alg2FLU.initialHash)!;
    expect(mappedAlgorithm).toEqual(mappedAlgorithm2);
  });

  it("should provide inner map's size", () => {
    expect(mappedAlgorithms.map.size).toBe(2);
    expect(mappedAlgorithms.map.size).toBe(mappedAlgorithms.size());
    mappedAlgorithms.add(new MappedAlgorithm(createAlgorithm(validAlgorithm), noArrows));
    expect(mappedAlgorithms.map.size).toBe(3);
    expect(mappedAlgorithms.map.size).toBe(mappedAlgorithms.size());
    mappedAlgorithms.add(new MappedAlgorithm(createAlgorithm(validAlgorithm), noArrows));
    expect(mappedAlgorithms.map.size).toBe(4);
    expect(mappedAlgorithms.map.size).toBe(mappedAlgorithms.size());
  });

  it('should correctly filter algorithms on demand', () => {
    const allItems = mappedAlgorithms.getAllItems();

    expect(allItems).toBeTruthy();
    expect(allItems.length).toBe(2);
    expect(allItems[0]).toEqual(alg1FRU);
    expect(allItems[1]).toEqual(alg2FLU);
  });

  it('should create a readable string representation', () => {
    const description  = mappedAlgorithms.toString();

    expect(description).toBe('0: [F R U] (0 arrows)\n1: [F L U] (0 arrows)');
  });

});
