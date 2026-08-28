# Kavach - Design System & UI Guidelines

## 1. Design Philosophy
**"Minimalist Government"**
The Kavach interface is designed to emulate modern, trustworthy government digital infrastructure (like GOV.UK, USWDS, or the new India.gov.in standards). It intentionally avoids "startup aesthetics" like neon glows, heavy glassmorphism, or rounded bubbles.

The primary goals are:
- **High Contrast & Readability:** Especially for mobile users in sunlight.
- **Authority & Trust:** Using formal navy blues and stark whites.
- **Urgency without Panic:** Using structured red alerts rather than chaotic flashing elements.

---

## 2. Color Palette & Theming (CSS Custom Properties)

### Primary Colors (Warm Paper & Ink)
*   **Canvas:** `#f4efe6` (Light mode) / `#0a0908` (Dark mode) - Warm, paper-like background.
*   **Card:** `#fffaf3` (Light mode) / `#141210` (Dark mode) - Solid background for data containers.
*   **Ink / Accent:** `#1c1c1c` (Light mode) / `#f3efe8` (Dark mode) - Used for primary buttons, active text, and high-contrast elements.

### Semantic Colors (Action & Status)
*   **Urgent Red:** `#d4351c` (Emergency / Danger) - Used for the 1930 Hotline, Takedown Actions, and critical warnings.
*   **Success Green:** `#1e9a52` (Success) - Used to indicate successful freezes, dispatches, and secure elements.
*   **Neutral Borders:** `var(--line)` and `var(--line-strong)` - Used for structural dividers.

---

## 3. Typography
The application uses modern sans-serif fonts for maximum legibility.
- **Inter Tight / Noto Sans Devanagari:** Font stack used for both English and Hindi.
- Headings are mostly bold and tight (`letter-spacing: -0.04em`).
- Legal text and disclaimers use `text-muted` and `text-subtle` colors for hierarchy.

---

## 4. Component Standards

### Buttons
All buttons rely on strict geometric CSS tokens (`--btn-height-md`, `--btn-pad-x`, etc.) to enforce consistency. Do not use ad-hoc Tailwind classes (`px-*`, `py-*`, `h-*`) for button anatomy.
*   **Primary Action (`btn-primary`, `btn-ai`):** Solid Ink/Accent background (`var(--accent)`), fully rounded pill (`border-radius: 999px`), bold text.
*   **Secondary Action (`btn-secondary`):** Transparent background with `var(--line-strong)` border, text color `var(--ink)`. Used for "Cancel", "Back", or "Change details".
*   **Emergency / Destructive (`btn-emergency`):** Solid Red (`#d4351c`), fully rounded pill. Used for "Dispatch Notice" or "Initiate Freeze".
*   **Icon Buttons (`btn-icon`):** Square `44px x 44px` with pill radius, used for modal close controls and theme toggles.
*   **Button Groups (`btn-group`):** A flex container that handles responsive stacking (side-by-side on desktop, full-width stacked on mobile).

### Cards
*   Flat white backgrounds (`bg-white`).
*   Sharp or slightly rounded corners (`rounded-lg`).
*   Very subtle drop shadows (`shadow-sm`) and explicit 1px borders (`border border-[#e5e7eb]`). No heavy or colored shadows.

### Print Styles (`@media print`)
When generating PDFs (like the Court Petition or FIR Draft), the UI strips away all navigation, buttons, and decorative elements using the `.no-print` and `.print-content` utility classes. The font is overridden to a formal serif (`Times New Roman`) to look like a legal document.
