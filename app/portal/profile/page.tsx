"use client";

import React, { useState } from "react";
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building,
  ShieldCheck,
  Edit3,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  FileText,
  Globe,
  ExternalLink,
  Sparkles,
  BookOpen,
  Code,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";
import { StudentHeaderCard } from "@/components/portal/StudentHeaderCard";
import { ProfileCompletenessCard } from "@/components/portal/ProfileCompletenessCard";
import { Modal } from "@/components/portal/ui/Modal";
import { formatDate } from "@/lib/portal/utils";

export default function ProfilePage() {
  const { activeStudent, refreshStudent, isLoading } = useStudent();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Form state for canonical contact, research, and profile details
  const [formData, setFormData] = useState({
    phone: "",
    date_of_birth: "",
    personal_email: "",
    alt_phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    specialization: "",
    supervisor: "",
    research_interests: "",
    thesis_title: "",
    technical_skills: "",
    linkedin_url: "",
    github_url: "",
    google_scholar_url: "",
  });

  const handleOpenEdit = () => {
    if (activeStudent) {
      setFormData({
        phone: activeStudent.phone || "",
        date_of_birth: activeStudent.date_of_birth || "",
        personal_email: activeStudent.personal_email || "",
        alt_phone: activeStudent.alt_phone || "",
        address: activeStudent.address || "",
        city: activeStudent.city || "",
        state: activeStudent.state || "",
        pincode: activeStudent.pincode || "",
        specialization: activeStudent.specialization || "",
        supervisor: activeStudent.supervisor || "",
        research_interests: activeStudent.research_interests || "",
        thesis_title: activeStudent.thesis_title || "",
        technical_skills: activeStudent.technical_skills || "",
        linkedin_url: activeStudent.linkedin_url || "",
        github_url: activeStudent.github_url || "",
        google_scholar_url: activeStudent.google_scholar_url || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;
    setSaving(true);
    setErrorToast(null);

    try {
      const res = await fetch(`/api/students/${encodeURIComponent(activeStudent.roll_number)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessToast("Profile information updated and synced to master sheet!");
        await refreshStudent();
        setIsEditModalOpen(false);
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        setErrorToast(json.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setErrorToast("Server communication error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!activeStudent) {
    return <StudentHeaderCard student={null} />;
  }

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <StudentHeaderCard student={activeStudent} onEditProfile={handleOpenEdit} />

      {/* Success notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Notice on read-only vs editable */}
      <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Master Institutional Record Protection:</span> Essential academic identifiers (Roll Number, Degree, Department, Batch) are verified directly from the IDRP Master Google Sheet and locked to prevent accidental corruption. Students can update contact details or submit an official profile amendment request below.
        </div>
      </div>

      {/* Completeness Card */}
      <ProfileCompletenessCard student={activeStudent} onEditProfile={handleOpenEdit} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
              <p className="text-[11px] text-slate-400">Master Sheet Record</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Full Legal Name
              </label>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                <span>{activeStudent.name}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Date of Birth
              </label>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <span>{formatDate(activeStudent.date_of_birth)}</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Gender
              </label>
              <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                {activeStudent.gender || "Not Specified"}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Institutional Email
              </label>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                <span className="truncate">{activeStudent.email}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Mobile Number
              </label>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                <span>{activeStudent.phone || "+91 98765 43210"}</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Credentials</h3>
              <p className="text-[11px] text-slate-400">Institutional Enrollment</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Roll Number (Primary Key)
              </label>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 font-bold font-mono">
                <span>{activeStudent.roll_number}</span>
                <Lock className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Degree / Program
              </label>
              <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                {activeStudent.degree}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Department / Centre
              </label>
              <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                {activeStudent.department}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                  Batch
                </label>
                <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {activeStudent.batch}
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                  Graduation Year
                </label>
                <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {activeStudent.graduation_year}
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Specialization / Domain
              </label>
              <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                {activeStudent.specialization || "Biomedical Engineering & AI"}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                Faculty Supervisor
              </label>
              <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                {activeStudent.supervisor || "Prof. Surajit Ghosh & Dr. Sushmita Jha"}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Contact & Campus Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Contact & Address</h3>
                <p className="text-[11px] text-slate-400">Postal & Campus Residence</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                  Current Campus Address
                </label>
                <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed min-h-[60px]">
                  {activeStudent.address || "IIT Jodhpur Campus Residence, Karwar, Rajasthan"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    City
                  </label>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    {activeStudent.city || "Jodhpur"}
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                    State
                  </label>
                  <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    {activeStudent.state || "Rajasthan"}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium uppercase tracking-wider text-[10px] block">
                  PIN Code
                </label>
                <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                  {activeStudent.pincode || "342030"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handleOpenEdit}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Contact Information</span>
            </button>
          </div>
        </div>

        {/* Card 4: Research & Online Scholarly Presence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Research & Professional Profile</h3>
                <p className="text-[11px] text-slate-400">Scholarly Focus, Thesis & Online Footprint</p>
              </div>
            </div>
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Profiles</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Thesis / Project Title</span>
              <p className="font-semibold text-slate-800 leading-snug">
                {activeStudent.thesis_title || "Pending submission (Edge-AI / Medical Devices)"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Research Interests</span>
              <p className="text-slate-700">
                {activeStudent.research_interests || "Deep Learning in Healthcare, Point-of-Care Diagnostics"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Technical Skills</span>
              <p className="font-mono text-slate-700">
                {activeStudent.technical_skills || "Python, PyTorch, Embedded Systems, Microfluidics"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Online Professional Footprint</span>
              <div className="space-y-1.5 pt-1">
                {activeStudent.linkedin_url ? (
                  <a
                    href={activeStudent.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold block truncate"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 italic block">LinkedIn: Not linked</span>
                )}

                {activeStudent.github_url ? (
                  <a
                    href={activeStudent.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold block truncate"
                  >
                    <span>GitHub / Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 italic block">GitHub: Not linked</span>
                )}

                {activeStudent.google_scholar_url ? (
                  <a
                    href={activeStudent.google_scholar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-semibold block truncate"
                  >
                    <span>Google Scholar / ORCID</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 italic block">Scholar: Not linked</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Official Profile Details"
        subtitle={`Updating master scholar record for ${activeStudent.name} (${activeStudent.roll_number})`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {errorToast && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorToast}</span>
            </div>
          )}

          {/* Section 1: Contact & Personal */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Alternate Mobile
                </label>
                <input
                  type="text"
                  value={formData.alt_phone}
                  onChange={(e) => setFormData({ ...formData, alt_phone: e.target.value })}
                  placeholder="+91 94140 12345"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Personal Email Address
              </label>
              <input
                type="email"
                value={formData.personal_email}
                onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                placeholder="personal.email@gmail.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Section 2: Academic & Research */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Academic & Research Focus
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Specialization / Focus Area
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Biomedical Devices & Biosensors"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Faculty Supervisor(s)
                </label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                  placeholder="e.g. Prof. Surajit Ghosh & Dr. Sushmita Jha"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Thesis / Project Title
                </label>
                <input
                  type="text"
                  value={formData.thesis_title}
                  onChange={(e) => setFormData({ ...formData, thesis_title: e.target.value })}
                  placeholder="e.g. Deep Learning for Pediatric Stunting"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Research Interests
                </label>
                <input
                  type="text"
                  value={formData.research_interests}
                  onChange={(e) => setFormData({ ...formData, research_interests: e.target.value })}
                  placeholder="e.g. Medical Imaging, Biosensors"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.technical_skills}
                onChange={(e) => setFormData({ ...formData, technical_skills: e.target.value })}
                placeholder="e.g. PyTorch, Microfluidics, MATLAB, CAD"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>

          {/* Section 3: Professional & Online Footprint */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Professional Footprint & Online Profiles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  GitHub / Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Google Scholar / ORCID
                </label>
                <input
                  type="text"
                  value={formData.google_scholar_url}
                  onChange={(e) => setFormData({ ...formData, google_scholar_url: e.target.value })}
                  placeholder="Scholar URL or 0000-0002-..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Address */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
              Residence & Address
            </h4>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Campus / Residential Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Room No, Hostel/Block, IIT Jodhpur Campus..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">PIN Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving to Sheets..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
