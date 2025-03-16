"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import dynamic from "next/dynamic";
import { Canvas } from "@/components/whiteboard/canvas";
import { Toolbar } from "@/components/whiteboard/toolbar";
import { Tool } from "@/types/whiteboard";

const WhiteboardComponent = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
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
  const [tool, setTool] = useState<Tool>("pen"); // Keep only this declaration with the Tool type
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fontSize, setFontSize] = useState(24);

  const handleZoom = (factor: number) => {
    setScale((prev) => Math.min(Math.max(prev * factor, 0.1), 5));
  };

  const clearCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return; // Early return if canvas is null
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background text-foreground">
      <Toolbar
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        tool={tool}
        setTool={setTool}
        clearCanvas={clearCanvas}
        handleZoom={handleZoom}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <Canvas
        scale={scale}
        offset={offset}
        selectedColor={selectedColor}
        lineWidth={lineWidth}
        tool={tool}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        textPosition={textPosition}
        setTextPosition={setTextPosition}
        textInput={textInput}
        setTextInput={setTextInput}
        fontSize={fontSize}
        dimensions={dimensions}
      />
    </main>
  );
};

const Whiteboard = dynamic(() => Promise.resolve(WhiteboardComponent), {
  ssr: false,
});

export default Whiteboard;
