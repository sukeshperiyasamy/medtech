// scripts/e2e_phase8_test.mjs
// Automated verification script for Phase 8 testing scenarios

const BASE_URL = "http://localhost:3005";

async function runTests() {
  console.log("==========================================================");
  console.log("   MEDTECH PORTAL — PHASE 8 END-TO-END VERIFICATION       ");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // Scenario 1: Existing student with complete records
    // ----------------------------------------------------
    console.log("TEST 1: Existing student with records (D20ID004 - Misaal Khan)");
    const res1 = await fetch(`${BASE_URL}/api/students/D20ID004`);
    const json1 = await res1.json();
    assert(json1.success === true, "Fetch D20ID004 profile succeeds");
    assert(json1.data.student.name === "Misaal Khan", "Student name matches Misaal Khan");
    assert(json1.data.counts.publications >= 1, `Publications count (${json1.data.counts.publications}) >= 1`);
    assert(json1.data.counts.patents >= 1, `Patents count (${json1.data.counts.patents}) >= 1`);
    assert(json1.data.student.completeness !== undefined, "Completeness engine calculated score");
    assert(json1.data.student.completeness.overall > 0, `Overall completeness is ${json1.data.student.completeness.overall}%`);
    assert(json1.data.student.completeness.personal.score > 0, `Personal completeness is ${json1.data.student.completeness.personal.score}%`);
    assert(json1.data.student.completeness.academic.score > 0, `Academic completeness is ${json1.data.student.completeness.academic.score}%`);

    // ----------------------------------------------------
    // Scenario 2: Existing student with missing records
    // ----------------------------------------------------
    console.log("\nTEST 2: Existing student with missing records (M24IM1001)");
    const res2 = await fetch(`${BASE_URL}/api/students/M24IM1001`);
    const json2 = await res2.json();
    assert(json2.success === true, "Fetch M24IM1001 profile succeeds");
    assert(json2.data.counts.publications === 0, "Publications count is 0 as expected");
    const allMissing = [
      ...json2.data.student.completeness.personal.missingFields,
      ...json2.data.student.completeness.academic.missingFields,
      ...json2.data.student.completeness.research.missingFields,
      ...json2.data.student.completeness.professional.missingFields
    ];
    assert(allMissing.length > 0, `Correctly identifies missing fields (${allMissing.length} missing)`);
    assert(allMissing.includes("Date of Birth"), "Identifies missing Date of Birth");
    assert(allMissing.includes("Mobile Number"), "Identifies missing Mobile Number");

    // ----------------------------------------------------
    // Scenario 3: New student registration
    // ----------------------------------------------------
    console.log("\nTEST 3: New student registration");
    const testRoll = `T${Date.now().toString().slice(-6)}`;
    const newStudentPayload = {
      roll_number: testRoll,
      name: "Test Scholar Phase8",
      email: `${testRoll.toLowerCase()}@iitj.ac.in`,
      degree: "M.Tech – Medical Technology",
      batch: "2024",
      department: "Centre for Medical Technologies (IDRP)",
      graduation_year: "2026",
      status: "Active"
    };
    const res3 = await fetch(`${BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudentPayload),
    });
    const json3 = await res3.json();
    assert(json3.success === true, `Registered new student with roll ${testRoll}`);
    
    // Verify on fetch
    const res3_verify = await fetch(`${BASE_URL}/api/students/${testRoll}`);
    const json3_verify = await res3_verify.json();
    assert(json3_verify.success === true && json3_verify.data.student.name === "Test Scholar Phase8", "New student is immediately retrievable");

    // ----------------------------------------------------
    // Scenario 4: Duplicate roll number detection
    // ----------------------------------------------------
    console.log("\nTEST 4: Duplicate roll number handling");
    const res4_dup = await fetch(`${BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudentPayload),
    });
    assert(res4_dup.status === 409, "Direct registration with duplicate roll number correctly rejected with 409 Conflict");

    // Submit duplicate via submissions queue
    const res4_sub = await fetch(`${BASE_URL}/api/admin/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roll_number: testRoll,
        payload: {
          name: "Test Scholar Phase8",
          email: `${testRoll.toLowerCase()}@iitj.ac.in`,
          degree: "M.Tech – Medical Technology",
          batch: "2024"
        }
      })
    });
    const json4_sub = await res4_sub.json();
    assert(json4_sub.success === true, "Submission queue accepted payload for processing");
    assert(json4_sub.data.submission_type === "DUPLICATE", `Correctly classified identical resubmission as DUPLICATE (got ${json4_sub.data.submission_type})`);

    // ----------------------------------------------------
    // Scenario 5: Updated student submission
    // ----------------------------------------------------
    console.log("\nTEST 5: Updated student submission with diff detection");
    const updatePayload = {
      roll_number: testRoll,
      payload: {
        name: "Test Scholar Phase8 Updated",
        email: `${testRoll.toLowerCase()}@iitj.ac.in`,
        dob: "2001-05-15",
        phone: "+91 9876543210",
        thesis_title: "AI in Micro-Endoscopy Diagnostics",
        research_interests: "Endoscopy, Computer Vision, Signal Processing",
        linkedin_url: "https://linkedin.com/in/test-scholar",
        orcid_id: "0000-0002-1234-5678"
      }
    };
    const res5 = await fetch(`${BASE_URL}/api/admin/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const json5 = await res5.json();
    assert(json5.success === true, "Update submission successfully queued");
    assert(json5.data.submission_type === "UPDATE", `Classified as UPDATE (got ${json5.data.submission_type})`);
    assert(json5.data.diff_fields.includes("date_of_birth"), "Diff includes 'date_of_birth'");
    assert(json5.data.diff_fields.includes("phone"), "Diff includes 'phone'");
    assert(json5.data.diff_fields.includes("thesis_title"), "Diff includes 'thesis_title'");
    const updateSubId = json5.data.submission_id;

    // ----------------------------------------------------
    // Scenario 6: Invalid submission
    // ----------------------------------------------------
    console.log("\nTEST 6: Invalid submission handling");
    const res6 = await fetch(`${BASE_URL}/api/admin/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll_number: "" }),
    });
    assert(res6.status === 400, "Submission without roll number rejected with 400 Bad Request");

    // Missing mandatory in new submission
    const res6_missing = await fetch(`${BASE_URL}/api/admin/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roll_number: "NONEXISTENT999",
        payload: {
          dob: "2000-01-01"
          // Missing name, email
        }
      })
    });
    const json6_missing = await res6_missing.json();
    assert(json6_missing.data.submission_type === "NEEDS_REVIEW", "New student missing mandatory fields classified as NEEDS_REVIEW");
    assert(json6_missing.data.missing_mandatory.includes("Full Name"), "Flagged 'Full Name' as missing mandatory field");

    // ----------------------------------------------------
    // Scenario 7: Student with multiple publications
    // ----------------------------------------------------
    console.log("\nTEST 7: Multiple publications tracking");
    // Add publication for test student
    const pubFormData = new FormData();
    pubFormData.append("roll_number", testRoll);
    pubFormData.append("title", "Deep Learning for Automated Ultrasound Biomarker Segmentation");
    pubFormData.append("authors", "Test Scholar, Prof. Supervisor");
    pubFormData.append("journal_conference", "IEEE Transactions on Biomedical Engineering");
    pubFormData.append("publication_type", "Journal Article");
    pubFormData.append("doi", "10.1109/TBME.2026.1234567");
    pubFormData.append("publisher", "IEEE");
    pubFormData.append("publication_date", "2026-03-15");
    pubFormData.append("status", "Published");

    const res7_pub1 = await fetch(`${BASE_URL}/api/publications`, {
      method: "POST",
      body: pubFormData
    });
    const json7_pub1 = await res7_pub1.json();
    assert(json7_pub1.success === true, "Added publication 1");

    // Add 2nd publication
    const pubFormData2 = new FormData();
    pubFormData2.append("roll_number", testRoll);
    pubFormData2.append("title", "A Microfluidic Impedance Sensor for Point-of-Care Diagnostics");
    pubFormData2.append("authors", "Test Scholar, Collaborator B");
    pubFormData2.append("journal_conference", "Biosensors and Bioelectronics");
    pubFormData2.append("publication_type", "Journal Article");
    pubFormData2.append("doi", "10.1016/j.bios.2026.9876543");
    pubFormData2.append("publisher", "Elsevier");
    pubFormData2.append("publication_date", "2026-04-20");
    pubFormData2.append("status", "Published");

    const res7_pub2 = await fetch(`${BASE_URL}/api/publications`, {
      method: "POST",
      body: pubFormData2
    });
    const json7_pub2 = await res7_pub2.json();
    assert(json7_pub2.success === true, "Added publication 2");

    // Verify student counts reflect 2 publications
    const res7_verify = await fetch(`${BASE_URL}/api/students/${testRoll}`);
    const json7_verify = await res7_verify.json();
    assert(json7_verify.data.counts.publications === 2, `Student profile reflects 2 publications (got ${json7_verify.data.counts.publications})`);

    // ----------------------------------------------------
    // Scenario 8: Scholar with no publications/patents/projects
    // ----------------------------------------------------
    console.log("\nTEST 8: Scholar without optional records (not penalized as incomplete)");
    const res8 = await fetch(`${BASE_URL}/api/students/M24IM1005`); // Ritika Jajoriya
    const json8 = await res8.json();
    assert(json8.success === true, "Loaded Ritika Jajoriya profile");
    // Academic completeness can be > 50% even if no publications/patents exist
    assert(json8.data.student.completeness.academic.score >= 50, `Academic completeness calculated without penalizing missing publications (${json8.data.student.completeness.academic.score}%)`);

    // ----------------------------------------------------
    // Scenario 9: Document upload / vault staging
    // ----------------------------------------------------
    console.log("\nTEST 9: Document Vault staging and metadata linkage");
    const docFormData = new FormData();
    docFormData.append("roll_number", testRoll);
    docFormData.append("category", "Publications");
    docFormData.append("record_id", json7_pub1.data.record_id);
    docFormData.append("short_title", "Ultrasound_Segmentation_Paper");
    const testFile = new Blob(["%PDF-1.4 Mock publication manuscript for testing"], { type: "application/pdf" });
    docFormData.append("file", testFile, "Manuscript_Final_CameraReady.pdf");

    const res9 = await fetch(`${BASE_URL}/api/documents`, {
      method: "POST",
      body: docFormData
    });
    const json9 = await res9.json();
    assert(json9.success === true, "Document uploaded and cataloged in Document Vault");
    assert(json9.data.roll_number === testRoll, `Roll number correctly attached (${json9.data.roll_number})`);
    assert(json9.data.student_name !== undefined, `Student name attached: ${json9.data.student_name}`);
    assert(json9.data.generated_filename.includes(testRoll), `Standardized filename includes roll number (${json9.data.generated_filename})`);
    assert(json9.data.drive_sync_status === "LOCAL_STAGED", `Drive sync status correctly marked LOCAL_STAGED (${json9.data.drive_sync_status})`);

    // ----------------------------------------------------
    // Scenario 10: Admin approval / rejection workflow
    // ----------------------------------------------------
    console.log("\nTEST 10: Admin Approval & Rejection workflow with audit logs");
    // 10a. Approve update submission
    const res10_app = await fetch(`${BASE_URL}/api/admin/submissions/${updateSubId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE", reviewer: "Faculty Coordinator" })
    });
    const json10_app = await res10_app.json();
    assert(json10_app.success === true, `Submission ${updateSubId} approved`);

    // Verify master student record was updated with the new fields
    const res10_student = await fetch(`${BASE_URL}/api/students/${testRoll}`);
    const json10_student = await res10_student.json();
    assert(json10_student.data.student.dob === "2001-05-15", "Student DOB updated in master record");
    assert(json10_student.data.student.phone === "+91 9876543210", "Student phone updated in master record");
    assert(json10_student.data.student.thesis_title === "AI in Micro-Endoscopy Diagnostics", "Student thesis title updated in master record");
    assert(json10_student.data.student.completeness.overall > json3_verify.data.student.completeness.overall, `Completeness score increased after approval (${json10_student.data.student.completeness.overall}% vs ${json3_verify.data.student.completeness.overall}%)`);

    // 10b. Submit another record to test REJECT
    const rejectSubRes = await fetch(`${BASE_URL}/api/admin/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roll_number: testRoll,
        payload: {
          phone: "0000000000"
        }
      })
    });
    const jsonRejectSub = await rejectSubRes.json();
    const rejectSubId = jsonRejectSub.data.submission_id;

    const res10_rej = await fetch(`${BASE_URL}/api/admin/submissions/${rejectSubId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REJECT",
        reviewer: "Admin Desk",
        reason: "Invalid dummy phone number submitted"
      })
    });
    const json10_rej = await res10_rej.json();
    assert(json10_rej.success === true, `Submission ${rejectSubId} rejected`);

    // Verify audit logs contain approval and rejection entries
    const res10_audit = await fetch(`${BASE_URL}/api/admin/audit`);
    const json10_audit = await res10_audit.json();
    const actions = json10_audit.data.map(l => l.action);
    assert(actions.includes("SUBMISSION_APPROVED"), "Audit log contains SUBMISSION_APPROVED");
    assert(actions.includes("SUBMISSION_REJECTED"), "Audit log contains SUBMISSION_REJECTED");

    console.log("\n==========================================================");
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==========================================================");
  } catch (err) {
    console.error("Test execution failed with unhandled error:", err);
  }
}

runTests();
