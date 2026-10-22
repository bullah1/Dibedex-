import { useEffect, useState } from "react";

const EVT = "checkout:submitting";
let current = false;

export function setCheckoutSubmitting(v: boolean) {
  current = v;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVT, { detail: v }));
  }
}

export function useCheckoutSubmitting() {
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    setSubmitting(current);
    const handler = (e: Event) => setSubmitting((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVT, handler);
    return () => window.removeEventListener(EVT, handler);
  }, []);
  return submitting;
}
