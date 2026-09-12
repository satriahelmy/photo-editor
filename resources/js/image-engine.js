export const MAX_FILE_BYTES = 30 * 1024 * 1024;
export const MAX_SOURCE_DIMENSION = 12000;
export const PREVIEW_MAX_DIMENSION = 1800;

export const SUPPORTED_IMAGE_TYPES = Object.freeze([
    'image/jpeg',
    'image/png',
    'image/webp',
]);

const SUPPORTED_IMAGE_EXTENSIONS = Object.freeze(['jpg', 'jpeg', 'png', 'webp']);

export const ADJUSTMENT_DEFINITIONS = Object.freeze([
    { key: 'exposure', label: 'Exposure', min: -2, max: 2, step: 0.01, precision: 2, section: 'Light', group: 'adjustments' },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, precision: 0, section: 'Light', group: 'adjustments' },
    { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, precision: 0, section: 'Light', group: 'adjustments' },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, precision: 0, section: 'Light', group: 'adjustments' },
    { key: 'whites', label: 'Whites', min: -100, max: 100, step: 1, precision: 0, section: 'Light', group: 'adjustments' },
    { key: 'blacks', label: 'Blacks', min: -100, max: 100, step: 1, precision: 0, section: 'Light', group: 'adjustments' },
    { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, precision: 0, section: 'Color', group: 'adjustments' },
    { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, precision: 0, section: 'Color', group: 'adjustments' },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, precision: 0, section: 'Color', group: 'adjustments' },
]);

export const HSL_COLOR_DEFINITIONS = Object.freeze([
    { id: 'red', label: 'Red', hue: 0, dot: '#d46f68' },
    { id: 'orange', label: 'Orange', hue: 30, dot: '#d69a62' },
    { id: 'yellow', label: 'Yellow', hue: 60, dot: '#d2c477' },
    { id: 'green', label: 'Green', hue: 120, dot: '#91b083' },
    { id: 'aqua', label: 'Aqua', hue: 180, dot: '#77b4ad' },
    { id: 'blue', label: 'Blue', hue: 240, dot: '#7192c4' },
    { id: 'purple', label: 'Purple', hue: 280, dot: '#a18ab9' },
    { id: 'magenta', label: 'Magenta', hue: 320, dot: '#c181a2' },
]);

export const HSL_CONTROL_DEFINITIONS = Object.freeze([
    { key: 'hue', label: 'Hue', min: -100, max: 100, step: 1, precision: 0, group: 'hsl' },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, precision: 0, group: 'hsl' },
    { key: 'luminance', label: 'Luminance', min: -100, max: 100, step: 1, precision: 0, group: 'hsl' },
]);

export const EFFECT_DEFINITIONS = Object.freeze([
    { key: 'fade', label: 'Fade', min: 0, max: 100, step: 1, precision: 0, group: 'effects' },
    { key: 'grain', label: 'Grain', min: 0, max: 100, step: 1, precision: 0, group: 'effects' },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, precision: 0, group: 'effects' },
]);

export const DETAIL_DEFINITIONS = Object.freeze([
    { key: 'sharpen', label: 'Sharpen', min: 0, max: 100, step: 1, precision: 0, group: 'detail' },
]);

export const DEFAULT_ADJUSTMENTS = Object.freeze(
    Object.fromEntries(ADJUSTMENT_DEFINITIONS.map(({ key }) => [key, 0])),
);

export const DEFAULT_HSL = Object.freeze(
    Object.fromEntries(HSL_COLOR_DEFINITIONS.map(({ id }) => [id, { hue: 0, saturation: 0, luminance: 0 }])),
);

export const DEFAULT_EFFECTS = Object.freeze({ fade: 0, grain: 0, vignette: 0 });
export const DEFAULT_DETAIL = Object.freeze({ sharpen: 0 });

const preset = (id, name, adjustments = {}, effects = {}, detail = {}) => ({
    id,
    name,
    adjustments: { ...DEFAULT_ADJUSTMENTS, ...adjustments },
    hsl: structuredClone(DEFAULT_HSL),
    effects: { ...DEFAULT_EFFECTS, ...effects },
    detail: { ...DEFAULT_DETAIL, ...detail },
});

export const BUILT_IN_PRESETS = Object.freeze([
    preset('natural', 'Natural', { contrast: 4, shadows: 5, saturation: 3 }),
    preset('clean', 'Clean', { exposure: 0.12, contrast: 8, highlights: -4, saturation: 2 }),
    preset('soft', 'Soft', { contrast: -12, highlights: -10, shadows: 12, saturation: -4 }, { fade: 8 }),
    preset('vivid', 'Vivid', { contrast: 12, highlights: 4, shadows: -4, saturation: 18 }),
    preset('warm-film', 'Warm Film', { temperature: 24, contrast: -4, highlights: -8, shadows: 8, saturation: 5 }, { fade: 10, grain: 8 }),
    preset('faded-film', 'Faded Film', { contrast: -14, highlights: -14, shadows: 14, saturation: -8 }, { fade: 30, grain: 12 }),
    preset('cool-film', 'Cool Film', { temperature: -24, tint: 4, contrast: 5, saturation: -3 }, { fade: 12, grain: 8 }),
    preset('vintage', 'Vintage', { temperature: 18, tint: 8, contrast: -10, saturation: -12 }, { fade: 24, grain: 18, vignette: 15 }),
    preset('moody', 'Moody', { exposure: -0.14, contrast: 18, highlights: -18, shadows: -12, saturation: -4 }, { vignette: 24 }),
    preset('golden', 'Golden', { exposure: 0.1, temperature: 32, highlights: 8, shadows: 4, saturation: 8 }, { vignette: 6 }),
    preset('pastel', 'Pastel', { exposure: 0.14, contrast: -18, highlights: -8, shadows: 16, saturation: -12 }, { fade: 15 }),
    preset('classic-bw', 'Classic B&W', { contrast: 14, saturation: -100 }, { grain: 7, vignette: 9 }),
]);

export function createDefaultEditState() {
    return {
        version: 2,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        hsl: structuredClone(DEFAULT_HSL),
        effects: { ...DEFAULT_EFFECTS },
        detail: { ...DEFAULT_DETAIL },
        preset: { id: null, intensity: 100 },
    };
}

export function cloneEditState(state) {
    const fallback = createDefaultEditState();

    return {
        version: state.version ?? 2,
        adjustments: { ...fallback.adjustments, ...state.adjustments },
        hsl: Object.fromEntries(HSL_COLOR_DEFINITIONS.map(({ id }) => [
            id,
            { ...fallback.hsl[id], ...(state.hsl?.[id] ?? {}) },
        ])),
        effects: { ...fallback.effects, ...state.effects },
        detail: { ...fallback.detail, ...state.detail },
        preset: { ...fallback.preset, ...state.preset },
    };
}

export function editStatesEqual(left, right) {
    const leftState = cloneEditState(left);
    const rightState = cloneEditState(right);

    leftState.preset = { id: null, intensity: 100 };
    rightState.preset = { id: null, intensity: 100 };

    return JSON.stringify(leftState) === JSON.stringify(rightState);
}

export function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}

export function formatAdjustmentValue(value, precision = 0) {
    const fixed = Number(value).toFixed(precision);
    const normalized = Number(fixed);

    if (normalized === 0) return precision > 0 ? (0).toFixed(precision) : '0';

    return normalized > 0 ? `+${fixed}` : fixed;
}

export function validateImageFile(file) {
    const extension = file?.name?.split('.').pop()?.toLowerCase();

    if (!file || !SUPPORTED_IMAGE_TYPES.includes(file.type) || !SUPPORTED_IMAGE_EXTENSIONS.includes(extension)) {
        return { valid: false, error: "This image couldn't be opened. Try a JPG, PNG, or WebP file." };
    }

    if (file.size > MAX_FILE_BYTES) {
        return { valid: false, error: 'This image is too large. Try a file smaller than 30 MB.' };
    }

    return { valid: true, error: '' };
}

export function getPreviewSize(width, height, maxDimension = PREVIEW_MAX_DIMENSION) {
    const scale = Math.min(1, maxDimension / Math.max(width, height));

    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
        scale,
    };
}

export function interpolateEditStates(baseState, targetState, intensity = 1) {
    const base = cloneEditState(baseState);
    const target = cloneEditState(targetState);
    const amount = clamp(Number(intensity), 0, 1);
    const next = createDefaultEditState();

    for (const { key } of ADJUSTMENT_DEFINITIONS) {
        next.adjustments[key] = base.adjustments[key] + (target.adjustments[key] - base.adjustments[key]) * amount;
    }

    for (const { id } of HSL_COLOR_DEFINITIONS) {
        for (const { key } of HSL_CONTROL_DEFINITIONS) {
            next.hsl[id][key] = base.hsl[id][key] + (target.hsl[id][key] - base.hsl[id][key]) * amount;
        }
    }

    for (const { key } of EFFECT_DEFINITIONS) {
        next.effects[key] = base.effects[key] + (target.effects[key] - base.effects[key]) * amount;
    }

    for (const { key } of DETAIL_DEFINITIONS) {
        next.detail[key] = base.detail[key] + (target.detail[key] - base.detail[key]) * amount;
    }

    next.preset = { ...base.preset };

    return next;
}

function rgbToHsl(red, green, blue) {
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    const delta = max - min;

    if (delta === 0) return { hue: 0, saturation: 0, lightness };

    const saturation = delta / (1 - Math.abs(2 * lightness - 1));
    let hue;

    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;

    return { hue: (hue * 60 + 360) % 360, saturation, lightness };
}

function hslToRgb(hue, saturation, lightness) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const section = hue / 60;
    const x = chroma * (1 - Math.abs((section % 2) - 1));
    const match = lightness - chroma / 2;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (section < 1) [red, green, blue] = [chroma, x, 0];
    else if (section < 2) [red, green, blue] = [x, chroma, 0];
    else if (section < 3) [red, green, blue] = [0, chroma, x];
    else if (section < 4) [red, green, blue] = [0, x, chroma];
    else if (section < 5) [red, green, blue] = [x, 0, chroma];
    else [red, green, blue] = [chroma, 0, x];

    return [red + match, green + match, blue + match];
}

function hueDistance(left, right) {
    const distance = Math.abs(left - right) % 360;

    return Math.min(distance, 360 - distance);
}

function smoothstep(value) {
    const amount = clamp(value);

    return amount * amount * (3 - 2 * amount);
}

function hashNoise(x, y) {
    const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;

    return (value - Math.floor(value)) * 2 - 1;
}

function applyHsl(red, green, blue, hsl) {
    let color = rgbToHsl(red, green, blue);

    if (color.saturation < 0.01) return [red, green, blue];

    const selected = HSL_COLOR_DEFINITIONS.reduce((closest, definition) => {
        const distance = hueDistance(color.hue, definition.hue);

        return distance < closest.distance ? { definition, distance } : closest;
    }, { definition: HSL_COLOR_DEFINITIONS[0], distance: Infinity });
    const weight = smoothstep(1 - selected.distance / 62) * clamp(color.saturation * 2);
    const values = hsl?.[selected.definition.id] ?? { hue: 0, saturation: 0, luminance: 0 };
    const hueShift = clamp(Number(values.hue ?? 0), -100, 100) * 0.6 * weight;
    const saturationShift = clamp(Number(values.saturation ?? 0), -100, 100) / 100 * 0.85 * weight;
    const luminanceShift = clamp(Number(values.luminance ?? 0), -100, 100) / 100 * 0.5 * weight;

    color = {
        hue: (color.hue + hueShift + 360) % 360,
        saturation: clamp(color.saturation + saturationShift),
        lightness: clamp(color.lightness + luminanceShift),
    };

    return hslToRgb(color.hue, color.saturation, color.lightness);
}

function applySharpen(data, width, height, amount) {
    if (amount <= 0 || width < 3 || height < 3) return;

    const source = new Uint8ClampedArray(data);
    const strength = (amount / 100) * (data.length > 8_000_000 ? 0.45 : 0.75);

    for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
            const index = (y * width + x) * 4;
            const neighbors = [
                index - width * 4,
                index - 4,
                index + 4,
                index + width * 4,
            ];

            for (let channel = 0; channel < 3; channel += 1) {
                const center = source[index + channel];
                const average = neighbors.reduce((sum, neighbor) => sum + source[neighbor + channel], 0) / 4;

                data[index + channel] = clamp(Math.round(center + (center - average) * strength), 0, 255);
            }
        }
    }
}

export function applyAdjustmentsToPixels(data, adjustments, renderOptions = {}) {
    const exposure = Number(adjustments.exposure ?? 0);
    const contrast = Number(adjustments.contrast ?? 0) / 100;
    const highlights = Number(adjustments.highlights ?? 0) / 100;
    const shadows = Number(adjustments.shadows ?? 0) / 100;
    const whites = Number(adjustments.whites ?? 0) / 100;
    const blacks = Number(adjustments.blacks ?? 0) / 100;
    const temperature = Number(adjustments.temperature ?? 0) / 100;
    const tint = Number(adjustments.tint ?? 0) / 100;
    const saturation = Number(adjustments.saturation ?? 0) / 100;
    const hsl = renderOptions.hsl ?? DEFAULT_HSL;
    const effects = { ...DEFAULT_EFFECTS, ...(renderOptions.effects ?? {}) };
    const detail = { ...DEFAULT_DETAIL, ...(renderOptions.detail ?? {}) };
    const width = renderOptions.width ?? Math.max(1, Math.round(Math.sqrt(data.length / 4)));
    const height = renderOptions.height ?? Math.max(1, Math.ceil(data.length / 4 / width));
    const exposureFactor = 2 ** exposure;
    const contrastFactor = 1 + contrast;
    const fade = clamp(Number(effects.fade) / 100);
    const grain = clamp(Number(effects.grain) / 100);
    const vignette = clamp(Number(effects.vignette) / 100);
    const hasHslAdjustment = HSL_COLOR_DEFINITIONS.some(({ id }) => {
        const values = hsl?.[id];

        return values && (values.hue !== 0 || values.saturation !== 0 || values.luminance !== 0);
    });

    for (let index = 0; index < data.length; index += 4) {
        const pixel = index / 4;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        let red = data[index] / 255;
        let green = data[index + 1] / 255;
        let blue = data[index + 2] / 255;

        red *= exposureFactor;
        green *= exposureFactor;
        blue *= exposureFactor;

        red += temperature * 0.08;
        blue -= temperature * 0.08;
        red += tint * 0.035;
        green -= tint * 0.07;
        blue += tint * 0.035;

        red = (red - 0.5) * contrastFactor + 0.5;
        green = (green - 0.5) * contrastFactor + 0.5;
        blue = (blue - 0.5) * contrastFactor + 0.5;

        const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
        const shadowWeight = clamp(1 - luminance * 2);
        const highlightWeight = clamp((luminance - 0.5) * 2);
        const tonalLift = shadows * shadowWeight * 0.32 + highlights * highlightWeight * 0.32;
        const rangeLift = whites * highlightWeight * 0.18 + blacks * shadowWeight * 0.18;

        red += tonalLift + rangeLift;
        green += tonalLift + rangeLift;
        blue += tonalLift + rangeLift;

        const adjustedLuminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
        const saturationFactor = 1 + saturation;

        red = adjustedLuminance + (red - adjustedLuminance) * saturationFactor;
        green = adjustedLuminance + (green - adjustedLuminance) * saturationFactor;
        blue = adjustedLuminance + (blue - adjustedLuminance) * saturationFactor;

        if (hasHslAdjustment) [red, green, blue] = applyHsl(clamp(red), clamp(green), clamp(blue), hsl);

        if (fade > 0) {
            const fadeLift = fade * 0.2;
            const fadeContrast = 1 - fade * 0.16;

            red = (red - 0.5) * fadeContrast + 0.5 + fadeLift;
            green = (green - 0.5) * fadeContrast + 0.5 + fadeLift;
            blue = (blue - 0.5) * fadeContrast + 0.5 + fadeLift;
        }

        if (vignette > 0) {
            const centerX = width / 2;
            const centerY = height / 2;
            const normalizedDistance = Math.min(1, Math.hypot((x - centerX) / centerX, (y - centerY) / centerY) / Math.SQRT2);
            const vignetteFactor = 1 - smoothstep(normalizedDistance) * vignette * 0.55;

            red *= vignetteFactor;
            green *= vignetteFactor;
            blue *= vignetteFactor;
        }

        if (grain > 0) {
            const grainValue = hashNoise(x, y) * grain * 0.09;

            red += grainValue;
            green += grainValue;
            blue += grainValue;
        }

        data[index] = Math.round(clamp(red) * 255);
        data[index + 1] = Math.round(clamp(green) * 255);
        data[index + 2] = Math.round(clamp(blue) * 255);
    }

    applySharpen(data, width, height, Number(detail.sharpen ?? 0));

    return data;
}

export async function decodeImageFile(file) {
    if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

        if (bitmap.width > MAX_SOURCE_DIMENSION || bitmap.height > MAX_SOURCE_DIMENSION) {
            bitmap.close();
            throw new Error('This image has very large dimensions. Try a smaller photo.');
        }

        return bitmap;
    }

    const objectUrl = URL.createObjectURL(file);

    try {
        const image = await new Promise((resolve, reject) => {
            const element = new Image();

            element.decoding = 'async';
            element.onload = () => resolve(element);
            element.onerror = () => reject(new Error("This image couldn't be opened. Try a JPG, PNG, or WebP file."));
            element.src = objectUrl;
        });

        if (image.naturalWidth > MAX_SOURCE_DIMENSION || image.naturalHeight > MAX_SOURCE_DIMENSION) {
            throw new Error('This image has very large dimensions. Try a smaller photo.');
        }

        return image;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export function releaseImageSource(source) {
    if (source && typeof source.close === 'function') source.close();
}

export function renderPreview({ source, canvas, editState, original = false, maxDimension = PREVIEW_MAX_DIMENSION }) {
    const sourceWidth = source.width ?? source.naturalWidth;
    const sourceHeight = source.height ?? source.naturalHeight;
    const { width, height } = getPreviewSize(sourceWidth, sourceHeight, maxDimension);
    const context = canvas.getContext('2d', { alpha: true, willReadFrequently: true });

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.clearRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    if (!original) {
        const imageData = context.getImageData(0, 0, width, height);

        applyAdjustmentsToPixels(imageData.data, editState.adjustments, {
            width,
            height,
            hsl: editState.hsl,
            effects: editState.effects,
            detail: editState.detail,
        });
        context.putImageData(imageData, 0, 0);
    }

    return { width, height };
}
