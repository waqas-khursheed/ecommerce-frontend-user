import Image from "next/image";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { uploadUrl } from "@/lib/http";
import type { ProductDefaultLogo } from "@/types/product";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/jpg,image/svg+xml";

interface LogoUploadPanelProps {
  defaultLogos: ProductDefaultLogo[];
  onUploadFile: (file: File) => void;
  onSelectPreset: (url: string) => void;
}

export function LogoUploadPanel({ defaultLogos, onUploadFile, onSelectPreset }: LogoUploadPanelProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Upload your logo/artwork</Label>
        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm text-muted-foreground hover:bg-muted">
          <Upload className="size-4" />
          PNG, JPG or SVG
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {defaultLogos.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Or pick a preset</Label>
          <div className="flex flex-wrap gap-2">
            {defaultLogos.map((logo) => {
              const src = uploadUrl("logos", logo.image);
              if (!src) return null;
              return (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => onSelectPreset(src)}
                  className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted hover:ring-2 hover:ring-primary"
                >
                  <Image src={src} alt="Logo preset" fill sizes="56px" className="object-contain p-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
