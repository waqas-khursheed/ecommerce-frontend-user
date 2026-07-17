import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistService } from "@/services/wishlist.service";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/auth.store";

const wishlistKey = ["wishlist"] as const;

export function useWishlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: wishlistKey,
    queryFn: () => wishlistService.list(),
    enabled: isAuthenticated,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistService.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKey });
      toast.success("Added to wishlist");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to add to wishlist")),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistService.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKey });
      toast.success("Removed from wishlist");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to remove from wishlist")),
  });
}
