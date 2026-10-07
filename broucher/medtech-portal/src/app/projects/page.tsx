"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  ArrowUpRight,
  Code,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { Project, ProjectType, ProjectStatus } from "@/types";
import { StudentHeaderCard } from "@/components/StudentHeaderCard";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import { formatDate } from "@/lib/utils";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const { activeStudent, activeRollNumber } = useStudent();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Research");
  const [description, setDescription] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [organization, setOrganization] = useState("IIT Jodhpur & AIIMS Jodhpur");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Ongoing");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProjects = async (roll: string) => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?rollNumber=${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data) setProjects(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) fetchProjects(activeRollNumber);
  }, [activeRollNumber]);

  useEffect(() => {
    if (searchParams.get("action") === "add") setIsAddModalOpen(true);
  }, [searchParams]);

  useEffect(() => {
    if (activeStudent && !supervisor) {
      setSupervisor(activeStudent.supervisor || "Prof. Surajit Ghosh");
    }
  }, [activeStudent]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRollNumber) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("roll_number", activeRollNumber);
    formData.append("title", title);
    formData.append("project_type", projectType);
    formData.append("description", description);
    formData.append("supervisor", supervisor);
    formData.append("organization", organization);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("technologies", technologies);
    formData.append("status", status);
    formData.append("project_url", projectUrl);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/projects", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Project record and report added to Google Drive!");
        await fetchProjects(activeRollNumber);
        setIsAddModalOpen(false);
        setTitle("");
        setDescription("");
        setTechnologies("");
        setSelectedFile(null);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(json.error || "Failed to add project.");
      }
    } catch {
      alert("Error adding project.");
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
              Academic & Translational Projects
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              {projects.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interdisciplinary clinical immersion, diagnostic prototype development, and thesis research.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Projects Logged</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No projects logged for {activeStudent?.name || "Student"}.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Project</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.record_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {proj.record_id}
                    </span>
                    <Badge variant="info">{proj.project_type}</Badge>
                    <StatusBadge status={proj.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                  {proj.technologies && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <Code className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-700">{proj.technologies}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 pt-1">
                    <span>Supervisor: {proj.supervisor}</span>
                    <span>• {proj.organization}</span>
                    {proj.start_date && (
                      <span>
                        • {formatDate(proj.start_date)} - {proj.end_date ? formatDate(proj.end_date) : "Present"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {proj.document_url && (
                    <a
                      href={proj.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Report in Drive</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </a>
                  )}
                  {proj.project_url && (
                    <a
                      href={proj.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
                    >
                      <span>Repository / URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Project Record"
        subtitle={`Academic or translational project for ${activeStudent?.name || "Student"} (${activeRollNumber})`}
        maxWidth="3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Non-Invasive Wearable Salivary Diagnostic Band"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Research">Research Project</option>
                <option value="Academic">Academic / Thesis</option>
                <option value="Industry">Industry Sponsored</option>
                <option value="Startup">Startup R&D</option>
                <option value="Personal">Personal Initiative</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Proposed">Proposed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Clinical Objectives</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of objectives, methodology, and translational outcomes..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Faculty Supervisor</label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Host Organization / Lab</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
              <input
                type="date"
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
            <label className="font-semibold text-slate-700 block mb-1">Technologies & Skills Employed</label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. Microfluidics, Electrochemical Sensors, Machine Learning, Python, PyTorch"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Demo / Repository URL</label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="pt-2">
            <FileUploadZone
              label="Upload Project Report / Thesis PDF"
              helperText="Auto-named: ROLLNO_PROJECT_SHORTTITLE_YEAR.pdf"
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
              <span>{submitting ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
      <ProjectsContent />
    </Suspense>
  );
}

