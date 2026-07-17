import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to {APP_NAME}.
      </p>
      <div className="mt-6 flex gap-3">
        <Button render={<Link href="/" />}>Go home</Button>
        <Button variant="outline" render={<Link href="/products" />}>
          Browse products
        </Button>
      </div>
    </div>
  );
}
