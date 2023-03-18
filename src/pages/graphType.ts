export interface Point {
  id: number;
  x: number;
  y: number;
  numberOfStudent: number;
}

export interface Edge {
  pointOne: number;
  pointTwo: number;
  weight: number;
}

export interface Graph {
  points: Point[];
  edges: Edge[];
}

export interface PVEdge {
  pointOne: number;
  pointTwo: number;
  value: number;
}
