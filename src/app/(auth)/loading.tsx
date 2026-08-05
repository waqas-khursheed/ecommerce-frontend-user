import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/shared/Loader";

// Covers login/register/forgot-password/reset-password. The (auth) layout
// already centers `children` inside a `max-w-sm` column, so this mirrors the
// Card shape those pages render to avoid a layout jump once they load.
export default function AuthLoading() {
  return (
    <Card>
      <CardContent className="py-16">
        <Loader size="lg" />
      </CardContent>
    </Card>
  );
}
