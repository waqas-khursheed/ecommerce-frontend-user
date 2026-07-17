"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfileSchema, changePasswordSchema, type UpdateProfileInput, type ChangePasswordInput } from "@/schemas/auth.schema";
import { useChangePassword, useLogout, useProfile, useUpdateProfile } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/shared/Loader";

function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name ?? "",
        username: profile.username ?? "",
        phone: profile.phone,
        company_name: profile.company_name ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: UpdateProfileInput) => {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" aria-invalid={!!errors.first_name} {...register("first_name")} />
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" {...register("last_name")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="company_name">Company</Label>
        <Input id="company_name" {...register("company_name")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11">
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      await changePassword.mutateAsync(values);
      toast.success("Password changed");
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to change password"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="old_password">Current password</Label>
        <Input id="old_password" type="password" aria-invalid={!!errors.old_password} {...register("old_password")} />
        {errors.old_password && <p className="text-xs text-destructive">{errors.old_password.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new_password">New password</Label>
        <Input id="new_password" type="password" aria-invalid={!!errors.new_password} {...register("new_password")} />
        {errors.new_password && <p className="text-xs text-destructive">{errors.new_password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11">
        {isSubmitting ? "Updating..." : "Change password"}
      </Button>
    </form>
  );
}

export default function AccountProfilePage() {
  const logout = useLogout();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Button variant="outline" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
