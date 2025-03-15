"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BiEraser, BiTrash, BiPencil } from "react-icons/bi";
import { FaRegHandPointUp } from "react-icons/fa";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [handMode, setHandMode] = useState(false);
  const [options, setOptions] = useState({
    lineWidth: 5,
    lineColor: { r: 0, g: 0, b: 0, a: 1 },
    mode: "draw",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 3000; // Large virtual canvas
      canvas.height = 3000;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctxRef.current = ctx;
        redrawCanvas();
      }
    }
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = options.lineWidth;
      const { r, g, b, a } = options.lineColor;
      ctxRef.current.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  }, [options]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (handMode) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    } else if (e.button === 0) {
      setIsDrawing(true);
      ctxRef.current?.beginPath();
      ctxRef.current?.moveTo(
        (e.clientX - offset.x) / scale,
        (e.clientY - offset.y) / scale
      );
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && ctxRef.current) {
      ctxRef.current.lineTo(
        (e.clientX - offset.x) / scale,
        (e.clientY - offset.y) / scale
      );
      ctxRef.current.stroke();
    }
    if (isPanning) {
      setOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      redrawCanvas();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
    ctxRef.current?.closePath();
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = 1.1;
    const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    setScale(newScale);
    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctxRef.current) {
      const ctx = ctxRef.current;
      ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.resetTransform();
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-background">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className={`absolute top-0 left-0 cursor-${
          handMode ? "grab" : "crosshair"
        }`}
        style={{ width: "3000px", height: "3000px" }}
      />
      <div className="flex gap-2 items-center mt-4 p-2 border border-border rounded-lg fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant={handMode ? "secondary" : "outline"}
          onClick={() => setHandMode(!handMode)}
        >
          <FaRegHandPointUp color="#000" />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setOptions({
              ...options,
              mode: "draw",
              lineWidth: 5,
              lineColor: { r: 0, g: 0, b: 0, a: 1 },
            })
          }
        >
          <BiPencil color="#000" />
        </Button>
        <Button
          variant="ghost"
      
          onClick={() =>
            setOptions({
              ...options,
              mode: "erase",
              lineWidth: 10,
              lineColor: { r: 255, g: 255, b: 255, a: 1 },
            })
          }
        >
          <BiEraser color="#000" />
        </Button>
        <Button variant="ghost" onClick={clearCanvas}>
          <BiTrash color="#000" />
        </Button>
        <input
          type="color"
          onChange={(e) =>
            setOptions({
              ...options,
              lineColor: {
                r: parseInt(e.target.value.slice(1, 3), 16),
                g: parseInt(e.target.value.slice(3, 5), 16),
                b: parseInt(e.target.value.slice(5, 7), 16),
                a: 1,
              },
            })
          }
        />
        <input
          type="range"
          min="1"
          max="20"
          value={options.lineWidth}
          onChange={(e) =>
            setOptions({ ...options, lineWidth: parseInt(e.target.value) })
          }
        />
      </div>
    </div>
  );
}
