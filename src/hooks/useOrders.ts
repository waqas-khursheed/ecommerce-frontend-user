import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";

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
