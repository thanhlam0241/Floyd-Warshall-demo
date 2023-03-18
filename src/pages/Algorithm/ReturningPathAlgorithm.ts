import { Point, Edge, Graph, PVEdge } from "../graphType";
import Floyd, { traceRoute } from "./Floyd";

export default function ReturningPathAlgorithm(
  graph: Graph,
  timeLimit: number,
  loadLimit: number,
  dist: number[][]
) {
  let pvMatrix: number[][] = [...dist];
  let PVTable: PVEdge[] = [];
  let n = pvMatrix.length;
  for (let i = 2; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (i !== 1 && j !== 1) {
        pvMatrix[i][j] = pvMatrix[i][1] + pvMatrix[1][j] - pvMatrix[i][j];
        pvMatrix[j][i] = pvMatrix[i][j];
        PVTable.push({
          pointOne: i,
          pointTwo: j,
          value: pvMatrix[i][j],
        });
      }
    }
  }
  PVTable.sort((a, b) => b.value - a.value);
  let { points, edges } = graph;

  let l = points.length;
  let numberOFPointNow = 1;
  let paths: number[][] = [];
  let nowPath: number[] = [];

  let visit = new Array(l + 1).fill(false);
  visit[1] = true;

  while (PVTable.length !== 0) {
    let timeNow = 0;
    let numberOfStudentNow = 0;
    let checkTime;
    let checkLoad;

    for (let i = 0; i < PVTable.length; i++) {
      let nowEdge = PVTable[i];

      let firstPoint = nowEdge.pointOne;
      let secondPoint = nowEdge.pointTwo;

      if (nowPath.length === 0) {
        timeNow =
          dist[firstPoint][secondPoint] +
          dist[1][firstPoint] +
          dist[1][secondPoint];
        numberOfStudentNow =
          points[firstPoint - 1].numberOfStudent +
          points[secondPoint - 1].numberOfStudent;
        if (timeNow > timeLimit || numberOfStudentNow > loadLimit) {
          nowPath = [];
          timeNow = 0;
          numberOfStudentNow = 0;
        } else {
          nowPath.push(firstPoint);
          nowPath.push(secondPoint);
          visit[firstPoint] = true;
          visit[secondPoint] = true;
        }
      } else {
        let endOfPathNow = nowPath[nowPath.length - 1];
        let startOfPathNow = nowPath[0];

        if (firstPoint === endOfPathNow && !visit[secondPoint]) {
          checkTime =
            timeNow +
            dist[firstPoint][secondPoint] -
            dist[1][firstPoint] +
            dist[1][secondPoint];
          checkLoad =
            numberOfStudentNow + points[secondPoint - 1].numberOfStudent;
          if (checkTime <= timeLimit && checkLoad <= loadLimit) {
            nowPath.push(secondPoint);
            timeNow = checkTime;
            numberOfStudentNow = checkLoad;
            visit[secondPoint] = true;
          }
        } else if (secondPoint === endOfPathNow && !visit[firstPoint]) {
          checkTime =
            timeNow +
            dist[firstPoint][secondPoint] +
            dist[1][firstPoint] -
            dist[1][secondPoint];
          checkLoad =
            numberOfStudentNow + points[firstPoint - 1].numberOfStudent;
          if (checkTime <= timeLimit && checkLoad <= loadLimit) {
            nowPath.push(firstPoint);
            timeNow = checkTime;
            numberOfStudentNow = checkLoad;
            visit[firstPoint] = true;
          }
        } else if (firstPoint === startOfPathNow && !visit[secondPoint]) {
          checkTime =
            timeNow +
            dist[firstPoint][secondPoint] -
            dist[1][firstPoint] +
            dist[1][secondPoint];
          checkLoad =
            numberOfStudentNow + points[secondPoint - 1].numberOfStudent;
          if (checkTime <= timeLimit && checkLoad <= loadLimit) {
            nowPath.unshift(secondPoint);
            timeNow = checkTime;
            numberOfStudentNow = checkLoad;
            visit[secondPoint] = true;
          }
        } else if (secondPoint === startOfPathNow && !visit[firstPoint]) {
          checkTime =
            timeNow +
            dist[firstPoint][secondPoint] +
            dist[1][firstPoint] -
            dist[1][secondPoint];
          checkLoad =
            numberOfStudentNow + points[firstPoint - 1].numberOfStudent;
          if (checkTime <= timeLimit && checkLoad <= loadLimit) {
            nowPath.unshift(firstPoint);
            timeNow = checkTime;
            numberOfStudentNow = checkLoad;
            visit[firstPoint] = true;
          }
        } else {
          continue;
        }
      }
    }
    nowPath.unshift(1);
    nowPath.push(1);
    paths.push(nowPath);
    numberOFPointNow += nowPath.length;
    nowPath = [];
    PVTable = PVTable.filter(
      (edge) => !visit[edge.pointOne] && !visit[edge.pointTwo]
    );
  }
  for (let i = 2; i <= l; i++) {
    if (visit[i] === false) {
      nowPath.push(i);
      nowPath.unshift(1);
      nowPath.push(1);
      visit[i] = true;
      numberOFPointNow++;
      paths.push(nowPath);
      nowPath = [];
    }
  }
  console.log(dist);
  let allTime = [];
  let allLoad = [];
  for (let i = 0; i < paths.length; i++) {
    let time = 0;
    let load = 0;
    for (let j = 0; j < paths[i].length - 1; j++) {
      let a = dist[paths[i][j]][paths[i][j + 1]];
      time += a;
      load += points[paths[i][j] - 1].numberOfStudent;
    }
    allTime.push(time);
    allLoad.push(load);
  }
  return { paths, allTime, allLoad };
}
