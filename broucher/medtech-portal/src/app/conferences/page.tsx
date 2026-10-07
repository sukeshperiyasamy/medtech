"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users2,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  Mic,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Conference, ConferenceType, ParticipationType } from "@/types";
import { StudentHeaderCard } from "@/components/StudentHeaderCard";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import { formatDate } from "@/lib/utils";

function ConferencesContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceType, setConferenceType] = useState<ConferenceType>("International");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [participationType, setParticipationType] = useState<ParticipationType>("Oral Presentation");
  const [paperPresented, setPaperPresented] = useState("Yes");
  const [presentationTitle, setPresentationTitle] = useState("");
  const [organizer, setOrganizer] = useState("IEEE EMBS / Society");
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchConferences = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/conferences?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setConferences(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchConferences(activeRollNumber);
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
    formData.append("conference_name", conferenceName);
    formData.append("conference_type", conferenceType);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("participation_type", participationType);
    formData.append("paper_presented", paperPresented);
    formData.append("presentation_title", presentationTitle);
    formData.append("organizer", organizer);
    formData.append("url", url);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/conferences", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Conference record and participation certificate saved!");
        await fetchConferences(activeRollNumber);
        setIsAddModalOpen(false);
        setConferenceName("");
        setPresentationTitle("");
        setSelectedFile(null);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to add conference.");
      }
    } catch {
      alert("Error adding conference.");
    } finally {
      setSubmitting(false);
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
              Conferences & Symposia
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              {conferences.length} Presented
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            National and International oral and poster presentations at IEEE, EMBS, and international medical conferences.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Conference</span>
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : conferences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Users2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Conferences Logged</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No conference presentations logged for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Conference</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {conferences.map((item) => (
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
                    <Badge variant="info">{item.conference_type}</Badge>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                      <Mic className="w-3 h-3 text-teal-600" />
                      <span>{item.participation_type}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.conference_name}</h3>
                  {item.presentation_title && (
                    <p className="text-xs text-slate-700 font-medium italic">
                      "{item.presentation_title}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                    {item.organizer && <span>• Organizer: {item.organizer}</span>}
                    {item.date && <span>• Date: {formatDate(item.date)}</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {item.certificate_url && (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certificate / Proof</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                    </a>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
                    >
                      <span>Conference Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Conference Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Conference Presentation"
        subtitle={`Presentation record for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Conference Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              placeholder="e.g. IEEE International Conference on Biomedical and Health Informatics (BHI 2025)"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Conference Scope</label>
              <select
                value={conferenceType}
                onChange={(e) => setConferenceType(e.target.value as ConferenceType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="International">International Conference</option>
                <option value="National">National Conference</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Participation Type</label>
              <select
                value={participationType}
                onChange={(e) => setParticipationType(e.target.value as ParticipationType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Oral Presentation">Oral Presentation</option>
                <option value="Poster Presentation">Poster Presentation</option>
                <option value="Attendee">Attendee</option>
                <option value="Session Chair">Session Chair</option>
                <option value="Keynote">Keynote / Invited</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Presentation / Paper Title</label>
            <input
              type="text"
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              placeholder="Title of oral talk or poster presented..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kyoto, Japan / Aalborg, Denmark"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Organizer / Professional Society</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="IEEE EMBS, Biophysical Society"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Conference Proceedings / Program URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="pt-2">
            <FileUploadZone
              label="Upload Participation Certificate (PDF / Image)"
              helperText="Auto-named: ROLLNO_CONFERENCE_SHORTTITLE_YEAR.pdf"
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
              <span>{submitting ? "Saving..." : "Save Conference"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ConferencesPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <ConferencesContent />
    </Suspense>
  );
}

