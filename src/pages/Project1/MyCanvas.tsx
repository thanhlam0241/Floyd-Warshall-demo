import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import "./styles.css";
import { Point, Edge, Graph } from "../graphType";
import Floyd from "../Algorithm/Floyd";

const drawPoint = (
  context: CanvasRenderingContext2D,
  point: Point,
  label: string,
  color: string,
  size: number
) => {
  console.log("drawPoint");
  if (color == null) {
    color = "#000";
  }
  if (size == null) {
    size = SIZE;
  }
  // to increase smoothing for numbers with decimal part
  context.beginPath();
  context.fillStyle = color;
  context.rect(point.x - size / 2, point.y - size / 2, size, size);
  context.fill();
  if (label) {
    var textX = Math.round(point.x);
    var textY = Math.round(point.y - size / 2 - 7);
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
  ctx: CanvasRenderingContext2D
) {
  // draw line
  let startX = startPoint.x;
  let startY = startPoint.y;
  let endX = endPoint.x;
  let endY = endPoint.y;
  let midX = (startX + endX) / 2;
  let midY = (startY + endY) / 2;
  let a = getQuadraticCurvePoint(startX, startY, midX, midY, endX, endY, 0.5);
  let midLabelX = a.x;
  let midLabelY = a.y;
  ctx.font = " 18px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.fillText(label.toString(), midX, midY);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(midLabelX, midLabelY, endX, endY);
  ctx.stroke();
  // draw arrow
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

interface Pos {
  x: number;
  y: number;
}
function MyCanvas() {
  const myCanvas = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const [resultFloyd, setResultFloyd] = useState<number[][]>([[]]);

  const [message, setMessage] = useState<string>("");
  //point to create new edge
  const [point1, setPoint1] = useState<number>(1);
  const [point2, setPoint2] = useState<number>(2);

  const [weight, setWeight] = useState<number>(1);

  const [graph, setGraph] = useState<Graph>({ points: [], edges: [] });

  const [busPoint, setBusPoint] = useState<Pos>({ x: 0, y: 0 });

  const AddPoint = (e: React.MouseEvent<HTMLElement>) => {
    let x = e.clientX;
    let y = e.clientY;
    let rect = myCanvas.current!.getBoundingClientRect();
    x = x - rect.left;
    y = y - rect.top;
    if (start && checkPoint(graph.points, x, y)) {
      setGraph(
        (prev) =>
          ({
            ...prev,
            points: [
              ...prev.points,
              { id: graph.points.length + 1, x: x, y: y },
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
        alert("Edge already exists");
      } else {
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
  };

  const drawLine = (
    pointX: number,
    pointY: number,
    weight: number,
    ctx: CanvasRenderingContext2D
  ) => {
    let p1: Point = graph.points[pointX - 1];
    let p2: Point = graph.points[pointY - 1];
    ctx.stroke();
    drawArrowLine(p1, p2, weight, ctx);
  };

  useEffect(() => {
    const handleDraw = () => {
      const context = myCanvas.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      if (graph.points.length > 0) {
        for (let i = 0; i < graph.points.length; i++) {
          draw(graph.points[i], i + 1);
        }
      }
      if (graph.edges.length > 0) {
        for (let i = 0; i < graph.edges.length; i++) {
          drawLine(
            graph.edges[i].pointOne,
            graph.edges[i].pointTwo,
            graph.edges[i].weight,
            context
          );
        }
      }
    };
    handleDraw();
  }, [graph.points, graph.edges]);

  useEffect(() => {
    function drawObject(ctx: CanvasRenderingContext2D) {
      // Draw your object on the canvas using the given context
      if (busPoint && busPoint.x >= 25 && busPoint.y >= 25) {
        ctx.fillStyle = "red";
        ctx.fillRect(
          busPoint.x - 25,
          busPoint.y - 25,
          busPoint.x + 25,
          busPoint.y + 25
        );
      }
    }
    const context = myCanvas.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    drawObject(context);
  }, [busPoint]);

  const calculateFloyd = () => {
    if (graph.points.length > 0) {
      let { arr } = Floyd(graph);
      setResultFloyd(arr);
      setMessage(arr.toString());
      console.log(arr);
      console.log(graph);
    }
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
      </div>
      <div></div>
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
            <button onClick={addEdge}>Create a or Modify</button>
          </div>
        </div>
        <div>
          <button className="button-normal" onClick={calculateFloyd}>
            Calculate Floyd
          </button>
        </div>
        <div className="console">{message}</div>
      </div>
    </div>
  );
}

export default MyCanvas;
