"use client";

import React from "react";
import { AlertTriangle, ExternalLink, ArrowRight } from "lucide-react";
import { Modal } from "./Modal";

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway: () => void;
  existingRecord?: any;
  warningMessage?: string;
  moduleName: string;
}

export function DuplicateWarningModal({
  isOpen,
  onClose,
  onProceedAnyway,
  existingRecord,
  warningMessage,
  moduleName,
}: DuplicateWarningModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Record Warning"
      subtitle={`Potential duplicate detected in ${moduleName}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Notice: Record may already exist</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {warningMessage ||
                "Our institutional verification identified an existing entry with matching identifiers in your portfolio."}
            </p>
          </div>
        </div>

        {existingRecord && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-200 pb-2">
              <span>Existing Record Match</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {existingRecord.record_id || existingRecord.application_no || "Existing ID"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="text-slate-500 font-medium">Title:</span>
              <span className="col-span-2 font-semibold text-slate-800 line-clamp-2">
                {existingRecord.title || existingRecord.organization || existingRecord.startup_name}
              </span>
            </div>
            {existingRecord.doi && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">DOI:</span>
                <span className="col-span-2 font-mono text-slate-700">{existingRecord.doi}</span>
              </div>
            )}
            {existingRecord.application_no && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Application No:</span>
                <span className="col-span-2 font-mono text-slate-700">{existingRecord.application_no}</span>
              </div>
            )}
            {existingRecord.journal_conference && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Venue:</span>
                <span className="col-span-2 text-slate-700">{existingRecord.journal_conference}</span>
              </div>
            )}
            {existingRecord.document_url && (
              <div className="pt-2 border-t border-slate-200">
                <a
                  href={existingRecord.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Uploaded Document in Drive
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Review & Edit Form
          </button>
          <button
            type="button"
            onClick={onProceedAnyway}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-xs"
          >
            <span>Confirm & Add Anyway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
