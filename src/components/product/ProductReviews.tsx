"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/product/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/shared/Loader";
import { useCreateReview, useProductReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/store/auth.store";
import type { ReviewStats } from "@/types/product";

const reviewSchema = z.object({
  review: z.string().trim().min(2, "Review must be at least 2 characters").max(2000),
});
type ReviewInput = z.infer<typeof reviewSchema>;

function ReviewForm({ productId }: { productId: number }) {
  const [rate, setRate] = useState(5);
  const createReview = useCreateReview();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema) });

  const onSubmit = (values: ReviewInput) => {
    createReview.mutate(
      { product_id: productId, review: values.review, rate },
      { onSuccess: () => reset() }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Write a review</p>
      <StarRating value={rate} onChange={setRate} size="md" />
      <Textarea rows={3} placeholder="Share your thoughts about this product..." {...register("review")} />
      {errors.review && <p className="text-xs text-destructive">{errors.review.message}</p>}
      <Button type="submit" disabled={createReview.isPending} className="h-10">
        {createReview.isPending ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}

export function ProductReviews({ productId, stats }: { productId: number; stats?: ReviewStats }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading } = useProductReviews(productId);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold sm:text-xl">Reviews</h2>
        {stats && stats.count > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <StarRating value={stats.average} />
            <span>
              {stats.average.toFixed(1)} ({stats.count} review{stats.count === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <ReviewForm productId={productId} />
      ) : (
        <p className="text-sm text-muted-foreground">Sign in to write a review.</p>
      )}

      {isLoading && <Loader />}
      {data && data.reviews.length === 0 && <EmptyState title="No reviews yet" description="Be the first to review this product." />}
      {data && data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <div key={review.id} className="space-y-1 border-b pb-4 last:border-0">
              <div className="flex items-center gap-2">
                <StarRating value={review.rate} />
                <span className="text-sm font-medium">{review.name}</span>
                {review.is_verified_purchase === 1 && (
                  <span className="text-xs text-emerald-600">Verified purchase</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{review.review}</p>
              <p className="text-xs text-muted-foreground/70">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
