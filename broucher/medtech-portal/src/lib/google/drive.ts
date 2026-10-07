import { google } from "googleapis";
import { Readable } from "stream";
import { getGoogleAuthClient } from "./auth";

function getDriveService() {
  const auth = getGoogleAuthClient();
  return google.drive({ version: "v3", auth });
}

// In-memory cache for folder IDs to minimize Google Drive API round-trips
const folderCache = new Map<string, string>();

/**
 * Searches for a folder with a given name under a parent folder.
 */
async function findFolder(name: string, parentId?: string): Promise<string | null> {
  const drive = getDriveService();
  let query = `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/'/g, "\\'")}' and trashed=false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const res = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id || null;
  }
  return null;
}

/**
 * Creates a folder under an optional parent folder.
 */
async function createFolder(name: string, parentId?: string): Promise<string> {
  const drive = getDriveService();
  const fileMetadata: any = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };
  if (parentId) {
    fileMetadata.parents = [parentId];
  }

  const res = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id, name",
  });

  if (!res.data.id) {
    throw new Error(`Failed to create Google Drive folder: ${name}`);
  }

  return res.data.id;
}

/**
 * Ensures a folder exists, returning its ID.
 */
async function getOrCreateFolder(name: string, parentId?: string): Promise<string> {
  const cacheKey = `${parentId || "root"}_${name}`;
  if (folderCache.has(cacheKey)) {
    return folderCache.get(cacheKey)!;
  }

  const existingId = await findFolder(name, parentId);
  if (existingId) {
    folderCache.set(cacheKey, existingId);
    return existingId;
  }

  const createdId = await createFolder(name, parentId);
  folderCache.set(cacheKey, createdId);
  return createdId;
}

/**
 * Ensures the institutional folder hierarchy exists:
 * Root -> Students -> {roll_number} -> {category}
 */
export async function getCategoryFolderId(
  rollNumber: string,
  category: string
): Promise<string> {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const cleanRoll = rollNumber.trim().toUpperCase();
  const cleanCategory = category.trim();

  // 1. "Students" folder inside root
  const studentsFolderId = await getOrCreateFolder("Students", rootFolderId);

  // 2. Student roll number folder inside "Students"
  const studentFolderId = await getOrCreateFolder(cleanRoll, studentsFolderId);

  // 3. Category folder inside student folder
  const categoryFolderId = await getOrCreateFolder(cleanCategory, studentFolderId);

  return categoryFolderId;
}

export interface UploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink?: string;
  filename: string;
}

/**
 * Uploads a file buffer to the appropriate Google Drive student category folder.
 */
export async function uploadDocumentToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  rollNumber: string,
  category: string
): Promise<UploadResult> {
  const drive = getDriveService();

  // Ensure target folder exists
  const parentFolderId = await getCategoryFolderId(rollNumber, category);

  // Convert buffer to readable stream for googleapis
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);

  const fileMetadata: any = {
    name: filename,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: mimeType || "application/octet-stream",
    body: readable,
  };

  const uploadRes = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, webViewLink, webContentLink",
  });

  const fileId = uploadRes.data.id;
  if (!fileId) {
    throw new Error("File upload to Google Drive returned empty ID.");
  }

  // Grant public view permission (read-only) so users/admins can preview the document link
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (permError) {
    console.warn("Could not set anyone-with-link permission on Drive file:", permError);
  }

  return {
    fileId,
    webViewLink:
      uploadRes.data.webViewLink ||
      `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    webContentLink: uploadRes.data.webContentLink || undefined,
    filename,
  };
}
