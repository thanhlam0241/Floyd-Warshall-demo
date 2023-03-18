//import { group } from "console";
import { Point, Edge, Graph, PVEdge } from "../graphType";
import Floyd, { traceRoute } from "./Floyd";

export default function Greedy(
  graph: Graph,
  timeLimit: number,
  loadLimit: number,
  dist: number[][]
) {
  const { points } = graph;
  let n = points.length;
  const paths: number[][] = [];
  let path: number[] = [];
  let visit = new Array(n + 1).fill(false);

  visit[1] = true;

  let timeNow = 0;
  let loadNow = 0;

  let sortEdgeConnect = new Array(n + 1).fill([]);
  let ar = [];
  for (let i = 1; i <= n; i++) {
    ar.push(i);
  }
  for (let i = 1; i <= n; i++) {
    sortEdgeConnect[i] = [...ar];
    sortEdgeConnect[i].sort((a: number, b: number) => dist[i][a] - dist[i][b]);
  }
  for (let i = 1; i < n; i++) {
    let firstPoint = sortEdgeConnect[1][i];
    if (visit[firstPoint]) {
      continue;
    } else {
      path.push(firstPoint);
      timeNow += 2 * dist[1][firstPoint];
      loadNow += points[firstPoint - 1].numberOfStudent;
      visit[firstPoint] = true;

      while (timeNow <= timeLimit && loadNow <= loadLimit) {
        let nowPoint = path[path.length - 1];
        let noMorePoint = true;
        for (let j = 1; j <= n - 1; j++) {
          let nextMaybePoint = sortEdgeConnect[nowPoint][j];
          if (nextMaybePoint && !visit[nextMaybePoint]) {
            let timeCheck =
              timeNow +
              dist[nowPoint][nextMaybePoint] +
              dist[nextMaybePoint][1] -
              dist[nowPoint][nextMaybePoint];
            let loadCheck =
              loadNow + points[nextMaybePoint - 1].numberOfStudent;
            if (timeCheck > timeLimit || loadCheck > loadLimit) {
              continue;
            }
            path.push(nextMaybePoint);
            timeNow = timeCheck;
            loadNow = loadCheck;
            visit[nextMaybePoint] = true;
            noMorePoint = false;
            continue;
          }
        }
        if (noMorePoint) {
          break;
        }
      }
      path.unshift(1);
      path.push(1);
      paths.push(path);
      path = [];
      timeNow = 0;
      loadNow = 0;
    }
  }
  let allTime = [];
  let allLoad = [];
  for (let i = 0; i < paths.length; i++) {
    let time = 0;
    let load = 0;
    for (let j = 0; j < paths[i].length - 1; j++) {
      time += dist[paths[i][j]][paths[i][j + 1]];
      load += points[paths[i][j] - 1].numberOfStudent;
    }
    allTime.push(time);
    allLoad.push(load);
  }
  return { paths, allTime, allLoad };
}
