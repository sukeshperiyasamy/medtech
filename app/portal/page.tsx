"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  UserCheck,
  Building,
  Mail,
  CheckCircle2,
  Shield,
  Sparkles,
  Lock,
  Search,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Student } from "@/lib/portal/types";
import { StatusBadge } from "@/components/portal/ui/Badge";

function PortalFormGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setActiveStudent, activeRollNumber } = useStudent();

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedRoll, setSelectedRoll] = useState<string>("");
  const [manualInput, setManualInput] = useState<string>("");
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load student directory for dropdown selection
  useEffect(() => {
    async function loadDirectory() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/students/search?q=");
        const json = await res.json();
        if (json.success && json.data) {
          setAllStudents(json.data);
          
          // Check if roll number was provided in URL params or active context
          const urlRoll = searchParams.get("roll") || searchParams.get("search");
          const targetRoll = (urlRoll || activeRollNumber || "").trim().toUpperCase();
          if (targetRoll) {
            const found = json.data.find(
              (s: Student) => s.roll_number.trim().toUpperCase() === targetRoll
            );
            if (found) {
              setSelectedRoll(found.roll_number);
              setVerifiedStudent(found);
              setSelectedBatch(found.batch);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load student directory:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDirectory();
  }, [searchParams, activeRollNumber]);

  const batches = ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020"];

  // Filter available roll numbers based on selected batch
  const availableRolls = useMemo(() => {
    return allStudents
      .filter((s) => selectedBatch === "All" || s.batch === selectedBatch)
      .map((s) => s.roll_number)
      .sort();
  }, [allStudents, selectedBatch]);

  // When a student picks from dropdown
  const handleDropdownSelect = (roll: string) => {
    setNotFoundError(null);
    setSelectedRoll(roll);
    if (!roll) {
      setVerifiedStudent(null);
      return;
    }
    const match = allStudents.find(
      (s) => s.roll_number.trim().toUpperCase() === roll.trim().toUpperCase()
    );
    if (match) {
      setVerifiedStudent(match);
      setManualInput(match.roll_number);
    }
  };

  // When user types roll number and clicks verify
  const handleVerifyManual = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setNotFoundError(null);
    const clean = manualInput.trim().toUpperCase();
    if (!clean) {
      setNotFoundError("Please enter your roll number.");
      return;
    }

    const match = allStudents.find(
      (s) => s.roll_number.trim().toUpperCase() === clean
    );

    if (match) {
      setSelectedRoll(match.roll_number);
      setVerifiedStudent(match);
      setSelectedBatch(match.batch);
    } else {
      setVerifiedStudent(null);
      setNotFoundError(
        `Roll Number "${clean}" was not found in the official register. Please check the spelling (e.g. M24IM1007, P21ID002) or select from the dropdown.`
      );
    }
  };

  const handleProceed = () => {
    if (verifiedStudent) {
      setActiveStudent(verifiedStudent);
      router.push("/portal/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden transition-all">
        {/* Top institutional strip */}
        <div className="h-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500" />

        <div className="p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Official 2026 Brochure Data Collection • Private Form</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student & Alumni Brochure Submission Form
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              This form collects verified publications, patents, clinical attachments, and startup data for the upcoming Centre Brochure.
              To maintain student privacy, records are not publicly listed. Select your Roll Number below to load your private form.
            </p>
          </div>

          {/* Form Step: Select / Enter Roll Number */}
          <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="flex items-center justify-center size-5 rounded-full bg-blue-600 text-white text-[11px] font-bold">1</span>
                <span>Select or Enter Your Roll Number</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Batch Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Filter by Cohort / Batch:
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSelectedRoll("");
                    setVerifiedStudent(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      {b === "All" ? "All Batches (2020 – 2026)" : `Batch ${b}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll Number Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Roll Number:
                </label>
                <select
                  value={selectedRoll}
                  onChange={(e) => handleDropdownSelect(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all disabled:opacity-60"
                >
                  <option value="">-- Choose Roll Number --</option>
                  {availableRolls.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick manual entry option */}
            <div className="pt-2 border-t border-slate-200/60">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Or type your Roll Number directly:
              </label>
              <form onSubmit={handleVerifyManual} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g. M24IM1007 or P21ID002"
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden uppercase transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  Verify
                </button>
              </form>

              {notFoundError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{notFoundError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Confirmation Box (ONLY visible when a student is selected) */}
          {verifiedStudent ? (
            <div className="p-6 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-teal-50/50 rounded-2xl border-2 border-blue-400/80 shadow-md space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Identity Confirmed • Ready to Submit</span>
                </span>
                <span className="text-xs text-blue-700 font-semibold font-mono">
                  {verifiedStudent.roll_number}
                </span>
              </div>

              {/* Student details card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xs p-5 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {verifiedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {verifiedStudent.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
                      {verifiedStudent.degree}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Batch {verifiedStudent.batch} • {verifiedStudent.department}
                    </p>
                  </div>
                </div>

                <StatusBadge status={verifiedStudent.status || "Active"} />
              </div>

              {/* Submission button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 group transition-all"
                >
                  <span>Proceed to My Submission Form & Dashboard</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerifiedStudent(null);
                    setSelectedRoll("");
                    setManualInput("");
                  }}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                >
                  Select Different Roll No
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
              <Shield className="size-6 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600">Confidential Submission System</p>
              <p>Your details and submission records will appear here once you select or verify your Roll Number.</p>
            </div>
          )}

          {/* Institutional Help / FAQ info */}
          <div className="pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="size-4 text-slate-400" />
              <span>Need help or your roll number is not listed?</span>
            </span>
            <a
              href="mailto:office_medtechcentre@iitj.ac.in?subject=Brochure%20Portal%20Query"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact MedTech Centre Office →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentIdentificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="size-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PortalFormGatewayContent />
    </Suspense>
  );
}
