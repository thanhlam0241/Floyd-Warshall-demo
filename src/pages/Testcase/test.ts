import { Point, Edge, Graph, PVEdge } from "../graphType";
export const graph1: Graph = {
  points: [
    { id: 1, x: 380, y: 100, numberOfStudent: 0 },
    { id: 2, x: 250, y: 170, numberOfStudent: 3 },
    { id: 3, x: 450, y: 300, numberOfStudent: 5 },
    { id: 4, x: 156, y: 165, numberOfStudent: 9 },
  ],
  edges: [
    { pointOne: 1, pointTwo: 2, weight: 1 },
    { pointOne: 1, pointTwo: 3, weight: 2 },
    { pointOne: 1, pointTwo: 4, weight: 4 },
    { pointOne: 2, pointTwo: 3, weight: 2 },
    { pointOne: 2, pointTwo: 4, weight: 1 },
    { pointOne: 3, pointTwo: 4, weight: 3 },
  ],
};
export const limit1 = {
  timeLimit: 6,
  loadLimit: 10,
};
export const graph2: Graph = {
  points: [
    { id: 1, x: 263, y: 276, numberOfStudent: 0 },
    { id: 2, x: 52, y: 97, numberOfStudent: 2 },
    { id: 3, x: 100, y: 250, numberOfStudent: 3 },
    { id: 4, x: 100, y: 456, numberOfStudent: 4 },
    { id: 5, x: 240, y: 400, numberOfStudent: 5 },
    { id: 6, x: 240, y: 70, numberOfStudent: 7 },
    { id: 7, x: 400, y: 240, numberOfStudent: 8 },
    { id: 8, x: 300, y: 90, numberOfStudent: 9 },
    { id: 9, x: 454, y: 290, numberOfStudent: 10 },
  ],
  edges: [
    { pointOne: 1, pointTwo: 2, weight: 1 },
    { pointOne: 1, pointTwo: 3, weight: 3 },
    { pointOne: 1, pointTwo: 4, weight: 4 },
    { pointOne: 1, pointTwo: 5, weight: 5 },
    { pointOne: 1, pointTwo: 6, weight: 6 },
    { pointOne: 1, pointTwo: 7, weight: 3 },
    { pointOne: 1, pointTwo: 8, weight: 2 },
    { pointOne: 1, pointTwo: 9, weight: 5 },
    { pointOne: 2, pointTwo: 3, weight: 1 },
    { pointOne: 2, pointTwo: 4, weight: 2 },
    { pointOne: 3, pointTwo: 4, weight: 1 },
    { pointOne: 4, pointTwo: 5, weight: 5 },
    { pointOne: 4, pointTwo: 6, weight: 2 },
    { pointOne: 5, pointTwo: 7, weight: 6 },
    { pointOne: 6, pointTwo: 7, weight: 3 },
    { pointOne: 7, pointTwo: 8, weight: 4 },
    { pointOne: 7, pointTwo: 9, weight: 2 },
  ],
};
export const limit2 = {
  timeLimit: 20,
  loadLimit: 20,
};

export const graph3: Graph = {
  points: [
    { id: 1, x: 263, y: 276, numberOfStudent: 0 },
    { id: 2, x: 152, y: 97, numberOfStudent: 2 },
    { id: 3, x: 100, y: 250, numberOfStudent: 3 },
    { id: 4, x: 500, y: 456, numberOfStudent: 10 },
    { id: 5, x: 240, y: 400, numberOfStudent: 5 },
    { id: 6, x: 340, y: 70, numberOfStudent: 7 },
    { id: 7, x: 400, y: 240, numberOfStudent: 8 },
    { id: 8, x: 360, y: 190, numberOfStudent: 9 },
    { id: 9, x: 454, y: 190, numberOfStudent: 10 },
  ],
  edges: [
    { pointOne: 1, pointTwo: 2, weight: 1 },
    { pointOne: 1, pointTwo: 3, weight: 3 },
    { pointOne: 1, pointTwo: 4, weight: 4 },
    { pointOne: 1, pointTwo: 5, weight: 5 },
    { pointOne: 1, pointTwo: 6, weight: 6 },
    { pointOne: 1, pointTwo: 7, weight: 3 },
    { pointOne: 1, pointTwo: 8, weight: 2 },
    { pointOne: 1, pointTwo: 9, weight: 5 },
    { pointOne: 2, pointTwo: 3, weight: 1 },
    { pointOne: 2, pointTwo: 4, weight: 2 },
    { pointOne: 3, pointTwo: 4, weight: 1 },
    { pointOne: 4, pointTwo: 5, weight: 5 },
    { pointOne: 4, pointTwo: 6, weight: 2 },
    { pointOne: 5, pointTwo: 7, weight: 6 },
    { pointOne: 6, pointTwo: 7, weight: 3 },
    { pointOne: 7, pointTwo: 8, weight: 4 },
    { pointOne: 7, pointTwo: 9, weight: 2 },
  ],
};
export const limit3 = {
  timeLimit: 30,
  loadLimit: 20,
};
