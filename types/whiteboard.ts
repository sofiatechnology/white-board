export type Tool = "pen" | "eraser" | "text";

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ToolbarProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  tool: Tool;
  setTool: (tool: Tool) => void;
  clearCanvas: () => void;
  handleZoom: (factor: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export interface CanvasProps {
  scale: number;
  offset: Position;
  selectedColor: string;
  lineWidth: number;
  tool: Tool;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  textPosition: Position | null;
  setTextPosition: (position: Position | null) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  fontSize: number;
  dimensions: Dimensions;
}