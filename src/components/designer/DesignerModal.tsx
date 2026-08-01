"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignerCanvas } from "@/components/designer/DesignerCanvas";
import { Toolbar } from "@/components/designer/Toolbar";
import { LogoUploadPanel } from "@/components/designer/LogoUploadPanel";
import { useFabricCanvas } from "@/hooks/useFabricCanvas";
import { useDesignSave } from "@/hooks/useDesignSave";
import { uploadUrl } from "@/lib/http";
import type { Product, ProductDefaultLogo } from "@/types/product";
import type { SavedDesign } from "@/types/order";

interface DesignerModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (design: SavedDesign) => void;
}

// One side's canvas + toolbar + logo panel. Kept as its own component (not
// inlined) so front and back each get a visually identical editor while
// staying wired to their own independent useFabricCanvas instance.
function SideEditor({
  canvas,
  defaultLogos,
  onUploadFile,
}: {
  canvas: ReturnType<typeof useFabricCanvas>;
  defaultLogos: ProductDefaultLogo[];
  onUploadFile: (file: File) => void;
}) {
  return (
    <div className="grid gap-4 pt-3 md:grid-cols-[minmax(0,1fr)_220px]">
      <DesignerCanvas containerRef={canvas.containerRef} />
      <div className="space-y-4">
        <Toolbar
          hasSelection={canvas.hasSelection}
          selectedText={canvas.selectedText}
          onAddText={canvas.addText}
          onDelete={canvas.deleteActiveObject}
          onUpdateText={canvas.updateSelectedText}
        />
        <LogoUploadPanel
          defaultLogos={defaultLogos}
          onUploadFile={onUploadFile}
          onSelectPreset={canvas.addImageFromUrl}
        />
      </div>
    </div>
  );
}

export function DesignerModal({ product, open, onOpenChange, onSaved }: DesignerModalProps) {
  const hasFront = !!product.customization_front_image;
  const hasBack = !!product.customization_back_image;
  // A customization-enabled product with neither template image configured
  // falls back to today's blank-canvas single-side behavior instead of
  // rendering an empty modal.
  const frontActive = hasFront || (!hasFront && !hasBack);
  const backActive = hasBack;
  const bothSides = hasFront && hasBack;

  const frontUrl = uploadUrl("products", product.customization_front_image) ?? undefined;
  const backUrl = uploadUrl("products", product.customization_back_image) ?? undefined;

  // Always called (rules of hooks) — a side that isn't rendered never gets a
  // container ref, so its internal init effect never fires and it stays inert.
  const front = useFabricCanvas(frontUrl);
  const back = useFabricCanvas(backUrl);

  const [frontLogoFile, setFrontLogoFile] = useState<File | null>(null);
  const [backLogoFile, setBackLogoFile] = useState<File | null>(null);
  const saveDesign = useDesignSave();

  const handleUploadFront = async (file: File) => {
    setFrontLogoFile(file);
    await front.addImageFromFile(file);
  };

  const handleUploadBack = async (file: File) => {
    setBackLogoFile(file);
    await back.addImageFromFile(file);
  };

  const handleSave = async () => {
    const frontHasContent = frontActive && !front.isEmpty();
    const backHasContent = backActive && !back.isEmpty();

    if (!frontHasContent && !backHasContent) {
      toast.error("Add a logo or some text to at least one side before saving your design");
      return;
    }

    const frontExport = frontHasContent
      ? {
          previewDataUrl: front.toPreviewDataUrl()!,
          highResDataUrl: front.toHighResDataUrl(3)!,
          designJson: front.toDesignJson()!,
          logoFile: frontLogoFile,
        }
      : null;

    const backExport = backHasContent
      ? {
          previewDataUrl: back.toPreviewDataUrl()!,
          highResDataUrl: back.toHighResDataUrl(3)!,
          designJson: back.toDesignJson()!,
          logoFile: backLogoFile,
        }
      : null;

    const result = await saveDesign.mutateAsync({ front: frontExport, back: backExport });
    onSaved(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-full max-w-[calc(100%-1.5rem)] flex-col overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-4 pt-4 pb-3 sm:px-5">
          <DialogTitle className="text-base sm:text-lg">Customize {product.title}</DialogTitle>
          <DialogDescription className="flex items-start gap-1.5 text-xs">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Drag your logo or text to position it, use the corner handle to resize — it's placed right on top of the
            real product photo, so what you see here is what gets printed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-5">
          {bothSides ? (
            <Tabs defaultValue="front">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="front" className="flex-1 sm:flex-none">Front</TabsTrigger>
                <TabsTrigger value="back" className="flex-1 sm:flex-none">Back</TabsTrigger>
              </TabsList>
              <TabsContent value="front" keepMounted>
                <SideEditor canvas={front} defaultLogos={product.defaultLogos ?? []} onUploadFile={handleUploadFront} />
              </TabsContent>
              <TabsContent value="back" keepMounted>
                <SideEditor canvas={back} defaultLogos={product.defaultLogos ?? []} onUploadFile={handleUploadBack} />
              </TabsContent>
            </Tabs>
          ) : backActive ? (
            <SideEditor canvas={back} defaultLogos={product.defaultLogos ?? []} onUploadFile={handleUploadBack} />
          ) : (
            <SideEditor canvas={front} defaultLogos={product.defaultLogos ?? []} onUploadFile={handleUploadFront} />
          )}
        </div>

        <DialogFooter className="border-t px-4 py-3 sm:px-5">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saveDesign.isPending}>
            {saveDesign.isPending ? "Saving..." : "Save Design"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
