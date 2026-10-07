"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lightbulb,
  Plus,
  ExternalLink,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Calendar,
  Building,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Patent, PatentType, PatentStatus } from "@/lib/portal/types";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { FileUploadZone } from "@/components/portal/ui/FileUploadZone";
import { DuplicateWarningModal } from "@/components/portal/ui/DuplicateWarningModal";
import { generateDocumentFilename, formatDate } from "@/lib/portal/utils";

function PatentsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Duplicate Warning
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState<any>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [inventors, setInventors] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [patentNo, setPatentNo] = useState("");
  const [filingDate, setFilingDate] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [patentType, setPatentType] = useState<PatentType>("Indian Patent");
  const [patentOffice, setPatentOffice] = useState("Indian Patent Office (IPO)");
  const [status, setStatus] = useState<PatentStatus>("Filed");
  const [applicantOrg, setApplicantOrg] = useState(
    "Indian Institute of Technology Jodhpur & AIIMS Jodhpur"
  );
  const [patentUrl, setPatentUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchPatents = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/patents?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPatents(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch patents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) {
      fetchPatents(activeRollNumber);
    }
  }, [activeRollNumber]);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeStudent && !inventors) {
      setInventors(`${activeStudent.name}, Prof. Surajit Ghosh`);
    }
  }, [activeStudent]);

  const resetForm = () => {
    setTitle("");
    setApplicationNo("");
    setPatentNo("");
    setFilingDate("");
    setPublicationDate("");
    setPatentUrl("");
    setSelectedFile(null);
    setInventors(activeStudent ? `${activeStudent.name}, Prof. Surajit Ghosh` : "");
  };

  const handleFormSubmit = async (e: React.FormEvent, force: boolean = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeRollNumber) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("title", title);
    formData.append("inventors", inventors);
    formData.append("application_no", applicationNo);
    formData.append("patent_no", patentNo);
    formData.append("filing_date", filingDate);
    formData.append("publication_date", publicationDate);
    formData.append("patent_type", patentType);
    formData.append("patent_office", patentOffice);
    formData.append("status", status);
    formData.append("applicant_organization", applicantOrg);
    formData.append("patent_url", patentUrl);
    if (force) formData.append("force", "true");
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/patents", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.status === 409 && json.duplicate) {
        setDuplicateRecord(json.existingRecord);
        setDuplicateModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (json.success) {
        setToastMessage("Patent record and document saved to Google Sheets and Drive!");
        await fetchPatents(activeRollNumber);
        setIsAddModalOpen(false);
        setDuplicateModalOpen(false);
        resetForm();
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to save patent.");
      }
    } catch (err) {
      alert("Error saving patent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePatent = async (recordId: string) => {
    if (deletingId !== recordId) {
      setDeletingId(recordId);
      setTimeout(() => setDeletingId((curr) => (curr === recordId ? null : curr)), 4000);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch(`/api/patents?id=${encodeURIComponent(recordId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Patent record removed successfully.");
        if (activeRollNumber) fetchPatents(activeRollNumber);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Failed to remove patent.");
      }
    } catch {
      alert("Error removing patent.");
    }
  };

  return (
    <div className="space-y-8">
      <StudentHeaderCard student={activeStudent} />

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Intellectual Property & Patents
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              {patents.length} Filings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Indian Patent Office (IPO) and International PCT filings from MedTech translations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patent Record</span>
        </button>
      </div>

      {/* Listing */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : patents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Patents Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No patent records are currently assigned to {activeStudent?.name || "this student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patent Filing</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {patents.map((pat) => (
            <div
              key={pat.record_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {pat.record_id}
                    </span>
                    <Badge variant="purple">{pat.patent_type}</Badge>
                    <StatusBadge status={pat.status} />
                    {pat.patent_no && (
                      <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Patent No: {pat.patent_no}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {pat.title}
                  </h3>

                  <p className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800">Inventors:</span> {pat.inventors}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                    <span className="font-mono font-medium text-slate-700">
                      App No: {pat.application_no || "Under Filing"}
                    </span>
                    {pat.filing_date && (
                      <span>• Filed: {formatDate(pat.filing_date)}</span>
                    )}
                    {pat.patent_office && <span>• {pat.patent_office}</span>}
                    {pat.applicant_organization && (
                      <span>• {pat.applicant_organization}</span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {pat.document_url ? (
                    <a
                      href={pat.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>View Filing in Drive</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No document</span>
                  )}

                  {pat.patent_url && (
                    <a
                      href={pat.patent_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
                    >
                      <span>IPO Public Search</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeletePatent(pat.record_id)}
                    title={deletingId === pat.record_id ? "Click again to confirm removal" : "Remove patent"}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer mt-1 font-medium ${
                      deletingId === pat.record_id
                        ? "bg-rose-600 text-white shadow-xs animate-pulse"
                        : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === pat.record_id ? "Confirm Delete?" : "Remove"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Patent Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Intellectual Property (Patent)"
        subtitle={`Registering patent filing for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="3xl"
      >
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Patent Title of Invention <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A Microfluidic Electrochemical Sensor for Continuous Vascular Hemodynamics"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Inventors (Comma-separated) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={inventors}
              onChange={(e) => setInventors(e.target.value)}
              placeholder="e.g. Sukesh Periyasamy, Jayant Singhal, Prof. Surajit Ghosh, Dr. Amitesh Kumar"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Application Number (Unique Identifier)
              </label>
              <input
                type="text"
                value={applicationNo}
                onChange={(e) => setApplicationNo(e.target.value)}
                placeholder="202511041154 or 202611002341"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Patent Number (If Granted)
              </label>
              <input
                type="text"
                value={patentNo}
                onChange={(e) => setPatentNo(e.target.value)}
                placeholder="IN-554321"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Filing Date
              </label>
              <input
                type="date"
                value={filingDate}
                onChange={(e) => setFilingDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Publication / Grant Date
              </label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Patent Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PatentStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Filed">Filed</option>
                <option value="Under Examination">Under Examination (FER)</option>
                <option value="Published">Published</option>
                <option value="Granted">Granted</option>
                <option value="Draft">Draft</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Patent Type
              </label>
              <select
                value={patentType}
                onChange={(e) => setPatentType(e.target.value as PatentType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Indian Patent">Indian Patent</option>
                <option value="PCT">PCT (International)</option>
                <option value="Design Patent">Design Patent</option>
                <option value="US Patent">US Patent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Patent Office
              </label>
              <input
                type="text"
                value={patentOffice}
                onChange={(e) => setPatentOffice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Applicant Organization
            </label>
            <input
              type="text"
              value={applicantOrg}
              onChange={(e) => setApplicantOrg(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          {/* Document Upload */}
          <div className="pt-2">
            <FileUploadZone
              label="Upload Patent Specification / Grant Document (PDF)"
              helperText="Auto-named: ROLLNO_PATENT_SHORTTITLE_YEAR.pdf"
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />

            {title && (
              <p className="text-[11px] text-slate-500 font-mono mt-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                Drive target name:{" "}
                <span className="text-blue-700 font-semibold">
                  {generateDocumentFilename(
                    activeRollNumber || "STUDENT",
                    "PATENT",
                    title,
                    filingDate ? filingDate.slice(0, 4) : 2026,
                    selectedFile?.name
                  )}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <span>{submitting ? "Saving & Syncing to Drive..." : "Submit Patent"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Duplicate Warning */}
      <DuplicateWarningModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onProceedAnyway={() => handleFormSubmit({} as any, true)}
        existingRecord={duplicateRecord}
        moduleName="Patents"
      />
    </div>
  );
}

export default function PatentsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <PatentsContent />
    </Suspense>
  );
}

