import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "purple";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();

  if (s.includes("granted") || s.includes("published") || s.includes("completed") || s.includes("active") || s.includes("incubated")) {
    return <Badge variant="success">{status}</Badge>;
  }
  if (s.includes("accepted") || s.includes("ongoing") || s.includes("oral") || s.includes("award")) {
    return <Badge variant="info">{status}</Badge>;
  }
  if (s.includes("examination") || s.includes("review") || s.includes("filed") || s.includes("pre-incubatee")) {
    return <Badge variant="warning">{status}</Badge>;
  }
  if (s.includes("rejected") || s.includes("withdrawn") || s.includes("failed")) {
    return <Badge variant="danger">{status}</Badge>;
  }
  if (s.includes("draft") || s.includes("submitted") || s.includes("upcoming")) {
    return <Badge variant="purple">{status}</Badge>;
  }

  return <Badge variant="default">{status || "Recorded"}</Badge>;
}
