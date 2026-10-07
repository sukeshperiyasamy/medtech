"use client";

import React from "react";
import { Student } from "@/lib/portal/types";
import { calculateStudentCompleteness, renderAsciiProgressBar } from "@/lib/portal/completeness";
import { CheckCircle2, AlertTriangle, ArrowRight, UserCheck, ShieldAlert, Sparkles } from "lucide-react";

interface Props {
  student: Student;
  onEditProfile?: () => void;
}

export function ProfileCompletenessCard({ student, onEditProfile }: Props) {
  const completeness = student.completeness || calculateStudentCompleteness(student);
  const { overall, personal, academic, research, professional, missingMandatory } = completeness;

  // Determine status color
  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-700", bg: "bg-emerald-500", border: "border-emerald-200", lightBg: "bg-emerald-50" };
    if (score >= 60) return { text: "text-blue-700", bg: "bg-blue-600", border: "border-blue-200", lightBg: "bg-blue-50" };
    if (score >= 40) return { text: "text-amber-700", bg: "bg-amber-500", border: "border-amber-200", lightBg: "bg-amber-50" };
    return { text: "text-rose-700", bg: "bg-rose-500", border: "border-rose-200", lightBg: "bg-rose-50" };
  };

  const color = getScoreColor(overall);
  const asciiBar = renderAsciiProgressBar(overall, 16);

  const allMissing = [
    ...personal.missingFields.map((f) => ({ section: "Personal", field: f })),
    ...academic.missingFields.map((f) => ({ section: "Academic", field: f })),
    ...research.missingFields.map((f) => ({ section: "Research", field: f })),
    ...professional.missingFields.map((f) => ({ section: "Professional", field: f })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Profile Completeness
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${color.border} ${color.lightBg} ${color.text}`}>
              {overall}% Complete
            </span>
            {student.verification_status && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                student.verification_status === "Verified"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : student.verification_status === "Needs Correction"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                {student.verification_status}
              </span>
            )}
          </div>
          <div className="mt-2 font-mono text-xs font-semibold text-slate-700 select-all">
            {asciiBar}
          </div>
        </div>

        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors self-start lg:self-auto cursor-pointer shadow-xs"
          >
            <span>Update Missing Fields</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${color.bg}`}
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* Mandatory warning if any */}
      {missingMandatory.length > 0 && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Missing Mandatory Institutional Fields: </span>
            <span>{missingMandatory.join(", ")}. Please update these to complete official brochure inclusion.</span>
          </div>
        </div>
      )}

      {/* 4 Category Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Personal</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-bold text-slate-800">{personal.score}%</span>
            <span className="text-[10px] text-slate-500">{personal.completedFields}/{personal.totalFields}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${personal.score}%` }} />
          </div>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Academic</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-bold text-slate-800">{academic.score}%</span>
            <span className="text-[10px] text-slate-500">{academic.completedFields}/{academic.totalFields}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: `${academic.score}%` }} />
          </div>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Research</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-bold text-slate-800">{research.score}%</span>
            <span className="text-[10px] text-slate-500">{research.completedFields}/{research.totalFields}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-purple-600 h-full" style={{ width: `${research.score}%` }} />
          </div>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Professional</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-bold text-slate-800">{professional.score}%</span>
            <span className="text-[10px] text-slate-500">{professional.completedFields}/{professional.totalFields}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-amber-600 h-full" style={{ width: `${professional.score}%` }} />
          </div>
        </div>
      </div>

      {/* Missing items list */}
      {allMissing.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Missing Recommended Brochure Data ({allMissing.length} fields):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allMissing.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
              >
                <span className="text-slate-400 font-mono mr-1">[{item.section}]</span>
                {item.field}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All recommended profile fields are complete and ready for brochure print export!</span>
        </div>
      )}
    </div>
  );
}
