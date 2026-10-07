"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Calendar,
  Building,
  UserCheck,
  Edit,
  ExternalLink,
  Shield,
  FileCheck2,
} from "lucide-react";
import { Student } from "@/types";
import { StatusBadge } from "./ui/Badge";

interface StudentHeaderCardProps {
  student: Student | null;
  onEditProfile?: () => void;
}

export function StudentHeaderCard({ student, onEditProfile }: StudentHeaderCardProps) {
  if (!student) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No Student Identified</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Please select or search for your student record to load your existing profile and records automatically.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          Select Student Record
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Decorative top institutional banner */}
      <div className="h-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500" />

      <div className="p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Avatar & Identity */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              {student.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <StatusBadge status={student.status || "Active"} />
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {student.roll_number}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {student.degree}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.department}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            {onEditProfile ? (
              <button
                onClick={onEditProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Request Update</span>
              </button>
            ) : (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>View Full Profile</span>
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50/60 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <span>Switch Student</span>
            </Link>
          </div>
        </div>

        {/* Quick meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Institutional Email
            </span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{student.email}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Academic Batch
            </span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{student.batch} (Grad: {student.graduation_year})</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Specialization
            </span>
            <span className="font-medium text-slate-800 block mt-0.5 truncate">
              {student.specialization || "Medical Technology"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Faculty Supervisor(s)
            </span>
            <span className="font-medium text-slate-800 block mt-0.5 truncate">
              {student.supervisor || "Faculty Board (IDRP)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
