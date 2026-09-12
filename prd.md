# Photo Editor — Product Requirements Document

**Version:** 1.0  
**Status:** V1 / MVP  
**Working Name:** Photo Editor  
**Platform:** Web  
**Backend:** Laravel  
**Primary Experience:** Browser-based photo editing

---

# 1. Product Overview

Photo Editor adalah aplikasi editing foto berbasis web yang berfokus pada pengalaman editing sederhana, cepat, dan berkualitas tinggi, terutama untuk kebutuhan **color grading**.

Produk mengambil inspirasi dari workflow aplikasi photo editing modern seperti VSCO, tetapi tidak bertujuan menjadi clone maupun menggantikan aplikasi editing profesional seperti Adobe Lightroom atau Photoshop.

Core experience produk adalah:

> **Upload → Adjust / Preset / Match Reference → Fine Tune → Frame / Crop → Export**

Photo Editor harus dapat digunakan tanpa instalasi aplikasi, tanpa login, tanpa subscription, dan tanpa watermark.

Sebisa mungkin seluruh proses editing foto dilakukan secara lokal di browser sehingga foto pengguna tidak perlu dikirim ke server.

---

# 2. Product Vision

Menyediakan photo editor gratis berbasis browser yang membuat color grading foto menjadi mudah bagi pengguna non-profesional maupun pengguna yang memahami dasar photo editing.

Produk harus terasa:

- Simple
- Fast
- Modern
- Visual
- Privacy-friendly
- Mobile-friendly
- Tidak intimidating bagi pengguna awam

Produk tidak ditujukan menjadi editor foto serba bisa.

Fokus utama V1 adalah:

1. Manual color adjustment
2. Ready-to-use presets
3. Reference-based color grading
4. Simple framing and cropping
5. High-quality export

---

# 3. Core Value Proposition

## 3.1 Free Photo Editing

Pengguna dapat melakukan color grading tanpa:

- Subscription
- Login
- Watermark
- Instalasi aplikasi

---

## 3.2 Reference Color Matching

Pengguna dapat mengunggah foto referensi dengan color grading yang disukai.

Photo Editor menganalisis karakter visual reference tersebut dan menerapkan grading yang serupa pada foto pengguna.

Contoh:

User memiliki foto wedding biasa.

User kemudian mengunggah foto wedding lain dengan karakter:

- Warm skin tone
- Muted green
- Creamy highlight
- Soft contrast
- Lifted black

Photo Editor mencoba menerapkan karakter color grading tersebut ke foto target.

Fitur ini disebut:

**Match Reference**

Nama dapat berubah pada tahap branding.

---

# 4. Product Principles

## 4.1 Photo Content Must Be Preserved

Editing V1 bersifat non-generative.

Sistem tidak boleh:

- Mengubah wajah
- Mengubah bentuk objek
- Menambahkan objek
- Menghapus objek
- Mengganti background
- Mengubah pose

Match Reference hanya memindahkan karakter color grading.

---

## 4.2 Non-Destructive Editing

Original image tidak boleh dimodifikasi secara permanen selama proses editing.

Adjustment disimpan sebagai parameter.

Contoh:

```json
{
  "exposure": 0.25,
  "contrast": -10,
  "temperature": 12,
  "saturation": -5
}
```

User harus selalu dapat:

- Undo
- Redo
- Reset
- Compare dengan original

---

## 4.3 Local-First Processing

Jika memungkinkan, image processing dilakukan sepenuhnya di browser.

Foto tidak dikirim ke backend hanya untuk melakukan adjustment.

Laravel terutama digunakan sebagai application shell dan untuk kemampuan server-side yang memang diperlukan.

---

# 5. Target Users

## Primary Users

Casual photographer dan social media user yang ingin membuat foto terlihat lebih menarik tanpa mempelajari software editing profesional.

Contoh:

- Instagram user
- Content creator
- Traveler
- Wedding attendee
- Small business owner
- Personal photographer

## Secondary Users

Pengguna yang sudah memahami basic photo editing dan ingin melakukan grading cepat melalui browser.

---

# 6. Primary User Journey

## Standard Editing

```text
Landing Page
     ↓
Upload Photo
     ↓
Editor
     ↓
Adjust / Preset
     ↓
Fine Tune
     ↓
Crop / Frame
     ↓
Export
```

## Reference Matching

```text
Upload Target Photo
     ↓
Open Match Reference
     ↓
Upload Reference Photo
     ↓
Analyze Reference
     ↓
Apply Suggested Grade
     ↓
Adjust Match Intensity
     ↓
Fine Tune
     ↓
Export
```

---

# 7. V1 Feature Scope

# 7.1 Image Import

Supported formats:

- JPG / JPEG
- PNG
- WebP

User dapat:

- Drag & drop
- Browse file
- Replace image

Application harus melakukan validasi format file.

File size limit harus dibuat cukup aman untuk browser tetapi tidak terlalu membatasi foto smartphone modern.

---

# 7.2 Basic Adjustments

Editor menyediakan adjustment berikut.

### Light

- Exposure / Brightness
- Contrast
- Highlights
- Shadows
- Whites
- Blacks

### Color

- Temperature
- Tint
- Saturation

### Effects

- Fade
- Grain
- Vignette

### Detail

- Sharpen

Semua adjustment menggunakan slider.

Default neutral value:

```text
0
```

Slider harus memberikan visual feedback secara real-time.

User dapat melakukan reset terhadap satu adjustment tanpa me-reset seluruh edit.

---

# 7.3 HSL

User dapat melakukan adjustment berdasarkan kelompok warna.

Minimum supported colors:

- Red
- Orange
- Yellow
- Green
- Aqua
- Blue
- Purple
- Magenta

Untuk setiap warna tersedia:

- Hue
- Saturation
- Luminance

HSL merupakan bagian penting dari color grading dan Match Reference.

---

# 7.4 Presets

Photo Editor menyediakan sekitar **12 built-in presets**.

Preset tidak boleh menggunakan nama proprietary milik aplikasi photo editing lain.

Contoh kategori:

### Essential

- Natural
- Clean
- Soft
- Vivid

### Film

- Warm Film
- Faded Film
- Cool Film
- Vintage

### Mood

- Moody
- Golden
- Pastel

### Monochrome

- Classic B&W

Nama dan formula preset dapat berubah selama development.

Setiap preset memiliki:

**Preset Intensity**

```text
0% ————————— 100%
```

Setelah preset diterapkan, user tetap dapat mengubah adjustment secara manual.

---

# 7.5 Save Custom Preset

User dapat menyimpan adjustment saat ini sebagai preset pribadi.

Contoh:

```text
My Wedding Look
```

Preset disimpan secara lokal menggunakan:

- LocalStorage

atau

- IndexedDB

Tidak diperlukan account untuk V1.

Custom preset harus dapat:

- Apply
- Rename
- Delete

---

# 7.6 Copy / Paste Edit

User dapat menyalin seluruh adjustment dari sebuah edit.

Contoh:

```text
Photo A
↓
Copy Edit
↓
Photo B
↓
Paste Edit
```

Copy Edit menyalin parameter secara persis.

Fitur ini berbeda dengan Match Reference.

---

# 7.7 Match Reference

Match Reference merupakan hero feature Photo Editor.

User menyediakan:

```text
TARGET PHOTO
foto yang sedang diedit

REFERENCE PHOTO
foto dengan color grading yang ingin ditiru
```

Application kemudian menganalisis reference image.

Potential characteristics yang dianalisis:

- Exposure distribution
- Contrast
- White balance
- Temperature
- Tint
- Saturation
- Tone distribution
- Highlight behavior
- Shadow behavior
- Color distribution
- HSL tendencies
- Tone curve
- Black level

Sistem kemudian menghasilkan adjustment yang mencoba mendekati grading reference.

---

# 8. Match Reference Requirements

## 8.1 Non-Generative

Match Reference tidak boleh mengubah content foto.

Only color and tonal characteristics may be modified.

---

## 8.2 Editable Result

Hasil Match Reference harus diterjemahkan ke parameter editor sejauh memungkinkan.

Contoh:

```text
Temperature     +12
Tint             +3
Contrast         -8
Highlights      -20
Shadows         +12
Saturation       -6
```

User kemudian dapat melakukan fine tuning.

---

## 8.3 Match Intensity

User dapat menentukan seberapa kuat grading reference diterapkan.

```text
Original                         Full Match

0% ───────────────────────────── 100%
```

Default:

```text
100%
```

---

## 8.4 Reference Preview

Saat melakukan Match Reference, UI menampilkan:

```text
YOUR PHOTO

[ Target ]

REFERENCE

[ Reference ]
```

Reference hanya digunakan sebagai visual/style source.

---

## 8.5 Expected Limitation

Photo Editor tidak menjanjikan hasil identik dengan reference.

Perbedaan berikut dapat memengaruhi hasil:

- Lighting
- Camera
- Exposure
- Environment
- Skin tone
- Time of day
- Dynamic range

UI tidak boleh memberikan klaim bahwa hasil akan identik.

Goal:

> Reproduce the overall color grading character of the reference.

---

# 9. Crop & Transform

User dapat:

- Crop
- Rotate
- Flip horizontal
- Flip vertical

Supported aspect ratios:

- Original
- Free
- 1:1
- 4:5
- 9:16
- 16:9

Crop tidak boleh menurunkan kualitas original image sebelum export.

---

# 10. Frame

User dapat menambahkan frame.

V1 menyediakan:

- None
- White
- Black

User dapat mengatur:

**Frame Size**

Frame dapat digunakan untuk menempatkan foto pada canvas dengan aspect ratio tertentu tanpa cropping.

Contoh:

Landscape image

→

4:5 white canvas

→

Photo centered inside canvas.

---

# 11. Before / After

User harus dapat membandingkan hasil edit dengan original.

Desktop:

- Click-and-hold Before button

Mobile:

- Press-and-hold preview

Ketika dilepas, preview kembali ke edited image.

Original image tidak berubah.

---

# 12. Undo / Redo

Application menyimpan edit history.

User dapat:

- Undo
- Redo

History mencakup perubahan seperti:

- Adjustment
- Preset
- Match Reference
- Crop
- Frame

Tidak perlu menyimpan history setelah browser session berakhir.

---

# 13. Reset

Tersedia:

**Reset Adjustment**

dan

**Reset All**

Reset All mengembalikan foto ke kondisi original.

Application harus meminta confirmation sebelum Reset All jika terdapat edit yang belum diexport.

---

# 14. Export

Supported formats:

- JPG
- PNG
- WebP

User dapat memilih:

### Resolution

- Original
- Instagram Portrait — 1080 × 1350
- Instagram Square — 1080 × 1080
- Story — 1080 × 1920

### Quality

Untuk JPG/WebP:

```text
Low ←────────────→ Maximum
```

Default harus menjaga kualitas visual yang baik.

Export tidak boleh memberikan watermark.

---

# 15. Histogram

Jika performa memungkinkan, editor menyediakan histogram kecil.

Minimum:

- Luminance histogram

Optional:

- RGB histogram

Histogram bersifat supporting feature dan tidak boleh mengganggu editing experience.

Jika implementasinya menyebabkan complexity atau performance issue signifikan, fitur dapat dipindahkan setelah V1.

---

# 16. Responsive Experience

Photo Editor harus usable di:

- Desktop
- Tablet
- Smartphone

Desktop dapat menggunakan layout multi-panel.

Mobile harus menggunakan interface yang lebih compact, misalnya bottom toolbar / bottom sheet.

Editing canvas tetap menjadi fokus utama layar.

---

# 17. Privacy

Jika semua processing dilakukan client-side, landing page/editor dapat menampilkan pesan:

> **Your photos stay on your device.**

Jangan membuat klaim tersebut jika terdapat proses yang mengunggah foto ke server.

V1 sebaiknya dirancang agar target dan reference image tetap berada di browser.

---

# 18. Performance

Editor harus terasa real-time.

Target interaction:

- Slider memberikan preview tanpa noticeable delay.
- UI tidak freeze saat adjustment.
- Full-resolution processing tidak harus dilakukan pada setiap slider movement.

Recommended strategy:

```text
Original Full Resolution
        ↓
Preview Resolution
        ↓
Real-Time Editing
        ↓
Export
        ↓
Render Full Resolution
```

Preview boleh menggunakan image resolution lebih rendah selama export menggunakan kualitas yang sesuai.

---

# 19. Technical Direction

Backend:

```text
Laravel
```

Frontend direction:

```text
Blade
Tailwind CSS
Alpine.js
JavaScript
Canvas / WebGL
```

Local persistence:

```text
LocalStorage / IndexedDB
```

Laravel dapat menangani:

- Routing
- Landing page
- Static content
- Future APIs
- Future preset sharing
- Future authentication

Image adjustment tidak boleh bergantung pada server request untuk setiap interaction.

Final technical architecture ditentukan pada `design.md`.

---

# 20. Pages

Minimum routes:

```text
/
```

Landing page.

```text
/editor
```

Photo editor.

Future routes dapat meliputi:

```text
/presets
/preset/{slug}
```

Namun public preset sharing bukan requirement V1.

---

# 21. Landing Page

Landing page harus menjelaskan value proposition dengan cepat.

Suggested hero:

> **Beautiful color grading. Right in your browser.**

Supporting message:

> Edit your photos, create your own presets, or match the color grade of a reference photo.

Primary CTA:

> **Edit a Photo**

Secondary emphasis:

> Free · No signup · No watermark

Landing page harus memperlihatkan kemampuan Match Reference sebagai differentiator utama.

---

# 22. Editor Information Architecture

Desktop conceptual layout:

```text
┌──────────────────────────────────────────────────────┐
│ Logo                     Undo  Redo        Export    │
├──────────────┬─────────────────────────┬─────────────┤
│              │                         │             │
│   Tools      │                         │ Adjustments │
│              │        PHOTO            │             │
│ Adjust       │                         │ Exposure    │
│ Presets      │                         │ Contrast    │
│ Match        │                         │ Highlights  │
│ Crop         │                         │ ...         │
│ Frame        │                         │             │
│              │                         │             │
├──────────────┴─────────────────────────┴─────────────┤
│                  Before / After                     │
└──────────────────────────────────────────────────────┘
```

Ini hanya information architecture.

Visual design final ditentukan di `design.md`.

---

# 23. V1 Non-Goals

V1 tidak mencakup:

- User authentication
- Subscription
- Payment
- Cloud photo storage
- Social feed
- Comments
- Public profile
- Layers
- Text editor
- Sticker
- Drawing
- Masking
- Selective adjustment
- Healing brush
- Object removal
- Background removal
- Generative fill
- Face retouching
- AI image generation
- Complex RAW development
- Collaborative editing
- Native mobile application

Fitur tersebut tidak boleh ditambahkan selama V1 kecuali requirement diubah secara eksplisit.

---

# 24. Success Criteria

V1 dianggap berhasil jika user dapat:

1. Membuka Photo Editor tanpa login.
2. Upload foto.
3. Melakukan basic color adjustment secara real-time.
4. Menggunakan preset.
5. Menyimpan custom preset.
6. Mengunggah reference image.
7. Melakukan Match Reference.
8. Mengubah Match Intensity.
9. Fine-tune hasil Match Reference.
10. Crop atau menambahkan frame.
11. Membandingkan Before / After.
12. Undo / Redo.
13. Export hasil tanpa watermark.
14. Melakukan semua core workflow tanpa foto harus meninggalkan browser.

---

# 25. V1 Priority

## P0 — Core Editor

- Image upload
- Editing canvas
- Exposure
- Contrast
- Highlights
- Shadows
- Whites
- Blacks
- Temperature
- Tint
- Saturation
- Crop
- Export
- Undo / Redo
- Before / After

## P1 — Color Grading Experience

- HSL
- Fade
- Grain
- Vignette
- Sharpen
- Built-in presets
- Preset intensity
- Custom presets
- Frame

## P2 — Differentiator

- Match Reference
- Match Intensity
- Reference preview
- Copy / Paste Edit

Match Reference merupakan hero feature produk, tetapi dikembangkan setelah rendering pipeline dasar stabil.

---

# 26. Development Milestones

## M0 — Foundation

- Laravel project
- Frontend structure
- Responsive application shell
- Landing page
- Editor route

## M1 — Image Engine

- Image upload
- Canvas rendering
- Preview pipeline
- Basic adjustment engine
- Undo / Redo
- Before / After

## M2 — Grading

- Advanced tonal adjustment
- HSL
- Effects
- Presets
- Preset intensity
- Custom preset storage

## M3 — Composition

- Crop
- Rotate
- Flip
- Aspect ratio
- White / black frame

## M4 — Match Reference

- Reference upload
- Reference analysis
- Color / tone matching
- Parameter translation
- Match intensity
- Fine tuning

## M5 — Export & Polish

- JPG / PNG / WebP
- Export quality
- Social-media resolutions
- Mobile UX
- Performance optimization
- Error handling
- Privacy messaging

---

# 27. Future Opportunities

Setelah V1 tervalidasi, beberapa pengembangan yang dapat dipertimbangkan:

### Better Reference Matching

- Advanced tone curve matching
- Local color analysis
- Semantic-aware grading
- Skin-aware color preservation
- Sky / vegetation-aware adjustment

### Preset Ecosystem

- Share preset via URL
- Import/export preset
- Community presets
- Preset QR/code

### Workflow

- Batch editing
- Apply edit to multiple photos
- Compare multiple variants

### Professional Features

- Curves
- Color wheels
- LUT import/export
- RAW support

### Accounts

Account hanya diperkenalkan jika terdapat kebutuhan nyata seperti:

- Cloud presets
- Edit history
- Cross-device synchronization

---

# 28. Guiding Rule

Jika terdapat usulan fitur baru selama development, gunakan pertanyaan berikut:

> **Apakah fitur ini membuat proses color grading, reference matching, atau exporting foto menjadi secara signifikan lebih baik?**

Jika tidak, fitur tersebut sebaiknya tidak masuk V1.

V1 harus tetap menjadi:

> **A fast, free, browser-based photo editor focused on beautiful color grading and reference matching.**