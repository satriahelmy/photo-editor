# Photo Editor

Browser-based photo editor focused on fast, quiet color grading. The V1 experience is designed around:

`Upload → Adjust → Preset / Match Reference → Fine Tune → Crop / Frame → Export`

## Stack

- Laravel 12
- Blade
- Tailwind CSS 4
- Alpine.js
- Vite
- Canvas-based client-side image pipeline (M1)

## Local development

```bash
composer install
npm install
npm run dev
php artisan serve
```

Open `http://localhost:8000` for the landing page or `http://localhost:8000/editor` for the editor shell.

Run the current test and formatting checks with `composer test` and `vendor/bin/pint --test`.

## Product documents

- [`prd.md`](prd.md) — product requirements and V1 scope
- [`design.md`](design.md) — visual and interaction direction
- [`task.md`](task.md) — implementation checklist and Definition of Done

## Privacy direction

The editor is intended to keep target and reference photos in the browser. Any feature that would send image data to the server must be explicitly reviewed before implementation.
