"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Lightbulb,
  Briefcase,
  Building2,
  FileText,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  HardDrive,
  Database,
  ArrowRight,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Student, AuditLog } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { setActiveStudent } = useStudent();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPublications: 0,
    totalPatents: 0,
    totalProjects: 0,
    totalInternships: 0,
    totalDocuments: 0,
    isGoogleConfigured: false,
    recentLogs: [] as AuditLog[],
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"students" | "audit" | "export">("students");
  const [studentSearch, setStudentSearch] = useState("");

  // New Student Registration Modal
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [regRoll, setRegRoll] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDegree, setRegDegree] = useState("M.Tech – Medical Technology");
  const [regBatch, setRegBatch] = useState("2024");
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/students"),
      ]);

      const statsJson = await statsRes.json();
      const studentsJson = await studentsRes.json();

      if (statsJson.success) setStats(statsJson.data);
      if (studentsJson.success) setStudents(studentsJson.data);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStudent(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_number: regRoll,
          name: regName,
          email: regEmail,
          degree: regDegree,
          batch: regBatch,
          department: "Centre for Medical Technologies (IDRP)",
          graduation_year: String(Number(regBatch) + 2),
          status: "Active",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMsg(`Registered ${regName} (${regRoll}) successfully!`);
        setIsAddStudentOpen(false);
        setRegRoll("");
        setRegName("");
        setRegEmail("");
        await fetchAdminData();
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        alert(json.error || "Failed to register student.");
      }
    } catch {
      alert("Error registering student.");
    } finally {
      setSubmittingStudent(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.roll_number || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Institutional Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              MedTech Administrator Console
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Cross-cohort student tracking, live Google Sheets synchronization, Drive storage supervision, and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Google Service Account
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    stats.isGoogleConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <span className="font-semibold text-slate-200">
                  {stats.isGoogleConfigured ? "Connected (Sheets & Drive)" : "Local Development Store"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Publications", value: stats.totalPublications, icon: BookOpen, color: "text-emerald-600 bg-emerald-50" },
          { label: "Patents & IPR", value: stats.totalPatents, icon: Lightbulb, color: "text-amber-600 bg-amber-50" },
          { label: "Projects", value: stats.totalProjects, icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
          { label: "Internships", value: stats.totalInternships, icon: Building2, color: "text-teal-600 bg-teal-50" },
          { label: "Drive Docs", value: stats.totalDocuments, icon: FileText, color: "text-slate-700 bg-slate-100" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-1.5 rounded-lg ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
                {loading ? "..." : item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "students"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Student Roster ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "audit"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Audit Log Stream ({stats.recentLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "export"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Export & Backups
          </button>
        </div>

        <button
          onClick={fetchAdminData}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 pb-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* TAB 1: Student Roster */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name, roll, email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-hidden"
              />
            </div>

            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Program & Batch</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Switch Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStudents.map((s) => (
                    <tr key={s.roll_number} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                        {s.roll_number}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span>{s.degree}</span>
                        <span className="text-slate-400 block text-[11px]">Batch {s.batch}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {s.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="success">{s.status || "Active"}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveStudent(s);
                            setToastMsg(`Switched active context to ${s.name} (${s.roll_number})`);
                            setTimeout(() => setToastMsg(null), 3000);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors"
                        >
                          Select Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Audit Log Stream */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Live Institutional Compliance Log
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Recorded in Google Sheets tab: `Audit_Log`
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Audit Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                {stats.recentLogs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold truncate max-w-[120px]">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-bold">
                      {log.roll_number}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-sans text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {log.module}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={log.status === "SUCCESS" ? "success" : "danger"}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Export & Backups */}
      {activeTab === "export" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Complete Master Dataset (JSON)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Download the complete relational dataset encompassing all 10 modules (Students, Publications, Patents, Projects, Internships, Startups, and Drive Documents).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="/api/admin/export?format=json"
                download="medtech_master_data.json"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Full JSON Archive</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Directory (CSV)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Download formatted spreadsheet CSV of student demographics, roll numbers, degrees, batch, contact info, and faculty supervisors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="/api/admin/export?format=csv"
                download="medtech_students.csv"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Student CSV</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Register New Student in Master Sheet"
        subtitle="Registers student master profile in Google Sheets"
        maxWidth="lg"
      >
        <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Roll Number (Primary Unique Key) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={regRoll}
              onChange={(e) => setRegRoll(e.target.value.toUpperCase())}
              placeholder="e.g. M24IM1010"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono uppercase"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Student Name"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Institutional Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="student@iitj.ac.in"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Program / Degree</label>
              <select
                value={regDegree}
                onChange={(e) => setRegDegree(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="M.Tech – Medical Technology">M.Tech – Medical Technology</option>
                <option value="Ph.D. – Medical Technologies">Ph.D. – Medical Technologies</option>
                <option value="Ph.D. – Interdisciplinary">Ph.D. – Interdisciplinary</option>
                <option value="M.Tech-Ph.D. Dual Degree">M.Tech-Ph.D. Dual Degree</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Admitted Batch</label>
              <input
                type="text"
                value={regBatch}
                onChange={(e) => setRegBatch(e.target.value)}
                placeholder="2024"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingStudent}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
            >
              <span>{submittingStudent ? "Registering..." : "Register Student"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
