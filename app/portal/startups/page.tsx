"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Rocket,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Building,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Trash2,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { Startup, StartupStatus } from "@/lib/portal/types";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Modal } from "@/components/portal/ui/Modal";
import { FileUploadZone } from "@/components/portal/ui/FileUploadZone";

function StartupsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form
  const [startupName, setStartupName] = useState("");
  const [founderRole, setFounderRole] = useState("Student Co-Founder");
  const [cofounders, setCofounders] = useState("");
  const [domain, setDomain] = useState("Point-of-Care Diagnostics / Medical Devices");
  const [description, setDescription] = useState("");
  const [foundedYear, setFoundedYear] = useState(new Date().getFullYear().toString());
  const [website, setWebsite] = useState("");
  const [currentStatus, setCurrentStatus] = useState<StartupStatus>("Pre-Incubatee");
  const [incubator, setIncubator] = useState("IIT Jodhpur TISC / AIIMS Jodhpur");
  const [funding, setFunding] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchStartups = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/startups?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setStartups(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchStartups(activeRollNumber);
  }, [activeRollNumber]);

  useEffect(() => {
    if (searchParams.get("action") === "add") setIsAddModalOpen(true);
  }, [searchParams]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRollNumber) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("startup_name", startupName);
    formData.append("founder_role", founderRole);
    formData.append("cofounders", cofounders);
    formData.append("domain", domain);
    formData.append("description", description);
    formData.append("founded_year", foundedYear);
    formData.append("website", website);
    formData.append("current_status", currentStatus);
    formData.append("incubator", incubator);
    formData.append("funding", funding);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/startups", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Startup venture record and pitch/agreement saved!");
        await fetchStartups(activeRollNumber);
        setIsAddModalOpen(false);
        setStartupName("");
        setDescription("");
        setFunding("");
        setSelectedFile(null);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to add startup.");
      }
    } catch {
      alert("Error adding startup.");
    } finally {
      setSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteStartup = async (recordId: string) => {
    if (deletingId !== recordId) {
      setDeletingId(recordId);
      setTimeout(() => setDeletingId((curr) => (curr === recordId ? null : curr)), 4000);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch(`/api/startups?id=${encodeURIComponent(recordId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Startup record removed successfully.");
        if (activeRollNumber) fetchStartups(activeRollNumber);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert(json.error || "Failed to remove startup.");
      }
    } catch {
      alert("Error removing startup.");
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
              Startups & Deep-Tech Spinoffs
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              {startups.length} Ventures
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Commercialization of patent-backed medical technologies, BIRAC grants, and TISC incubation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Startup Venture</span>
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : startups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Rocket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Startups Registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No active healthcare or deep-tech startup ventures logged for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Register Startup Venture</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {startups.map((item) => (
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
                    <StatusBadge status={item.current_status} />
                    <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      Founded: {item.founded_year}
                    </span>
                    {item.funding && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>{item.funding}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.startup_name}</h3>
                  <p className="text-xs font-semibold text-blue-700">Role: {item.founder_role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                    <span>Domain: {item.domain}</span>
                    {item.incubator && <span>• Incubator: {item.incubator}</span>}
                    {item.cofounders && <span>• Co-Founders: {item.cofounders}</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {item.document_url && (
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pitch / MoU</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    </a>
                  )}
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteStartup(item.record_id)}
                    title={deletingId === item.record_id ? "Click again to confirm removal" : "Remove startup record"}
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

      {/* Add Startup Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Startup / Spinoff Venture"
        subtitle={`Venture registration for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Startup Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              placeholder="e.g. NxGen Healtech Pvt. Ltd."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Founder Role / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={founderRole}
                onChange={(e) => setFounderRole(e.target.value)}
                placeholder="Co-Founder & Chief Technology Officer"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Incubation Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as StartupStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Pre-Incubatee">Pre-Incubatee</option>
                <option value="Incubated">Incubated Company</option>
                <option value="Graduated">Graduated Venture</option>
                <option value="Active">Active Spinoff</option>
                <option value="Ideation">Ideation / PoC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Co-Founders & Faculty Mentors</label>
            <input
              type="text"
              value={cofounders}
              onChange={(e) => setCofounders(e.target.value)}
              placeholder="e.g. Dr. Ajay Agarwal, Prof. Surajit Ghosh"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Technology Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Salivary Biosensors, Neonatal Phototherapy"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Founded Year</label>
              <input
                type="text"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="2024"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Product Description & Technology Pipeline</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Commercialization details, targeted clinical indications, regulatory pathway..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Incubation Center</label>
              <input
                type="text"
                value={incubator}
                onChange={(e) => setIncubator(e.target.value)}
                placeholder="IIT Jodhpur TISC / AIIMS Jodhpur"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Grants / Funding Raised</label>
              <input
                type="text"
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                placeholder="BIRAC BIG (50 Lakhs), NIDHI-PRAYAS"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="pt-2">
            <FileUploadZone
              label="Upload Pitch Deck / Incubation Agreement / CIN (PDF)"
              helperText="Auto-named: ROLLNO_STARTUP_SHORTTITLE_YEAR.pdf"
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
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
              <span>{submitting ? "Saving..." : "Save Startup"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function StartupsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <StartupsContent />
    </Suspense>
  );
}

