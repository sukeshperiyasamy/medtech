"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  UserCheck,
  Search,
  BookOpen,
  Award,
  Briefcase,
  FileText,
  ShieldCheck,
  Menu,
  X,
  Lightbulb,
  Building2,
  ExternalLink,
  ArrowLeft,
  Users2,
  Rocket,
} from "lucide-react";
import { useStudent } from "@/components/portal/context/StudentContext";

export function Navbar() {
  const pathname = usePathname();
  const { activeStudent, activeRollNumber } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/portal/dashboard", label: "Dashboard", icon: GraduationCap },
    { href: "/portal/profile", label: "Profile", icon: UserCheck },
    { href: "/portal/publications", label: "Publications", icon: BookOpen },
    { href: "/portal/patents", label: "Patents", icon: Lightbulb },
    { href: "/portal/projects", label: "Projects", icon: Briefcase },
    { href: "/portal/internships", label: "Internships", icon: Building2 },
    { href: "/portal/achievements", label: "Achievements", icon: Award },
    { href: "/portal/conferences", label: "Conferences", icon: Users2 },
    { href: "/portal/startups", label: "Startups", icon: Rocket },
    { href: "/portal/documents", label: "Documents", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top institutional strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-medium text-blue-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to MedTech Site</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            IIT Jodhpur & AIIMS Jodhpur Joint IDRP Centre
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link
            href="/portal"
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <Search className="w-3 h-3 text-blue-400" />
            <span>Switch Roll Number</span>
          </Link>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-emerald-400 font-mono">
            Confidential Form
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Link href="/portal/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none block">
                MedTech Student Portal
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase block mt-0.5">
                Centralized Brochure Data & Drive Vault
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 overflow-x-auto py-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Active Student Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          {activeStudent ? (
            <Link
              href="/portal/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {activeStudent.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {activeStudent.name}
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  {activeStudent.roll_number}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/portal"
              className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Select Student
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {activeStudent && (
            <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between border border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Active Student
                </p>
                <p className="text-sm font-bold text-slate-900">{activeStudent.name}</p>
                <p className="text-xs font-mono text-slate-600">{activeStudent.roll_number}</p>
              </div>
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-blue-600 font-semibold underline"
              >
                Switch
              </Link>
            </div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
