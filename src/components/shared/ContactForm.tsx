"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { leadService } from "@/services/lead.service";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mirrors backed/src/modules/leads/validations/user.lead.validation.js contactFormSchema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(95),
  email: z.string().trim().email("Invalid email format").max(95),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  description: z.string().trim().min(2, "Message is required"),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactInput) => {
    try {
      await leadService.contactUs(values);
      toast.success("Message sent — we'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send your message"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Message</Label>
        <Textarea id="description" rows={5} aria-invalid={!!errors.description} {...register("description")} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
