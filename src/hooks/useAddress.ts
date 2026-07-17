import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addressService } from "@/services/address.service";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/auth.store";

const addressKey = ["address"] as const;

export function useAddress() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: addressKey,
    queryFn: () => addressService.get(),
    enabled: isAuthenticated,
  });
}

export function useUpsertAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressService.upsert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKey });
      toast.success("Address saved");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to save address")),
  });
}
