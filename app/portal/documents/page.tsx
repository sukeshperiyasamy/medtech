"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  FolderOpen,
  Calendar,
  HardDrive,
  CheckCircle2,
  Cloud,
  FileCheck,
  Download,
  Trash2,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { DocumentRecord, DocumentCategory } from "@/lib/portal/types";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { FileUploadZone } from "@/components/portal/ui/FileUploadZone";
import { formatFileSize, formatDate } from "@/lib/portal/utils";

function DocumentsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Modal State
  const [category, setCategory] = useState<DocumentCategory>("Publications");
  const [shortTitle, setShortTitle] = useState("");
  const [recordId, setRecordId] = useState("DOC-DIRECT");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDocuments = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setDocuments(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchDocuments(activeRollNumber);
  }, [activeRollNumber]);

  useEffect(() => {
    if (searchParams.get("action") === "upload") setIsUploadModalOpen(true);
  }, [searchParams]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRollNumber || !selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("category", category);
    formData.append("record_id", recordId);
    formData.append("short_title", shortTitle || selectedFile.name);
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Document synchronized to Google Drive and cataloged!");
        await fetchDocuments(activeRollNumber);
        setIsUploadModalOpen(false);
        setShortTitle("");
        setSelectedFile(null);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to upload document.");
      }
    } catch {
      alert("Error uploading document.");
    } finally {
      setUploading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteDocument = async (documentId: string) => {
    if (deletingId !== documentId) {
      setDeletingId(documentId);
      setTimeout(() => setDeletingId((curr) => (curr === documentId ? null : curr)), 4000);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch(`/api/documents?id=${encodeURIComponent(documentId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Document removed successfully.");
        if (activeRollNumber) fetchDocuments(activeRollNumber);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Failed to remove document.");
      }
    } catch {
      alert("Error removing document.");
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (doc.generated_filename || "").toLowerCase().includes(q) ||
      (doc.original_filename || "").toLowerCase().includes(q) ||
      (doc.category || "").toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const totalBytes = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  return (
    <div className="space-y-8">
      <StudentHeaderCard student={activeStudent} />

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Storage Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Synced Files</p>
            <p className="text-xl font-bold font-mono text-slate-900">{documents.length} Files</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Drive Storage Used</p>
            <p className="text-xl font-bold font-mono text-slate-900">{formatFileSize(totalBytes)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Drive Hierarchy</p>
            <p className="text-xs font-mono text-slate-700 truncate font-semibold">
              Students/{activeRollNumber || "ROLL"}/
            </p>
          </div>
        </div>
      </div>

      {/* Actions and Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filenames, records, or tags..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-blue-600 outline-hidden"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Publications">Publications</option>
            <option value="Patents">Patents</option>
            <option value="Projects">Projects</option>
            <option value="Internships">Internships</option>
            <option value="Achievements">Achievements</option>
            <option value="Conferences">Conferences</option>
            <option value="Startups">Startups</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Table */}
      {loading ? (
        <div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No uploaded files match the current query for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Standardized Filename</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Original Name</th>
                  <th className="py-3.5 px-4">Size & Type</th>
                  <th className="py-3.5 px-4">Upload Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredDocs.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-xs">{doc.generated_filename}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="info">{doc.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-[180px]">
                      {doc.original_filename}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatFileSize(doc.file_size)} • {doc.file_type ? doc.file_type.split("/").pop()?.toUpperCase() : "PDF"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(doc.uploaded_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.drive_url && doc.drive_url !== "#" ? (
                          <a
                            href={doc.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                          >
                            <span>Drive Synced</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Staged Locally
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteDocument(doc.document_id)}
                          title={deletingId === doc.document_id ? "Click again to confirm removal" : "Remove document"}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                            deletingId === doc.document_id
                              ? "bg-rose-600 text-white shadow-xs animate-pulse"
                              : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingId === doc.document_id ? "Confirm?" : ""}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Supporting Document"
        subtitle={`Synchronizing file into Google Drive vault for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Category / Folder</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            >
              <option value="Publications">Publications</option>
              <option value="Patents">Patents</option>
              <option value="Projects">Projects</option>
              <option value="Internships">Internships</option>
              <option value="Achievements">Achievements</option>
              <option value="Conferences">Conferences</option>
              <option value="Startups">Startups</option>
              <option value="Other">Other Institutional Docs</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Document Subject / Short Title</label>
            <input
              type="text"
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
              placeholder="e.g. SERS Sepsis Biomarkers Reprint"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Related Record ID (Optional)</label>
            <input
              type="text"
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="PUB-001 or PAT-002"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
            />
          </div>

          <div className="pt-2">
            <FileUploadZone
              label="Select Document File"
              helperText="Supported: PDF, DOC, DOCX, JPG, PNG (Max 15MB)"
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
            >
              <span>{uploading ? "Uploading to Drive..." : "Upload & Sync"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <DocumentsContent />
    </Suspense>
  );
}

