import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a clean, standardized, institutional filename according to the specification:
 * Format: ROLLNUMBER_CATEGORY_SHORTTITLE_YEAR_TIMESTAMP.extension
 * Example: M24IM1007_PATENT_AI_BIOPSY_DEVICE_2026_172345.pdf
 */
export function generateDocumentFilename(
  rollNumber: string,
  category: string,
  title: string,
  year?: string | number,
  originalFilename?: string
): string {
  // Clean roll number (uppercase, alphanumeric only)
  const cleanRoll = rollNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Clean category (uppercase, letters only)
  const cleanCategory = category.trim().toUpperCase().replace(/[^A-Z]/g, "");

  // Clean short title: extract up to 4 significant words, remove special chars
  const cleanWords = title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 4)
    .map((w) => w.toUpperCase());

  const shortTitle = cleanWords.length > 0 ? cleanWords.join("_") : "DOCUMENT";

  // Year (default to current year if absent)
  const fileYear = year ? String(year).slice(0, 4) : new Date().getFullYear().toString();

  // Timestamp in seconds
  const timestamp = Math.floor(Date.now() / 1000) % 1000000;

  // Extension from original filename or default to .pdf
  let ext = "pdf";
  if (originalFilename && originalFilename.includes(".")) {
    const rawExt = originalFilename.split(".").pop()?.toLowerCase();
    if (rawExt && ["pdf", "doc", "docx", "jpg", "jpeg", "png"].includes(rawExt)) {
      ext = rawExt === "jpeg" ? "jpg" : rawExt;
    }
  }

  return `${cleanRoll}_${cleanCategory}_${shortTitle}_${fileYear}_${timestamp}.${ext}`;
}

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export function validateUploadedFile(file: { name: string; size: number; type: string }): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 15 MB limit (Current: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  const allowedMime = Object.keys(ALLOWED_FILE_TYPES).includes(file.type);
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const allowedExt = Object.values(ALLOWED_FILE_TYPES).flat().includes(ext);

  if (!allowedMime && !allowedExt) {
    return {
      valid: false,
      error: "Unsupported file type. Only PDF, DOC, DOCX, JPG, and PNG documents are allowed.",
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Parses incoming Next.js Request payload safely, supporting both
 * application/json and multipart/form-data without throwing Content-Type errors.
 */
export async function parseRequestPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => ({}));
    return {
      get: (key: string): string => {
        const val = json[key];
        return val !== undefined && val !== null ? String(val) : "";
      },
      getFile: (_key: string): File | null => null,
      isJson: true,
      raw: json,
    };
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();
    return {
      get: (key: string): string => (formData.get(key) as string) || "",
      getFile: (key: string): File | null => {
        const val = formData.get(key);
        return val instanceof File ? val : null;
      },
      isJson: false,
      raw: formData,
    };
  }

  return {
    get: (_key: string): string => "",
    getFile: (_key: string): File | null => null,
    isJson: false,
    raw: {},
  };
}
