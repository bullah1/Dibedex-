import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw, Copy } from "lucide-react";
import { runDnsAudit, type DnsAuditResult, type DnsCheck } from "@/lib/dns-audit.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/dns-audit")({
  head: () => ({
    meta: [
      { title: "DNS Record Audit — Dibedex" },
      { name: "description", content: "Verify A and TXT DNS records before connecting your custom domain to Lovable." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DnsAuditPage,
});

function statusMeta(status: DnsCheck["status"] | DnsAuditResult["overall"]) {
  if (status === "pass") return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", label: "Pass" };
  if (status === "warn") return { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", label: "Warning" };
  return { icon: XCircle, color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", label: "Fail" };
}

function DnsAuditPage() {
  const auditFn = useServerFn(runDnsAudit);
  const [domain, setDomain] = useState("dibedex.com");

  const mutation = useMutation({
    mutationFn: (d: string) => auditFn({ data: { domain: d } }),
    onError: (e: Error) => toast.error(e.message || "Audit failed"),
  });

  const result = mutation.data;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">DNS Record Audit</h1>
          <p className="text-slate-600 mt-2 text-sm">
            Custom domain connect করার আগে A record (root + www) এবং <code>_lovable</code> TXT verification value check করে নিন।
          </p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(domain);
              }}
              className="flex gap-2"
            >
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="flex-1"
              />
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Checking…</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" />Run Audit</>
                )}
              </Button>
            </form>
            <p className="text-xs text-slate-500 mt-3">
              Query source: Cloudflare DNS-over-HTTPS (1.1.1.1). Propagation-এ ৭২ ঘণ্টা লাগতে পারে।
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expected values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ExpectedRow type="A" name="@" value="185.158.133.1" onCopy={copy} />
            <ExpectedRow type="A" name="www" value="185.158.133.1" onCopy={copy} />
            <ExpectedRow type="TXT" name="_lovable" value="lovable_verify=… (Lovable dashboard থেকে exact value)" onCopy={copy} />
          </CardContent>
        </Card>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}

function ExpectedRow({ type, name, value, onCopy }: { type: string; name: string; value: string; onCopy: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 border rounded-md px-3 py-2 bg-white">
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant="outline" className="shrink-0">{type}</Badge>
        <code className="text-slate-500 shrink-0">{name}</code>
        <span className="text-slate-400">→</span>
        <code className="truncate">{value}</code>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onCopy(value)}>
        <Copy className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function ResultCard({ result }: { result: DnsAuditResult }) {
  const meta = statusMeta(result.overall);
  const Icon = meta.icon;
  return (
    <Card className={`ring-2 ${meta.ring}`}>
      <CardHeader className={meta.bg}>
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${meta.color}`} />
          <div>
            <CardTitle className="text-lg">
              {result.overall === "pass" ? "সব record ঠিক আছে — connect করা যাবে" : result.overall === "warn" ? "Connect করা যাবে, তবে সতর্কতা রয়েছে" : "Records এখনো ঠিক নেই"}
            </CardTitle>
            <p className="text-xs text-slate-600 mt-0.5">
              {result.domain} • checked {new Date(result.checkedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {result.checks.map((c) => (
          <CheckRow key={c.host + c.type} check={c} />
        ))}
      </CardContent>
    </Card>
  );
}

function CheckRow({ check }: { check: DnsCheck }) {
  const meta = statusMeta(check.status);
  const Icon = meta.icon;
  return (
    <div className={`border rounded-lg p-4 ${meta.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900">{check.label}</span>
            <Badge variant="outline">{check.type}</Badge>
            <code className="text-xs text-slate-600">{check.host}</code>
          </div>
          <p className="text-sm text-slate-700 mt-1.5">{check.message}</p>
          {check.found.length > 0 && (
            <div className="mt-2 text-xs">
              <span className="text-slate-500">Found: </span>
              <code className="text-slate-800 break-all">{check.found.join(", ")}</code>
            </div>
          )}
          <div className="mt-1 text-xs">
            <span className="text-slate-500">Expected: </span>
            <code className="text-slate-800">{check.expected}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
