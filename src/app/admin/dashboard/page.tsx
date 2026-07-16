import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: replace with real stats once the admin dashboard endpoint is wired up.
const STATS = [
  { label: "Total Orders", value: "—" },
  { label: "Revenue", value: "—" },
  { label: "Products", value: "—" },
  { label: "Customers", value: "—" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
