# MedTech Student Data Portal

A centralized institutional information, research output, and document collection portal for the **Joint IDRP Centre for Medical Technologies (IIT Jodhpur & AIIMS Jodhpur)**.

Designed for automated loading of existing master student demographics from **Google Sheets**, automatic student profile re-use across modules, and direct document synchronization to **Google Drive** with predictable institutional filenames.

---

## Core Philosophy

> **"Enter student information once. Reuse it everywhere."**

* Students are identified via **Roll Number** (primary unique key) or Name/Email.
* Existing master data (degree, batch, supervisor, department, contact) is loaded automatically—students never repeatedly type information that already exists.
* New entries (Publications, Patents, Projects, Internships, Startups, Conferences, Achievements) are appended directly to designated tabs in **Google Sheets**.
* Uploaded PDFs/documents are uploaded server-side to **Google Drive** into a structured directory tree:
  ```
  MedTech Student Portal/
  └── Students/
      ├── M24IM1007/
      │   ├── Publications/
      │   ├── Patents/
      │   ├── Projects/
      │   ├── Internships/
      │   ├── Achievements/
      │   └── Other/
      └── ...
  ```
* Generated Google Drive URLs are automatically saved back to the corresponding Google Sheet row.
* Predictable institutional filename format:
  `ROLLNUMBER_CATEGORY_SHORTTITLE_YEAR_TIMESTAMP.extension`
  (e.g., `M24IM1007_PUBLICATION_SEPSIS_BIOSENSING_2026_172345.pdf`).

---

## Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Semantic Institutional Design System
- **Icons**: Lucide React
- **Cloud APIs**: Google Sheets API v4 + Google Drive API v3 (Server-Side Only)
- **Deployment**: Vercel Serverless Ready (Zero separate Node/Express backend required)
- **Data Layer**: Clean Repository pattern (`StudentRepository`, `PublicationRepository`, `PatentRepository`, `DocumentRepository`, `AuditRepository`) with automatic offline/demo fallback when Google credentials are not yet configured.

---

## Step-by-Step Google API & Cloud Setup Guide

Follow these beginner-friendly steps to connect your institutional Google Workspace:

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and select **"New Project"**.
3. Name your project (e.g., `medtech-student-portal`) and click **"Create"**.

### Step 2: Enable Google Sheets API
1. In the Google Cloud Console, navigate to **APIs & Services > Library**.
2. Search for **"Google Sheets API"**.
3. Select it and click **"Enable"**.

### Step 3: Enable Google Drive API
1. In the same **APIs & Services > Library**, search for **"Google Drive API"**.
2. Select it and click **"Enable"**.

### Step 4: Create a Service Account
1. Navigate to **APIs & Services > Credentials**.
2. Click **"+ Create Credentials"** at the top and select **"Service Account"**.
3. Enter a Service Account Name (e.g., `medtech-portal-sa`).
4. Click **"Create and Continue"**.
5. (Optional) Assign the role **"Editor"** and click **"Done"**.

### Step 5: Generate & Download Service Account Key
1. In the Credentials table under **Service Accounts**, click on your newly created service account email.
2. Go to the **"Keys"** tab.
3. Click **"Add Key" > "Create new key"**.
4. Select **JSON** format and click **"Create"**.
5. Save the downloaded JSON file securely. It contains:
   - `client_email`
   - `private_key`

### Step 6: Create & Share the Master Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet named `MedTech_Master_Database`.
2. Copy the **Spreadsheet ID** from the browser URL:
   `https://docs.google.com/spreadsheets/d/`**`<YOUR_SPREADSHEET_ID>`**`/edit`
3. Click the **"Share"** button in Google Sheets.
4. Paste your **Service Account Email** (`medtech-portal-sa@...iam.gserviceaccount.com`).
5. Grant it **"Editor"** permission and uncheck "Notify people", then click **"Share"**.

### Step 7: Create & Share the Google Drive Root Folder
1. Open [Google Drive](https://drive.google.com) and create a folder named `MedTech Student Portal`.
2. Copy the **Folder ID** from the browser URL:
   `https://drive.google.com/drive/folders/`**`<YOUR_FOLDER_ID>`**
3. Right-click the folder, click **Share**, and share with the **Service Account Email** with **"Editor"** role.

---

## Local Development Setup

1. **Clone and enter repository**:
   ```bash
   cd medtech-portal
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your values from Step 5, 6, and 7:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID="your_google_sheet_id"
   GOOGLE_DRIVE_ROOT_FOLDER_ID="your_google_drive_folder_id"
   ADMIN_EMAILS="admin@iitj.ac.in"
   ```
   *(Note: If Google credentials are not set, the portal runs seamlessly in Demo/Offline mode using pre-populated MedTech seed records!)*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New > Project"**.
3. Import your repository.
4. Under **"Environment Variables"**, add:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` *(Ensure quotes are used and `\n` is preserved)*
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_DRIVE_ROOT_FOLDER_ID`
   - `ADMIN_EMAILS`
5. Click **"Deploy"**.
6. Your portal is now live with global serverless edge deployment!

---

## Initial Data Import from Excel

To migrate existing records from the consolidated MedTech Excel workbook into Google Sheets:

```bash
node scripts/import-excel-to-sheets.mjs
```

---

## Architecture & Security

- **Server-Side Credentials**: Google Service Account private keys are strictly accessed inside Next.js Server Actions and Route Handlers (`src/app/api/...`). No secrets are ever sent to client-side bundles.
- **Roll Number Primary Key**: Uniquely identifies each student to prevent identity collisions with common names.
- **Duplicate Prevention**:
  - Publications: Checked against `Roll Number + DOI` or `Roll Number + Title + Year`.
  - Patents: Checked against `Roll Number + Application Number`.
  - Internships: Checked against `Roll Number + Organization + Start Date`.
- **Relational Integrity**: Foreign key `roll_number` connects all 10 domain modules back to the student master profile.
- **Comprehensive Audit Trail**: Every write operation generates an immutable log in the `Audit_Log` sheet.
