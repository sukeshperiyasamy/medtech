"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  Search,
  BookOpen,
  Lightbulb,
  Building2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function HomeBrochurePortalSection() {
  const router = useRouter();
  const [quickRoll, setQuickRoll] = useState("");

  const handleQuickGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRoll.trim()) {
      router.push(`/portal?roll=${encodeURIComponent(quickRoll.trim().toUpperCase())}`);
    } else {
      router.push("/portal");
    }
  };

  return (
    <section
      id="brochure-portal"
      aria-labelledby="brochure-portal-title"
      className="relative border-t border-line bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24"
    >
      <div className="container-x">
        {/* Banner badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="font-mono uppercase tracking-wider text-[11px]">Submission Channel</span>
            <span className="text-slate-400">|</span>
            <span>2026 Centre Brochure Data Form</span>
          </div>

          <Link
            href="/portal/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-ink transition-colors"
          >
            <ShieldCheck className="size-3.5 text-slate-400" />
            <span>Admin & Coordinator Desk</span>
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2
              id="brochure-portal-title"
              className="text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-ink leading-tight"
            >
              MedTech Student & Alumni <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Brochure Submission Form
              </span>
            </h2>

            <p className="mt-4 text-[1.05rem] text-muted max-w-xl leading-relaxed">
              We are compiling the official Centre for Medical Technologies 2026 Brochure.
              To preserve student privacy, submissions are handled through a dedicated form gateway.
              Enter your Roll Number below to load your personal submission form.
            </p>

            {/* Quick Roll lookup form */}
            <form onSubmit={handleQuickGo} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={quickRoll}
                  onChange={(e) => setQuickRoll(e.target.value)}
                  placeholder="Enter Roll Number (e.g. M24IM1007)..."
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-line text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue shrink-0 shadow-xs"
              >
                <span>Open My Form</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>Eligible cohorts:</span>
              <span className="px-2 py-0.5 rounded bg-white border border-line font-mono text-ink">M.Tech (2020–2026)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-line font-mono text-ink">Ph.D. (2020–2026)</span>
              <span className="px-2 py-0.5 rounded bg-white border border-line font-mono text-ink">Dual Degree (2020–2025)</span>
            </div>
          </div>

          {/* Quick cards */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/portal"
              className="group block p-5 rounded-lg border border-line bg-white hover:border-blue/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="size-5 text-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink group-hover:text-blue transition-colors">
                    Private & Confidential Submission
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-normal">
                    Select your Roll Number on the portal to access your private records and submit updates.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/portal"
              className="group block p-5 rounded-lg border border-line bg-white hover:border-emerald-500/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="size-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink group-hover:text-emerald-700 transition-colors">
                    Publications, Patents & Clinical Internships
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-normal">
                    Submit verified DOI, journal titles, patent application numbers, and AIIMS hospital attachments.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/portal/patents"
              className="group block p-5 rounded-lg border border-line bg-white hover:border-amber-500/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Lightbulb className="size-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink group-hover:text-amber-700 transition-colors">
                    Patents, Clinical Internships & Startups
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-normal">
                    Document hospital attachments at AIIMS, patent filings, and healthcare ventures incubated at IITJ.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
