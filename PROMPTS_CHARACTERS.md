# Master Game Sprite Prompt (Strict Grid Version)

Use this optimized prompt to generate high-quality assets.

> **Subject:** Game sprite sheet of **[CHARACTER NAME]**, **Side-view fighting game style**.
>
> **Format (Strict):**
> *   **Layout:** Uniform 6x8 grid (6 columns, 9 rows).
> *   **Resolution:** 1536x2304 pixels. Each cell must be exactly **256x256 pixels**.
> *   **Background:** white
>
> **Style:** High-fidelity 16-bit pixel art, modern indie game style, dynamic anatomy, vibrant flat colors, **hard edges**, **distinct thick outlines**.
>
> **Animations (Top to Bottom):**
> *   **Row 1:** Idle combat stance (breathing cycle, 4 frames).
> *   **Row 2:** Run cycle (forward dash with motion blur, full 6 frames).
> *   **Row 3:** Jump (Rising Pose, 4 frames).
> *   **Row 4:** Fall (Dropping Pose, 4 frames).
> *   **Row 5:** Attack (Heavy combat punch/kick/weapon swing, 5 frames).
> *   **Row 6:** Skill (Special power/magic release, 6 frames).
> *   **Row 7:** Hit (Wince/Damage Frame, 3 frames).
> *   **Row 8:** KO (Defeated/Lying Down, 1 static frame).
> **Constraint:** Ensure perfect centering in each 256x256 cell. No overlapping. Maintain consistent scale.
>
> **Quality Tags:** --no anti-aliasing, no blurry edges, no artifacts, no dither, no text, no border.

---

## Negative Prompt (For Stable Diffusion)
> fuzzy, blurry, anti-aliasing, noise, jpeg artifacts, messy, overlapping, cropped, text, watermark, realistic photo, 3d render, sketch, incomplete, distorted grid, incorrect columns.
