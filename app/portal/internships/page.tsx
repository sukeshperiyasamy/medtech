"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  Award,
  Layers,
  Trash2,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Internship, InternshipType, InternshipStatus } from "@/lib/portal/types";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { FileUploadZone } from "@/components/portal/ui/FileUploadZone";
import { DuplicateWarningModal } from "@/components/portal/ui/DuplicateWarningModal";
import { formatDate } from "@/lib/portal/utils";

function InternshipsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Duplicate Warning
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState<any>(null);

  // Form Fields
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [internshipType, setInternshipType] = useState<InternshipType>("Industrial");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<InternshipStatus>("Completed");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [offerFile, setOfferFile] = useState<File | null>(null);

  const fetchInternships = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/internships?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setInternships(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchInternships(activeRollNumber);
  }, [activeRollNumber]);

  useEffect(() => {
    if (searchParams.get("action") === "add") setIsAddModalOpen(true);
  }, [searchParams]);

  const resetForm = () => {
    setOrganization("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setTechnologies("");
    setSupervisor("");
    setLocation("");
    setCertFile(null);
    setOfferFile(null);
  };

  const handleFormSubmit = async (e: React.FormEvent, force: boolean = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeRollNumber) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("organization", organization);
    formData.append("role", role);
    formData.append("internship_type", internshipType);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("description", description);
    formData.append("technologies", technologies);
    formData.append("supervisor", supervisor);
    formData.append("location", location);
    formData.append("status", status);
    if (force) formData.append("force", "true");
    if (certFile) formData.append("certificate_file", certFile);
    if (offerFile) formData.append("offer_file", offerFile);

    try {
      const res = await fetch("/api/internships", { method: "POST", body: formData });
      const json = await res.json();

      if (res.status === 409 && json.duplicate) {
        setDuplicateRecord(json.existingRecord);
        setDuplicateModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (json.success) {
        setToastMessage("Internship record and documents synchronized with Google Drive!");
        await fetchInternships(activeRollNumber);
        setIsAddModalOpen(false);
        setDuplicateModalOpen(false);
        resetForm();
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to add internship.");
      }
    } catch {
      alert("Error adding internship.");
    } finally {
      setSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteInternship = async (recordId: string) => {
    if (deletingId !== recordId) {
      setDeletingId(recordId);
      setTimeout(() => setDeletingId((curr) => (curr === recordId ? null : curr)), 4000);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch(`/api/internships?id=${encodeURIComponent(recordId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Internship record removed successfully.");
        if (activeRollNumber) fetchInternships(activeRollNumber);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Failed to remove internship.");
      }
    } catch {
      alert("Error removing internship.");
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Internships & Clinical Immersion
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              {internships.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hospital immersion at AIIMS, clinical shadowing, and biomedical industry R&D internships.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Internship</span>
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : internships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Internships Logged</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No clinical immersion or industry internships logged for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Internship</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((item) => (
            <div
              key={item.record_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.record_id}
                    </span>
                    <Badge variant="info">{item.internship_type}</Badge>
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.organization}</h3>
                  <p className="text-xs font-semibold text-slate-700">Role: {item.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.supervisor && <span>• Supervisor: {item.supervisor}</span>}
                    {item.start_date && (
                      <span>
                        • {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : "Present"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Certificate & Offer letter links */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {item.certificate_url && (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certificate</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    </a>
                  )}

                  {item.offer_letter_url && (
                    <a
                      href={item.offer_letter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Offer Letter</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteInternship(item.record_id)}
                    title={deletingId === item.record_id ? "Click again to confirm removal" : "Remove internship"}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer mt-1 font-medium ${
                      deletingId === item.record_id
                        ? "bg-rose-600 text-white shadow-xs animate-pulse"
                        : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === item.record_id ? "Confirm Delete?" : "Remove"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Internship Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Internship / Clinical Immersion"
        subtitle={`Logging training record for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="3xl"
      >
        <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Organization / Hospital / Firm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Medtronic R&D / AIIMS Jodhpur NICU"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Internship Role / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Biomedical Systems Engineering Fellow"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Internship Type</label>
              <select
                value={internshipType}
                onChange={(e) => setInternshipType(e.target.value as InternshipType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Industrial">Industrial R&D</option>
                <option value="Clinical / Hospital">Clinical / Hospital Immersion</option>
                <option value="Academic Research">Academic Research Exchange</option>
                <option value="R&D">Other R&D</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Internship Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InternshipStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Key Clinical Findings</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical observation summary, biomedical instrument calibration, unmet needs identified..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Supervisor / Mentor</label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                placeholder="Dr. Rajeshwar Sharma"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad, Telangana"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Technologies / Medical Devices Evaluated</label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. Pulse Oximeters, Phototherapy Wraps, LabVIEW, MATLAB, ISO 13485"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
            />
          </div>

          {/* Dual Document Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <FileUploadZone
              label="1. Internship Certificate (PDF)"
              helperText="Named: ROLLNO_INTERNSHIP_COMPANY_YEAR_CERTIFICATE.pdf"
              selectedFile={certFile}
              onFileSelect={setCertFile}
            />

            <FileUploadZone
              label="2. Offer Letter / Immersion MoU (PDF)"
              helperText="Named: ROLLNO_INTERNSHIP_COMPANY_YEAR_OFFER.pdf"
              selectedFile={offerFile}
              onFileSelect={setOfferFile}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
            >
              <span>{submitting ? "Saving & Syncing to Drive..." : "Submit Internship"}</span>
            </button>
          </div>
        </form>
      </Modal>

      <DuplicateWarningModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onProceedAnyway={() => handleFormSubmit({} as any, true)}
        existingRecord={duplicateRecord}
        moduleName="Internships"
      />
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <InternshipsContent />
    </Suspense>
  );
}

