# Kavach Omni - Design System & UI Guidelines

## 1. Design Philosophy
**"Minimalist Government"**
The Kavach Omni interface is designed to emulate modern, trustworthy government digital infrastructure (like GOV.UK, USWDS, or the new India.gov.in standards). It intentionally avoids "startup aesthetics" like neon glows, heavy glassmorphism, or rounded bubbles.

The primary goals are:
- **High Contrast & Readability:** Especially for mobile users in sunlight.
- **Authority & Trust:** Using formal navy blues and stark whites.
- **Urgency without Panic:** Using structured red alerts rather than chaotic flashing elements.

---

## 2. Color Palette (Tailwind)

### Primary Colors (Authority)
*   **Navy Blue:** `#1e3a8a` (Tailwind `blue-900`) - Used for headers, primary buttons, and official badges.
*   **Deep Gray:** `#111827` (Tailwind `gray-900`) - Used for all primary text and critical headings.

### Semantic Colors (Action & Status)
*   **Urgent Red:** `#b91c1c` (Tailwind `red-700`) - Used for the 1930 Hotline, Takedown Actions, and critical warnings.
*   **Success Green:** `#15803d` (Tailwind `green-700`) - Used to indicate successful freezes, dispatches, and secure elements.
*   **Neutral Borders:** `#e5e7eb` (Tailwind `gray-200`) - Used for structural dividers and card outlines.

### Backgrounds
*   **Canvas:** `#f9fafb` (Tailwind `gray-50`) - Light gray background behind cards.
*   **Cards:** `#ffffff` (White) - Solid white backgrounds for data containers.
*   **Subtle Highlights:** `#eff6ff` (Tailwind `blue-50`) - Used for information banners or subtle selections.

---

## 3. Typography
The application uses modern sans-serif fonts for maximum legibility.
- **Inter / San Francisco / Roboto:** Depending on the OS, native stack is preferred.
- Headings are mostly bold and tight (`tracking-tight`).
- Legal text and disclaimers are small (`text-xs`) but high contrast (`text-gray-600` or `text-gray-800`).

---

## 4. Component Standards

### Buttons
*   **Primary Action (`btn-primary`):** Solid Navy Blue (`bg-[#1e3a8a]`), white text, no border radius rounding (`rounded`), slight hover state.
*   **Secondary Action (`btn-secondary`):** White background, gray border, gray text. Used for "Cancel", "Back", or "Close".
*   **Destructive Action:** Solid Red (`bg-[#b91c1c]`), used for "Dispatch Notice" or "Initiate Freeze".

### Cards
*   Flat white backgrounds (`bg-white`).
*   Sharp or slightly rounded corners (`rounded-lg`).
*   Very subtle drop shadows (`shadow-sm`) and explicit 1px borders (`border border-[#e5e7eb]`). No heavy or colored shadows.

### Print Styles (`@media print`)
When generating PDFs (like the Court Petition or FIR Draft), the UI strips away all navigation, buttons, and decorative elements using the `.no-print` and `.print-content` utility classes. The font is overridden to a formal serif (`Times New Roman`) to look like a legal document.
