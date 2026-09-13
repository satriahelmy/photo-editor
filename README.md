# Pancarona

Pancarona is a local-first photo editor for shaping a photo's color, tone, and visual character directly in the browser.

> Shape the look. Keep it local.

The main editing flow is:

`Open → Adjust → Preset / Match Reference → Fine-tune → Crop / Frame → Export`

## Features

- Light, color, HSL, effects, and detail adjustments.
- Built-in presets plus custom presets stored locally in the browser.
- Local Match Reference with intensity control and fine-tuning.
- Crop, rotate, flip, aspect-ratio presets, and frames.
- Copy and paste edit settings between photos.
- Undo/redo history, zoom, pan, and Before comparison.
- JPG, PNG, and WebP export with Original, Instagram Portrait, Instagram Square, and Story sizes.
- Full-resolution export with format-aware quality controls; JPEG exports flatten transparency to white.
- Keyboard-friendly controls, accessible labels, dialog focus handling, and reduced-motion support.

## Privacy and limits

Photos are decoded, analyzed, rendered, and exported in the browser. The current application has no image upload endpoint or image upload request flow. Custom presets use browser storage.

To keep editing responsive and avoid excessive resource use, source files are limited to:

- 30 MB per file.
- 12,000 pixels on either side.
- 60 megapixels total.

## Tech stack

- Laravel 12
- Blade
- Alpine.js
- Tailwind CSS 4
- Vite
- Canvas-based client-side image pipeline
- Lucide icons

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- PHP GD extension for generating QA fixtures

## Local development

Install the backend and frontend dependencies:

```bash
composer install
npm install
```

Create the local environment and application key if needed:

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
```

Run the application in two terminals:

```bash
npm run dev
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000) for the landing page or [http://localhost:8000/editor](http://localhost:8000/editor) for the editor.

For a production asset build:

```bash
npm run build
```

## Tests and quality checks

Run the JavaScript image-engine tests:

```bash
npm run test:js
```

Run the Laravel test suite and formatting checks:

```bash
composer test
vendor/bin/pint --test
```

Additional checks used during QA:

```bash
php artisan view:cache
git diff --check
```

## QA fixtures

Generate the local fixture set for portrait, square, transparent, and extreme-dimension cases:

```bash
php tests/fixtures/generate-qa-fixtures.php
```

The generated files are written to `tests/fixtures/` and are intended for local browser QA only.

## Product documents

- [`prd.md`](prd.md) — product requirements and V1 scope.
- [`design.md`](design.md) — visual and interaction direction.
- [`task.md`](task.md) — implementation checklist, QA record, and Definition of Done.
