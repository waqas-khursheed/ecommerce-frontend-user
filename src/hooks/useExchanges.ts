import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exchangeService } from "@/services/exchange.service";
import { getApiErrorMessage } from "@/lib/apiError";
import type { ExchangeRequestPayload } from "@/types/exchange";

const exchangeKeys = {
  mine: ["exchanges", "mine"] as const,
};

export function useMyExchanges(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...exchangeKeys.mine, params],
    queryFn: () => exchangeService.listMine(params),
  });
}

export function useCreateExchange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExchangeRequestPayload) => exchangeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeKeys.mine });
      toast.success("Exchange request submitted — we'll review it shortly");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not submit exchange request")),
  });
}
