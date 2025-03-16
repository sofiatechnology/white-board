import { useRef, useEffect } from "react";
import { CANVAS_SIZE } from "@/constants/canvas-size";
import { useDraw } from "@/hooks/drawing";

interface CanvasProps {
  scale: number;
  offset: { x: number; y: number };
  selectedColor: string;
  lineWidth: number;
  tool: "pen" | "eraser" | "text";
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  textPosition: { x: number; y: number } | null;
  setTextPosition: (position: { x: number; y: number } | null) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  fontSize: number;
  dimensions: { width: number; height: number };
}

export const Canvas = ({
  scale,
  offset,
  selectedColor,
  lineWidth,
  tool,
  isDrawing,
  setIsDrawing,
  textPosition,
  setTextPosition,
  textInput,
  setTextInput,
  fontSize,
  dimensions,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = CANVAS_SIZE.width;
      canvas.height = CANVAS_SIZE.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctxRef.current = ctx;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = lineWidth;
      }
    }
  }, [selectedColor, lineWidth]);

  const { handleStartDrawing, handleEndDrawing, handleDraw } = useDraw(
    {
      lineColor: selectedColor,
      lineWidth,
      fillColor: "transparent",
      shape: "line",
      mode: "draw",
      selection: false,
    },
    ctxRef.current!
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "text") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      setTextPosition({ x, y });
      setTextInput("");
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      setIsDrawing(true);
      handleStartDrawing(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && tool !== "text") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      handleDraw(x, y);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      handleEndDrawing();
    }
  };

  const handleTextInput = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (tool !== "text" || !textPosition || !ctxRef.current) return;

    if (e.key === "Enter") {
      ctxRef.current.font = `${fontSize}px Arial`;
      ctxRef.current.fillStyle = selectedColor;
      ctxRef.current.fillText(textInput, textPosition.x, textPosition.y);

      setTextInput("");
      setTextPosition(null);
    } else if (e.key === "Backspace") {
      setTextInput((prevText) => prevText.slice(0, -1));
    } else if (e.key.length === 1) {
      setTextInput((prevText) => prevText + e.key);
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full h-full rounded-lg"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: "0 0",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleTextInput}
        tabIndex={0}
        className="bg-background"
      />
      {tool === "text" && textPosition && (
        <div
          style={{
            position: "absolute",
            left: `${textPosition.x * scale + offset.x}px`,
            top: `${textPosition.y * scale + offset.y}px`,
            fontSize: `${fontSize * scale}px`,
            color: selectedColor,
            pointerEvents: "none",
          }}
        >
          {textInput}
        </div>
      )}
    </div>
  );
};