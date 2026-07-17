"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.schema";
import { useForgotPassword } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      const result = await forgotPassword.mutateAsync(values.email);
      setSentTo(values.email);
      if (result.debug_code) {
        toast.info(`Dev mode — your reset code is ${result.debug_code}`);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send reset code"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>We&apos;ll email you a 6-digit code to reset it.</CardDescription>
      </CardHeader>
      <CardContent>
        {sentTo ? (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              If an account exists for <strong>{sentTo}</strong>, a reset code is on its way.
            </p>
            <Button className="h-11 w-full" render={<Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`} />}>
              I have my code
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
              {isSubmitting ? "Sending..." : "Send reset code"}
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
