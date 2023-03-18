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
  let { points, edges } = graph;
  let n = points.length;
  var arr = new Array(n + 1);
  for (var i = 1; i <= n; i++) {
    arr[i] = new Array(n + 1).fill(0);
  }
  let dist = new Array(n + 1);
  const INF_LENGTH = edges.reduce((acc, cur) => acc + cur.weight, 0);
  for (let i = 1; i <= n; i++) {
    dist[i] = new Array(n + 1);
    for (let j = 1; j <= n; j++) {
      dist[i][j] = i === j ? 0 : INF_LENGTH;
    }
  }
  for (let i = 0; i < edges.length; i++) {
    let { pointOne, pointTwo, weight } = edges[i];
    dist[pointOne][pointTwo] = weight;
    dist[pointTwo][pointOne] = weight;
    arr[pointOne][pointTwo] = pointTwo;
    arr[pointTwo][pointOne] = pointOne;
  }
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
  return {
    dist,
    arr,
  };
}
