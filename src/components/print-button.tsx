"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button type="button" className="button-primary" onClick={() => window.print()}><Printer size={15} /> Print certificate</button>;
}
