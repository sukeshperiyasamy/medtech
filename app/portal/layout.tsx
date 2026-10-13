import type { Metadata } from "next";
import { StudentProvider } from "@/components/portal/context/StudentContext";
import { Navbar } from "@/components/portal/Navbar";

export const metadata: Metadata = {
  title: "MedTech Student Data Collection Portal | IIT Jodhpur & AIIMS Jodhpur",
  description:
    "Official student research, publications, patents, and achievements data collection portal for the Centre for Medical Technologies, IIT Jodhpur & AIIMS Jodhpur.",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="font-semibold text-slate-700">
                Centre for Medical Technologies (IDRP) — IIT Jodhpur & AIIMS Jodhpur
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official Student Brochure Data Collection • Version 2026
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Confidential Student Submission Gateway</span>
              <span>•</span>
              <a href="/portal/admin" className="hover:text-slate-700 font-medium transition-colors">
                Coordinator Desk
              </a>
            </div>
          </div>
        </footer>
      </div>
    </StudentProvider>
  );
}
