export interface Point {
  id: number;
  x: number;
  y: number;
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
