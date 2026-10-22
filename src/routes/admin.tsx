import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Toaster, toast } from "sonner";
import { Loader2, LogOut, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  adminChangePassword,
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminListOrders,
  adminListTestimonials,
  adminLogin,
  adminUpdateOrderStatus,
  adminUpdateSettings,
  adminUpdateStats,
  adminUpdateTestimonial,
  adminPushToCourier,
} from "@/lib/api/admin.functions";


import {
  fetchSettings,
  fetchStats,
  type SiteSettings,
  type SiteStats,
  type Testimonial,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
} from "@/lib/site";
import { track } from "@/lib/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, MessageSquare, BarChart3, ShoppingCart, LineChart, TrendingDown } from "lucide-react";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { FunnelReport } from "@/components/admin/FunnelReport";
import { AbandonedCheckouts } from "@/components/admin/AbandonedCheckouts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Dibedex" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const TOKEN_KEY = "dibedex_admin_token";

type Order = {
  id: string;
  full_name: string;
  phone: string;
  district: string;
  address: string;
  quantity: number;
  payment_method: string;
  product_name: string;
  product_price: number;
  delivery_charge: number;
  total_amount: number;
  status: string;
  order_note: string | null;
  created_at: string;
  consignment_id?: string | null;
  tracking_code?: string | null;
  courier_status?: string | null;
  courier_error?: string | null;
};


function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(sessionStorage.getItem(TOKEN_KEY));
  }, []);

  if (!token) return <LoginGate onLogin={(t) => {
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }} />;

  return <Dashboard token={token} onLogout={() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }} />;
}

function LoginGate({ onLogin }: { onLogin: (t: string) => void }) {
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-mint px-4">
      <Toaster position="top-center" richColors />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const res = await login({ data: { password } });
            onLogin(res.token);
            toast.success("লগইন সফল");
          } catch {
            toast.error("ভুল পাসওয়ার্ড");
          } finally {
            setLoading(false);
          }
        }}
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)]"
      >
        <h1 className="text-xl font-bold">Dibedex Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin password দিয়ে লগইন করুন।
        </p>
        <Label className="mt-5 block text-sm font-medium">Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
          autoFocus
        />
        <Button type="submit" className="btn-cta mt-5 w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Login
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          পাসওয়ার্ড ডাটাবেস থেকে যাচাই হচ্ছে। লগইন করার পর "Change Password" থেকে পরিবর্তন করুন।
        </p>

      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const listOrders = useServerFn(adminListOrders);
  const updateStatus = useServerFn(adminUpdateOrderStatus);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await listOrders({ data: { token } });
      setOrders(res.orders as Order[]);
    } catch (e) {
      console.error(e);
      toast.error("লোড করা যায়নি — লগআউট করে আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    fetchSettings().then(setSettings).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const revenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + o.total_amount, 0);
    return { total, pending, confirmed, delivered, cancelled, revenue };
  }, [orders]);

  const onStatusChange = async (id: string, status: string) => {
    const prev = orders.find((o) => o.id === id);
    try {
      const res = await updateStatus({
        data: { token, id, status: status as "pending" | "confirmed" | "delivered" | "cancelled" },
      });
      setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o)));
      track("order_status_change", {
        order_id: id,
        from: prev?.status,
        to: status,
        total: prev?.total_amount,
        currency: "BDT",
      });
      if (status === "confirmed") {
        track("order_confirmed", {
          order_id: id,
          total: prev?.total_amount,
          currency: "BDT",
          from: prev?.status,
        });
        const courier = (res as { courier?: { ok: boolean; consignment_id?: string; tracking_code?: string; error?: string } | null }).courier;
        if (courier?.ok && courier.consignment_id) {
          toast.success(`Steadfast-এ পুশ হয়েছে (CID: ${courier.consignment_id})`);
          await refresh();
        } else if (courier && !courier.ok) {
          toast.error(`Courier push ব্যর্থ: ${courier.error ?? "unknown"}`);
        }
      } else if (status === "delivered") {
        track("order_delivered", {
          order_id: id,
          total: prev?.total_amount,
          currency: "BDT",
        });
      } else if (status === "cancelled") {
        track("order_cancelled", {
          order_id: id,
          total: prev?.total_amount,
          from: prev?.status,
        });
      }
      toast.success("Status আপডেট হয়েছে");
    } catch {
      toast.error("আপডেট করা যায়নি");
    }

  };

  return (
    <div className="min-h-screen bg-muted">
      <Toaster position="top-center" richColors />
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
              D
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Dibedex Admin</h1>
              <p className="text-xs text-muted-foreground">Orders &amp; Settings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <SettingsDialog
              token={token}
              settings={settings}
              onSaved={(s) => setSettings(s)}
            />
            <ChangePasswordDialog token={token} onChanged={(t) => {
              try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
            }} />
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="mr-1.5 h-4 w-4" /> Logout
            </Button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Tabs defaultValue="analytics">
          <TabsList className="mb-5">
            <TabsTrigger value="analytics"><LineChart className="mr-1.5 h-4 w-4" />Analytics</TabsTrigger>
            <TabsTrigger value="funnel"><TrendingDown className="mr-1.5 h-4 w-4" />Funnel</TabsTrigger>
            <TabsTrigger value="orders"><ShoppingCart className="mr-1.5 h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="abandoned"><ShoppingCart className="mr-1.5 h-4 w-4" />Abandoned</TabsTrigger>
            <TabsTrigger value="reviews"><MessageSquare className="mr-1.5 h-4 w-4" />Reviews</TabsTrigger>
            <TabsTrigger value="stats"><BarChart3 className="mr-1.5 h-4 w-4" />Stats &amp; Urgency</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            {loading ? (
              <div className="grid place-items-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AnalyticsDashboard orders={orders} />
            )}
          </TabsContent>

          <TabsContent value="funnel">
            <FunnelReport token={token} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Total" value={stats.total} />
              <Stat label="Pending" value={stats.pending} tone="warn" />
              <Stat label="Confirmed" value={stats.confirmed} />
              <Stat label="Delivered" value={stats.delivered} tone="ok" />
              <Stat label="Cancelled" value={stats.cancelled} tone="bad" />
              <Stat label="Revenue" value={`৳ ${stats.revenue}`} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Courier</TableHead>
                    </TableRow>

                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-10 text-center">
                          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                          এখনো কোনো অর্ডার নেই
                        </TableCell>
                      </TableRow>

                    ) : (
                      orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(o.created_at).toLocaleString("en-GB")}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{o.full_name}</div>
                            <div className="max-w-[220px] truncate text-xs text-muted-foreground">
                              {o.address}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <a href={`tel:${o.phone}`} className="text-primary hover:underline">
                              {o.phone}
                            </a>
                          </TableCell>
                          <TableCell>{o.district}</TableCell>
                          <TableCell>{o.quantity}</TableCell>
                          <TableCell className="font-semibold">৳ {o.total_amount}</TableCell>
                          <TableCell className="uppercase text-xs">{o.payment_method}</TableCell>
                          <TableCell>
                            <Select
                              value={o.status}
                              onValueChange={(v) => onStatusChange(o.id, v)}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <CourierCell order={o} token={token} onDone={refresh} />
                          </TableCell>
                        </TableRow>

                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="abandoned">
            <AbandonedCheckouts token={token} />
          </TabsContent>

          <TabsContent value="reviews">
            <TestimonialsManager token={token} />
          </TabsContent>

          <TabsContent value="stats">
            <StatsManager token={token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TestimonialsManager({ token }: { token: string }) {
  const list = useServerFn(adminListTestimonials);
  const create = useServerFn(adminCreateTestimonial);
  const update = useServerFn(adminUpdateTestimonial);
  const del = useServerFn(adminDeleteTestimonial);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, text: "" });
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await list({ data: { token } });
      setItems(res.testimonials as Testimonial[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Text</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    কোনো রিভিউ নেই — ডানপাশে যোগ করুন
                  </TableCell>
                </TableRow>
              ) : (
                items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.location ?? "—"}</TableCell>
                    <TableCell>{t.rating}★</TableCell>
                    <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                      {t.text}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={t.is_active}
                        onCheckedChange={async (v) => {
                          await update({ data: { token, id: t.id, is_active: v } });
                          setItems((prev) =>
                            prev.map((x) => (x.id === t.id ? { ...x, is_active: v } : x)),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={async () => {
                          if (!confirm("Delete this review?")) return;
                          await del({ data: { token, id: t.id } });
                          setItems((prev) => prev.filter((x) => x.id !== t.id));
                          toast.success("Deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <form
        className="grid h-fit gap-3 rounded-2xl border border-border bg-card p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!form.name.trim() || !form.text.trim()) return;
          setSaving(true);
          try {
            await create({
              data: {
                token,
                name: form.name.trim(),
                location: form.location.trim() || undefined,
                rating: form.rating,
                text: form.text.trim(),
              },
            });
            setForm({ name: "", location: "", rating: 5, text: "" });
            toast.success("Review added");
            refresh();
          } catch {
            toast.error("Could not save");
          } finally {
            setSaving(false);
          }
        }}
      >
        <h3 className="text-base font-bold">নতুন রিভিউ যোগ করুন</h3>
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Location</Label>
          <Input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">Rating (1–5)</Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label className="text-xs">Review Text</Label>
          <Textarea
            rows={4}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </div>
        <Button className="btn-cta" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add Review
        </Button>
      </form>
    </div>
  );
}

function StatsManager({ token }: { token: string }) {
  const update = useServerFn(adminUpdateStats);
  const [form, setForm] = useState<SiteStats>(DEFAULT_STATS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats().then(setForm).catch(() => {});
  }, []);

  return (
    <form
      className="grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await update({
            data: {
              token,
              happy_customers: Number(form.happy_customers),
              delivered_orders: Number(form.delivered_orders),
              avg_rating: Number(form.avg_rating),
              urgency_text: form.urgency_text,
            },
          });
          toast.success("সেভ হয়েছে");
        } catch {
          toast.error("সেভ করা যায়নি");
        } finally {
          setSaving(false);
        }
      }}
    >
      <h3 className="text-base font-bold">Stats Strip &amp; Urgency Banner</h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Happy Customers</Label>
          <Input
            type="number"
            value={form.happy_customers}
            onChange={(e) =>
              setForm({ ...form, happy_customers: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label className="text-xs">Delivered Orders</Label>
          <Input
            type="number"
            value={form.delivered_orders}
            onChange={(e) =>
              setForm({ ...form, delivered_orders: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label className="text-xs">Avg Rating (0–5)</Label>
          <Input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={form.avg_rating}
            onChange={(e) =>
              setForm({ ...form, avg_rating: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div>
        <Label className="text-xs">Top Urgency Banner Text</Label>
        <Textarea
          rows={2}
          value={form.urgency_text}
          onChange={(e) => setForm({ ...form, urgency_text: e.target.value })}
        />
      </div>
      <Button className="btn-cta" disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save
      </Button>
    </form>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "ok" | "warn" | "bad";
}) {
  const toneCls =
    tone === "ok"
      ? "text-primary"
      : tone === "warn"
        ? "text-warn-foreground"
        : tone === "bad"
          ? "text-destructive"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${toneCls}`}>{value}</div>
    </div>
  );
}

function SettingsDialog({
  token,
  settings,
  onSaved,
}: {
  token: string;
  settings: SiteSettings;
  onSaved: (s: SiteSettings) => void;
}) {
  const update = useServerFn(adminUpdateSettings);
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SettingsIcon className="mr-1.5 h-4 w-4" /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Site Settings</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              await update({
                data: {
                  token,
                  product_price: Number(form.product_price),
                  delivery_charge: Number(form.delivery_charge),
                  whatsapp_number: form.whatsapp_number,
                  call_number: form.call_number,
                  disclaimer_text: form.disclaimer_text,
                },
              });
              onSaved(form);
              toast.success("সেটিংস সেভ হয়েছে");
            } catch {
              toast.error("সেভ করা যায়নি");
            } finally {
              setSaving(false);
            }
          }}
          className="grid gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Product Price (৳)</Label>
              <Input
                type="number"
                value={form.product_price}
                onChange={(e) =>
                  setForm({ ...form, product_price: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className="text-xs">Delivery Charge (৳)</Label>
              <Input
                type="number"
                value={form.delivery_charge}
                onChange={(e) =>
                  setForm({ ...form, delivery_charge: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">WhatsApp Number (with country code)</Label>
            <Input
              value={form.whatsapp_number}
              onChange={(e) =>
                setForm({ ...form, whatsapp_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Call Number</Label>
            <Input
              value={form.call_number}
              onChange={(e) => setForm({ ...form, call_number: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Disclaimer</Label>
            <Textarea
              rows={4}
              value={form.disclaimer_text}
              onChange={(e) =>
                setForm({ ...form, disclaimer_text: e.target.value })
              }
            />
          </div>
          <Button className="btn-cta mt-2" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Settings
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog({ token, onChanged }: { token: string; onChanged: (t: string) => void }) {
  const change = useServerFn(adminChangePassword);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (current !== token) {
      toast.error("Current password ভুল");
      return;
    }
    if (next.length < 4) {
      toast.error("Password অন্তত ৪ অক্ষর দিন");
      return;
    }
    if (next !== confirm) {
      toast.error("Confirm password মিলছে না");
      return;
    }
    setLoading(true);
    try {
      const res = await change({ data: { token, newPassword: next } });
      onChanged(res.token);
      toast.success("Password পরিবর্তন হয়েছে");
      setOpen(false);
      setCurrent(""); setNext(""); setConfirm("");
    } catch {
      toast.error("Password পরিবর্তন করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Admin Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Current password</Label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">New password</Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">Confirm new password</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" />
          </div>
          <Button className="btn-cta w-full" onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CourierCell({
  order,
  token,
  onDone,
}: {
  order: Order;
  token: string;
  onDone: () => void | Promise<void>;
}) {
  const pushFn = useServerFn(adminPushToCourier);
  const [busy, setBusy] = useState(false);

  if (order.consignment_id) {
    const track = order.tracking_code
      ? `https://steadfast.com.bd/t/${order.tracking_code}`
      : null;
    return (
      <div className="text-xs">
        <div className="font-medium text-emerald-700">CID: {order.consignment_id}</div>
        {track ? (
          <a href={track} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Track: {order.tracking_code}
          </a>
        ) : null}
        {order.courier_status ? (
          <div className="text-muted-foreground capitalize">{order.courier_status}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const res = await pushFn({ data: { token, id: order.id } });
            toast.success(`Steadfast-এ পুশ হয়েছে (CID: ${res.consignment_id})`);
            await onDone();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Push failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Push to Steadfast"}
      </Button>
      {order.courier_error ? (
        <div className="max-w-[200px] truncate text-[11px] text-red-600" title={order.courier_error}>
          {order.courier_error}
        </div>
      ) : null}
    </div>
  );
}
