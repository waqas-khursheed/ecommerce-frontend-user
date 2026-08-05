import Image from "next/image";
import { uploadUrl } from "@/lib/http";
import type { TrustBadge } from "@/types/home";

export function TrustBadges({ badges }: { badges: TrustBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {badges.map((badge) => {
        const image = uploadUrl("trust-badges", badge.image);
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-primary/10">
              {image && <Image src={image} alt="" fill sizes="44px" className="object-cover" />}
            </div>
            <p className="text-sm font-semibold">{badge.title}</p>
            {badge.description && <p className="text-xs text-muted-foreground">{badge.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
