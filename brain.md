# Kavach (Formerly Kavach 60) - Project Brain

## 1. Project Overview
**Kavach** is a prototype web application designed as a next-generation "Emergency Cybercrime Support Portal" for Indian citizens. It acts as an intelligent frontend for the National Cybercrime Reporting Portal (NCRP).

Its primary goal is to minimize the friction of reporting cybercrimes during the critical "Golden Hour". It achieves this by using AI (simulated via OCR and Voice Transcription) to instantly parse evidence (screenshots, voice reports) and automatically generate statutory actions (Bank Freezes for financial crimes, and IT Act Sec 79 Takedowns for social media crimes).

The UI is built with a strictly formal, high-contrast **Government Light Theme**, drawing inspiration from modern bureaucratic design systems (GOV.UK, USWDS) rather than startup aesthetics.

---

## 2. Core Architecture & Workflows

The application is built on React + Vite + Tailwind CSS. The state machine is housed entirely in `src/App.tsx`, which routes the user through a linear sequence of "Steps" based on the type of crime detected.

### The Financial and Social Crime Split
When a user submits evidence (via file drop, voice, or a mock persona), the `ocrService.ts` classifies the incident into one of two branches:

#### Branch A: Financial Incident (Money Loss)
1. **Intake (`EmergencyIntake.tsx`)**: User uploads a payment screenshot (e.g., GPay).
2. **Review (`ExtractedDetailsCard.tsx`)**: Displays the parsed UTR, amount, and banks.
3. **Freeze (`DualBankFreezeCard.tsx`)**: Simulates dispatching an emergency lien to both the victim's bank and the suspect's bank.
4. **Tracker (`FundTrailRadar.tsx`)**: Shows a vertical timeline of the funds moving through the banking system (victim -> mule -> ATM) and their frozen status.
5. **Modals**: The user can generate a `CourtPetitionModal` (Sec 457 CrPC / 503 BNSS) to reclaim frozen funds, or an `OfficialReceipt`.

#### Branch B: Social Incident (Impersonation, Harassment)
1. **Intake (`EmergencyIntake.tsx`)**: User uploads a screenshot of a fake profile or speaks about harassment.
2. **Review (`SocialVerificationCard.tsx`)**: Verifies the platform (e.g., Instagram) and the suspect's profile URL.
3. **Takedown (`TakedownDispatchCard.tsx`)**: Generates an official Section 79 IT Act Notice with a 36-hour compliance countdown, dispatched to the platform's Grievance Officer.
4. **Tracker (`EscalationTracker.tsx`)**: Tracks the status of the notice from the NCRP node to the platform, and outlines police escalation.
5. **Modals**: The user can generate an `FIRDraftModal` (Sec 154 CrPC) for submission to the local cyber cell.

---

## 3. Directory Map & File Contents

### `/src` (Root)
*   **`App.tsx`**: The master state machine. Maintains `currentStep`, `transaction` (the incident data), and the API `payloads`. Handles rendering the correct component based on the step and incident type.
*   **`main.tsx`**: React DOM entry point.
*   **`index.css`**: Tailwind v4 configuration and global styles. Defines the "Government Light Theme" colors (Navy blue, urgent red, success green) and the `@media print` rules that strip UI elements when generating PDFs.
*   **`types/index.ts`**: The central TypeScript definitions. Crucial for understanding the data models (`CyberIncident`, `FinancialIncident`, `SocialIncident`, `CFCFRMSPayload`, `Sec79Payload`).

### `/src/components` (UI Elements)
*   **`Header.tsx`**: The top navigation bar with the "Kavach" branding, 1930 hotline, and language toggle.
*   **`StepTracker.tsx`**: A simple breadcrumb/progress bar showing where the user is in the flow.
*   **`EmergencyIntake.tsx`**: The landing page. Contains the drag-and-drop zone, voice recording button, manual UTR entry, and the list of mock simulation personas.
*   **`MockedTransparencyHub.tsx`**: An informational modal explaining the architecture to stakeholders.

#### Financial Flow Components
*   **`ExtractedDetailsCard.tsx`**: Step 2 (Financial). Verifies UTR and banking details.
*   **`DualBankFreezeCard.tsx`**: Step 3 (Financial). Executes the freeze action.
*   **`FundTrailRadar.tsx`**: Step 4 (Financial). Shows the multi-tier banking transaction timeline.
*   **`CourtPetitionModal.tsx`**: A print-ready legal document for reclaiming frozen funds.
*   **`OfficialReceipt.tsx`**: A print-ready acknowledgment slip.

#### Social Flow Components
*   **`SocialVerificationCard.tsx`**: Step 2 (Social). Verifies platform and suspect URL.
*   **`TakedownDispatchCard.tsx`**: Step 3 (Social). Executes the Sec 79 Takedown notice.
*   **`EscalationTracker.tsx`**: Step 4 (Social). Shows the status of the takedown request and police escalation.
*   **`FIRDraftModal.tsx`**: A print-ready First Information Report document tailored for social media crimes.

### `/src/services` (Business Logic)
*   **`ocrService.ts`**: Simulates the AI backend. It exports `parseScreenshotOCR` and `parseVoiceTranscription`. It uses keyword detection (intent classification) to decide if an input is a Financial or Social incident and returns the heavily structured `CyberIncident` object.
*   **`speechService.ts`**: A wrapper around the browser's native `SpeechRecognition` API (Web Speech API) to capture voice input in English or Hindi.
*   **`storageService.ts`**: LocalStorage wrapper to persist the user's progress (drafts) across page reloads and save their language preference.

### `/src/data` (Mock Data)
*   **`mockPersonas.ts`**: Contains the hardcoded scenarios (e.g., GPay Phishing, Fake Electricity APK, Fake Instagram Profile). When a user clicks a preset on the intake screen, this data is injected into the state machine.
*   **`sampleScreenshots.ts`**: Stores base64 image representations for the mock personas (currently mostly placeholders).

### `/src/utils` (Helpers)
*   **`formatters.ts`**: Utility functions for formatting currency (`formatINR`), dates, and countdown timers.
