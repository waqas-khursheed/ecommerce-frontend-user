import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => setSession(result.user, result.token),
  });
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (result) => setSession(result.user, result.token),
  });
}

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authService.changePassword });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authService.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authService.resetPassword });
}

export function useLogout() {
  return useAuthStore((state) => state.logout);
}
