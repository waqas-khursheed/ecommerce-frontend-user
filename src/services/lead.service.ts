import { http } from "@/lib/http";

// Confirmed against backed/src/modules/leads/routes/user.lead.routes.js
// (mounted at /api).
export const leadService = {
  async subscribe(email: string): Promise<void> {
    await http.post("/subscribe", { email });
  },

  async contactUs(payload: { name: string; email: string; phone?: string; description: string }): Promise<void> {
    await http.post("/contact-us", payload);
  },
};
