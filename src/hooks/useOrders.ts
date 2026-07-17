import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import { getApiErrorMessage } from "@/lib/apiError";

export function useOrders(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderService.listMyOrders(params),
  });
}

export function useOrderDetail(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderService.cancel(id),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["orders", order.id], order);
      toast.success("Order cancelled");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to cancel order")),
  });
}
