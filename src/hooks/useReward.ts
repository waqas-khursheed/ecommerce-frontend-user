import { useQuery } from "@tanstack/react-query";
import { rewardService } from "@/services/reward.service";
import { useAuthStore } from "@/store/auth.store";

export function useRewardSettings() {
  return useQuery({
    queryKey: ["rewards", "settings"],
    queryFn: () => rewardService.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRewardBalance() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ["rewards", "balance"],
    queryFn: () => rewardService.getBalance(),
    enabled: isAuthenticated,
  });
}
