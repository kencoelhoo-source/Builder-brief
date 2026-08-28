# Kavach

Kavach is an independent citizen prototype for the Build What Moves India hackathon presented by Varun Mayya and OpenAI. It rethinks the first few minutes of an Indian cybercrime report by starting with the evidence a victim already has, such as a UPI receipt, bank SMS, chat, or social profile screenshot.

> The existing portal asks a victim to describe the crime. Kavach reads the evidence, makes the missing details visible, and prepares the next action. 1930, banks, police, platforms, and the National Cybercrime Reporting Portal remain the real authorities.

Kavach is not an official government service. It does not freeze accounts, submit an NCRP complaint, file an FIR, send a platform notice, or recover money.

## 250-word submission summary

Kavach is an independent civic prototype for India’s cybercrime reporting journey. It is designed for the first 90 seconds after a UPI debit or fake social profile, when a victim is stressed, on a phone, and unsure which details a complaint needs.

The National Cybercrime Reporting Portal is valuable, but its journey separates registration, tracking, suspect reporting, and the 1930 emergency channel. Its checklist asks for incident details, identity, bank or wallet information, a 12 digit UTR, amount, date, and evidence. MoSPI’s 2025 survey found only 17.7% of people aged 15+ said they could report cybercrime, including 12.7% of women and 22.7% of men. Kavach starts with evidence: upload a receipt, chat, or profile screenshot; parse it in the browser with Tesseract.js; review fields; then follow the relevant path.

Financial cases create a labelled simulated dual bank freeze payload, illustrative fund trail, tracking view, and court petition and receipt templates. Social cases create a simulated Section 79 notice, 36 hour demo window, escalation view, and FIR draft. Hindi and English UI, voice input, editable fields, saved drafts, and clear boundaries reduce cognitive load without pretending to contact banks, police, platforms, or NCRP.

I used Codex as a product and engineering partner to scan the repository, shape the four step state machine, implement the bilingual mobile journey, reason through OCR failure states, define safe mock boundaries, and verify the documentation. Kavach turns a screenshot into understandable next actions while keeping 1930 and real authorities in the loop.

## The problem and the evidence

The National Cybercrime Reporting Portal is an important national service. Its official site directs financial-fraud victims to the 24 by 7 helpline 1930, supports complaint tracking, and provides suspect-search and suspect-reporting facilities. MHA reports that CFCFRMS had onboarded more than 375 financial intermediaries and saved more than ₹4,725 crore for more than 14.47 lakh victims by 31 March 2025. Kavach is designed to improve the citizen handoff into that ecosystem, not to replace it.

The usability problem is the effort required at the moment of highest urgency:

| Evidence | What it means for the user | Kavach response |
| --- | --- | --- |
| The official portal exposes separate entry points for registration, tracking, suspect reporting, social-media abuse reporting, and learning resources. | A panicked user must understand which door to open before they can explain what happened. | One guided intake routes a financial or social incident into the relevant path. |
| The published complaint checklist asks for incident time, a description, identity, bank or wallet details, a 12 digit transaction ID or UTR, amount, date, and evidence. | A victim has to find and retype facts from a receipt, SMS, or screenshot. | Screenshot-first intake extracts visible fields in the browser, then presents a human Check step with editable fields. |
| MoSPI’s Comprehensive Modular Survey: Telecom 2025 found that only 17.7% of people aged 15 and above reported being able to complain about cybercrime or report cyber fraud. The figure was 12.7% for women and 22.7% for men. | The flow must explain itself to people with limited digital confidence. | Plain-language copy, bilingual UI, voice input, visible fallbacks, and no hidden assumptions. |
| MHA data records reported cyber-fraud losses of ₹2,290.24 crore in 2022, ₹7,465.18 crore in 2023, and ₹22,845.73 crore in 2024. | Reporting speed matters, especially for financial fraud. | 1930 is visible throughout the flow, and the demo keeps the bank call separate from the prototype action. |

These are not claims that the official service lacks capability. They are product reasons to reduce the work a citizen must do before reaching the real response system.

## What Kavach does better

| Current friction | Kavach’s design response |
| --- | --- |
| Category-first reporting | Evidence-first intake using a receipt, SMS, chat, or profile screenshot. |
| Manual copying of transaction fields | Browser OCR with a review and correction step. If OCR cannot read a field, the user can enter it manually. |
| Separate financial and social experiences | Two complete branches in one four-step flow: Report, Check, Preview, and Track. |
| Unclear next action after an incident | Financial flow shows a simulated dual-bank request and an illustrative fund trail. Social flow shows a simulated Section 79 notice and escalation path. |
| No clear bridge to the next document | The same case data creates a prototype court petition, FIR draft, and financial receipt for review. |
| Language and input barriers | English and Hindi interface, Hindi or English browser voice input, large mobile actions, and editable extracted details. |
| Risk of over-trusting a polished prototype | Repeated labels explain what works, what is simulated, and what would require authorised production integrations. |

## User journey

1. The user signs in with the mock reviewer flow, or uses the simulated phone and OTP fields.
2. The user chooses Report a complaint and selects a financial, social, or uncertain incident.
3. The user uploads an image, types a fallback, or speaks in Hindi or English.
4. Kavach classifies the incident, extracts visible details, and shows the Check screen.
5. The user edits the fields and continues to a clearly labelled demo notice.
6. The financial branch previews a dual-bank freeze payload, then shows a fund trail, tracking view, court petition, and receipt.
7. The social branch previews a Section 79 takedown request, a 36 hour demo window, an escalation tracker, and an FIR draft.

## Implementation

- React 19, TypeScript, Vite 8, Tailwind CSS 4, and Lucide icons.
- `src/App.tsx` owns the four-step state machine and routes financial and social cases.
- `src/services/ocrService.ts` uses Tesseract.js in the browser, image rasterisation, regex extraction, confidence values, a small cache, and timeout handling.
- `src/services/speechService.ts` wraps the browser Web Speech API with `en-IN` and `hi-IN` modes.
- `src/services/storageService.ts` stores a short-lived draft, language preference, acknowledgement reference, manual fields, and demo timers in browser storage.
- `src/data/mockPersonas.ts` provides synthetic reviewer scenarios including UPI phishing, digital arrest, fake social profile, and wrongly accused account cases.
- `src/data/bankNodalDirectory.ts` is a static demo directory used to shape the banking handoff. It is not a live contact system.
- `html2pdf.js` generates downloadable prototype petition, FIR, and receipt documents.
- `src/components/MockedTransparencyHub.tsx` and `src/components/PrototypeBoundaryModal.tsx` disclose the boundary between working browser behavior and simulated integrations.

## How Codex was used

Codex was a meaningful part of the build, not a label added after the fact. It was used to:

- scan the complete repository and map the user journey, state machine, data models, services, and UI components;
- turn the builder brief into product decisions for urgency, mobile use, bilingual access, mock data, and honest disclosure;
- implement and refine the React flow, OCR handling, voice fallback, back navigation, persistence, timers, and PDF outputs;
- inspect failure cases such as unreadable images, unsupported HEIC files, incomplete extraction, invalid UTR or VPA values, unavailable voice recognition, and missing API keys;
- review the codebase and README together so the submission does not claim live banking, police, platform, or government access.

## What works and what is mocked

### Works in the browser

- Four-step financial and social citizen journeys.
- Image upload, local OCR attempt, field review, manual correction, and manual entry fallbacks.
- Hindi and English interface text.
- Browser voice input where Web Speech API support is available.
- Mock personas for fast reviewer demos.
- Back navigation, draft resume, language preference, theme preference, and draft clearing.
- Simulated payload previews, timers, trackers, and client-side PDF generation.
- A visible `tel:1930` link. The browser does not place the call automatically.

### Simulated or not connected

- NCRP complaint submission and acknowledgement.
- CFCFRMS, bank nodal systems, payment rails, police systems, platform APIs, and email dispatch.
- Account freezes, liens, takedowns, refunds, FIR registration, court filings, and legal outcomes.
- Bank contacts, acknowledgement tokens, transaction trails, timers, names, account numbers, and all sample personas.
- Secure identity, authentication, database persistence, and cross-device case tracking.

## OCR and OpenAI behavior

The evidence pipeline does not send screenshots to a paid vision API. Tesseract.js runs in the browser using its English model, and the extracted fields remain editable. Hindi interface text and Hindi voice input are supported, but Hindi text inside screenshots may be missed by the current OCR model. A blank or weak extraction should be corrected manually.

The optional complaint assistant has a local deterministic fallback. In Vite development only, setting `OPENAI_API_KEY` enables the `/api/chat-assistant` route to request a text response from the configured OpenAI model. The key stays server-side and is not required for the core journey. Do not enter real personal, banking, identity, or incident data into this prototype.

## Reviewer access

The current build includes a simulated sign-in gate for reviewers:

- Phone: `9876543210`
- OTP: `123456`
- Or select `Continue as reviewer`

This is synthetic access only. No real OTP is sent.

## Run locally

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

## Submission readiness and next steps

The Build What Moves India brief requires a public browser link, a video of no more than two minutes, and a summary under 250 words. Before submission:

1. Publish a public URL that opens without access requests.
2. Record the first minute as a citizen uploading a real synthetic screenshot, then use the second minute to explain the design, mock boundaries, and Codex contribution.
3. Consider moving the simulated sign-in off the emergency path. The current code requires sign-in before Report, which adds friction for the exact user Kavach is meant to serve.
4. Test the real upload path on a phone, including an unreadable image. The reviewer should see an editable or empty field, never an invented UTR.
5. Keep the 1930 call and official NCRP submission visible in the demo. Kavach is a preparation and handoff layer, not a replacement for either.

## Research sources

Research snapshot: 28 August 2026.

- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
- [Build What Moves India FAQ](https://buildwhatmovesindia.com/faq)
- [National Cybercrime Reporting Portal](https://www.cybercrime.gov.in/)
- [NCRP published complaint checklist](https://www.cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx)
- [NCRP financial-fraud reporting instructions](https://cybercrime.gov.in/uploadmedia/instructions_citizenreportingcyberfrauds.pdf)
- [Ministry of Home Affairs parliamentary answer on cyber fraud losses and 1930](https://www.mha.gov.in/MHA1/Par2017/pdfs/par2025-pdfs/LS02122025/432.pdf)
- [MoSPI NSS Report No. 593, Comprehensive Modular Survey: Telecom 2025](https://mospi.gov.in/sites/default/files/publication_reports/CMST_report_m.pdf)

## License and data note

This repository is an independent hackathon prototype. All people, accounts, transaction identifiers, contact details, timestamps, and outcomes in the demo are synthetic. Do not use the generated petition, FIR, receipt, or payload as proof of a real report or legal action.
