import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { adminFunnelReport } from "@/lib/api/admin.functions";

type Row = {
  label: string;
  view_checkout: number;
  begin_checkout: number;
  checkout_submit: number;
  view_to_begin_pct: number;
  begin_to_submit_pct: number;
  view_to_submit_pct: number;
  drop_view_to_begin_pct: number;
  drop_begin_to_submit_pct: number;
};

type Report = { overall: Row; byDate: Row[]; byDevice: Row[] };

export function FunnelReport({ token }: { token: string }) {
  const fetchReport = useServerFn(adminFunnelReport);
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchReport({ data: { token, days } });
      setReport(res as Report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days]);

  const StepCard = ({ title, value, pct, drop }: { title: string; value: number; pct?: number; drop?: number }) => (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</div>
      {pct !== undefined && (
        <div className="mt-1 text-xs text-muted-foreground">
          Conversion: <span className="font-medium text-foreground">{pct}%</span>
        </div>
      )}
      {drop !== undefined && drop > 0 && (
        <div className="mt-0.5 flex items-center gap-1 text-xs text-destructive">
          <TrendingDown className="h-3 w-3" /> {drop}% drop-off
        </div>
      )}
    </div>
  );

  const renderTable = (rows: Row[], firstColLabel: string) => (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{firstColLabel}</TableHead>
            <TableHead className="text-right">Viewed</TableHead>
            <TableHead className="text-right">Started</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
            <TableHead className="text-right">V→B %</TableHead>
            <TableHead className="text-right">B→S %</TableHead>
            <TableHead className="text-right">V→S %</TableHead>
            <TableHead className="text-right">Drop V→B</TableHead>
            <TableHead className="text-right">Drop B→S</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-sm text-muted-foreground">
                No events in this range yet.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="text-right">{r.view_checkout}</TableCell>
                <TableCell className="text-right">{r.begin_checkout}</TableCell>
                <TableCell className="text-right">{r.checkout_submit}</TableCell>
                <TableCell className="text-right">{r.view_to_begin_pct}%</TableCell>
                <TableCell className="text-right">{r.begin_to_submit_pct}%</TableCell>
                <TableCell className="text-right font-semibold">{r.view_to_submit_pct}%</TableCell>
                <TableCell className="text-right text-destructive">{r.drop_view_to_begin_pct}%</TableCell>
                <TableCell className="text-right text-destructive">{r.drop_begin_to_submit_pct}%</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Checkout Funnel</h2>
          <p className="text-sm text-muted-foreground">
            view_checkout → begin_checkout → checkout_submit (unique sessions)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24h</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

      {report && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StepCard title="Viewed Checkout" value={report.overall.view_checkout} />
            <StepCard
              title="Started Filling"
              value={report.overall.begin_checkout}
              pct={report.overall.view_to_begin_pct}
              drop={report.overall.drop_view_to_begin_pct}
            />
            <StepCard
              title="Submitted"
              value={report.overall.checkout_submit}
              pct={report.overall.begin_to_submit_pct}
              drop={report.overall.drop_begin_to_submit_pct}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">By Device</h3>
            {renderTable(report.byDevice, "Device")}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">By Date</h3>
            {renderTable(report.byDate, "Date")}
          </div>
        </>
      )}
    </div>
  );
}
