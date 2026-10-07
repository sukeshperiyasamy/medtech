"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  GraduationCap,
  ArrowRight,
  UserCheck,
  Building,
  Mail,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  Sparkles,
  Database,
  Cloud,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Student } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";

export default function StudentIdentificationPage() {
  const router = useRouter();
  const { setActiveStudent, activeRollNumber } = useStudent();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Initial load: fetch top students for quick preview
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetch("/api/students/search?q=");
        const json = await res.json();
        if (json.success && json.data) {
          setSearchResults(json.data);
        }
      } catch (err) {
        console.error("Failed to load initial students:", err);
      }
    }
    loadInitial();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        const res = await fetch("/api/students/search?q=");
        const json = await res.json();
        if (json.success && json.data) {
          setSearchResults(json.data);
        }
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/students/search?q=${encodeURIComponent(searchQuery)}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          setSearchResults(json.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setActiveStudent(student);
    router.push("/dashboard");
  };

  const quickSamples = [
    { roll: "M24IM1007", name: "Sukesh Periyasamy", program: "M.Tech" },
    { roll: "M24IM1005", name: "Ritika Jajoriya", program: "M.Tech" },
    { roll: "P21ID002", name: "Jayant Singhal", program: "Ph.D." },
    { roll: "P24IHC001", name: "Ananta Kapoor", program: "Ph.D." },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Single Source of Truth • Automated Google Sheets & Drive Sync</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          MedTech Student <br />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
            Data & Document Vault
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed font-normal">
          <strong>"Enter student information once. Reuse it everywhere."</strong> <br className="hidden sm:inline" />
          Search by Roll Number, Name, or Email to load existing institutional profile.
          Never re-enter data that already exists.
        </p>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-xs text-slate-400 font-medium">Quick Select Demo:</span>
          {quickSamples.map((sample) => (
            <button
              key={sample.roll}
              onClick={() => {
                setSearchQuery(sample.roll);
              }}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all shadow-2xs"
            >
              <span className="font-mono text-blue-600">{sample.roll}</span> • {sample.name} ({sample.program})
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Roll Number (e.g. M24IM1007), Name, or Email..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-medium shadow-sm transition-all outline-hidden"
            autoFocus
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          Primary Key: <span className="font-mono font-semibold text-slate-700">Roll Number</span> (unique identifier preventing duplicates)
        </p>
      </div>

      {/* Student Results Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Matching Student Profiles ({searchResults.length})
          </h2>
          <span className="text-xs text-slate-500">
            Select your profile to enter your personalized dashboard
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Student Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No existing student found matching "{searchQuery}". Check the roll number or register via the Admin portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((student) => {
              const isCurrent = activeRollNumber === student.roll_number;

              return (
                <div
                  key={student.roll_number}
                  onClick={() => handleSelectStudent(student)}
                  className={`group relative bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                    isCurrent
                      ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/20"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {student.name}
                          </h3>
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {student.roll_number}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={student.status || "Active"} />
                    </div>

                    <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">{student.degree}</p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{student.department}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-mono">{student.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Batch {student.batch}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Access Portal & Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature Showcase Grid */}
      <div className="max-w-5xl mx-auto pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Loaded from Master Sheets</h4>
            <p className="text-xs text-slate-500 mt-1">
              Personal, degree, batch, and supervisor information is retrieved directly. Never re-typed by students.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Cloud className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Google Drive Document Vault</h4>
            <p className="text-xs text-slate-500 mt-1">
              Publications, patents, and internship certificates are structured automatically into nested Drive folders.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Duplicate Prevention & Audit</h4>
            <p className="text-xs text-slate-500 mt-1">
              Built-in validation checks DOI, Application Numbers, and date ranges with full institutional audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
