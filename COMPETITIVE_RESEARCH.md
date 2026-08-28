# Kavach — Competitive Research

> [!NOTE]
> **Date:** 28 August 2026  
> **Question:** What does Kavach do better than cybercrime.gov.in, how do other *Build What Moves India* cybercrime entries compare, and what would put this build ten steps ahead?
> 
> *This is a research note for the hackathon submission, not a claim of official partnership.*

---

## 1. What the original system actually is

The live public service is the **National Cybercrime Reporting Portal (NCRP)** at [cybercrime.gov.in](https://cybercrime.gov.in/), run by the Indian Cyber Crime Coordination Centre (I4C) under the Ministry of Home Affairs.

It is not one form. It is three stacked doors:

| Door | What it is | Job |
| :--- | :--- | :--- |
| **1930** | 24×7 helpline | Fast freeze for *financial* fraud via CFCFRMS |
| **NCRP website / app** | Written complaint | Formal record, routing to state cyber cell |
| **Police FIR** | BNSS / CrPC | Investigation, arrest, court |

> [!WARNING]
> 1930 is the freeze. The website is the paper trail. The FIR is prosecution. Most victims mix these up.

The portal homepage (fetched 28 Aug 2026) still looks like a 2010s government site: image carousels, three big tiles (Women/Children, Financial Fraud, Other Cyber Crime), a “What’s new” stack of PDFs, a suspect-search repository, and a footer that says it is best viewed in Firefox or Chrome. File-a-complaint requires accepting a disclaimer, picking a legal category, mobile OTP, and usually name / email / state plus PAN or Aadhaar for the trackable path. Anonymous filing is mainly for the women-and-children track. Evidence is upload-up-to-10-files, ≤5 MB each. The form wants incident time, place, suspect phone / VPA / URL, modus operandi in prose, then an acknowledgement number.

That acknowledgement is **not** an FIR, **not** a refund, and **not** proof the money is frozen. It starts a record and *may* trigger a lien if funds are still in the first mule account.

### What the original system does well (do not pretend otherwise)

*   It is national, 24×7, and connected to banks, wallets, and NPCI through **CFCFRMS**.
*   I4C reports large freeze totals (MHA has cited thousands of crores held/saved across millions of complaints).
*   It has real operators, a suspect-identifier search, women/child anonymous reporting, and a track-complaint dashboard.
*   1930 is the right first move for money loss. No prototype replaces that.

### Where citizens actually fail

> [!IMPORTANT]
> **Public reporting, not vibes:**

*   **NSSO / MOSPI telecom survey (Jan–Mar 2025):** only **18%** of Indians 15+ can report cybercrime through official channels (13% women, 23% men; 13% rural, 28% urban). Source: *The Hindu Business Line*, 11 Jun 2025.
*   **Golden hour is shrinking.** Indian Express (Dec 2025) and state cyber cells: with UPI, money layers in minutes. A complaint inside ~60 minutes can still freeze; after six hours recovery often collapses. RingSafe (2026) cites I4C-adjacent figures of roughly **1 in 4 freezes if called in the first hour, under 5% after six hours**.
*   **Two systems, one panicked person.** Best practice is *call 1930 and file NCRP in parallel*. In practice people try 1930, get busy tone (Indian Express Mumbai, 2023: 15 test calls, 2 connected), then open the website, hit a long taxonomy form, and quit.
*   **The form is a taxonomy test.** Citizens must choose Financial vs Other vs Women/Child, then type UTR, VPA, bank, URL by hand while shaking. Screenshots are attachments, not the input.
*   **After “submitted,” silence.** Business Standard (Jun 2026): acknowledgement in minutes, then weeks of “under investigation” with no freeze status, no FIR number, no next paper.
*   **Lien ≠ money back.** Frozen funds sit until a magistrate restoration order (Sec 457 CrPC / 503 BNSS). The portal does not generate that petition. LiveLaw (Jun 2026) also notes innocent receivers getting whole accounts frozen — a 2026 SOP now tries to limit lien to the disputed amount.
*   **Desktop-biased.** Citizen guides still say “use a desktop if you can; the form is friendlier.” That is a fail for the person holding a GPay screenshot on a phone.

> [!TIP]
> **Kavach’s bet:** the citizen problem is not “another complaint form.” It is *compress the golden hour into one sitting*: evidence in → structured freeze or takedown out → papers for the court/police step.

---

## 2. What Kavach already does better than NCRP (as a prototype)

Honest split: NCRP *executes* freezes in the real world. Kavach *simulates* them. Judges will mark honesty. The win is the **citizen journey**, not claiming I4C access.

| Pain on NCRP | What Kavach does |
| :--- | :--- |
| Pick a legal category first | Start with **evidence** (screenshot / voice / UTR). Type is inferred. |
| Type UTR, VPA, amount, URL by hand | **OCR on the actual upload** (Tesseract) plus voice (Hindi/English). |
| Financial form *or* a vague “other” track | Two real branches: **bank freeze (CFCFRMS-shaped)** *and* **Sec 79 social takedown**. |
| No dual-bank thinking | Notice to **victim bank and suspect bank** in one step. |
| Acknowledgement, then fog | **Track**: fund trail / mule layers, or takedown 36-hour clock. |
| Frozen money, no next document | **Court petition + FIR draft + receipt** from the same case data. |
| Confusing legal terminology | **Conversational AI Assistant (Live):** 24/7 OpenAI-powered widget that explains legal rights in plain Hindi and English. |
| Desktop ASP.NET, carousels, PDFs | Mobile-first civic UI; 1930 once; Hindi/English. |
| Looks official, so people over-trust | Explicit **prototype / what’s mocked** (brief’s Honesty criterion). |

That last point is a judging advantage if others ship a clone of the emblem and call it “the new NCRP.” The brief forbids presenting as an official product.

---

## 3. Other *Build What Moves India* entries on the same problem

There is **no public leaderboard**. ~10,000 registrations (Varun Mayya, 24 Aug 2026). Deadline 28 Aug 2026, 8:00 PM IST. Reviewers test a **browser URL**, not an app. Codex or an OpenAI model is supposed to be a *meaningful* part of the build.

Public same-problem builds found on **X** (28 Aug 2026):

| Build | Who | What they appear to be |
| :--- | :--- | :--- |
| **Niriksh** | @sc0pophobic + @bigguysahaj | Classify / understand / route / track. AI-heavy intake for messy evidence. Shipping late. |
| **“Modern NCRP”** | Vinay Gaddam @Rocky177200 | Reskin: minimal UI, clear CTAs, simpler citizen journey. Started late. |
| **NotNCRP** | Kanishka Das @bhajamaacha — [bwmi.bhajamaach.dev](https://bwmi.bhajamaach.dev/) | Urgency first (“happening now vs already happened”), Golden Hour fast-track vs guided form, 1930 + bank + filing in parallel, SLA timeline instead of silent pending. |
| **Garuda (V1)** | Kush Agarwal @seemslikekush | Cyber-crime topic, early live V1, asking for feedback while exams run. |
| **NCCRP dashboard** | Kajol Manwani @kajol_manwani | Product-design dashboard for simpler complaints. |

**GitHub:** no other BWMI-2026 NCRP repos stood out in search besides ours ([kencoelhoo-source/Builder-brief](https://github.com/kencoelhoo-source/Builder-brief)). Older work exists (IndiaAI CyberGuard 2024–25 NLP classifiers, SIH crime-reporting apps). Those are **backend/NLP or patrol apps**, not a golden-hour citizen intercept.

**Reddit:** almost no BWMI-cybercrime threads. Citizen anger about NCRP lives in news (busy 1930, “portal too complicated”) more than in long Reddit UX posts.

**LinkedIn:** I4C / Cyber Dost official pages; no dense public cluster of BWMI NCRP rebuilds found in this pass.

**Razorpay:** [razorpay.com/buildathon](https://razorpay.com/buildathon/) is a **separate** student AI-internship contest (commerce agents, Bangalore). Not BWMI. Ignore as a competitor unless someone dual-submits.

### How we are different from those five

Most same-problem entries are **a nicer NCRP form** or **an AI classifier in front of the same form**.

| They | Kavach |
| :--- | :--- |
| Redesign tiles and copy | Redesign the **job**: freeze / takedown, not “file a ticket” |
| One complaint type | **Money + social** in one product |
| Urgency question, then still a form (NotNCRP) | Screenshot *is* the form |
| Dashboard for officers (NCCRP) | Papers the citizen needs **after** freeze |
| Classify and route (Niriksh) | Structured **CFCFRMS / Sec 79 payloads** + mule trail |
| Late / V1 skins | Working **four-step** journey with back-nav, OCR, voice, Hindi |

Closest conceptual cousin is **NotNCRP** (urgency + golden hour + track). They still start with a question tree. We start with the screenshot in the victim’s camera roll — which is what they actually have at minute 4.

---

## 4. What would put Kavach ten steps ahead

Not more UI chrome. The field will be full of pretty forms. Ahead means **depth that reviewers can complete in two minutes** plus **one sentence they remember**.

### Must-do before the form closes (judging, not taste)

1.  **Live public URL** (Vercel/Netlify) that opens without login walls except the mock OTP (`9876543210` / `123456`). Reviewers will not clone GitHub.
2.  **2-minute video:** minute 1 = citizen (upload GPay shot → freeze → petition). Minute 2 = “what’s mocked, why screenshot-first.” Tag `#BuildWhatMovesIndia` / @waitin4agi_.
3.  **Codex / OpenAI as a real step (✅ Completed).** We have successfully integrated the **Kavach AI Cyber Assistant** which explicitly utilizes the OpenAI API to provide conversational statutory guidance to victims in English and Hindi.
4.  **250-word summary** that says: *NCRP records a complaint; Kavach spends the golden hour extracting the freeze packet and the court paper. Banks and 1930 stay real; we sit in front.*
5.  **README that is not the Vite template.** Ours on GitHub still is. Judges who click the repo will bounce.

### Product gaps vs NCRP (keep mocked, but *show the wiring*)

6.  **1930 in the journey, not just a button.** Our new AI Assistant provides the exact "what to say" script (UTR, amount, VPA) to the victim before they call 1930, preventing the failures documented by Indian Express.
7.  **Women/child and anonymous** — NCRP’s one unique strength. A third, quieter track, even if mocked, shows we read the original service.
8.  **Suspect-search analogue** — “check this VPA / URL against known-mule patterns” as a local list, labelled simulated.
9.  **Slow network / 2G honesty.** Our AI Assistant features a built-in **offline fallback legal guidance engine**. If the network drops (or OpenAI fails), it instantly falls back to a robust local statutory rule-engine (Sec 79, Sec 457 processes), keeping the app functional even on spotty 2G connections.
10. **Restoration is our moat.** Competitors stop at “complaint filed.” We already generate the magistrate petition. Make that the climax of the video: *the portal freezes; we hand you the page the court actually wants.*

### How to talk so we don’t lose Honesty points

*   Never use the Lion Capital or “Government of India.”
*   Never say we freeze real accounts.
*   Say: *pre-ingestion layer in front of CFCFRMS / I4C.* Integration guide already describes this.
*   One screen: **Working today / Mocked / Would need MHA + banks.**

### Messaging that is 10 steps ahead of clones

Do not pitch “a modern NCRP.” Pitch:

> [!IMPORTANT]
> **The portal asks you to describe the crime. Kavach reads the screenshot and spends the golden hour on the freeze.**

That sentence is the difference from Niriksh (classify), Vinay (reskin), Kajol (dashboard), and NotNCRP (decision tree).

---

## 5. Risks (say them first in the video)

| Risk | Why it matters |
| :--- | :--- |
| Codex/OpenAI requirement | **(Mitigated)** We integrated a live OpenAI Cyber Assistant that acts as a core hero feature for answering complex legal queries. |
| Live URL | Localhost is invisible to reviewers. |
| Off-list service | Varun said IRCTC/EPFO/IT are easier for judges who have used them. 1930/NCRP is still nationally famous — but spell the pain in the first 15 seconds of the video. |
| Over-claiming | Fake GOI chrome will get dumped on Honesty. |
| OCR quality | Blurry Hindi GPay shots will miss UTR; the Check step must stay the hero, not the model. **(Mitigated)** Users can now simply dictate the missing UTR via voice to the AI Assistant. |

---

## 6. Sources (accessed 28 Aug 2026)

*   [cybercrime.gov.in](https://cybercrime.gov.in/) homepage
*   [buildwhatmovesindia.com/brief](https://buildwhatmovesindia.com/brief) and [FAQ](https://buildwhatmovesindia.com/faq)
*   MOSPI/NSSO via *Hindu Business Line*, 11 Jun 2025 (18% can report)
*   *Indian Express*, 6 Dec 2025 (golden hour now ~60 minutes)
*   *Indian Express* Mumbai, 5 Nov 2023 (1930 busy; portal “too complicated”)
*   *Business Standard*, 25 Jun 2026 (reporting easier than recovery)
*   *ETV Bharat*, 13 Sep 2025 (parliamentary panel; NCRP 53.93 lakh complaints, ~₹31,594 crore)
*   RingSafe 2026 guide; RTI Wiki NCRP/1930 explainers; LiveLaw CFCFRMS SOP, 11 Jun 2026
*   X: @sc0pophobic Niriksh; @Rocky177200 modern NCRP; @bhajamaacha NotNCRP; @seemslikekush Garuda; @kajol_manwani NCCRP
*   [bwmi.bhajamaach.dev](https://bwmi.bhajamaach.dev/)
*   [github.com/kencoelhoo-source/Builder-brief](https://github.com/kencoelhoo-source/Builder-brief)
*   Razorpay AI Buildathon: different contest, not a BWMI competitor

---

## 7. One-page verdict

NCRP is a **national switchboard**. It is slow to *start*, silent *after*, and split across a phone number and a 2019 website. Recovery lives in the first hour; only a fifth of Indians can even begin.

Same-hackathon rivals are mostly **prettier intake**. Kavach is already the only public BWMI cybercrime build that treats the screenshot as the complaint and walks through **freeze + mule trail + court paper**, powered by an active **OpenAI Assistant**.

> [!TIP]
> To go ten steps ahead before 8:00 PM IST: **ship a public URL, a two-minute citizen video, and a sentence that is not “we redesigned NCRP.”**
