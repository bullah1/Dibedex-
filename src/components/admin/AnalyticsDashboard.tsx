import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ShoppingBag,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Truck,
  Receipt,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Order = {
  id: string;
  full_name: string;
  district: string;
  quantity: number;
  product_name: string;
  product_price: number;
  total_amount: number;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(38 92% 50%)",
  confirmed: "hsl(217 91% 60%)",
  delivered: "hsl(142 71% 45%)",
  cancelled: "hsl(0 84% 60%)",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function fmtBn(n: number) {
  return `৳${n.toLocaleString("en-IN")}`;
}

export function AnalyticsDashboard({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayOrders = orders.filter(
      (o) => new Date(o.created_at) >= today,
    );
    const yestOrders = orders.filter((o) => {
      const d = new Date(o.created_at);
      return d >= yesterday && d < today;
    });
    const monthDelivered = orders.filter(
      (o) => o.status === "delivered" && new Date(o.created_at) >= monthStart,
    );

    const delivered = orders.filter((o) => o.status === "delivered");
    const confirmed = orders.filter((o) => o.status === "confirmed");
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const nonPending = orders.filter((o) => o.status !== "pending");

    const confirmRate =
      orders.length > 0
        ? ((confirmed.length + delivered.length) / orders.length) * 100
        : 0;
    const deliveryRate =
      nonPending.length > 0
        ? (delivered.length / (delivered.length + cancelled.length || 1)) * 100
        : 0;
    const aov =
      delivered.length > 0
        ? delivered.reduce((s, o) => s + o.total_amount, 0) / delivered.length
        : 0;

    // 30-day trend
    const days: { date: string; label: string; revenue: number; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        revenue: 0,
        count: 0,
      });
    }
    const byDay = new Map(days.map((d) => [d.date, d]));
    for (const o of orders) {
      const key = new Date(o.created_at).toISOString().slice(0, 10);
      const bucket = byDay.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      if (o.status === "delivered") bucket.revenue += o.total_amount;
    }

    // Status breakdown
    const statusCounts = ["pending", "confirmed", "delivered", "cancelled"].map(
      (s) => ({
        name: STATUS_LABEL[s],
        key: s,
        value: orders.filter((o) => o.status === s).length,
      }),
    );

    // Top districts
    const distMap = new Map<string, number>();
    for (const o of orders) distMap.set(o.district, (distMap.get(o.district) ?? 0) + 1);
    const topDistricts = [...distMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Package performance
    const pkgMap = new Map<
      string,
      { name: string; total: number; delivered: number; revenue: number }
    >();
    for (const o of orders) {
      const key = o.product_name || "Unknown";
      const row = pkgMap.get(key) ?? {
        name: key,
        total: 0,
        delivered: 0,
        revenue: 0,
      };
      row.total += 1;
      if (o.status === "delivered") {
        row.delivered += 1;
        row.revenue += o.total_amount;
      }
      pkgMap.set(key, row);
    }
    const packages = [...pkgMap.values()].sort((a, b) => b.total - a.total);

    const recent = [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total_amount, 0);
    const monthRevenue = monthDelivered.reduce((s, o) => s + o.total_amount, 0);
    const dayDelta =
      yestOrders.length > 0
        ? ((todayOrders.length - yestOrders.length) / yestOrders.length) * 100
        : todayOrders.length > 0
          ? 100
          : 0;

    return {
      todayCount: todayOrders.length,
      todayRevenue,
      monthRevenue,
      confirmRate,
      deliveryRate,
      aov,
      dayDelta,
      days,
      statusCounts,
      topDistricts,
      packages,
      recent,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Kpi
          icon={<ShoppingBag className="h-4 w-4" />}
          label="আজকের অর্ডার"
          value={data.todayCount.toString()}
          hint={`${data.dayDelta >= 0 ? "▲" : "▼"} ${Math.abs(data.dayDelta).toFixed(0)}% গতকাল`}
          tone={data.dayDelta >= 0 ? "ok" : "bad"}
        />
        <Kpi
          icon={<Wallet className="h-4 w-4" />}
          label="আজকের সম্ভাব্য"
          value={fmtBn(data.todayRevenue)}
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="এই মাসের Revenue"
          value={fmtBn(data.monthRevenue)}
          tone="ok"
        />
        <Kpi
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Confirm Rate"
          value={`${data.confirmRate.toFixed(1)}%`}
        />
        <Kpi
          icon={<Truck className="h-4 w-4" />}
          label="Delivery Rate"
          value={`${data.deliveryRate.toFixed(1)}%`}
        />
        <Kpi
          icon={<Receipt className="h-4 w-4" />}
          label="Avg Order"
          value={fmtBn(Math.round(data.aov))}
        />
      </div>

      {/* Revenue trend */}
      <Card title="Revenue Trend (৩০ দিন)">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.days} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number, k: string) =>
                  k === "revenue" ? [fmtBn(v), "Revenue"] : [v, "Orders"]
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(142 71% 45%)"
                fill="url(#rev)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Status breakdown */}
        <Card title="Status Breakdown">
          <div className="flex items-center gap-4">
            <div className="h-56 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusCounts}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.statusCounts.map((s) => (
                      <Cell key={s.key} fill={STATUS_COLORS[s.key]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-sm">
              {data.statusCounts.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: STATUS_COLORS[s.key] }}
                  />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Top districts */}
        <Card title="Top Districts">
          <div className="h-56 w-full">
            {data.topDistricts.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                কোনো ডেটা নেই
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topDistricts} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Package performance */}
      <Card title="Package Performance">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">মোট অর্ডার</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg Ticket</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                    এখনো ডেটা নেই
                  </TableCell>
                </TableRow>
              ) : (
                data.packages.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.total}</TableCell>
                    <TableCell className="text-right">{p.delivered}</TableCell>
                    <TableCell className="text-right font-semibold">{fmtBn(p.revenue)}</TableCell>
                    <TableCell className="text-right">
                      {p.delivered > 0 ? fmtBn(Math.round(p.revenue / p.delivered)) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Recent activity */}
      <Card title="সাম্প্রতিক অর্ডার">
        <ul className="divide-y divide-border">
          {data.recent.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">এখনো কোনো অর্ডার নেই</li>
          ) : (
            data.recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{o.full_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.district} · {new Date(o.created_at).toLocaleString("en-GB")}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{fmtBn(o.total_amount)}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white"
                    style={{ background: STATUS_COLORS[o.status] ?? "hsl(215 16% 47%)" }}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "bad";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-muted">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-xl font-extrabold tracking-tight">{value}</div>
      {hint ? (
        <div
          className={`mt-1 text-[11px] font-medium ${
            tone === "ok" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : "text-muted-foreground"
          }`}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}
