"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Lightbulb,
  Briefcase,
  Building2,
  Award,
  Users2,
  Rocket,
  FileText,
  UserCheck,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Microscope,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { StudentHeaderCard } from "@/components/StudentHeaderCard";

export default function StudentDashboardPage() {
  const { activeStudent, activeRollNumber, refreshStudent, isLoading } = useStudent();
  const [counts, setCounts] = useState({
    publications: 0,
    patents: 0,
    projects: 0,
    internships: 0,
    achievements: 0,
    conferences: 0,
    startups: 0,
    documents: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);

  const fetchStudentCounts = async (roll: string) => {
    if (!roll) return;
    setLoadingCounts(true);
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(roll)}`);
      const json = await res.json();
      if (json.success && json.data?.counts) {
        setCounts(json.data.counts);
      }
    } catch (err) {
      console.error("Failed to load counts:", err);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    if (activeRollNumber) {
      fetchStudentCounts(activeRollNumber);
    }
  }, [activeRollNumber]);

  const dashboardModules = [
    {
      id: "profile",
      title: "My Profile",
      subtitle: "Personal, Academic & Contact Record",
      countText: "Verified Institutional Record",
      icon: UserCheck,
      color: "from-blue-600 to-indigo-600",
      viewHref: "/profile",
      addText: "Edit / Update",
      addHref: "/profile",
      highlight: true,
    },
    {
      id: "publications",
      title: "Publications",
      subtitle: "Journals, Conferences & Chapters",
      count: counts.publications,
      icon: BookOpen,
      color: "from-emerald-600 to-teal-600",
      viewHref: "/publications",
      addText: "Add Publication",
      addHref: "/publications?action=add",
    },
    {
      id: "patents",
      title: "Patents & IPR",
      subtitle: "Granted, Filed & Published IPR",
      count: counts.patents,
      icon: Lightbulb,
      color: "from-amber-500 to-orange-600",
      viewHref: "/patents",
      addText: "Add Patent",
      addHref: "/patents?action=add",
    },
    {
      id: "projects",
      title: "Projects",
      subtitle: "Academic, Research & Clinical R&D",
      count: counts.projects,
      icon: Briefcase,
      color: "from-indigo-600 to-violet-600",
      viewHref: "/projects",
      addText: "Add Project",
      addHref: "/projects?action=add",
    },
    {
      id: "internships",
      title: "Internships & Clinical",
      subtitle: "Industry & Hospital Immersion",
      count: counts.internships,
      icon: Building2,
      color: "from-blue-700 to-cyan-600",
      viewHref: "/internships",
      addText: "Add Internship",
      addHref: "/internships?action=add",
    },
    {
      id: "achievements",
      title: "Achievements & Awards",
      subtitle: "Hackathons, Honors & Fellowships",
      count: counts.achievements,
      icon: Award,
      color: "from-purple-600 to-pink-600",
      viewHref: "/achievements",
      addText: "Add Achievement",
      addHref: "/achievements?action=add",
    },
    {
      id: "conferences",
      title: "Conferences & Symposia",
      subtitle: "Oral & Poster Presentations",
      count: counts.conferences,
      icon: Users2,
      color: "from-teal-600 to-emerald-700",
      viewHref: "/conferences",
      addText: "Add Conference",
      addHref: "/conferences?action=add",
    },
    {
      id: "research",
      title: "Research & Lab Output",
      subtitle: "Joint IIT-AIIMS Translations",
      count: counts.publications + counts.patents,
      countLabel: "Combined Output",
      icon: Microscope,
      color: "from-cyan-600 to-blue-700",
      viewHref: "/publications",
      addText: "View Pipeline",
      addHref: "/publications",
    },
    {
      id: "startups",
      title: "Startups & Spinoffs",
      subtitle: "Deep-Tech Incubated Ventures",
      count: counts.startups,
      icon: Rocket,
      color: "from-rose-600 to-red-600",
      viewHref: "/startups",
      addText: "Add Startup",
      addHref: "/startups?action=add",
    },
    {
      id: "documents",
      title: "Document Vault",
      subtitle: "Google Drive Synchronized PDFs",
      count: counts.documents,
      icon: FileText,
      color: "from-slate-700 to-slate-900",
      viewHref: "/documents",
      addText: "Upload Document",
      addHref: "/documents?action=upload",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Student Profile Card Header */}
      <StudentHeaderCard student={activeStudent} />

      {/* Modules Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic & Translational Modules
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any module to inspect existing records or submit new verified credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeRollNumber) {
                refreshStudent();
                fetchStudentCounts(activeRollNumber);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCounts ? "animate-spin text-blue-600" : ""}`} />
            <span>Sync Sheets</span>
          </button>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Drive Vault</span>
          </Link>
        </div>
      </div>

      {/* 10 Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardModules.map((module) => {
          const Icon = module.icon;
          const count = module.count ?? 0;

          return (
            <div
              key={module.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group ${
                module.highlight
                  ? "border-blue-200 bg-gradient-to-b from-blue-50/30 to-white"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{module.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Count Badge / Status */}
                <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {module.countLabel || "Existing Records"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {loadingCounts ? (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    ) : module.countText ? (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {module.countText}
                      </span>
                    ) : (
                      <span className="text-sm font-black font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {count} {count === 1 ? "Record" : "Records"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: [View] [Add New] */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <Link
                  href={module.viewHref}
                  className="font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={module.addHref}
                  className="inline-flex items-center gap-1 font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{module.addText}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
