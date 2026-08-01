interface DesignerCanvasProps {
  containerRef: (node: HTMLDivElement | null) => void;
}

// The live preview IS the canvas itself — whatever the customer sees here is
// exactly what gets exported on Save Design, so no separate preview element
// is needed. Renders a plain container div — useFabricCanvas owns creating
// and appending the actual <canvas> element into it (see that hook for why).
// `h-auto` alongside `max-w-full` keeps the square aspect ratio intact when
// the container itself is narrower than the canvas's native size (phones).
export function DesignerCanvas({ containerRef }: DesignerCanvasProps) {
  return (
    <div className="flex items-center justify-center overflow-hidden rounded-lg border bg-muted/30 p-2 sm:p-3">
      <div ref={containerRef} className="[&_canvas]:h-auto [&_canvas]:max-w-full [&_canvas]:rounded-md [&_canvas]:shadow-sm" />
    </div>
  );
}
