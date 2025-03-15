import { Button } from "./ui/button";
import { COLORS } from "@/constants/colors";

interface ToolbarProps {
  tool: "pen" | "eraser" | "text";
  selectedColor: string;
  onToolChange: (tool: "pen" | "eraser" | "text") => void;
  onColorChange: (color: string) => void;
  onClearCanvas: () => void;
  onZoom: (factor: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const Toolbar = ({
  tool,
  selectedColor,
  onToolChange,
  onColorChange,
  onClearCanvas,
  onZoom,
  fontSize,
  onFontSizeChange,
}: ToolbarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow-lg z-10">
      <div className="flex gap-2">
        {Object.values(COLORS).map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full ${
              selectedColor === color ? "ring-2 ring-black" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
      <div className="border-l mx-2" />
      <Button
        onClick={() => onToolChange("pen")}
        className={tool === "pen" ? "bg-accent" : ""}
      >
        ✏️
      </Button>
      <Button
        onClick={() => onToolChange("eraser")}
        className={tool === "eraser" ? "bg-accent" : ""}
      >
        🧹
      </Button>
      <Button
        onClick={() => onToolChange("text")}
        className={tool === "text" ? "bg-accent" : ""}
      >
        T
      </Button>
      <Button onClick={onClearCanvas}>🗑️</Button>
      <div className="border-l mx-2" />
      <Button onClick={() => onZoom(1.2)}>🔍+</Button>
      <Button onClick={() => onZoom(0.8)}>🔍-</Button>
      <div className="border-l mx-2" />
      <input
        type="range"
        min="12"
        max="72"
        value={fontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="w-24"
      />
    </div>
  );
};
