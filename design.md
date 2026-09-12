# Photo Editor — Design Specification

**Version:** 1.0  
**Product:** Photo Editor  
**Status:** V1  
**Companion Document:** `prd.md`

---

# 1. Design Objective

Photo Editor harus terasa seperti sebuah **serious photography tool yang sederhana**, bukan dashboard SaaS, landing page AI, atau generic Tailwind application.

Visual direction:

> Quiet, photographic, precise, minimal.

Foto pengguna adalah elemen visual utama.

Interface harus mundur ke belakang dan membiarkan foto menjadi pusat perhatian.

Reference inspiration secara konseptual:

- Modern photography applications
- Professional editing tools
- Editorial photography websites
- Minimal creative software

Jangan menyalin interface atau visual identity produk tertentu.

---

# 2. Anti AI-Slop Rule

Ini merupakan requirement utama.

Jangan menghasilkan generic AI-generated SaaS aesthetic.

## Avoid

Jangan gunakan secara default:

- Purple/blue gradient
- Neon glow
- Glassmorphism
- Giant rounded cards
- Excessive border radius
- Gradient CTA
- Decorative blobs
- Floating abstract shapes
- Random sparkles
- Fake AI illustrations
- Excessive shadows
- Oversized hero typography
- Badge berlebihan
- Emoji sebagai icon
- Icon pada setiap heading
- Card di dalam card
- Dashboard-style stat cards
- Excessive pill-shaped components
- Excessive explanatory copy
- Feature grid dengan icon berwarna-warni
- Generic "AI-powered" visual language

Jika sebuah container dapat bekerja tanpa card, jangan membuat card.

Jika sebuah element dapat bekerja tanpa shadow, jangan menggunakan shadow.

Jika sebuah control dapat bekerja tanpa icon, jangan menambahkan icon.

---

# 3. Design Personality

Interface harus terasa:

**Calm**

Tidak banyak warna bersaing.

**Precise**

Slider, values, spacing, dan controls terasa seperti sebuah editing tool.

**Photographic**

Foto menjadi visual hero.

**Compact**

Editor menggunakan ruang secara efisien.

**Intentional**

Setiap border, radius, icon, dan label memiliki fungsi.

**Timeless**

Hindari visual trend yang cepat terasa outdated.

---

# 4. Primary Theme

Editor menggunakan **dark neutral interface**.

Alasan:

- Membuat foto menjadi fokus.
- Tidak mengganggu persepsi warna.
- Familiar untuk photography workflow.
- Memberikan contrast yang baik terhadap image canvas.

Gunakan neutral dark grey, bukan pure black di semua area.

Conceptual palette:

```text
App background      #111111
Panel background    #171717
Elevated surface    #1D1D1D

Primary text        #F2F2F2
Secondary text      #A3A3A3
Muted text          #737373

Border              #2A2A2A
Strong border       #3A3A3A

Control active      #F2F2F2
Control inactive    #666666
```

Exact values boleh disesuaikan selama implementation.

Hindari colorful accent sebagai visual identity utama.

Color sebaiknya berasal dari foto pengguna.

---

# 5. Typography

Gunakan satu sans-serif family yang bersih dan highly readable.

Preferred direction:

```text
Inter
```

atau system sans-serif stack jika lebih efisien.

Typography harus functional.

Avoid:

- Display font dekoratif
- Multiple font families
- Extremely bold typography
- Excessive uppercase

Suggested hierarchy:

```text
Landing hero        48–64px desktop
Page title          24–32px
Panel heading       13–14px
Control label       12–13px
Value               11–12px
Helper text         12–14px
```

Editor tidak membutuhkan heading besar.

---

# 6. Spacing System

Gunakan consistent spacing scale.

Recommended:

```text
4
8
12
16
24
32
48
64
```

Editor menggunakan spacing lebih compact daripada landing page.

Example:

```text
Adjustment row
Label
8px
Slider
12px
Next adjustment
```

Hindari whitespace berlebihan pada control panels.

---

# 7. Border Radius

Gunakan radius secara restrained.

Recommended:

```text
Small controls      4–6px
Buttons             6–8px
Panels              0–8px
Modal               10–12px
```

Avoid:

```text
rounded-2xl
rounded-3xl
```

sebagai default container style.

Photo editor bukan kumpulan floating cards.

---

# 8. Shadows

Sebisa mungkin gunakan:

- Background contrast
- Border
- Spacing

untuk menciptakan hierarchy.

Shadow hanya digunakan untuk:

- Modal
- Floating menu
- Context menu
- Temporary overlay

Jangan menggunakan shadow pada setiap panel/button.

---

# 9. Icons

Gunakan satu icon system yang konsisten.

Preferred:

- Lucide

Icons harus:

- Simple
- Monochrome
- Small
- Functional

Suggested size:

```text
16px
18px
20px
```

Jangan menggunakan oversized icons.

Jangan menambahkan icon hanya untuk dekorasi.

---

# 10. Application Structure

Desktop editor menggunakan tiga area utama.

```text
┌───────────────────────────────────────────────────────────────┐
│  Logo / Back                Undo  Redo             Export     │
├──────────┬──────────────────────────────────────┬─────────────┤
│          │                                      │             │
│          │                                      │             │
│  TOOLS   │                                      │ ADJUSTMENT  │
│          │                                      │             │
│ Adjust   │              IMAGE                   │ Exposure    │
│ Presets  │                                      │ ─────●──── │
│ Match    │                                      │             │
│ Crop     │                                      │ Contrast    │
│ Frame    │                                      │ ────●───── │
│          │                                      │             │
│          │                                      │             │
├──────────┴──────────────────────────────────────┴─────────────┤
│                     Zoom / Before                            │
└───────────────────────────────────────────────────────────────┘
```

The image workspace is always the largest region.

---

# 11. Top Bar

Height approximately:

```text
52–60px
```

Left:

- Product mark / name
- Back when necessary

Center/Right:

- Undo
- Redo
- Export

Avoid large navigation.

Editor bukan website navigation experience.

Export menjadi primary action tetapi tidak perlu menggunakan bright gradient.

Recommended:

```text
[ Export ]
```

Light button against dark interface.

---

# 12. Left Tool Rail

Width:

```text
64–80px
```

atau sekitar:

```text
180px
```

jika menggunakan icon + label.

Preferred V1:

Compact icon + label navigation.

Tools:

```text
Adjust
Presets
Match
Crop
Frame
```

Selected tool menggunakan subtle background atau text contrast.

Jangan membuat setiap tool sebagai large card.

---

# 13. Image Workspace

Workspace adalah pusat aplikasi.

Background:

```text
#0D0D0D – #121212
```

Image berada di tengah.

Gunakan checkerboard hanya jika image memiliki transparency.

Workspace mendukung:

- Fit
- Zoom
- Pan

Photo harus mendapatkan ruang sebanyak mungkin.

Jangan memasukkan decorative elements di sekitar photo.

---

# 14. Adjustment Panel

Right panel:

```text
280–340px
```

Scrollable secara independen.

Structure:

```text
LIGHT

Exposure                    0
────────────●────────────

Contrast                    0
────────────●────────────

Highlights                  0
────────────●────────────


COLOR

Temperature                 0
────────────●────────────

Tint                        0
────────────●────────────
```

Section dapat collapse.

Suggested sections:

```text
Light
Color
HSL
Effects
Detail
```

Panel harus compact.

---

# 15. Slider Design

Slider merupakan salah satu control terpenting.

Requirements:

- Thin track
- Clear handle
- Neutral appearance
- Smooth interaction
- Numeric value visible
- Double click / double tap resets value

Example:

```text
Exposure                       +0.3

──────────────●──────────────
-2                           +2
```

Jangan menggunakan slider besar atau colorful.

---

# 16. HSL Interface

Color selector:

```text
● ● ● ● ● ● ● ●
R O Y G A B P M
```

Color dots boleh menggunakan representasi warna karena memiliki fungsi nyata.

Setelah color dipilih:

```text
GREEN

Hue              -12
────────●────────

Saturation       -18
──────●──────────

Luminance         +6
─────────●───────
```

Color bukan dekorasi; color digunakan sebagai data/control.

---

# 17. Preset Browser

Preset ditampilkan menggunakan thumbnail foto.

Example:

```text
PRESETS

Essential

┌─────────┐ ┌─────────┐ ┌─────────┐
│ photo   │ │ photo   │ │ photo   │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
 Natural      Clean       Soft
```

Recommended:

2–3 columns depending panel width.

Preset thumbnail menggunakan **image yang sama** sehingga user dapat melihat efek sebenarnya.

Jangan menggunakan gradient/color card untuk representasi preset.

Selected preset menggunakan subtle outline.

---

# 18. Match Reference

Match Reference harus menjadi feature yang paling distinctive tetapi tetap sederhana.

Panel state sebelum reference:

```text
MATCH REFERENCE

Match the color grade of another photo.

┌───────────────────────────┐
│                           │
│    Drop reference photo   │
│                           │
│      Browse photo         │
│                           │
└───────────────────────────┘
```

Setelah reference tersedia:

```text
MATCH REFERENCE

REFERENCE

┌───────────────────────────┐
│                           │
│       reference           │
│                           │
└───────────────────────────┘

[ Match Color Grade ]

Intensity                   100
──────────────────────●

[ Remove Reference ]
```

Jangan menggunakan:

- AI sparkle icon
- AI gradient
- Magic wand animation
- "Powered by AI"

Fitur ini adalah image processing tool, bukan AI gimmick.

---

# 19. Match Result Feedback

Setelah Match Reference:

```text
Grade matched

Temperature               +12
Contrast                    -8
Highlights                 -18
Saturation                  -6

Intensity
──────────────────●────
```

User dapat langsung berpindah ke Adjust untuk fine tuning.

Hindari success modal besar.

Gunakan subtle confirmation.

---

# 20. Crop Tool

Ketika Crop aktif:

- Canvas tetap besar.
- Crop overlay muncul langsung di image.
- Controls muncul di side panel.

Options:

```text
Aspect Ratio

Original
Free
1:1
4:5
9:16
16:9

Rotate

↺    ↻

Flip

Horizontal
Vertical
```

Aspect ratio control dapat menggunakan compact segmented controls.

---

# 21. Frame Tool

Panel:

```text
FRAME

Color

○ None
○ White
○ Black

Size

────────●────────

Canvas

Original
1:1
4:5
9:16
```

Preview update real-time.

White frame harus benar-benar white.

Jangan menggunakan off-white aesthetic filter kecuali user memilihnya di masa depan.

---

# 22. Before / After

Before/After harus terasa instant.

Desktop:

```text
Hold to see original
```

atau compact button:

```text
[ Before ]
```

Saat button ditahan:

Original.

Saat dilepas:

Edited.

Optional future:

split-view comparison.

Tidak diperlukan untuk V1.

---

# 23. Bottom Canvas Controls

Gunakan minimal controls:

```text
−    75%    +       Fit       Before
```

Tidak perlu toolbar besar.

---

# 24. Export Dialog

Export menggunakan focused modal.

```text
EXPORT

Format
JPG   PNG   WebP

Size
Original
1080 × 1350
1080 × 1080
1080 × 1920

Quality
──────────────●────
90%

Estimated size
2.4 MB


Cancel                Export
```

Tidak perlu ilustrasi.

Tidak perlu congratulation screen setelah export.

---

# 25. Empty Editor State

Jika user membuka `/editor` tanpa image:

```text
Drop a photo here

or

[ Choose Photo ]

JPG, PNG or WebP
```

Centered.

Tidak perlu card besar.

Tidak perlu illustration.

---

# 26. Landing Page Direction

Landing page boleh lebih expressive daripada editor tetapi tetap mengikuti photographic aesthetic.

Recommended structure:

```text
NAVIGATION

HERO

PRODUCT DEMO / BEFORE AFTER

MATCH REFERENCE

PRESETS

PRIVACY

CTA

FOOTER
```

Hindari typical SaaS structure:

```text
Hero
Logo cloud
3 statistic cards
6 feature cards
Testimonials
Pricing
FAQ
```

jika content tersebut belum memiliki alasan nyata untuk ada.

---

# 27. Landing Hero

Hero harus menunjukkan produknya.

Preferred direction:

```text
Beautiful color grading.
Right in your browser.

Edit your photos, create your own presets,
or match the color grade of a reference photo.

[ Edit a Photo ]

Free · No signup · No watermark


       [ LARGE PRODUCT PREVIEW ]
```

Product screenshot/demo lebih penting daripada abstract illustration.

---

# 28. Landing Photography

Jika menggunakan photography pada landing page:

Use:

- High-quality editorial photography
- Human photography
- Travel
- Portrait
- Wedding
- Lifestyle

Avoid:

- Generic corporate stock photo
- Fake 3D render
- AI robot
- Abstract technology artwork

Foto harus menunjukkan alasan color grading berguna.

---

# 29. Before / After Landing Demo

Salah satu visual utama landing page:

```text
BEFORE              AFTER

┌─────────────────────────────┐
│                             │
│       draggable divider     │
│                             │
└─────────────────────────────┘
```

User dapat drag divider untuk melihat grading difference.

Ini lebih efektif daripada menjelaskan fitur menggunakan banyak copy.

---

# 30. Match Reference Landing Demo

Gunakan visual storytelling:

```text
YOUR PHOTO        REFERENCE

┌──────────┐      ┌──────────┐
│          │      │          │
│ Target   │      │ Wedding  │
│          │      │ Ref      │
└──────────┘      └──────────┘

        ↓ Match Grade

┌────────────────────────────┐
│                            │
│       MATCHED RESULT       │
│                            │
└────────────────────────────┘
```

User harus memahami fitur tanpa membaca paragraf panjang.

---

# 31. Buttons

Primary:

Light background, dark text.

```text
[ Edit a Photo ]
```

Secondary:

Transparent / subtle border.

```text
[ Learn More ]
```

Avoid:

- Gradient
- Glow
- Giant pill
- Icon unnecessarily inside every button

Radius:

```text
6–8px
```

---

# 32. Forms

Forms harus compact.

Input menggunakan:

- Neutral border
- Dark surface
- Clear focus state

No floating labels.

No oversized inputs.

---

# 33. Motion

Animation harus functional.

Recommended duration:

```text
120–200ms
```

Use for:

- Panel transition
- Dropdown
- Modal
- Selected state
- Tool switching

Avoid:

- Scroll-triggered spectacle
- Parallax
- Floating objects
- Continuous animation
- Shimmer
- Excessive spring animation

Editing interaction harus terasa immediate.

---

# 34. Loading

Jika processing membutuhkan waktu:

Use:

```text
Matching color grade…
```

dengan subtle spinner/progress indicator.

Jangan menggunakan fake multi-step AI loading seperti:

```text
Analyzing image…
Understanding colors…
Creating magic…
Almost there…
```

Tampilkan hanya proses yang benar-benar terjadi.

---

# 35. Error States

Error harus direct.

Example:

```text
This image couldn't be opened.

Try a JPG, PNG, or WebP file.
```

Jangan menggunakan:

```text
Oops!
Something went wrong 😢
```

Tone tetap professional dan calm.

---

# 36. Mobile Editor

Mobile bukan versi desktop yang diperkecil.

Structure:

```text
┌───────────────────────┐
│ ←        Photo   Export│
├───────────────────────┤
│                       │
│                       │
│        IMAGE          │
│                       │
│                       │
├───────────────────────┤
│                       │
│ Adjustment Controls   │
│                       │
├───────────────────────┤
│ Adjust Preset Match   │
│ Crop   Frame          │
└───────────────────────┘
```

Tools berada di bottom navigation.

Adjustment dapat muncul sebagai bottom sheet.

Image harus tetap mendapatkan area terbesar.

---

# 37. Mobile Slider

Slider harus cukup besar untuk touch interaction tetapi secara visual tetap thin.

Value dapat muncul di atas thumb saat sedang digeser.

Example:

```text
          +12
           |
───────●──────────
```

---

# 38. Responsive Priorities

Urutan prioritas:

1. Image
2. Active editing control
3. Tool navigation
4. Export
5. Secondary information

Jika space terbatas, secondary UI harus disembunyikan terlebih dahulu.

---

# 39. Accessibility

Minimum requirements:

- Keyboard-accessible controls
- Visible focus states
- Sufficient contrast
- Buttons memiliki accessible labels
- Slider mendukung keyboard arrows
- Drag/drop memiliki browse alternative
- Jangan mengandalkan warna saja untuk menunjukkan state

---

# 40. Performance Perception

Interface tidak boleh terasa berat.

Saat slider digerakkan:

- Preview harus merespons segera.
- Tidak menampilkan loading indicator.
- Heavy processing dapat menggunakan preview resolution.

Loading hanya digunakan untuk operation yang memang membutuhkan waktu seperti Match Reference atau export full-resolution.

---

# 41. Design Tokens

Implementation harus menggunakan centralized design tokens.

Example:

```text
background.app
background.panel
background.surface

text.primary
text.secondary
text.muted

border.default
border.strong

space.1
space.2
space.3
...

radius.control
radius.modal
```

Jangan menyebarkan arbitrary values tanpa alasan.

---

# 42. Component Philosophy

Sebelum membuat component baru, tanyakan:

> Apakah component ini benar-benar reusable atau hanya wrapper visual?

Hindari component explosion.

Jangan membuat:

```text
Card
FeatureCard
FeatureCardInner
FeatureCardHeader
FeatureCardIcon
```

jika sebenarnya hanya membutuhkan:

```html
<section>
```

UI architecture harus sesederhana visual design-nya.

---

# 43. No Unnecessary Cards

Rule penting:

> Sections are not automatically cards.

Gunakan hierarchy dari:

- spacing
- typography
- divider
- background level

sebelum menggunakan card.

Contoh yang benar:

```text
LIGHT
Exposure
Contrast
Highlights

────────────────

COLOR
Temperature
Tint
Saturation
```

Bukan:

```text
┌ LIGHT CARD ┐
└────────────┘

┌ COLOR CARD ┐
└────────────┘
```

---

# 44. No Unnecessary Copy

Editor adalah tool.

Jangan menjelaskan control yang sudah obvious.

Bad:

```text
Brightness

Use this powerful slider to adjust
the brightness of your beautiful image.
```

Good:

```text
Exposure                 +0.3
──────────●──────────────
```

Helper text hanya digunakan jika user mungkin salah memahami behavior.

---

# 45. Real Content Over Placeholder UI

Saat membuat prototype atau implementation:

Prefer:

- Actual preset names
- Actual adjustment values
- Realistic photos
- Real export options

Avoid:

```text
Feature 1
Feature 2
Lorem ipsum
John Doe
10K+ users
```

Jangan membuat fake social proof.

---

# 46. Visual QA Checklist

Sebelum sebuah screen dianggap selesai, cek:

### Hierarchy

- Apakah photo menjadi elemen paling dominan?
- Apakah primary action jelas?
- Apakah secondary controls cukup subtle?

### Restraint

- Apakah ada card yang tidak diperlukan?
- Apakah ada shadow yang tidak diperlukan?
- Apakah ada icon yang tidak diperlukan?
- Apakah radius terlalu besar?
- Apakah terdapat decorative gradient?

### Density

- Apakah editor terlalu kosong?
- Apakah control terlalu besar?
- Apakah panel menggunakan space secara efisien?

### Photography

- Apakah UI membantu melihat foto?
- Apakah background neutral?
- Apakah UI color memengaruhi persepsi terhadap grading?

### Authenticity

- Apakah UI terlihat seperti photography tool?
- Atau terlihat seperti generic SaaS template?

Jika terlihat seperti generic SaaS template, redesign sebelum melanjutkan.

---

# 47. AI Coding Instruction

Saat menggunakan AI coding agent:

Do not interpret:

```text
modern
premium
beautiful
clean
```

sebagai izin untuk menambahkan visual decoration.

Prioritize:

```text
proportion
spacing
typography
alignment
interaction
photography
control density
```

over:

```text
gradient
shadow
glow
rounded cards
decorative illustration
animation
```

When uncertain, choose the simpler visual solution.

Do not add UI elements that are not specified in `prd.md` or this document merely to make the page look more complete.

---

# 48. Final Design Principle

The interface should look designed by someone who cares about photography, not generated from a generic SaaS prompt.

The user should remember:

**their photo and its color grade**

not:

**the interface around it.**