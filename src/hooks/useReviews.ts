import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService } from "@/services/review.service";
import { getApiErrorMessage } from "@/lib/apiError";

export function useProductReviews(productId: number, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["reviews", productId, params],
    queryFn: () => reviewService.listForProduct(productId, params),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.create,
    onSuccess: (_review, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
      toast.success("Thanks! Your review has been submitted and is awaiting approval.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to submit review")),
  });
}
