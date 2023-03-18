import { Point, Edge, Graph } from "../graphType";

export function traceRoute(arr: number[][], start: number, end: number) {
  let path = [start];
  while (start !== end) {
    start = arr[start][end];
    path.push(start);
  }
  return path;
}

export default function Floyd(graph: Graph) {
  console.log("calculate floyd");
  let { points, edges } = graph;
  const n = points.length;
  const arr = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    arr[i] = new Array(n + 1).fill(0);
  }
  const dist = new Array(n + 1);
  const INF_LENGTH: number = 999;
  for (let i = 1; i <= n; i++) {
    dist[i] = new Array(n + 1);
    dist[i][0] = i;
    for (let j = 1; j <= n; j++) {
      dist[i][j] = i === j ? 0 : INF_LENGTH;
    }
  }
  console.log(dist);
  for (let i = 0; i < edges.length; i++) {
    let { pointOne, pointTwo, weight } = edges[i];
    dist[pointOne][pointTwo] = weight;
    dist[pointTwo][pointOne] = weight;
    arr[pointOne][pointTwo] = pointTwo;
    arr[pointTwo][pointOne] = pointOne;
  }
  //console.log(dist);
  for (let k = 1; k <= n; k++) {
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          arr[i][j] = arr[i][k];
        }
      }
    }
  }
  console.log(dist);
  return {
    dist,
    arr,
  };
}
