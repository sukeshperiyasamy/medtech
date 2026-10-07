"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Plus,
  ExternalLink,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Publication, PublicationType, PublicationStatus } from "@/lib/portal/types";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { FileUploadZone } from "@/components/portal/ui/FileUploadZone";
import { DuplicateWarningModal } from "@/components/portal/ui/DuplicateWarningModal";
import { generateDocumentFilename, formatDate } from "@/lib/portal/utils";

function PublicationsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");

  // Duplicate Warning state
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState<any>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [journalConference, setJournalConference] = useState("");
  const [publicationType, setPublicationType] = useState<PublicationType>("Journal Article");
  const [doi, setDoi] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [studentContribution, setStudentContribution] = useState("First Author");
  const [status, setStatus] = useState<PublicationStatus>("Published");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchPublications = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/publications?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPublications(json.data);
      }
    } catch (err) {
      console.error("Failed to load publications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) {
      fetchPublications(activeRollNumber);
    }
  }, [activeRollNumber]);

  // Handle URL action=add
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  // Autofill authors default with student name
  useEffect(() => {
    if (activeStudent && !authors) {
      setAuthors(`${activeStudent.name}, et al.`);
    }
  }, [activeStudent]);

  const resetForm = () => {
    setTitle("");
    setJournalConference("");
    setDoi("");
    setPublisher("");
    setPublicationDate("");
    setVolume("");
    setIssue("");
    setPages("");
    setUrl("");
    setSelectedFile(null);
    setAuthors(activeStudent ? `${activeStudent.name}, et al.` : "");
  };

  const handleFormSubmit = async (e: React.FormEvent, force: boolean = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeRollNumber) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("title", title);
    formData.append("authors", authors);
    formData.append("journal_conference", journalConference);
    formData.append("publication_type", publicationType);
    formData.append("doi", doi);
    formData.append("publisher", publisher);
    formData.append("publication_date", publicationDate);
    formData.append("volume", volume);
    formData.append("issue", issue);
    formData.append("pages", pages);
    formData.append("url", url);
    formData.append("student_contribution", studentContribution);
    formData.append("status", status);
    if (force) formData.append("force", "true");
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/publications", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.status === 409 && json.duplicate) {
        // Trigger Duplicate Warning Modal
        setDuplicateRecord(json.existingRecord);
        setPendingFormData(formData);
        setDuplicateModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (json.success) {
        setToastMessage("Publication successfully saved to Google Sheets and Drive!");
        await fetchPublications(activeRollNumber);
        setIsAddModalOpen(false);
        setDuplicateModalOpen(false);
        resetForm();
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to save publication.");
      }
    } catch (err: any) {
      alert("Error saving publication. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedDuplicate = () => {
    handleFormSubmit({} as any, true);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePublication = async (recordId: string) => {
    if (deletingId !== recordId) {
      setDeletingId(recordId);
      setTimeout(() => setDeletingId((curr) => (curr === recordId ? null : curr)), 4000);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch(`/api/publications?id=${encodeURIComponent(recordId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Publication removed successfully.");
        if (activeRollNumber) fetchPublications(activeRollNumber);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Failed to remove publication.");
      }
    } catch {
      alert("Error removing publication.");
    }
  };

  const filteredList = publications.filter((p) => {
    if (filterType === "All") return true;
    return p.publication_type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <StudentHeaderCard student={activeStudent} />

      {/* Toast Alert */}
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
              Scholarly Publications & Research
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              {publications.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer-reviewed journals, IEEE conferences, and academic book chapters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs outline-hidden"
          >
            <option value="All">All Types</option>
            <option value="Journal Article">Journal Articles</option>
            <option value="Conference Paper">Conference Papers</option>
            <option value="Book Chapter">Book Chapters</option>
            <option value="Review Article">Review Articles</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Publication</span>
          </button>
        </div>
      </div>

      {/* Publications Listing */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Publications Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No publication entries match your current selection for {activeStudent?.name || "this student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit First Publication</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((pub) => (
            <div
              key={pub.record_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {pub.record_id}
                    </span>
                    <Badge variant="info">{pub.publication_type}</Badge>
                    <StatusBadge status={pub.status} />
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {pub.student_contribution || "Lead Author"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {pub.title}
                  </h3>

                  <p className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800">Authors:</span> {pub.authors}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">
                      {pub.journal_conference}
                    </span>
                    {pub.publisher && <span>• {pub.publisher}</span>}
                    {pub.publication_date && (
                      <span>• {formatDate(pub.publication_date)}</span>
                    )}
                    {(pub.volume || pub.issue) && (
                      <span>
                        • Vol {pub.volume || "-"}, Issue {pub.issue || "-"}, pp {pub.pages || "-"}
                      </span>
                    )}
                  </div>

                  {pub.doi && (
                    <div className="pt-1">
                      <a
                        href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-mono inline-flex items-center gap-1"
                      >
                        <span>DOI: {pub.doi}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: Document & Drive Link */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {pub.document_url ? (
                    <a
                      href={pub.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>View PDF in Drive</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No PDF attached</span>
                  )}

                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
                    >
                      <span>Publisher Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeletePublication(pub.record_id)}
                    title={deletingId === pub.record_id ? "Click again to confirm removal" : "Remove publication"}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer mt-1 font-medium ${
                      deletingId === pub.record_id
                        ? "bg-rose-600 text-white shadow-xs animate-pulse"
                        : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === pub.record_id ? "Confirm Delete?" : "Remove"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Publication Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Scholarly Publication"
        subtitle={`Recording publication credentials for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="3xl"
      >
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Publication Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Non-Invasive Electrochemical MoS2 Biosensor for Salivary Glucose..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium text-slate-900"
            />
          </div>

          {/* Authors */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Authors List (in citation order) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="e.g. Sukesh Periyasamy, Jayant Singhal, Prof. Surajit Ghosh"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Journal / Conference */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Journal / Conference / Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={journalConference}
                onChange={(e) => setJournalConference(e.target.value)}
                placeholder="e.g. IEEE Transactions on Biomedical Engineering"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>

            {/* Publication Type */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Publication Type
              </label>
              <select
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value as PublicationType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
              >
                <option value="Journal Article">Journal Article</option>
                <option value="Conference Paper">Conference Paper</option>
                <option value="Book Chapter">Book Chapter</option>
                <option value="Review Article">Review Article</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* DOI */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                DOI Number (Uniqueness Check)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.1016/j.bios.2025.114521"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="IEEE, Elsevier, Springer, Nature"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>

            {/* Publication Date */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Volume</label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="72"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue</label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="4"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pages</label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="102-115"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student's Contribution
              </label>
              <select
                value={studentContribution}
                onChange={(e) => setStudentContribution(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="First Author">First Author</option>
                <option value="Co-Author">Co-Author</option>
                <option value="Corresponding Author">Corresponding Author</option>
                <option value="Equal Contributor">Equal Contributor</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PublicationStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Under Review">Under Review</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              External Article URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ieeexplore.ieee.org/document/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
            />
          </div>

          {/* PDF Upload Zone */}
          <div className="pt-2">
            <FileUploadZone
              label="Upload Publication Manuscript / Reprint (PDF)"
              helperText="Auto-named: ROLLNO_PUBLICATION_SHORTTITLE_YEAR.pdf (Max 15MB)"
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />

            {title && (
              <p className="text-[11px] text-slate-500 font-mono mt-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                Drive target name:{" "}
                <span className="text-blue-700 font-semibold">
                  {generateDocumentFilename(
                    activeRollNumber || "STUDENT",
                    "PUBLICATION",
                    title,
                    publicationDate ? publicationDate.slice(0, 4) : 2026,
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
              <span>{submitting ? "Saving & Syncing to Drive..." : "Submit Publication"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onProceedAnyway={handleProceedDuplicate}
        existingRecord={duplicateRecord}
        moduleName="Publications"
      />
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <PublicationsContent />
    </Suspense>
  );
}

