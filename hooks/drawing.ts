import { useEffect, useState } from "react";

let moves: [number, number][] = [];
export const useDraw = (options: CtxOptions, ctx: CanvasRenderingContext2D) => {
  const [drawing, setDrawing] = useState(false);
  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx) return;
    moves = [[x, y]];
    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEndDrawing = () => {
    if (!ctx) return;
    setDrawing(false);
    // moves = [];
    ctx.closePath();
  };

  const handleDraw = (x: number, y: number) => {
    if (ctx || drawing) {
      moves.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  return { handleStartDrawing, handleEndDrawing, handleDraw, drawing };
};
