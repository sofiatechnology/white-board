"use client";
// import { useState } from "react";
// import { Canvas } from "@/components/canvas";
// import { Toolbar } from "@/components/toolbar";
// import { useViewportSize } from "@/hooks/use-viewport-size";
// import { CANVAS_SIZE } from "@/constants/canvas-size";
// import { COLORS } from "@/constants/colors";

// export default function Whiteboard() {
//   const { width, height } = useViewportSize();
//   const [scale, setScale] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [selectedColor, setSelectedColor] = useState(COLORS.BLACK);
//   const [lineWidth, setLineWidth] = useState(2);
//   const [tool, setTool] = useState<"pen" | "eraser" | "text">("pen");
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [textInput, setTextInput] = useState("");
//   const [textPosition, setTextPosition] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);
//   const [fontSize, setFontSize] = useState(24);

//   const handleZoom = (factor: number) => {
//     setScale((prev) => Math.min(Math.max(prev * factor, 0.1), 5));
//   };

//   const handleClearCanvas = () => {
//     const canvas = document.querySelector("canvas");
//     const ctx = canvas?.getContext("2d");
//     if (ctx) {
//       ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (tool === "text") {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const x = (e.clientX - rect.left - offset.x) / scale;
//       const y = (e.clientY - rect.top - offset.y) / scale;
//       setTextPosition({ x, y });
//       setTextInput("");
//     } else {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const x = (e.clientX - rect.left - offset.x) / scale;
//       const y = (e.clientY - rect.top - offset.y) / scale;
//       setIsDrawing(true);
//       // Start drawing logic here
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isDrawing && tool !== "text") {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const x = (e.clientX - rect.left - offset.x) / scale;
//       const y = (e.clientY - rect.top - offset.y) / scale;
//       // Draw logic here
//     }
//   };

//   const handleMouseUp = () => {
//     if (isDrawing) {
//       setIsDrawing(false);
//       // End drawing logic here
//     }
//   };

//   const handleMouseLeave = () => {
//     if (isDrawing) {
//       setIsDrawing(false);
//       // End drawing logic here
//     }
//   };

//   const handleTextInput = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
//     if (tool !== "text" || !textPosition) return;

//     if (e.key === "Enter") {
//       const canvas = document.querySelector("canvas");
//       const ctx = canvas?.getContext("2d");
//       if (ctx) {
//         ctx.font = `${fontSize}px Arial`;
//         ctx.fillStyle = selectedColor;
//         ctx.fillText(textInput, textPosition.x, textPosition.y);
//       }
//       setTextInput("");
//       setTextPosition(null);
//     } else if (e.key === "Backspace") {
//       setTextInput((prev) => prev.slice(0, -1));
//     } else if (e.key.length === 1) {
//       setTextInput((prev) => prev + e.key);
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-4">
//       <Toolbar
//         tool={tool}
//         selectedColor={selectedColor}
//         onToolChange={setTool}
//         onColorChange={setSelectedColor}
//         onClearCanvas={handleClearCanvas}
//         onZoom={handleZoom}
//       />
//       <div
//         className="relative overflow-hidden w-full h-full border rounded-lg"
//         style={{
//           width: width - 32,
//           height: height - 100,
//         }}
//       >
//         <Canvas
//           tool={tool}
//           selectedColor={selectedColor}
//           lineWidth={lineWidth}
//           scale={scale}
//           offset={offset}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseLeave}
//           onTextInput={handleTextInput}
//           textPosition={textPosition}
//           textInput={textInput}
//           fontSize={fontSize}
//         />
//       </div>
//     </main>
//   );
// }

// "use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CANVAS_SIZE } from "@/constants/canvas-size";
import { COLORS } from "@/constants/colors";
import { useDraw } from "@/hooks/drawing";
import dynamic from "next/dynamic";

// Create a client-side only version of the component
const WhiteboardComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Move window access to useEffect
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Now we safely access window
    setDimensions({
      width: window.innerWidth - 32,
      height: window.innerHeight - 60,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth - 32,
        height: window.innerHeight - 60,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(COLORS.BLACK);
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<"pen" | "eraser" | "text">("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fontSize, setFontSize] = useState(24);

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
      fillColor: "transparent", // or any default value
      shape: "line", // or any default value
      mode: "draw", // or any default value
      selection: false,
    },
    ctxRef.current!
  );

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    }
  };

  const handleZoom = (factor: number) => {
    setScale((prev) => Math.min(Math.max(prev * factor, 0.1), 5));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "text") {
      // Handle text tool click
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      setTextPosition({ x, y });
      setTextInput("");
    } else {
      // Handle drawing tools
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
      // Render text on canvas
      ctxRef.current.font = `${fontSize}px Arial`;
      ctxRef.current.fillStyle = selectedColor;
      ctxRef.current.fillText(textInput, textPosition.x, textPosition.y);

      // Reset text input and position
      setTextInput("");
      setTextPosition(null);
    } else if (e.key === "Backspace") {
      setTextInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setTextInput((prev) => prev + e.key);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background text-foreground">
      <div className="absolute bottom-4 left-auto right-auto flex gap-2 bg-background p-2 rounded-lg border border-border z-10">
        <div className="flex gap-2">
          {Object.values(COLORS).map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full ${
                selectedColor === color ? "ring-2 ring-black" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <div className="border-l mx-2" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTool("pen")}
          className={tool === "pen" ? "bg-accent" : ""}
        >
          ✏️
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTool("eraser")}
          className={tool === "eraser" ? "bg-accent" : ""}
        >
          🧹
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTool("text")}
          className={tool === "text" ? "bg-accent" : ""}
        >
          T
        </Button>
        <Button variant="outline" size="icon" onClick={clearCanvas}>
          🗑️
        </Button>
        <div className="border-l mx-2" />
        <Button variant="outline" size="icon" onClick={() => handleZoom(1.2)}>
          🔍+
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleZoom(0.8)}>
          🔍-
        </Button>
        <div className="border-l mx-2" />
        <input
          type="range"
          min="12"
          max="72"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-24"
        />
      </div>
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
          onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves canvas
          onKeyDown={handleTextInput}
          tabIndex={0} // Make canvas focusable for keyboard events
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
    </main>
  );
};

// Create a wrapper component that dynamically imports the client component
const Whiteboard = dynamic(() => Promise.resolve(WhiteboardComponent), {
  ssr: false, // Disable server-side rendering
});

export default Whiteboard;
