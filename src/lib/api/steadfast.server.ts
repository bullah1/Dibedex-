// Server-only Steadfast Courier API client
// Docs: https://docs.google.com/document/d/e/2PACX-1vRFsEsb3rzC1Ehm0-9r4Fj6iyahT-GLA2Bl4dc4rz9okz3ChKUgnFq3RIubHYuKGZbewpZ7dvSHJDzT/pub
const BASE_URL = "https://portal.packzy.com/api/v1";

export type SteadfastCreateInput = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string; // 11-digit BD number
  recipient_address: string;
  cod_amount: number;
  note?: string;
};

export type SteadfastCreateResponse = {
  status: number;
  message: string;
  consignment: {
    consignment_id: number;
    invoice: string;
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    status: string;
    note?: string | null;
    created_at: string;
    updated_at: string;
  };
};

function getKeys() {
  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;
  if (!apiKey || !secretKey) {
    throw new Error("Steadfast API credentials are not configured");
  }
  return { apiKey, secretKey };
}

export async function steadfastCreateOrder(
  input: SteadfastCreateInput,
): Promise<SteadfastCreateResponse> {
  const { apiKey, secretKey } = getKeys();
  const res = await fetch(`${BASE_URL}/create_order`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Secret-Key": secretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Steadfast: invalid response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok || json?.status >= 400) {
    const msg = json?.message || `HTTP ${res.status}`;
    throw new Error(`Steadfast: ${msg}`);
  }
  return json as SteadfastCreateResponse;
}

export async function steadfastStatusByConsignmentId(
  consignmentId: string | number,
): Promise<{ status: number; delivery_status: string }> {
  const { apiKey, secretKey } = getKeys();
  const res = await fetch(
    `${BASE_URL}/status_by_cid/${encodeURIComponent(String(consignmentId))}`,
    {
      headers: { "Api-Key": apiKey, "Secret-Key": secretKey },
    },
  );
  const json = (await res.json()) as any;
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

// Normalize BD phone → 11-digit local format (01XXXXXXXXX)
export function normalizeBdPhone(raw: string): string {
  const digits = (raw || "").replace(/\D+/g, "");
  if (digits.startsWith("880") && digits.length === 13) return "0" + digits.slice(3);
  if (digits.startsWith("88") && digits.length === 13) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith("1")) return "0" + digits;
  return digits;
}
