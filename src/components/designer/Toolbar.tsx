import { Type, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectedTextProps } from "@/hooks/useFabricCanvas";

const FONT_FAMILIES = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana", "Trebuchet MS", "Impact"];

interface ToolbarProps {
  hasSelection: boolean;
  selectedText: SelectedTextProps | null;
  onAddText: () => void;
  onDelete: () => void;
  onUpdateText: (patch: Partial<SelectedTextProps>) => void;
}

export function Toolbar({ hasSelection, selectedText, onAddText, onDelete, onUpdateText }: ToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onAddText}>
          <Type /> Add Text
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDelete} disabled={!hasSelection}>
          <Trash2 /> Delete Selected
        </Button>
      </div>

      {selectedText && (
        <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Font family</Label>
            <Select value={selectedText.fontFamily} onValueChange={(v) => v && onUpdateText({ fontFamily: v })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Font size ({selectedText.fontSize}px)</Label>
            <input
              type="range"
              min={8}
              max={120}
              value={selectedText.fontSize}
              onChange={(e) => onUpdateText({ fontSize: Number(e.target.value) })}
              className="h-11 w-full accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Text colour</Label>
            <input
              type="color"
              value={selectedText.fill}
              onChange={(e) => onUpdateText({ fill: e.target.value })}
              className="h-11 w-full cursor-pointer rounded-lg border border-input bg-transparent p-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
