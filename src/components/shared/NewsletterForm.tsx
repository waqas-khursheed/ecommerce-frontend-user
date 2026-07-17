"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadService } from "@/services/lead.service";
import { getApiErrorMessage } from "@/lib/apiError";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await leadService.subscribe(email);
      toast.success("Subscribed! Watch your inbox for offers.");
      setEmail("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not subscribe right now"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />
        <Button type="submit" disabled={isSubmitting} className="h-11 shrink-0">
          {isSubmitting ? "..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
