import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import "./styles.css";
import { Point, Edge, Graph } from "../graphType";
import Floyd, { traceRoute } from "../Algorithm/Floyd";
import ReturningPathAlgorithm from "../Algorithm/ReturningPathAlgorithm";
import Greedy from "../Algorithm/Greedy";

import {
  graph1,
  graph2,
  limit1,
  limit2,
  graph3,
  limit3,
} from "../Testcase/test";

const drawPoint = (
  context: CanvasRenderingContext2D,
  point: Point,
  label: string,
  color: string,
  size: number
) => {
  if (color == null) {
    color = "#000";
  }
  if (size == null) {
    size = SIZE;
  }
  // to increase smoothing for numbers with decimal part
  context.beginPath();
  context.fillStyle = color;
  // context.rect(point.x - size / 2, point.y - size / 2, size, size);
  context.arc(point.x, point.y, 20, 0, 2 * Math.PI);
  context.fill();
  if (label) {
    var textX = Math.round(point.x);
    var textY = Math.round(point.y);
    context.font = " 18px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(label, textX, textY);
  }
};

function _getQBezierValue(t: number, p1: number, p2: number, p3: number) {
  let iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(
  startX: number,
  startY: number,
  cpX: number,
  cpY: number,
  endX: number,
  endY: number,
  position: number
) {
  return {
    x: _getQBezierValue(position, startX, cpX, endX),
    y: _getQBezierValue(position, startY, cpY, endY),
  };
}

// draw line from point A to point B with label and arrow
function drawArrowLine(
  startPoint: Point,
  endPoint: Point,
  label: number,
  color: string,
  ctx: CanvasRenderingContext2D
) {
  // draw line
  let startX = startPoint.x;
  let startY = startPoint.y;
  let endX = endPoint.x;
  let endY = endPoint.y;
  let midX = (startX + endX) / 2;
  let midY = (startY + endY) / 2;
  let x1 = startX;
  let x2 = endX;
  let y1 = startY;
  let y2 = endY;
  // Calculate the distance between the centers of the circles
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // Calculate the unit vector between the two centers
  const dx = (x2 - x1) / distance;
  const dy = (y2 - y1) / distance;

  // Calculate the coordinates of the two points where the line intersects the circles
  const x1p = x1 + dx * 20;
  const y1p = y1 + dy * 20;
  const x2p = x2 - dx * 20;
  const y2p = y2 - dy * 20;
  // adjust color
  ctx.strokeStyle = color;
  // Draw the line
  ctx.beginPath();
  ctx.moveTo(x1p, y1p);
  ctx.lineTo(x2p, y2p);
  ctx.stroke();
  if (label !== 0) {
    ctx.font = " 18px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    ctx.fillText(label.toString(), midX, midY);
  }
}

const SIZE = 10;
const checkPoint = (points: Point[], x: number, y: number) => {
  for (let i = 0; i < points.length; i++) {
    if (
      points[i].x - SIZE / 2 - 10 <= x &&
      x <= points[i].x + SIZE / 2 + 10 &&
      points[i].y - SIZE / 2 - 10 <= y &&
      y <= points[i].y + SIZE / 2 + 10
    ) {
      return false;
    }
  }
  return true;
};

function MyCanvas() {
  const myCanvas = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<boolean>(false);

  const [resultFloyd, setResultFloyd] = useState<number[][]>([]);

  const [matrixFloyd, setMatrixFloyd] = useState<number[][]>([]);

  const [showPath, setShowPath] = useState<number[]>([]);
  //students
  const [numberOfStudent, setNumberOfStudent] = useState<number>(0);
  const [vertexToAddStudents, setVertexToAddStudents] = useState<number>(2);

  //message
  const [message, setMessage] = useState<string>("Hello world");
  const [message2, setMessage2] = useState<string>("Hello world");

  //limit load and time
  const [maxStudent, setMaxStudent] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);

  //point to create new edge
  const [point1, setPoint1] = useState<number>(1);
  const [point2, setPoint2] = useState<number>(2);

  const [weight, setWeight] = useState<number>(1);

  const [graph, setGraph] = useState<Graph>({ points: [], edges: [] });

  const AddPoint = (e: React.MouseEvent<HTMLElement>) => {
    let x = e.clientX;
    let y = e.clientY;
    let rect = myCanvas.current!.getBoundingClientRect();
    x = x - rect.left;
    y = y - rect.top;
    if (start && checkPoint(graph.points, x, y)) {
      setMessage("Add a point successfully");
      setGraph(
        (prev) =>
          ({
            ...prev,
            points: [
              ...prev.points,
              { id: graph.points.length + 1, x: x, y: y, numberOfStudent: 0 },
            ],
          } as Graph)
      );
    }
  };

  const checkTwoPointHasEdge = (point1: number, point2: number) => {
    for (let i = 0; i < graph.edges.length; i++) {
      if (
        (graph.edges[i].pointOne === point1 &&
          graph.edges[i].pointTwo === point2) ||
        (graph.edges[i].pointOne === point2 &&
          graph.edges[i].pointTwo === point1)
      ) {
        return true;
      }
    }
  };

  const addEdge = () => {
    if (
      point1 &&
      point2 &&
      weight &&
      point1 !== point2 &&
      point1 >= 1 &&
      point2 >= 1 &&
      point1 <= graph.points.length &&
      point2 <= graph.points.length &&
      weight > 0 &&
      !checkTwoPointHasEdge(point1, point2)
    ) {
      if (checkTwoPointHasEdge(point1, point2)) {
        setMessage("Edge already exists");
      } else {
        setMessage("Add edge successfully");
        setGraph(
          (prev) =>
            ({
              points: [...prev.points],
              edges: [
                ...prev.edges,
                {
                  pointOne: point1,
                  pointTwo: point2,
                  weight: weight,
                },
              ],
            } as Graph)
        );
      }
    }
  };

  const draw = (point: Point, label: number) => {
    const context = myCanvas.current!.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    drawPoint(context, point, String(label), "#ff0000", SIZE);
  };

  const clearCanvas = (): void => {
    const context = myCanvas.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    setGraph({ points: [], edges: [] });
    context.clearRect(0, 0, 1000, 600);
    setPoint1(1);
    setPoint2(2);
    setWeight(1);
    setResultFloyd([[]]);
    setMatrixFloyd([[]]);
    setShowPath([]);
    setMaxStudent(0);
    setMaxTime(0);
    setNumberOfStudent(0);
    setVertexToAddStudents(2);
  };

  const drawLine = (
    pointX: number,
    pointY: number,
    weight: number,
    color: string,
    ctx: CanvasRenderingContext2D
  ) => {
    let p1: Point = graph.points[pointX - 1];
    let p2: Point = graph.points[pointY - 1];
    ctx.stroke();
    drawArrowLine(p1, p2, weight, color, ctx);
  };

  useEffect(() => {
    const handleDraw = () => {
      const context = myCanvas.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      context.clearRect(0, 0, 1000, 600);
      if (graph.points.length > 0) {
        for (let i = 0; i < graph.points.length; i++) {
          draw(graph.points[i], i + 1);
        }
      }
      if (graph.edges.length > 0) {
        for (let i = 0; i < graph.edges.length; i++) {
          let a = graph.edges[i].pointOne;
          let b = graph.edges[i].pointTwo;
          if (showPath.includes(a) && showPath.includes(b)) {
            const indexA = showPath.indexOf(a);
            const indexB = showPath.indexOf(b);
            const check = Math.abs(indexA - indexB);
            if (check === 1) {
              drawLine(a, b, graph.edges[i].weight, "blue", context);
            } else {
              drawLine(a, b, graph.edges[i].weight, "black", context);
            }
          } else {
            drawLine(a, b, graph.edges[i].weight, "black", context);
          }
        }
      }
    };
    handleDraw();
  }, [graph.points, graph.edges, showPath]);

  const calculateFloyd = () => {
    if (graph.points.length > 0) {
      let { dist, arr } = Floyd(graph);
      setResultFloyd(arr);
      setMatrixFloyd(dist);
    }
  };

  const showShortestPath = (i: number, j: number) => {
    let path: number[] = traceRoute(resultFloyd, i, j);
    setMessage(
      `The shortest path from ${i} to ${j} is: \n` + path.join(" -> ")
    );
    setShowPath(path);
  };

  const addStudents = () => {
    const i = graph.points.find((point) => point.id === vertexToAddStudents);
    if (i) {
      if (i.id === 1) {
        setMessage("You can't add students to the school");
        return;
      }
      if (i.numberOfStudent) {
        setMessage("This vertex already has students");
      } else {
        if (numberOfStudent <= 0) {
          setMessage("Number of students must be greater than 0");
        } else {
          setGraph({
            ...graph,
            points: graph.points.map((point) => {
              if (point.id === vertexToAddStudents) {
                return { ...point, numberOfStudent: numberOfStudent };
              }
              return point;
            }),
          });
        }
      }
    } else {
      setMessage("Please choose a valid vertex");
    }
  };

  const runReturningPathAlgorithm = () => {
    if (maxTime === 0 || maxStudent === 0) {
      alert("Please enter limit load and time");
    } else {
      let check = false;
      let n = graph.points.length;
      for (let i = 0; i < n; i++) {
        if (graph.points[i].id > 1 && graph.points[i].numberOfStudent === 0) {
          check = true;
          break;
        }
      }
      if (check) {
        alert("Please add students to all vertices except the starting point");
      } else {
        if (resultFloyd) {
          console.log(matrixFloyd);
          const { paths, allTime, allLoad } = ReturningPathAlgorithm(
            graph,
            maxTime,
            maxStudent,
            [...matrixFloyd]
          );
          let s: string = "(Algorithms of reports) \n The routes are: \n";
          for (let i = 0; i < paths.length; i++) {
            s +=
              `Route ${i + 1}: ` +
              paths[i].join(" -> ") +
              `\n Time: ${allTime[i]}, Students: ${allLoad[i]}` +
              "\n ------------------------- \n";
          }
          setMessage(s);
        } else {
          alert("Please calculate Floyd");
          return;
        }
      }
    }
  };

  const runGreedyAlgorithm = () => {
    if (maxTime === 0 || maxStudent === 0) {
      setMessage("Please enter limit load and time");
      return;
    } else {
      let check = false;
      let n = graph.points.length;
      for (let i = 0; i < n; i++) {
        if (graph.points[i].id > 1 && graph.points[i].numberOfStudent === 0) {
          check = true;
          break;
        }
      }
      if (check) {
        setMessage(
          "Please add students to all vertices except the starting point"
        );
      } else {
        if (matrixFloyd.length > 0) {
          const { paths, allTime, allLoad } = Greedy(
            graph,
            maxTime,
            maxStudent,
            matrixFloyd
          );
          let s: string = "(Greedy)The routes are: \n";
          for (let i = 0; i < paths.length; i++) {
            s +=
              `Route ${i + 1}: ` +
              paths[i].join(" -> ") +
              `\n Time: ${allTime[i]}, Students: ${allLoad[i]}` +
              "\n ------------------------- \n";
          }
          setMessage2(s);
        } else {
          alert("Please run Floyd algorithm");
          return;
        }
      }
    }
  };

  const runtest1 = () => {
    setGraph(graph1);
    setMaxStudent(limit1.loadLimit);
    setMaxTime(limit1.timeLimit);
    setMessage("Run test 1");
  };
  const runtest2 = () => {
    setGraph(graph2);
    setMaxStudent(limit2.loadLimit);
    setMaxTime(limit2.timeLimit);
    setMessage("Run test 2");
  };
  const runtest3 = () => {
    setGraph(graph3);
    setMaxStudent(limit3.loadLimit);
    setMaxTime(limit3.timeLimit);
    setMessage("Run test 3");
  };

  return (
    <div className="container-wrap">
      <div className="container">
        <canvas
          width="1000"
          height="500"
          className={start ? "canvas canvas-active" : "canvas"}
          onClick={AddPoint}
          ref={myCanvas}
        ></canvas>
        <div className="list-edges">
          <h2>List edges</h2>
          <table>
            <thead>
              <tr>
                <th>Point 1</th>
                <th>Point 2</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {graph.edges.map((edge, index) => (
                <tr key={`${"edge" + index} `}>
                  <td key={"td1" + index}>{edge.pointOne}</td>
                  <td key={"td2" + index}>{edge.pointTwo}</td>
                  <td key={"td3" + index}>{edge.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="list-student">
          <h2>List students</h2>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {graph.points.map((point, index) => (
                <tr key={`${"edge" + index} `}>
                  <td key={"td-1" + index}>{point.id}</td>
                  <td key={"td-2" + index}>{point.numberOfStudent || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-container">
        <div className="btn-container">
          <button
            className={start ? "button-start-program" : "button-normal"}
            onClick={() => setStart((prev) => !prev)}
          >
            {!start ? "Start" : "End"}
          </button>
          <button className="button-normal" onClick={clearCanvas}>
            Clear
          </button>
          <div className="div_create_line">
            <label htmlFor="point1">
              Start vertex
              <input
                type="number"
                value={point1}
                id="point1"
                onChange={(e) => setPoint1(Number(e.target.value))}
              />
            </label>
            <label htmlFor="point2">
              End vertex
              <input
                type="number"
                id="point2"
                value={point2}
                onChange={(e) => setPoint2(Number(e.target.value))}
              />
            </label>
            <label htmlFor="point2">
              Weight
              <input
                type="number"
                id="point2"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </label>
            <button onClick={addEdge}>Create an edge</button>
          </div>

          <div className="div_create_line">
            <label htmlFor="point">
              Vertex
              <input
                type="number"
                value={vertexToAddStudents}
                id="point"
                onChange={(e) => setVertexToAddStudents(Number(e.target.value))}
              />
            </label>
            <label htmlFor="numberOfStudent">
              Number of students
              <input
                type="number"
                value={numberOfStudent}
                id="numberOfStudent"
                onChange={(e) => setNumberOfStudent(Number(e.target.value))}
              />
            </label>
            <button onClick={addStudents}>Add</button>
          </div>
          <div>
            <button onClick={runtest1}>Test 1</button>
            <button onClick={runtest2}>Test 2</button>
            <button onClick={runtest3}>Test 3</button>
          </div>
        </div>
        <div className="run">
          <div className="calculalte">
            <label className="label-input" htmlFor="max-student">
              <span className="label-cal">Max students</span>
              <input
                type="number"
                value={maxStudent}
                id="max-student"
                onChange={(e) => setMaxStudent(Number(e.target.value))}
              />
            </label>
            <label className="label-input" htmlFor="max-time">
              <span className="label-cal">Max time</span>
              <input
                type="number"
                value={maxTime}
                id="max-time"
                onChange={(e) => setMaxTime(Number(e.target.value))}
              />
            </label>
          </div>
          <button onClick={calculateFloyd}>Calculate Floyd</button>

          <div></div>

          <button onClick={runReturningPathAlgorithm}>
            Run returning path
          </button>
          <button onClick={runGreedyAlgorithm}>Run greedy</button>
        </div>
        <div>
          {matrixFloyd &&
            matrixFloyd.map((value, index) => {
              if (index > 0) {
                return (
                  <div key={index}>
                    {value.map((v, i) => {
                      return (
                        <button
                          key={index + " " + i}
                          onClick={() => {
                            showShortestPath(index, i);
                          }}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                );
              } else {
                return false;
              }
            })}
        </div>
        <div className="console">
          {message && <p>{message}</p>}
          {message2 && <p>{message2}</p>}
        </div>
      </div>
    </div>
  );
}

export default MyCanvas;
