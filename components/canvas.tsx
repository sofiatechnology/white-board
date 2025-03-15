// import { useRef, useState } from "react";
// import { COLORS } from "@/constants/colors";
// import { useDrawing } from "@/hooks/drawing";

// interface CanvasProps {
//   tool: "pen" | "eraser" | "text";
//   selectedColor: string;
//   lineWidth: number;
//   scale: number;
//   offset: { x: number; y: number };
//   onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
//   onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
//   onMouseUp: () => void;
//   onMouseLeave: () => void;
//   onTextInput: (e: React.KeyboardEvent<HTMLCanvasElement>) => void;
//   textPosition: { x: number; y: number } | null;
//   textInput: string;
//   fontSize: number;
// }

// export const Canvas = ({
//   tool,
//   selectedColor,
//   lineWidth,
//   scale,
//   offset,
//   onMouseDown,
//   onMouseMove,
//   onMouseUp,
//   onMouseLeave,
//   onTextInput,
//   textPosition,
//   textInput,
//   fontSize,
// }: CanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

//   const { startDrawing, draw, endDrawing } = useDrawing(
//     { lineColor: selectedColor, lineWidth },
//     ctxRef.current!
//   );

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         style={{
//           transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
//           transformOrigin: "0 0",
//         }}
//         onMouseDown={onMouseDown}
//         onMouseMove={onMouseMove}
//         onMouseUp={onMouseUp}
//         onMouseLeave={onMouseLeave}
//         onKeyDown={onTextInput}
//         tabIndex={0} // Make canvas focusable for keyboard events
//         className="bg-white"
//       />
//       {tool === "text" && textPosition && (
//         <div
//           style={{
//             position: "absolute",
//             left: `${textPosition.x * scale + offset.x}px`,
//             top: `${textPosition.y * scale + offset.y}px`,
//             fontSize: `${fontSize * scale}px`,
//             color: selectedColor,
//             pointerEvents: "none",
//           }}
//         >
//           {textInput}
//         </div>
//       )}
//     </>
//   );
// };
