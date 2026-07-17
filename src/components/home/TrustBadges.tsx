import { BadgeCheck, CreditCard, Globe, Tag } from "lucide-react";

const BADGES = [
  { icon: Globe, title: "Worldwide Shipping", desc: "We deliver to your doorstep, wherever you are." },
  { icon: BadgeCheck, title: "Best Quality", desc: "Every product is checked before it ships." },
  { icon: Tag, title: "Best Offers", desc: "New deals and discounts every week." },
  { icon: CreditCard, title: "Secure Payments", desc: "Your payment details are always protected." },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <div key={badge.title} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <p className="text-sm font-semibold">{badge.title}</p>
            <p className="text-xs text-muted-foreground">{badge.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
