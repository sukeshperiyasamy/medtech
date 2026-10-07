import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StudentProvider } from "@/context/StudentContext";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedTech Student Data Portal | IIT Jodhpur & AIIMS Jodhpur",
  description:
    "Centralized student data, research publications, patents, internships, and Google Drive document vault for the Joint IDRP Centre for Medical Technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/60 text-slate-900 font-sans">
        <StudentProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                © {new Date().getFullYear()} Joint IDRP Centre for Medical Technologies • IIT Jodhpur & AIIMS Jodhpur
              </p>
              <p className="text-slate-400">
                Institutional Data & Document Infrastructure • Powered by Next.js & Google Workspace
              </p>
            </div>
          </footer>
        </StudentProvider>
      </body>
    </html>
  );
}
