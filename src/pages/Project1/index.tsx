import { useState, useRef, useEffect } from "react";
import React from "react";
import MyCanvas from "./MyCanvas";
import "./styles.css";

const Demo = () => {
  // const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   ctx.fillStyle = "#000000";
  //   ctx.beginPath();
  //   ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  //   ctx.fill();
  // };
  // const getPositionAndAdd = (e: React.MouseEvent<HTMLElement>) => {
  //   const { x, y } = getPositionWhenClick(e);
  //   setPoints((prev) => [...prev, { x: x, y: y }]);
  //   console.log(points);
  // };

  return (
    <div>
      <h1>Demo All Pairs Shortest Paths</h1>
      <main>
        <MyCanvas />
      </main>
    </div>
  );
};

export { Demo };
