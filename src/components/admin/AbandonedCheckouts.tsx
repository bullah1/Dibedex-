import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Phone, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminListAbandoned, adminUpdateAbandoned } from "@/lib/api/admin.functions";

type Row = {
  id: string;
  full_name: string | null;
  phone: string;
  address: string | null;
  package_name: string | null;
  quantity: number;
  total_amount: number | null;
  device: string | null;
  status: string;
  updated_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  abandoned: "নতুন",
  contacted: "যোগাযোগ করা হয়েছে",
  not_interested: "আগ্রহী নয়",
};

function waNumber(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("880")) return d;
  if (d.startsWith("0")) return "88" + d;
  return d;
}

export function AbandonedCheckouts({ token }: { token: string }) {
  const list = useServerFn(adminListAbandoned);
  const update = useServerFn(adminUpdateAbandoned);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await list({ data: { token } });
      setRows(r.rows as Row[]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: string, status: "abandoned" | "contacted" | "not_interested") => {
    await update({ data: { token, id, status } });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Abandoned Checkouts ({rows.length})</h2>
          <p className="text-sm text-muted-foreground">
            ফোন নম্বর দিয়েছে কিন্তু অর্ডার সম্পন্ন করেনি — কল বা WhatsApp করে অর্ডার নিন।
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>
      {!loading && rows.length === 0 && (
        <p className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          এখনো কোনো abandoned checkout নেই।
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => {
          const msg = encodeURIComponent(
            `আসসালামু আলাইকুম ${r.full_name ?? ""}, আপনি Dibedex (${r.package_name ?? ""}) অর্ডার করতে চেয়েছিলেন। অর্ডারটি কনফার্ম করে দেবো?`,
          );
          return (
            <div key={r.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{r.full_name || "(নাম নেই)"}</div>
                  <div className="font-mono text-sm">{r.phone}</div>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {STATUS_LABEL[r.status] ?? r.status}
                </span>
              </div>
              {r.address && <p className="mt-1 text-sm text-muted-foreground">{r.address}</p>}
              <p className="mt-2 text-sm">
                {r.package_name} × {r.quantity} · ৳{r.total_amount ?? "-"} · {r.device}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(r.updated_at).toLocaleString("en-GB")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`tel:${r.phone}`}><Phone className="mr-1 h-4 w-4" />Call</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`https://wa.me/${waNumber(r.phone)}?text=${msg}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-1 h-4 w-4" />WhatsApp
                  </a>
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setStatus(r.id, "contacted")}>Contacted</Button>
                <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "not_interested")}>Not interested</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
