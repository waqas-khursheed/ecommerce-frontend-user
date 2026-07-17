import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";

export function useCountries() {
  return useQuery({
    queryKey: ["locations", "countries"],
    queryFn: () => locationService.listCountries(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useStates(countryId?: number) {
  return useQuery({
    queryKey: ["locations", "states", countryId],
    queryFn: () => locationService.listStates(countryId),
    enabled: !!countryId,
    staleTime: 60 * 60 * 1000,
  });
}

export function useCities(stateId?: number) {
  return useQuery({
    queryKey: ["locations", "cities", stateId],
    queryFn: () => locationService.listCities(stateId),
    enabled: !!stateId,
    staleTime: 60 * 60 * 1000,
  });
}
