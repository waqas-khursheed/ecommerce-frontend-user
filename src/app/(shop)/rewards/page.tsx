"use client";

import { Gift } from "lucide-react";
import { useRewardBalance, useRewardSettings } from "@/hooks/useReward";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils";
import { Loader } from "@/components/shared/Loader";

export default function RewardsPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: settings, isLoading } = useRewardSettings();
  const { data: balance } = useRewardBalance();

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-xl font-bold sm:text-2xl">Rewards Program</h1>
        <p className="text-sm text-muted-foreground">
          Earn points on every purchase and redeem them for discounts on future orders.
        </p>
      </div>

      {isAuthenticated && balance && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <Gift className="size-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Your balance</p>
            <p className="text-lg font-semibold">{balance.rewards} points</p>
          </div>
        </div>
      )}

      {settings && settings.earningMethods.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">How you earn points</h2>
          <div className="divide-y rounded-lg border">
            {settings.earningMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 text-sm">
                <span>Spend {formatPrice(method.purchase)}</span>
                <span className="font-medium">Earn {method.equals_to} points</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {settings && settings.redemptionRules.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">How you redeem points</h2>
          <div className="divide-y rounded-lg border">
            {settings.redemptionRules.map((rule) => (
              <div key={rule.id} className="p-4 text-sm text-muted-foreground">
                Every {rule.points} points = {formatPrice(rule.equal_to)} off, once you have at least{" "}
                {rule.minimum_points} points.
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
