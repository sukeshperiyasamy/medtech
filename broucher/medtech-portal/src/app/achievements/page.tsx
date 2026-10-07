"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Achievement, AchievementCategory } from "@/types";
import { StudentHeaderCard } from "@/components/StudentHeaderCard";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import { formatDate } from "@/lib/utils";

function AchievementsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AchievementCategory>("Award");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [positionRank, setPositionRank] = useState("");
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchAchievements = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/achievements?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setAchievements(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchAchievements(activeRollNumber);
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
    formData.append("title", title);
    formData.append("category", category);
    formData.append("organization", organization);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("position_rank", positionRank);
    formData.append("url", url);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/achievements", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Achievement and proof document saved!");
        await fetchAchievements(activeRollNumber);
        setIsAddModalOpen(false);
        setTitle("");
        setDescription("");
        setPositionRank("");
        setSelectedFile(null);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to record achievement.");
      }
    } catch {
      alert("Error adding achievement.");
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
              Honors, Awards & Achievements
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              {achievements.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            National hackathons, fellowships, innovation competitions, and institutional honors.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : achievements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Honors Logged Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No achievement or award records for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Honor</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((item) => (
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
                    <Badge variant="purple">{item.category}</Badge>
                    {item.position_rank && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.position_rank}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                    <span>Awarded by: {item.organization}</span>
                    {item.date && <span>• Date: {formatDate(item.date)}</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {item.proof_url && (
                    <a
                      href={item.proof_url}
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
                      <span>Verification Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Achievement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Honor / Achievement"
        subtitle={`Award and recognition record for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Achievement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1st Prize – National MedTech Hackathon 2025"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Award">Institutional Award</option>
                <option value="Competition">Hackathon / Innovation Competition</option>
                <option value="Scholarship">Fellowship / Scholarship</option>
                <option value="Academic">Academic Distinction</option>
                <option value="Leadership">Leadership / Society</option>
                <option value="Technical">Technical Recognition</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Position / Rank</label>
              <input
                type="text"
                value={positionRank}
                onChange={(e) => setPositionRank(e.target.value)}
                placeholder="1st Place, Finalist, Gold Medalist"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Conferring Organization <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="DBT, BIRAC, IEEE, SRISTI"
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
            <label className="font-semibold text-slate-700 block mb-1">Description / Project Detail</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of innovation evaluated, grant prize received, or citation..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Announcement / News URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://birac.nic.in/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="pt-2">
            <FileUploadZone
              label="Upload Award Certificate / Citation Document (PDF / Image)"
              helperText="Auto-named: ROLLNO_ACHIEVEMENT_SHORTTITLE_YEAR.pdf"
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
              <span>{submitting ? "Saving..." : "Save Achievement"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <AchievementsContent />
    </Suspense>
  );
}

