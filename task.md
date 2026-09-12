# Photo Editor — Implementation Checklist

Checklist ini diturunkan dari `prd.md` dan `design.md`. Urutan mengikuti dependency teknis: rendering pipeline harus stabil sebelum fitur grading lanjutan dan `Match Reference` dibangun.

## Scope dan guardrails

- [ ] V1 tetap tanpa login, subscription, payment, cloud photo storage, watermark, dan upload foto ke server.
- [ ] V1 tetap non-generative: tidak ada perubahan wajah, bentuk objek, background, pose, object removal, masking, atau selective adjustment.
- [ ] Semua edit disimpan sebagai parameter; file original selalu immutable.
- [ ] Tidak menambahkan fitur non-goal seperti layers, text, sticker, drawing, RAW development kompleks, social feed, atau native mobile app.
- [ ] `Match Reference` hanya memindahkan karakter warna dan tonal; UI tidak boleh menjanjikan hasil identik dengan reference.

## Keputusan teknis yang harus dikunci sebelum implementasi

- [ ] Konfirmasi baseline Laravel, Blade, Tailwind CSS, Alpine.js, dan JavaScript yang tersedia di project.
- [ ] Pilih renderer V1 berdasarkan benchmark kecil: mulai dengan Canvas 2D/ImageData; gunakan WebGL hanya jika target performa tidak tercapai.
- [ ] Bungkus renderer di interface yang terpisah dari UI agar Canvas 2D dapat diganti tanpa menulis ulang state dan control.
- [ ] Definisikan schema edit yang versioned, minimal mencakup `adjustments`, `hsl`, `transform`, `crop`, `frame`, `preset`, dan metadata dirty/export.
- [ ] Tetapkan rentang, step, default, dan unit untuk semua slider. Semua nilai neutral harus `0`, kecuali `Match Intensity` yang default `100%` dan `Preset Intensity` yang memiliki behavior yang terdokumentasi.
- [ ] Tetapkan urutan pipeline render, minimal: source → transform/crop → tonal/color → HSL → effects/detail → frame/canvas → output.
- [ ] Tetapkan behavior ketika preset atau match diterapkan di atas edit yang sudah ada: apakah mengganti parameter, membuat layer/delta, atau menggabungkan parameter.
- [ ] Tetapkan batas ukuran file, batas dimensi, dan strategi downscale preview yang aman untuk browser tetapi tetap mendukung foto smartphone modern.
- [ ] Tetapkan browser support matrix dan capability fallback untuk Canvas, `createImageBitmap`, WebP encoding, pointer events, dan clipboard.
- [ ] Buat decision log singkat untuk keputusan di atas sebelum M1 selesai.

## M0 — Foundation

### Project dan routing

- [ ] Siapkan project Laravel dan struktur frontend sesuai stack yang disepakati.
- [ ] Tambahkan route `/` untuk landing page.
- [ ] Tambahkan route `/editor` untuk editor.
- [ ] Pastikan `/editor` dapat dibuka tanpa login dan tanpa parameter server-side yang wajib.
- [ ] Siapkan layout Blade minimal tanpa component explosion.
- [ ] Siapkan linting, formatting, dan test command yang dapat dijalankan secara konsisten.

### Design system dan shell

- [ ] Buat centralized design tokens untuk background, panel, surface, text, border, spacing, radius, dan motion.
- [ ] Terapkan tema dark neutral: app sekitar `#111111`, panel sekitar `#171717`, surface sekitar `#1D1D1D`; sesuaikan hanya bila hasil QA lebih baik.
- [ ] Gunakan Inter atau system sans-serif tunggal dengan hierarchy typography yang functional.
- [ ] Integrasikan satu icon system monochrome, misalnya Lucide, hanya untuk control yang memang membutuhkan icon.
- [ ] Buat application shell desktop: top bar, tool rail, image workspace terbesar, adjustment panel, dan bottom canvas controls.
- [ ] Buat top bar tinggi sekitar 52–60px dengan product mark/back, Undo, Redo, dan Export.
- [ ] Buat tool rail compact dengan Adjust, Presets, Match, Crop, dan Frame; selected state subtle tanpa large card.
- [ ] Buat panel kanan 280–340px yang scrollable secara independen.
- [ ] Buat empty editor state: “Drop a photo here”, browse alternative, dan “JPG, PNG or WebP”.
- [ ] Buat komponen control dasar yang reusable secukupnya: button, segmented control, slider row, section/collapse, dialog, file dropzone, dan toast/status message.
- [ ] Pastikan control tidak memakai gradient, glow, glassmorphism, giant pill, dekorasi abstrak, atau shadow yang tidak diperlukan.

### Landing page

- [ ] Bangun hero dengan copy utama “Beautiful color grading. Right in your browser.” dan CTA “Edit a Photo”.
- [ ] Tampilkan pesan “Free · No signup · No watermark” tanpa fake social proof.
- [ ] Tampilkan product preview/editor visual sebagai hero visual, bukan abstract illustration.
- [ ] Tambahkan section product demo / before-after dengan draggable divider.
- [ ] Tambahkan section Match Reference dengan visual storytelling target → reference → matched result.
- [ ] Tambahkan section presets, privacy, CTA, dan footer dengan copy ringkas.
- [ ] Gunakan foto editorial/lifestyle yang sah dipakai dan menunjukkan manfaat color grading; jangan gunakan placeholder, corporate stock generik, atau artwork AI.
- [ ] Tampilkan privacy message “Your photos stay on your device.” hanya setelah alur client-side diverifikasi.
- [ ] Pastikan CTA landing mengarah ke `/editor`.

## M1 — Image Engine dan Core Editor (P0)

### Import dan lifecycle image

- [ ] Implementasikan input file untuk JPG/JPEG, PNG, dan WebP.
- [ ] Implementasikan drag-and-drop dan browse alternative yang sama-sama dapat digunakan keyboard.
- [ ] Validasi MIME/content file, ekstensi, ukuran, dan dimensi; tampilkan error direct jika file tidak dapat dibuka.
- [ ] Implementasikan replace image dengan konfirmasi/behavior yang tidak menghilangkan pekerjaan secara tidak sengaja.
- [ ] Simpan original sebagai source immutable di memory browser; jangan mengirim target ke Laravel.
- [ ] Buat preview source yang di-downscale dengan mempertahankan aspect ratio.
- [ ] Revoke object URL dan release bitmap/canvas resource saat image diganti atau editor ditutup.

### State dan renderer

- [ ] Implementasikan single source of truth untuk edit state dan derived render state.
- [ ] Pisahkan original, preview, edited preview, dan export render.
- [ ] Implementasikan renderer yang menerima image source + parameter dan menghasilkan preview canvas.
- [ ] Implementasikan fit-to-workspace dengan aspect ratio yang benar.
- [ ] Implementasikan zoom in, zoom out, zoom percentage, Fit, dan pan tanpa mengubah pixel source.
- [ ] Gunakan `requestAnimationFrame`/strategi setara agar slider tidak memicu render berulang yang tidak perlu.
- [ ] Pastikan canvas tetap menjadi area visual terbesar dan tidak diberi dekorasi yang mengganggu foto.

### Basic adjustments

- [ ] Implementasikan section Light: Exposure/Brightness, Contrast, Highlights, Shadows, Whites, Blacks.
- [ ] Implementasikan section Color: Temperature, Tint, Saturation.
- [ ] Render semua adjustment secara real-time pada preview resolution.
- [ ] Pastikan setiap adjustment memiliki label, numeric value, neutral default, min/max, step, dan reset per-control.
- [ ] Buat slider thin dengan handle jelas, appearance neutral, value visible, dan keyboard arrow support.
- [ ] Implementasikan double-click/double-tap pada slider untuk mengembalikan nilai neutral.
- [ ] Pastikan slider touch target cukup besar di mobile meskipun track visual tetap thin.
- [ ] Pastikan Exposure, contrast, temperature, dan parameter lain menggunakan color/tone math yang konsisten dan diuji.

### Before / After, reset, dan history

- [ ] Implementasikan Before/After press-and-hold di desktop.
- [ ] Implementasikan Before/After press-and-hold pada preview di mobile.
- [ ] Saat ditahan, tampilkan original sesuai behavior yang disepakati; saat dilepas, kembali ke edited preview secara instant.
- [ ] Implementasikan Undo dan Redo untuk adjustment.
- [ ] Coalesce perubahan slider dalam satu gesture menjadi satu history entry, bukan satu entry per pointer movement.
- [ ] Invalidate redo stack ketika user membuat perubahan baru setelah Undo.
- [ ] Implementasikan Reset Adjustment untuk satu control/section sesuai konteks aktif.
- [ ] Implementasikan Reset All ke kondisi original.
- [ ] Minta konfirmasi sebelum Reset All bila ada edit yang belum diexport.
- [ ] Tampilkan disabled state yang jelas saat Undo/Redo tidak tersedia.
- [ ] Jangan persist history setelah browser session berakhir.

## M2 — Color Grading Experience (P1)

### HSL

- [ ] Implementasikan selector 8 warna: Red, Orange, Yellow, Green, Aqua, Blue, Purple, Magenta.
- [ ] Gunakan color dots hanya sebagai control/data representation, bukan dekorasi.
- [ ] Implementasikan Hue, Saturation, dan Luminance untuk setiap warna.
- [ ] Pastikan color selector dan setiap slider memiliki accessible label serta state yang tidak hanya dibedakan oleh warna.
- [ ] Integrasikan HSL ke pipeline renderer dan history.
- [ ] Tambahkan test untuk wrap Hue, clamp value, dan neutral HSL output.

### Effects dan detail

- [ ] Implementasikan Fade.
- [ ] Implementasikan Grain dengan noise yang stabil selama slider tidak berubah; hindari grain yang berkedip di setiap render.
- [ ] Implementasikan Vignette.
- [ ] Implementasikan Sharpen dengan fallback/guard agar tidak membuat preview terlalu lambat.
- [ ] Integrasikan Effects dan Detail ke reset per-control, Undo/Redo, Before/After, serta export.

### Built-in presets

- [ ] Definisikan sekitar 12 built-in presets dengan nama non-proprietary: Natural, Clean, Soft, Vivid, Warm Film, Faded Film, Cool Film, Vintage, Moody, Golden, Pastel, dan Classic B&W atau formula final yang disepakati.
- [ ] Simpan formula preset dalam data terstruktur, bukan hardcode tersebar di template.
- [ ] Implementasikan Preset Intensity 0–100% sebagai interpolasi yang deterministik.
- [ ] Tetapkan dan uji behavior intensity 0% (neutral/current sesuai keputusan) dan 100% (full preset).
- [ ] Setelah preset diterapkan, pastikan user dapat fine-tune semua adjustment secara manual.
- [ ] Tampilkan preset dalam thumbnail foto yang sama dengan image user sehingga hasil efek benar-benar terlihat.
- [ ] Buat layout thumbnail 2–3 kolom sesuai lebar panel.
- [ ] Tampilkan selected preset dengan subtle outline, bukan gradient/color card.

### Custom preset lokal

- [ ] Pilih LocalStorage atau IndexedDB berdasarkan ukuran schema dan kebutuhan evolusi; dokumentasikan keputusan.
- [ ] Buat schema custom preset versioned yang menyimpan adjustment/HSL/effect yang relevan, nama, id, dan timestamps.
- [ ] Implementasikan Save Custom Preset dengan nama user, termasuk validasi nama kosong/duplikat.
- [ ] Implementasikan Apply custom preset.
- [ ] Implementasikan Rename custom preset.
- [ ] Implementasikan Delete custom preset dengan konfirmasi bila perlu.
- [ ] Tangani data storage yang rusak, penuh, atau berasal dari schema lama tanpa membuat editor crash.

## M3 — Composition (P0/P1)

### Crop dan transform

- [ ] Implementasikan crop overlay langsung pada canvas.
- [ ] Implementasikan mode Original, Free, 1:1, 4:5, 9:16, dan 16:9.
- [ ] Implementasikan drag/resize crop area dengan pointer dan touch.
- [ ] Implementasikan Rotate kiri/kanan.
- [ ] Implementasikan Flip horizontal dan vertical.
- [ ] Pastikan transform/crop tidak merusak original dan tidak melakukan downscale permanen sebelum export.
- [ ] Integrasikan crop, rotate, flip, dan aspect ratio ke history serta Reset All.
- [ ] Pastikan crop overlay memiliki keyboard/fallback control yang masuk akal atau documented limitation bila interaksi murni pointer tidak dapat digantikan.

### Frame

- [ ] Implementasikan frame None, White, dan Black.
- [ ] Implementasikan Frame Size slider dengan preview real-time.
- [ ] Implementasikan canvas ratio Original, 1:1, 4:5, dan 9:16.
- [ ] Center-kan foto dalam canvas frame tanpa cropping ketika behavior frame dipilih.
- [ ] Pastikan white frame benar-benar white dan black frame benar-benar black.
- [ ] Integrasikan frame ke state, history, Before/After, dan export.

### Copy / Paste Edit (P2)

- [ ] Implementasikan Copy Edit sebagai salinan parameter edit yang immutable.
- [ ] Implementasikan Paste Edit ke target image lain tanpa menyalin source/reference image.
- [ ] Tampilkan feedback subtle saat copy/paste berhasil atau clipboard edit belum tersedia.
- [ ] Pastikan Copy/Paste berbeda secara behavior dari Match Reference.

## M4 — Match Reference (P2 / hero feature)

### Reference lifecycle dan UI

- [ ] Implementasikan upload reference JPG/JPEG, PNG, dan WebP secara client-side.
- [ ] Tampilkan preview target dan reference secara berdampingan di panel Match.
- [ ] Sediakan dropzone dan browse alternative untuk reference.
- [ ] Implementasikan Remove Reference dan pembersihan resource reference.
- [ ] Pastikan reference hanya menjadi visual/style source dan tidak ikut masuk ke export target.
- [ ] Tampilkan limitation yang jelas: hasil mereproduksi karakter color grading, bukan menjamin hasil identik.
- [ ] Saat processing berlangsung, tampilkan hanya status nyata seperti “Matching color grade…” dengan spinner subtle.
- [ ] Hindari AI sparkle, AI gradient, “Powered by AI”, magic wand animation, dan success modal besar.

### Analisis dan parameter translation

- [ ] Buat feature extractor lokal untuk luminance/exposure distribution, contrast, white balance, temperature/tint, saturation, tone distribution, highlight/shadow behavior, black level, channel/color distribution, dan HSL tendencies sesuai kemampuan renderer.
- [ ] Pilih dan dokumentasikan metode analisis: histogram/statistics/tone mapping atau pendekatan lain yang tetap non-generative.
- [ ] Implementasikan perbandingan feature target terhadap reference, bukan hanya menyalin nilai mentah reference.
- [ ] Terjemahkan hasil analisis menjadi parameter editor yang dapat diedit: minimal Temperature, Tint, Contrast, Highlights, Shadows, Saturation, dan HSL bila memungkinkan.
- [ ] Clamp hasil ke rentang slider dan simpan parameter match sebagai state yang dapat di-Undo/Redo.
- [ ] Pastikan operasi match tidak mengubah geometry/content foto.
- [ ] Uji kasus target/reference berbeda lighting, kamera, exposure, environment, skin tone, time of day, dan dynamic range.
- [ ] Tetapkan behavior jika reference terlalu kecil, transparan, rusak, atau analisis menghasilkan confidence rendah.

### Intensity dan fine tuning

- [ ] Terapkan Match Intensity default 100%.
- [ ] Interpolasikan hasil match terhadap state sebelum match sehingga 0% mengembalikan state sebelumnya dan 100% menerapkan full match.
- [ ] Pastikan perubahan intensity real-time dan tidak mengakumulasi match berulang kali.
- [ ] Tampilkan feedback “Grade matched” secara subtle beserta ringkasan parameter yang dihasilkan.
- [ ] Sediakan perpindahan langsung ke Adjust untuk fine tuning.
- [ ] Integrasikan Match Reference, Match Intensity, Remove Reference, dan fine tuning ke history dengan entry yang dapat dipahami user.
- [ ] Pastikan seluruh target/reference tetap berada di browser; audit network untuk memastikan tidak ada image upload.

## M5 — Export dan polish (P0)

### Export pipeline

- [ ] Buat focused Export modal sesuai design: format, size, quality, estimated size, Cancel, Export.
- [ ] Implementasikan output JPG, PNG, dan WebP.
- [ ] Implementasikan resolution Original, Instagram Portrait `1080×1350`, Instagram Square `1080×1080`, dan Story `1080×1920`.
- [ ] Tetapkan behavior resize/crop/frame ketika output ratio berbeda dari image.
- [ ] Implementasikan quality slider untuk JPG/WebP dengan default yang menjaga kualitas visual; disable/hide quality bila format PNG.
- [ ] Render full-resolution hanya saat export, dengan semua adjustment, HSL, effects, crop, transform, dan frame ikut diterapkan.
- [ ] Pastikan export tidak menambahkan watermark atau metadata yang tidak diperlukan.
- [ ] Download file dengan extension dan MIME type yang benar.
- [ ] Beri error yang direct jika full-resolution export gagal atau browser tidak mendukung format tertentu.
- [ ] Uji output pada image portrait, landscape, square, transparency, resolusi besar, serta semua format.

### Histogram (conditional)

- [ ] Benchmark biaya histogram sebelum memasukkannya ke editor.
- [ ] Jika tidak menimbulkan complexity/performance issue signifikan, tambahkan luminance histogram kecil yang supporting.
- [ ] Tambahkan RGB histogram hanya jika luminance histogram tidak mengganggu editing experience.
- [ ] Jika benchmark gagal, dokumentasikan histogram sebagai post-V1 dan jangan mengorbankan slider/canvas performance.

## Responsive, accessibility, dan states

- [ ] Implementasikan layout desktop multi-panel, tablet, dan mobile tanpa sekadar mengecilkan desktop.
- [ ] Pada mobile, gunakan bottom navigation untuk Adjust, Presets, Match, Crop, dan Frame.
- [ ] Tampilkan adjustment di bottom sheet/area aktif yang compact.
- [ ] Pastikan image tetap mendapat area terbesar dengan prioritas: image → active control → tool navigation → export → secondary information.
- [ ] Pastikan panel yang bisa scroll tidak mengunci scroll workspace secara tidak sengaja.
- [ ] Tambahkan visible focus states dan keyboard navigation ke semua interactive control.
- [ ] Tambahkan accessible label untuk button, icon button, file input, dialog, preset thumbnail, dan tool navigation.
- [ ] Pastikan slider mendukung Arrow keys, Home/End bila relevan, dan touch.
- [ ] Jangan mengandalkan warna saja untuk selected/active/error state.
- [ ] Pastikan semua drag/drop mempunyai browse alternative.
- [ ] Gunakan motion functional 120–200ms untuk panel, dropdown, modal, selected state, dan tool switching.
- [ ] Hormati reduced-motion preference bila ada animasi.
- [ ] Implementasikan loading hanya untuk operasi berat nyata seperti Match Reference dan full-resolution export.
- [ ] Implementasikan error state direct, misalnya “This image couldn't be opened. Try a JPG, PNG, or WebP file.”
- [ ] Pastikan dialog dapat ditutup dengan Escape, focus trap bekerja, dan focus kembali ke trigger.

## Performance, privacy, dan reliability

- [ ] Ukur waktu respons slider pada preview resolution di device desktop dan mobile representative.
- [ ] Pastikan slider tidak menampilkan loading indicator dan UI tidak freeze saat adjustment.
- [ ] Hindari full-resolution processing pada setiap pointer movement.
- [ ] Profiling memory untuk image besar, replace image, reference removal, undo/redo, dan export berulang.
- [ ] Pastikan object URL, ImageBitmap, canvas, worker, dan event listener dibersihkan saat tidak digunakan.
- [ ] Pastikan local-only workflow diverifikasi melalui browser network inspection sebelum menampilkan klaim privacy.
- [ ] Tambahkan guard terhadap file decompression/resource exhaustion yang dapat membuat browser tidak responsif.
- [ ] Pastikan kegagalan LocalStorage/IndexedDB tidak memblokir editing inti.
- [ ] Pastikan state edit tidak bocor antar tab/image tanpa behavior yang sengaja dirancang.

## Testing dan QA

### Automated tests

- [ ] Unit test parameter defaults, clamp, reset, interpolation intensity, dan serialization schema.
- [ ] Unit test renderer untuk adjustment neutral, kombinasi adjustment, HSL wrap/clamp, frame, crop, rotate, flip, dan output dimensions.
- [ ] Unit test history: add, undo, redo, coalescing slider, redo invalidation, Reset All, preset, crop, frame, dan match.
- [ ] Unit test preset storage: create, apply, rename, delete, invalid/corrupt data, dan schema migration.
- [ ] Test file validation untuk JPG/JPEG, PNG, WebP, file rusak, MIME palsu, ukuran terlalu besar, dan dimensi ekstrem.
- [ ] Test export format/extension/MIME, quality, social sizes, transparency, dan no-watermark invariant.
- [ ] Test Match Reference agar hanya mengubah color/tonal parameters dan tidak mengubah geometry/content.

### Integration dan manual QA

- [ ] E2E test workflow utama: landing → upload → adjust → preset → fine tune → crop/frame → export.
- [ ] E2E test workflow reference: upload target → upload reference → match → intensity → fine tune → export.
- [ ] E2E test Before/After hold, Undo/Redo, Reset confirmation, replace image, dan Copy/Paste Edit.
- [ ] Uji keyboard-only flow, focus order, Escape dialog, screen-reader labels, dan contrast.
- [ ] Uji drag/drop, browse, touch slider, crop gesture, pan, zoom, dan bottom sheet pada mobile.
- [ ] Uji landing draggable before/after demo pada pointer dan touch.
- [ ] Lakukan visual QA pada desktop, tablet, dan smartphone terhadap hierarchy, restraint, density, photography, dan authenticity dari `design.md`.
- [ ] Hapus placeholder UI, fake social proof, copy berlebihan, card yang tidak perlu, decorative gradient, glow, dan shadow yang tidak punya fungsi.
- [ ] Verifikasi bahwa foto tetap menjadi elemen paling dominan dan UI tidak memengaruhi persepsi grading.
- [ ] Jalankan production build dan smoke test `/` serta `/editor` dari build hasil deployment.

## Definition of Done V1

- [ ] User dapat membuka `/editor` tanpa login dan mengunggah JPG, PNG, atau WebP.
- [ ] User dapat melakukan semua P0 adjustment secara real-time, reset, Before/After, Undo/Redo, crop, dan export.
- [ ] User dapat menggunakan preset, HSL/effects, menyimpan custom preset lokal, frame, dan transform sesuai scope P1.
- [ ] User dapat mengunggah reference, melihat target/reference, menjalankan Match Reference, mengubah intensity, dan fine-tune hasilnya.
- [ ] User dapat melakukan Copy/Paste Edit.
- [ ] Export JPG/PNG/WebP dan social-media sizes bekerja tanpa watermark.
- [ ] Core workflow selesai tanpa foto meninggalkan browser.
- [ ] Responsive, accessibility, error handling, dan performance acceptance terpenuhi.
- [ ] Visual final lolos checklist “photography tool”, bukan generic SaaS template.
- [ ] Tidak ada fitur V1 non-goal yang ikut masuk tanpa perubahan requirement eksplisit.
