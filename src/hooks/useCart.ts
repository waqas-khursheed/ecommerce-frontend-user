import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { getApiErrorMessage } from "@/lib/apiError";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => cartService.list(),
    staleTime: 30 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
    onError: (error) => {
      // TODO: replace with the app's toast component once wired up.
      console.error(getApiErrorMessage(error, "Failed to add to cart"));
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => cartService.updateQuantity(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cartService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
  });
}
