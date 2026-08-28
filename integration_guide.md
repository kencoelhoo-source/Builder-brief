# Kavach - Technical Integration & API Guide

This document outlines how the Kavach frontend currently simulates its backend operations, and how it should be wired up to actual government/banking APIs in a production environment.

## 1. The Simulated AI Parser (`src/services/ocrService.ts`)

Currently, when a user uploads an image or speaks into the microphone, the application does not make an external network request. Instead, it relies on mock data and simple keyword matching.

### Moving to Production
In a real environment, the `parseScreenshotOCR` and `parseVoiceTranscription` functions should be replaced with calls to a backend inference server.

*   **Endpoint:** `POST /api/v1/extract-evidence`
*   **Payload:** Multipart form data (Image File) OR Base64 Audio Buffer.
*   **Response:** A JSON representation of the `CyberIncident` type.

The backend would likely employ:
1.  **Vision LLMs (e.g., Gemini 1.5 Pro)** to extract structured text from screenshots of banking apps or social media profiles.
2.  **Speech-to-Text (e.g., Whisper, Bhashini)** for translating and transcribing multilingual Indian voice reports.
3.  **Intent Classification Models** to determine if the payload is `FINANCIAL` or `SOCIAL`.

---

## 2. CFCFRMS API (Financial Freezes)

Currently, the `DualBankFreezeCard` simulates generating a freeze payload and immediately marks it as successful.

### Moving to Production
This needs to connect to the actual **Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)** API, which routes requests to nodal bank officers.

*   **Endpoint:** `POST /api/v1/cfcfrms/dispatch-lien`
*   **Payload:** (Matches the `CFCFRMSPayload` interface)
    ```json
    {
      "incidentId": "TXN-...",
      "remitterBank": "...",
      "beneficiaryVpa": "...",
      "amount": 25000,
      "urgencyLevel": "CRITICAL"
    }
    ```
*   **Response:** Acknowledgment token and initial lien status from the banks.

---

## 3. Section 79 IT Act API (Social Takedowns)

Currently, the `TakedownDispatchCard` simulates generating an IT Act Notice and immediately marks it as dispatched.

### Moving to Production
This needs to connect to a centralized government node (like a modernized NCRP portal) that has direct API pipelines to the designated Grievance Officers of major Intermediaries (Meta, Google, X).

*   **Endpoint:** `POST /api/v1/intermediary/sec79-takedown`
*   **Payload:** (Matches the `Sec79Payload` interface)
    ```json
    {
      "incidentId": "SOC-...",
      "platform": "Instagram",
      "targetUrl": "https://instagram.com/...",
      "violationCategory": "IMPERSONATION",
      "complianceDeadline": "2026-08-29T10:00:00Z"
    }
    ```
*   **Response:** `takedownToken`, platform acknowledgment timestamp, and initial review status.

---

## 4. State Persistence (`src/services/storageService.ts`)

Currently, progress is saved to the browser's `localStorage` so users don't lose data if they refresh.
In production, drafts should be tied to a verified user session (e.g., authenticated via Aadhaar or Mobile OTP) and saved in a secure database (e.g., PostgreSQL or MongoDB) so the user can resume a case from a different device or check the status of an ongoing investigation weeks later.
