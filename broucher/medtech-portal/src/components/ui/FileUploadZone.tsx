"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { formatFileSize, validateUploadedFile } from "@/lib/utils";

interface FileUploadZoneProps {
  label?: string;
  helperText?: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  required?: boolean;
  accept?: string;
}

export function FileUploadZone({
  label = "Upload Supporting Document (PDF / Image)",
  helperText = "Supported: PDF, DOC, DOCX, JPG, PNG (Max 15MB)",
  selectedFile,
  onFileSelect,
  required = false,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    setErrorMsg(null);
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || "Invalid file");
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[11px] text-slate-500">Auto-saved to Google Drive</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              <span className="text-blue-600 hover:underline">Click to browse</span> or drag & drop document
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">
                {formatFileSize(selectedFile.size)} • Ready for Drive sync
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
