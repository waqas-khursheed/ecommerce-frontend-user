"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { designService } from "@/services/design.service";
import { dataUrlToFile } from "@/lib/dataUrl";
import { getApiErrorMessage } from "@/lib/apiError";
import type { SavedDesign } from "@/types/order";

interface SideExport {
  previewDataUrl: string;
  highResDataUrl: string;
  designJson: string;
  logoFile: File | null;
}

interface SaveDesignInput {
  front: SideExport | null;
  back: SideExport | null;
}

export function useDesignSave() {
  return useMutation<SavedDesign, unknown, SaveDesignInput>({
    mutationFn: async ({ front, back }) => {
      const formData = new FormData();

      if (front) {
        formData.append("front_preview_image", dataUrlToFile(front.previewDataUrl, "front-preview.png"));
        formData.append("front_high_res_image", dataUrlToFile(front.highResDataUrl, "front-high-res.png"));
        formData.append("front_design_json", new File([front.designJson], "front-design.json", { type: "application/json" }));
        if (front.logoFile) formData.append("front_logo_image", front.logoFile);
      }

      if (back) {
        formData.append("back_preview_image", dataUrlToFile(back.previewDataUrl, "back-preview.png"));
        formData.append("back_high_res_image", dataUrlToFile(back.highResDataUrl, "back-high-res.png"));
        formData.append("back_design_json", new File([back.designJson], "back-design.json", { type: "application/json" }));
        if (back.logoFile) formData.append("back_logo_image", back.logoFile);
      }

      return designService.save(formData);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to save design"));
    },
  });
}
