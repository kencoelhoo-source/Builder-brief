# Kavach — implementation prompt (student budget, no paid models)

You are improving **Kavach**, a civic prototype for **Build What Moves India** (OpenAI × Varun Mayya).

**Money constraint (non-negotiable):** The builder is a **student with $0 for APIs**. Do **not** add GPT-4o / GPT-5 / Gemini paid vision, paid Whisper, or any usage-billed model. Do **not** put `OPENAI_API_KEY` in the client. Do **not** pretend Tesseract is a vision LLM.

**How the brief is satisfied without paying:**  
“Built with Codex **or** powered by an OpenAI model.” Runtime does **not** have to call OpenAI. Document honestly: *Codex/ChatGPT used to author the build; screenshots are parsed on-device so a victim’s GPay photo is not sent to a paid US API.* That is product thinking (cost + privacy), not a dodge. If Codex was not used, do not lie in the README/video.

Read the whole repo before editing. Do not invent files that exist. Do not restyle for fun. Do not add features.

**Product name in UI:** Kavach.  
**Not GOI.** No Lion Capital, Ashoka emblem, “Government of India,” fake NCRP chrome.

---

## 0. Who this is for

**User (optimize this first):** India, ~90 seconds after a UPI debit SMS, cheap Android, GPay/PhonePe screenshot, maybe Hindi, 4G, panicked. They need: (1) call 1930 / bank **now**, (2) facts from the picture they already have, (3) one next paper. They do not need login, quiz, or a chatbot.

**Judge:** Complete citizen journey in a **public browser**. Usable on phone. Mock data disclosed. They will click **upload**, not only demos.

**Pitch that must remain true:**  
*NCRP asks you to describe the crime while the money leaves. Kavach reads the screenshot on-device and spends the golden hour assembling a freeze packet and court paper. 1930 and banks stay real. This build does not freeze accounts.*

If the real upload is worse than tapping “Google Pay demo,” you failed.

---

## 1. Current codebase (scan this, don’t assume)

Stack: **React 19, Vite 8, Tailwind 4, TypeScript**. No production backend. State: **`src/App.tsx`**. Steps: `intake → review → freeze → radar`. Drafts: `storageService.ts` localStorage. Theme/lang persist. History back.

| Step | Financial | Social |
| --- | --- | --- |
| intake | `EmergencyIntake.tsx` | same |
| review | `ExtractedDetailsCard.tsx` | `SocialVerificationCard.tsx` |
| freeze | `DualBankFreezeCard.tsx` (copy already says **demo** freeze) | `TakedownDispatchCard.tsx` |
| radar | `FundTrailRadar.tsx`, `MyApplicationsTab.tsx` | `EscalationTracker.tsx` |
| extra | `WronglyAccusedCaseCard.tsx` if `casePerspective === 'WRONGLY_ACCUSED'` | |

Also: `LoginScreen.tsx` (sessionStorage; phone `9876543210`, OTP `123456`, Continue as reviewer), `ComplaintAssistant.tsx` + `chatAssistantService.ts` + **`vite.config.ts` `/api/chat-assistant`** (gpt-4o-mini **only if key in Vite dev**; else keyword script — **preview/static host has no this plugin**), `CyberSafetyQuiz.tsx`, `PrototypeBoundaryModal.tsx`, `MockedTransparencyHub.tsx`, html2pdf modals (petition, FIR, receipt).

**OCR today:** `ocrService.ts` — `Tesseract.recognize(file, 'eng')` + regex (12-digit UTR, VPA, ₹, bank words, URL). English only. Hindi UI will miss fields. Demos bypass OCR via `mockPersonas.ts`.

**Voice:** `speechService.ts` Web Speech API `hi-IN`/`en-IN`.

**Intake today:** “What happened?” then three cards — **I lost money → manual UTR** (wrong), fake profile → file input, not sure → voice; **then** a dropzone; then demos. 1930 urgent strip exists. Saved-draft resume exists.

`index.html`: `user-scalable=no` (bad). README = Vite template. `package.json` name is still the Windows path. Confetti likely unused.

---

## 2. Keep (do not rip out)

- Financial **and** Sec 79 social branches  
- Human Check step  
- Dual-bank nodal directory  
- Fund trail / 36h takedown tracker  
- Petition, FIR, receipt from the same case  
- Prototype / mocked disclosure  
- Hindi + English, one `tel:1930`, step back-nav, saved draft  
- Demo freeze wording on DualBankFreeze — spread that honesty everywhere  

---

## 3. Work order (do in this order)

### P0 — user-first + brief (no paid API)

**1. Kill the login wall on the emergency path.**  
Victim hits the report page in one tap. Mock login is for **judges** (“Continue as reviewer” on the report screen, or credentials in README). Do not make OTP the first screen after losing money.

**2. Screenshot is the main action for money loss.**  
“I lost money” must **not** skip to manual UTR. Open upload first. UTR/voice are fallbacks. Demos: label **For reviewers**, visually quieter than the dropzone.

**3. Make Tesseract honest and slightly less dumb — still free.**  
- Try `eng+hin` if it doesn’t explode bundle/load time; if it does, keep `eng` and say so in mocked.  
- **Never invent a UTR.** Empty field + “type it from the SMS.”  
- Toast: if almost nothing extracted, say that. Don’t say “Vision AI parsed.”  
- Check step is the product when OCR fails.

**4. 1930 is the real freeze, shown as a parallel action.**  
One red number. On financial review, once UTR/amount/VPA exist: “Read this to 1930: …” — amount, UTR, VPA. Never imply Kavach replaced 1930.

**5. Don’t ship the chatbot as the AI.**  
Without a paid key it’s if/else. Hide it or footer-only. Don’t demo it. Don’t require `OPENAI_API_KEY`.

**6. Copy lies.**  
Scan freeze/radar/chat for “dispatched,” “lien confirmed,” “order executed.” Align with **simulated / demo**. If they believe you froze the bank, you harmed them.

**7. `index.html`:** remove `user-scalable=no`. Allow zoom.

**8. README** (replace Vite boilerplate): what Kavach is, mock credentials, **what’s mocked vs local OCR**, not GOI, how to run, **why no paid vision** (student + don’t upload victim screenshots to a billed API).

### P1 — cut fat

- Quiz: footer at most, not on the golden-hour path  
- Wrongly-accused: keep only if it doesn’t steal the home screen  
- Unused `canvas-confetti` if unused: remove  
- Header “Out” → Sign out / बाहर  
- No second mobile 1930 bar  
- No laptop stock-image split that you already undid — don’t bring it back  

### P2 — deploy for judges

- Public URL (Vercel free). Localhost is invisible.  
- Video (if they still need it): 60s citizen **upload** (real screenshot, show fail/edit if OCR misses), then 60s mocked + on-device OCR + Codex-as-author if true.  
- 250 words: screenshot-first golden hour, not “modern NCRP.”

---

## 4. Hard constraints

- **$0 APIs.** No OpenAI/Gemini/Anthropic vision at runtime. Tesseract + regex only.  
- No live NCRP, CFCFRMS, banks, Aadhaar, PAN, real PII.  
- No official logos. Independent prototype stays.  
- Don’t break the four-step machine or PDF petition/FIR/receipt.  
- Don’t go back to `#root { max-width: 768px }`.  
- Don’t restyle to GOV.UK black/green or spinning art.  
- Update `MockedTransparencyHub` so it matches code after OCR/copy changes.  
- Match existing style: functional React, `src/index.css` classes, no new UI kit.

---

## 5. Files you will likely touch

- `src/components/EmergencyIntake.tsx` — money → upload, not UTR  
- `src/components/LoginScreen.tsx` / `src/App.tsx` — don’t block intake  
- `src/services/ocrService.ts` — no fake UTRs; optional `eng+hin`; honest labels  
- Freeze/radar/chat copy  
- `index.html` viewport  
- `README.md`, `MockedTransparencyHub.tsx`  
- `src/components/ComplaintAssistant.tsx` — hide or demote  

Do not rewrite legal PDF bodies unless they claim a real filing.

---

## 6. Done when

A stranger on a phone can:

1. Open the site and **upload a screenshot without logging in**.  
2. Get extracted fields **or** a clear “we couldn’t read this — type UTR.” Never a fake 12-digit.  
3. Confirm → **labeled simulated** freeze or takedown → PDF.  
4. See **1930** plus the numbers to read out.  
5. Open what’s mocked and it matches.  
6. Judge can still finish a **demo persona** in < 60s.

**Failed if:** login is first; demos work and real photos silently invent data; UI says a bank froze money; you added a paid API; you added a chatbot as the “OpenAI” story.

---

## 7. Before you write code

8 bullets: user, login problem, intake problem, OCR honesty, 1930, what you’ll delete, files, done-test. Then implement P0 only. Then cut fat. Then README.
