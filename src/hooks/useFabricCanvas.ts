"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, Textbox, type FabricObject } from "fabric";

// Kept modest so the modal itself stays compact — the high-res export
// (toHighResDataUrl's multiplier) is what actually determines print quality,
// not this on-screen working size.
export const DESIGN_CANVAS_WIDTH = 440;
export const DESIGN_CANVAS_HEIGHT = 440;

export interface SelectedTextProps {
  fontFamily: string;
  fontSize: number;
  fill: string;
}

const isTextbox = (obj: FabricObject | undefined | null): obj is Textbox => !!obj && obj.type === "textbox";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Owns the fabric.Canvas instance's whole lifecycle (init on mount, dispose
// on unmount) so components using it never touch the fabric API directly —
// they just call these methods and read `selectedText`/`hasSelection`.
//
// `backgroundImageUrl` is the product's own template photo (front or back)
// for this side — the customer designs on top of it, and since fabric
// includes `canvas.backgroundImage` in both toDataURL() and toJSON() output
// automatically, no separate compositing step is needed at save time.
export function useFabricCanvas(backgroundImageUrl?: string) {
  // A container div, not the <canvas> itself — fabric wraps whatever canvas
  // element it's given (extra "upper-canvas" sibling, wrapper div) and its
  // dispose() is asynchronous. Under React StrictMode's dev-only double
  // effect invocation, reusing the same JSX-rendered <canvas> across the
  // simulated mount→unmount→mount cycle lets the first instance's delayed
  // dispose() tear down DOM nodes the second instance now owns. Owning a
  // fresh <canvas> per real mount (appended into this container, hard-removed
  // on cleanup) keeps each fabric.Canvas instance's DOM isolated so that race
  // can't corrupt the live one.
  //
  // A callback ref (not useRef + useEffect(fn, [])) on purpose: this canvas
  // lives inside a Dialog's portaled content, which mounts asynchronously
  // relative to the component's own effect timing — a plain ref can still be
  // null the first time the init effect runs. Keying the effect off state set
  // by the ref callback guarantees it only runs once the DOM node is real.
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedText, setSelectedText] = useState<SelectedTextProps | null>(null);
  const [isReady, setIsReady] = useState(false);

  const syncSelection = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    setHasSelection(!!active);
    setSelectedText(
      isTextbox(active)
        ? { fontFamily: active.fontFamily ?? "Arial", fontSize: active.fontSize ?? 24, fill: String(active.fill ?? "#000000") }
        : null
    );
  }, []);

  useEffect(() => {
    const container = containerEl;
    if (!container) return;

    const canvasEl = document.createElement("canvas");
    container.appendChild(canvasEl);

    const canvas = new Canvas(canvasEl, {
      width: DESIGN_CANVAS_WIDTH,
      height: DESIGN_CANVAS_HEIGHT,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    fabricCanvasRef.current = canvas;
    setIsReady(true);

    canvas.on("selection:created", syncSelection);
    canvas.on("selection:updated", syncSelection);
    canvas.on("selection:cleared", syncSelection);

    return () => {
      fabricCanvasRef.current = null;
      setIsReady(false);
      // Fire-and-forget — dispose() is async, but the container's children
      // are removed synchronously below, so whatever it does afterwards
      // touches detached, orphaned nodes rather than the next mount's canvas.
      canvas.dispose().catch(() => {});
      container.replaceChildren();
    };
  }, [containerEl, syncSelection]);

  // Runs whenever the canvas becomes ready or the requested template image
  // changes (e.g. this hook is reused across products) — loads it, scales it
  // to fit the canvas without cropping, and pins it as the non-interactive
  // background so added logos/text always render on top of it.
  useEffect(() => {
    if (!isReady || !backgroundImageUrl) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    FabricImage.fromURL(backgroundImageUrl, { crossOrigin: "anonymous" }).then((img) => {
      if (cancelled || !fabricCanvasRef.current) return;

      const scale = Math.min(
        DESIGN_CANVAS_WIDTH / (img.width || DESIGN_CANVAS_WIDTH),
        DESIGN_CANVAS_HEIGHT / (img.height || DESIGN_CANVAS_HEIGHT)
      );
      img.set({
        left: DESIGN_CANVAS_WIDTH / 2,
        top: DESIGN_CANVAS_HEIGHT / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    });

    return () => {
      cancelled = true;
    };
  }, [isReady, backgroundImageUrl]);

  const addImageFromUrl = useCallback(async (url: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    const maxDim = DESIGN_CANVAS_WIDTH * 0.6;
    const scale = Math.min(maxDim / (img.width || maxDim), maxDim / (img.height || maxDim), 1);
    img.set({
      left: DESIGN_CANVAS_WIDTH / 2,
      top: DESIGN_CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      scaleX: scale,
      scaleY: scale,
    });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    syncSelection();
  }, [syncSelection]);

  const addImageFromFile = useCallback(
    async (file: File) => {
      const dataUrl = await readFileAsDataUrl(file);
      await addImageFromUrl(dataUrl);
    },
    [addImageFromUrl]
  );

  const addText = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const textbox = new Textbox("Your text here", {
      left: DESIGN_CANVAS_WIDTH / 2,
      top: DESIGN_CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      fontFamily: "Arial",
      fontSize: 32,
      fill: "#000000",
      width: 240,
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.requestRenderAll();
    syncSelection();
  }, [syncSelection]);

  const deleteActiveObject = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;

    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    syncSelection();
  }, [syncSelection]);

  const updateSelectedText = useCallback((patch: Partial<SelectedTextProps>) => {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !isTextbox(active)) return;

    active.set(patch);
    canvas.requestRenderAll();
    setSelectedText((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const isEmpty = useCallback(() => {
    return (fabricCanvasRef.current?.getObjects().length ?? 0) === 0;
  }, []);

  const toPreviewDataUrl = useCallback(() => {
    return fabricCanvasRef.current?.toDataURL({ format: "png", multiplier: 1 }) ?? null;
  }, []);

  const toHighResDataUrl = useCallback((multiplier = 3) => {
    return fabricCanvasRef.current?.toDataURL({ format: "png", multiplier }) ?? null;
  }, []);

  const toDesignJson = useCallback(() => {
    return fabricCanvasRef.current ? JSON.stringify(fabricCanvasRef.current.toJSON()) : null;
  }, []);

  return {
    containerRef,
    isReady,
    hasSelection,
    selectedText,
    addImageFromFile,
    addImageFromUrl,
    addText,
    deleteActiveObject,
    updateSelectedText,
    isEmpty,
    toPreviewDataUrl,
    toHighResDataUrl,
    toDesignJson,
  };
}
