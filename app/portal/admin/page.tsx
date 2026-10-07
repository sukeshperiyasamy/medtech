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
  Eye,
  GitPullRequest,
  Check,
  X,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Student, AuditLog, StudentSubmission } from "@/lib/portal/types";
import { Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { formatDate } from "@/lib/portal/utils";

export default function AdminDashboardPage() {
  const { setActiveStudent } = useStudent();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPublications: 0,
    totalPatents: 0,
    totalProjects: 0,
    totalInternships: 0,
    totalDocuments: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    isGoogleConfigured: false,
    recentLogs: [] as AuditLog[],
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"submissions" | "students" | "quality" | "audit" | "export">("submissions");
  const [studentSearch, setStudentSearch] = useState("");
  const [subFilter, setSubFilter] = useState<string>("ALL");

  // Diff Modal state
  const [selectedSubForDiff, setSelectedSubForDiff] = useState<StudentSubmission | null>(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      const [statsRes, studentsRes, subsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/students"),
        fetch("/api/admin/submissions"),
      ]);

      const statsJson = await statsRes.json();
      const studentsJson = await studentsRes.json();
      const subsJson = await subsRes.json();

      if (statsJson.success) setStats(statsJson.data);
      if (studentsJson.success) setStudents(studentsJson.data);
      if (subsJson.success) setSubmissions(subsJson.data);
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

  const handleSubmissionAction = async (id: string, action: string, extra?: { reason?: string; notes?: string }) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewer: "Admin Desk (Coordinator)", ...extra }),
      });
      const json = await res.json();
      if (json.success) {
        setToastMsg(json.message || `Action ${action} completed successfully.`);
        await fetchAdminData();
        setIsDiffModalOpen(false);
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        alert(json.error || `Failed to perform ${action}`);
      }
    } catch {
      alert("Server error processing administrative action.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDiff = (sub: StudentSubmission) => {
    setSelectedSubForDiff(sub);
    setIsDiffModalOpen(true);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (subFilter === "ALL") return true;
    if (subFilter === "PENDING") return s.status === "PENDING";
    return s.submission_type === subFilter;
  });

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
          { label: "Master Submissions", value: submissions.length, icon: GitPullRequest, color: "text-purple-600 bg-purple-50" },
          { label: "Pending Review", value: stats.pendingSubmissions || submissions.filter(s => s.status === "PENDING").length, icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
          { label: "Publications", value: stats.totalPublications, icon: BookOpen, color: "text-emerald-600 bg-emerald-50" },
          { label: "Patents & IPR", value: stats.totalPatents, icon: Lightbulb, color: "text-amber-600 bg-amber-50" },
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
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "submissions"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Master Submissions Queue</span>
            {submissions.filter((s) => s.status === "PENDING").length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {submissions.filter((s) => s.status === "PENDING").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "students"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Student Roster ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "quality"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Data Quality Audit
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === "audit"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Audit Log Stream ({stats.recentLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
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
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 pb-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* TAB 0: Master Submissions Queue */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["ALL", "PENDING", "NEW", "UPDATE", "NEEDS_REVIEW", "DUPLICATE"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSubFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    subFilter === filter
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-mono self-start sm:self-auto">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <GitPullRequest className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No Submissions in Queue</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Google Form responses or batch synchronization records will automatically populate here. Responses are validated against master roll numbers and categorized as NEW, UPDATE, NEEDS REVIEW, or DUPLICATE.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredSubmissions.map((sub) => {
                const isPending = sub.status === "PENDING";
                return (
                  <div
                    key={sub.submission_id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {sub.submission_id}
                          </span>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {sub.roll_number}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              sub.submission_type === "NEW"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : sub.submission_type === "UPDATE"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : sub.submission_type === "NEEDS_REVIEW"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {sub.submission_type}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              sub.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : sub.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800"
                                : sub.status === "CORRECTION_REQUESTED"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800 animate-pulse"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {sub.raw_payload.name || "Scholar Submission"}
                        </h3>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span>
                            <strong className="text-slate-800">Email:</strong> {sub.raw_payload.email || "N/A"}
                          </span>
                          <span>
                            <strong className="text-slate-800">Degree:</strong> {sub.raw_payload.degree || "N/A"}
                          </span>
                          <span>
                            <strong className="text-slate-800">Submitted:</strong> {formatDate(sub.submitted_at)}
                          </span>
                        </div>

                        {/* Diff summary */}
                        {sub.diff_fields.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                            <span className="font-semibold text-slate-700">Modified Master Fields ({sub.diff_fields.length}): </span>
                            <span className="font-mono text-blue-700">{sub.diff_fields.join(", ")}</span>
                          </div>
                        )}

                        {/* Mandatory warning */}
                        {sub.missing_mandatory.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                            <span>
                              <strong>Missing Mandatory Fields:</strong> {sub.missing_mandatory.join(", ")}
                            </span>
                          </div>
                        )}

                        {sub.review_notes && (
                          <div className="text-xs text-slate-600 italic">
                            Review Notes: {sub.review_notes} (by {sub.reviewed_by})
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <button
                          onClick={() => handleOpenDiff(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Changes</span>
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => handleSubmissionAction(sub.submission_id, "APPROVE")}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => {
                                const notes = prompt("Enter correction instructions for student:");
                                if (notes) handleSubmissionAction(sub.submission_id, "REQUEST_CORRECTION", { notes });
                              }}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Request Correction</span>
                            </button>

                            <button
                              onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) handleSubmissionAction(sub.submission_id, "REJECT", { reason });
                              }}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            {sub.submission_type === "DUPLICATE" && (
                              <button
                                onClick={() => handleSubmissionAction(sub.submission_id, "MERGE_DUPLICATE")}
                                disabled={actionLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
                              >
                                <GitPullRequest className="w-3.5 h-3.5" />
                                <span>Merge Duplicate</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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

      {/* TAB 2: Data Quality Audit */}
      {activeTab === "quality" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Data Quality & Completeness Audit (106 Scholars)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional assessment comparing brochure master Excel sheets with database records. Identifies gaps requiring master form collection.
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold self-start sm:self-auto">
                Audit Status: Active
              </span>
            </div>

            {/* Quality KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Scholars
                </span>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">106</p>
                <span className="text-[11px] text-emerald-600 font-medium">100% Unique Roll Nos</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Missing Date of Birth
                </span>
                <p className="text-2xl font-bold font-mono text-amber-900 mt-1">95</p>
                <span className="text-[11px] text-amber-700 font-medium">89.6% incomplete</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Missing Mobile Phone
                </span>
                <p className="text-2xl font-bold font-mono text-amber-900 mt-1">95</p>
                <span className="text-[11px] text-amber-700 font-medium">89.6% incomplete</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Unassigned Supervisor
                </span>
                <p className="text-2xl font-bold font-mono text-rose-900 mt-1">87</p>
                <span className="text-[11px] text-rose-700 font-medium">82.1% unallocated</span>
              </div>
            </div>

            {/* Module Coverage Matrix */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Module Activity & Record Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Publications Logged</span>
                  <strong className="text-sm text-slate-900">7 Scholars (99 None)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Patents / IPR Logged</span>
                  <strong className="text-sm text-slate-900">10 Scholars (96 None)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Projects Logged</span>
                  <strong className="text-sm text-slate-900">3 Scholars (103 None)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Internships Logged</span>
                  <strong className="text-sm text-slate-900">3 Scholars (103 None)</strong>
                </div>
              </div>
            </div>

            {/* Master Google Form Recommendation Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Next Operational Step: Master Google Form Distribution</span>
                  <p className="text-blue-800 leading-relaxed">
                    To populate the 95 missing contact & DOB profiles and unallocated supervisors without manual re-entry, distribute the standardized Google Form to all 106 scholars. Responses flow into the Submissions Queue above, where diffs can be verified and approved in one click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Log Stream */}
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

      {/* Submission Diff & Inspection Modal */}
      {selectedSubForDiff && (
        <Modal
          isOpen={isDiffModalOpen}
          onClose={() => setIsDiffModalOpen(false)}
          title={`Review Submission: ${selectedSubForDiff.submission_id}`}
          subtitle={`Roll Number: ${selectedSubForDiff.roll_number} • Type: ${selectedSubForDiff.submission_type} • Status: ${selectedSubForDiff.status}`}
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Meta summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Classification:</span>
                <span className="px-2 py-0.5 rounded font-bold font-mono bg-blue-100 text-blue-800">
                  {selectedSubForDiff.submission_type}
                </span>
                <span className="font-semibold text-slate-700 ml-2">Timestamp:</span>
                <span className="text-slate-600 font-mono">
                  {formatDate(selectedSubForDiff.submitted_at)}
                </span>
              </div>
              <span className="text-slate-500 font-medium">
                {selectedSubForDiff.diff_fields.length} field(s) changed
              </span>
            </div>

            {/* Missing mandatory alert */}
            {selectedSubForDiff.missing_mandatory.length > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Missing Mandatory Google Form Fields:</strong>
                  <p className="text-[11px] mt-0.5">
                    {selectedSubForDiff.missing_mandatory.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Field Diff Table */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                Side-by-Side Field Changes
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-1/4">Field</th>
                      <th className="py-2.5 px-3 w-3/8 text-slate-700">Current Master Record</th>
                      <th className="py-2.5 px-3 w-3/8 text-blue-700">Incoming Form Submission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.keys(selectedSubForDiff.raw_payload).map((fieldKey) => {
                      const incomingVal = String(
                        (selectedSubForDiff.raw_payload as Record<string, unknown>)[fieldKey] ?? ""
                      );
                      const currentVal = String(
                        selectedSubForDiff.existing_record
                          ? (selectedSubForDiff.existing_record as Record<string, unknown>)[fieldKey] ?? ""
                          : ""
                      );
                      const isChanged = selectedSubForDiff.diff_fields.includes(fieldKey);

                      return (
                        <tr
                          key={fieldKey}
                          className={isChanged ? "bg-amber-50/60 font-medium" : "hover:bg-slate-50"}
                        >
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-800">
                            {fieldKey}
                            {isChanged && (
                              <span className="ml-1 text-[10px] px-1 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                                DIFF
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 font-mono text-[11px] break-all">
                            {currentVal || <span className="text-slate-400 italic">Empty</span>}
                          </td>
                          <td className="py-2 px-3 text-blue-900 font-mono text-[11px] break-all">
                            {incomingVal || <span className="text-slate-400 italic">Empty</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Administrative Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDiffModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Close View
              </button>

              <div className="flex items-center gap-2">
                {selectedSubForDiff.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason)
                          handleSubmissionAction(selectedSubForDiff.submission_id, "REJECT", {
                            reason,
                          });
                      }}
                      className="px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-semibold transition-colors"
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        const notes = prompt("Enter correction guidance for student:");
                        if (notes)
                          handleSubmissionAction(
                            selectedSubForDiff.submission_id,
                            "REQUEST_CORRECTION",
                            { notes }
                          );
                      }}
                      className="px-3.5 py-2 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl font-semibold transition-colors"
                    >
                      Request Correction
                    </button>

                    {selectedSubForDiff.submission_type === "DUPLICATE" ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleSubmissionAction(selectedSubForDiff.submission_id, "MERGE_DUPLICATE")
                        }
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-xs"
                      >
                        Merge Duplicate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleSubmissionAction(selectedSubForDiff.submission_id, "APPROVE")
                        }
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-xs"
                      >
                        Approve & Patch Master
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

