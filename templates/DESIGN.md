# Design System Document: Automotive Luxury & Aesthetics

## 1. Overview & Creative North Star: "The Kinetic Atelier"

This design system is engineered to evoke the precision of high-end automotive engineering and the exclusivity of a private gallery. Our Creative North Star is **"The Kinetic Atelier"**—a space where mechanical power meets curated elegance. 

We move beyond the standard "form-filler" scheduling interface by treating the UI as a high-performance dashboard. This is achieved through:
*   **Intentional Asymmetry:** Breaking the expected centered grid to create movement and focal points.
*   **Tonal Depth:** Replacing harsh lines with structural layering and light.
*   **High-Contrast Sophistication:** Using the interplay between deep obsidians and metallic golds to signal premium service.

---

## 2. Colors: Obsidian & Auric Chrome

The palette is rooted in deep, matte foundations punctuated by high-gloss accents.

### Palette Strategy
*   **Primary (`#f2ca50` / `#d4af37`):** Use for "High-RPM" interactions—CTAs, active states, and critical branding icons. This is your "Gold Standard."
*   **Surface Foundation (`#131313`):** The primary environment. It provides a void-like depth that makes elements feel illuminated from within.
*   **On-Surface Variant (`#d0c5af`):** A muted, champagne-toned text color that reduces eye strain while maintaining a luxury feel.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. Sectioning must be achieved through background shifts. For example, a dashboard sidebar should use `surface_container_low` while the main content area sits on `surface`. This creates a seamless, "milled-from-one-block" aesthetic.

### The Glass & Gradient Rule
For hero sections or premium booking cards, use a linear gradient: `primary` to `primary_container` at a 135-degree angle. This mimics the light reflection on a car's curved bodywork. For floating navigation or modals, apply **Glassmorphism**: use `surface_bright` at 60% opacity with a 20px backdrop-blur.

---

## 3. Typography: Editorial Performance

We utilize a three-font system to create a sophisticated hierarchy that feels like a luxury car brochure.

*   **Display & Headlines (Space Grotesk):** A geometric, wide-tracking typeface that feels mechanical yet modern. Use `display-lg` for impactful welcome messages.
*   **Titles & Body (Manrope):** A high-legibility sans-serif that balances the tech-heavy headlines with a human touch. Use `body-lg` for schedule descriptions to ensure clarity.
*   **Labels (Inter):** A utilitarian typeface for technical data (e.g., VIN numbers, service times).

**Hierarchy Principle:** Typography is our main tool for contrast. Pair a `headline-lg` in `primary` gold with `body-md` in `on_surface_variant` to create immediate visual authority.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "web 2.0" for this system. We use **Tonal Layering** to define space.

*   **The Layering Principle:** Stack tiers to create lift. 
    *   *Base:* `surface`
    *   *Section:* `surface_container_low`
    *   *Component/Card:* `surface_container_high`
*   **Ambient Shadows:** If a card must "float," use an extra-diffused shadow: `offset-y: 24px`, `blur: 48px`, `color: rgba(0,0,0, 0.4)`. The shadow should feel like ambient light blockage, not a heavy ink stain.
*   **Ghost Borders:** For form inputs where a boundary is critical, use the `outline_variant` token at **15% opacity**. It should be felt rather than seen.

---

## 5. Components: Precision Engineered

### Buttons
*   **Primary:** Solid `primary` background with `on_primary` (dark) text. Use `rounded-md` (0.375rem) for a sleek, "machined" corner.
*   **Secondary:** No background. `primary` text with a "Ghost Border."
*   **States:** On hover, primary buttons should transition to `primary_fixed_dim` with a subtle `primary` outer glow.

### Input Fields
*   **Style:** Minimalist. Use `surface_container_highest` for the background. Replace the 4-sided border with a 2px `primary` bottom-border that activates only on focus.
*   **Errors:** Use `error` text with a `surface_container_lowest` background to pop against the dark UI.

### Cards & Scheduling Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Use the `Spacing Scale 4` (1.4rem) to create clear vertical breathing room. Use `surface_container_low` for the card background to separate it from the main `surface`.

### Custom Component: The "Service Gauge"
For scheduling progress, use a horizontal bar utilizing a gradient from `surface_variant` to `primary`. It should mimic a vehicle's tachometer, providing a functional, thematic visual cue.

---

## 6. Do's and Don'ts

### Do
*   **Do** use wide letter-spacing (0.05em) on `label-sm` to give it a "technical" luxury feel.
*   **Do** use the `24` (8.5rem) spacing token for hero section margins to ensure the layout feels "expensive" through whitespace.
*   **Do** utilize `primary_fixed` for icons to ensure they glow against the dark backgrounds.

### Don't
*   **Don't** use pure white (`#FFFFFF`). It breaks the "Obsidian" immersion. Always use `secondary_fixed` or `on_surface`.
*   **Don't** use standard `full` rounded corners for buttons. It feels too playful/consumer. Stick to `sm` or `md` for an architectural feel.
*   **Don't** use high-opacity shadows. If the surface isn't clearly defined, use a background color shift instead.

---
*Director's Final Note: Every pixel should feel like it was turned on a lathe. If an element doesn't serve the "Kinetic Atelier" aesthetic, remove it. Simplicity is the ultimate sophistication.*