import { Button } from "@/components/ui/button";
import { COLORS } from "@/constants/colors";
import { ToolbarProps } from "@/types/whiteboard";

export const Toolbar = ({
  selectedColor,
  setSelectedColor,
  tool,
  setTool,
  clearCanvas,
  handleZoom,
  fontSize,
  setFontSize,
}: ToolbarProps) => {
  return (
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
  );
};