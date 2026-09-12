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
export const DEFAULT_TRANSFORM = Object.freeze({ rotation: 0, flipX: false, flipY: false });
export const DEFAULT_CROP = Object.freeze({ mode: 'original', x: 0, y: 0, width: 1, height: 1 });
export const DEFAULT_FRAME = Object.freeze({ style: 'none', size: 0, ratio: 'original' });
export const DEFAULT_MATCH = Object.freeze({ id: null, intensity: 100, confidence: 0 });

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
        version: 3,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        hsl: structuredClone(DEFAULT_HSL),
        effects: { ...DEFAULT_EFFECTS },
        detail: { ...DEFAULT_DETAIL },
        preset: { id: null, intensity: 100 },
        transform: { ...DEFAULT_TRANSFORM },
        crop: { ...DEFAULT_CROP },
        frame: { ...DEFAULT_FRAME },
        match: { ...DEFAULT_MATCH },
    };
}

export function cloneEditState(state) {
    const fallback = createDefaultEditState();

    return {
        version: state.version ?? 3,
        adjustments: { ...fallback.adjustments, ...state.adjustments },
        hsl: Object.fromEntries(HSL_COLOR_DEFINITIONS.map(({ id }) => [
            id,
            { ...fallback.hsl[id], ...(state.hsl?.[id] ?? {}) },
        ])),
        effects: { ...fallback.effects, ...state.effects },
        detail: { ...fallback.detail, ...state.detail },
        preset: { ...fallback.preset, ...state.preset },
        transform: { ...fallback.transform, ...state.transform },
        crop: { ...fallback.crop, ...state.crop },
        frame: { ...fallback.frame, ...state.frame },
        match: { ...fallback.match, ...state.match },
    };
}

export function editStatesEqual(left, right) {
    const leftState = cloneEditState(left);
    const rightState = cloneEditState(right);

    leftState.preset = { id: null, intensity: 100 };
    rightState.preset = { id: null, intensity: 100 };
    leftState.match = { ...DEFAULT_MATCH };
    rightState.match = { ...DEFAULT_MATCH };

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

export function extractImageFeatures(data, width, height) {
    const buckets = Object.fromEntries(HSL_COLOR_DEFINITIONS.map(({ id }) => [id, {
        count: 0,
        saturation: 0,
        luminance: 0,
        hueSin: 0,
        hueCos: 0,
    }]));
    const pixelCount = Math.max(1, Math.floor(data.length / 4));
    let luminanceSum = 0;
    let luminanceSquareSum = 0;
    let redSum = 0;
    let greenSum = 0;
    let blueSum = 0;
    let saturationSum = 0;
    let shadowSum = 0;
    let shadowCount = 0;
    let highlightSum = 0;
    let highlightCount = 0;
    let blackLevel = 1;
    let alphaSum = 0;

    for (let index = 0; index < data.length; index += 4) {
        const red = data[index] / 255;
        const green = data[index + 1] / 255;
        const blue = data[index + 2] / 255;
        alphaSum += (data[index + 3] ?? 255) / 255;
        const color = rgbToHsl(red, green, blue);
        const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

        luminanceSum += luminance;
        luminanceSquareSum += luminance * luminance;
        redSum += red;
        greenSum += green;
        blueSum += blue;
        saturationSum += color.saturation;
        blackLevel = Math.min(blackLevel, luminance);

        if (luminance < 0.35) {
            shadowSum += luminance;
            shadowCount += 1;
        }
        if (luminance > 0.65) {
            highlightSum += luminance;
            highlightCount += 1;
        }

        if (color.saturation >= 0.01) {
            const selected = HSL_COLOR_DEFINITIONS.reduce((closest, definition) => {
                const distance = hueDistance(color.hue, definition.hue);

                return distance < closest.distance ? { definition, distance } : closest;
            }, { definition: HSL_COLOR_DEFINITIONS[0], distance: Infinity });
            const bucket = buckets[selected.definition.id];
            const radians = color.hue * Math.PI / 180;

            bucket.count += 1;
            bucket.saturation += color.saturation;
            bucket.luminance += color.lightness;
            bucket.hueSin += Math.sin(radians);
            bucket.hueCos += Math.cos(radians);
        }
    }

    const meanLuminance = luminanceSum / pixelCount;
    const variance = Math.max(0, luminanceSquareSum / pixelCount - meanLuminance ** 2);
    const meanRed = redSum / pixelCount;
    const meanGreen = greenSum / pixelCount;
    const meanBlue = blueSum / pixelCount;

    const meanSaturation = saturationSum / pixelCount;
    const alphaCoverage = alphaSum / pixelCount;
    const sampleConfidence = Math.min(1, pixelCount / 20000);
    const distributionSignal = clamp(Math.sqrt(variance) * 7 + meanSaturation * 0.45);

    return {
        sampleCount: pixelCount,
        meanLuminance,
        contrast: Math.sqrt(variance),
        temperature: clamp((meanRed - meanBlue) * 160, -100, 100),
        tint: clamp((meanGreen - (meanRed + meanBlue) / 2) * 180, -100, 100),
        saturation: saturationSum / pixelCount * 100,
        shadowMean: shadowCount ? shadowSum / shadowCount : meanLuminance,
        highlightMean: highlightCount ? highlightSum / highlightCount : meanLuminance,
        blackLevel,
        hsl: Object.fromEntries(HSL_COLOR_DEFINITIONS.map(({ id }) => {
            const bucket = buckets[id];
            const hue = bucket.count
                ? (Math.atan2(bucket.hueSin, bucket.hueCos) * 180 / Math.PI + 360) % 360
                : 0;

            return [id, {
                hue,
                saturation: bucket.count ? bucket.saturation / bucket.count : 0,
                luminance: bucket.count ? bucket.luminance / bucket.count : meanLuminance,
                coverage: bucket.count / pixelCount,
            }];
        })),
        alphaCoverage,
        confidence: clamp(sampleConfidence * alphaCoverage * (0.1 + distributionSignal * 0.9)),
    };
}

export function analyzeImageSource(source, maxDimension = 320) {
    const sourceWidth = source.width ?? source.naturalWidth;
    const sourceHeight = source.height ?? source.naturalHeight;
    const { width, height } = getPreviewSize(sourceWidth, sourceHeight, maxDimension);
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    context.drawImage(source, 0, 0, width, height);

    return extractImageFeatures(context.getImageData(0, 0, width, height).data, width, height);
}

export function deriveMatchState(targetFeatures, referenceFeatures) {
    const state = createDefaultEditState();
    const difference = (reference, target) => reference - target;
    const circularHueDifference = (reference, target) => ((reference - target + 540) % 360) - 180;

    // Scene content can create large global luminance differences. Keep tonal
    // translation deliberately gentle so a bright city and a dark forest do
    // not turn into an over-corrected result.
    state.adjustments.exposure = clamp(difference(referenceFeatures.meanLuminance, targetFeatures.meanLuminance) * 2.25, -0.9, 0.9);
    state.adjustments.contrast = clamp(difference(referenceFeatures.contrast, targetFeatures.contrast) * 180, -45, 45);
    state.adjustments.highlights = clamp(difference(referenceFeatures.highlightMean, targetFeatures.highlightMean) * 120, -35, 35);
    state.adjustments.shadows = clamp(difference(referenceFeatures.shadowMean, targetFeatures.shadowMean) * 120, -35, 35);
    state.adjustments.whites = clamp(difference(referenceFeatures.blackLevel, targetFeatures.blackLevel) * 70, -25, 25);
    state.adjustments.temperature = clamp(difference(referenceFeatures.temperature, targetFeatures.temperature) * 0.65, -50, 50);
    state.adjustments.tint = clamp(difference(referenceFeatures.tint, targetFeatures.tint) * 0.6, -40, 40);
    state.adjustments.saturation = clamp(difference(referenceFeatures.saturation, targetFeatures.saturation) * 0.65, -45, 45);

    for (const { id } of HSL_COLOR_DEFINITIONS) {
        const target = targetFeatures.hsl[id];
        const reference = referenceFeatures.hsl[id];
        const sharedCoverage = Math.min(target.coverage, reference.coverage);
        const coverageTotal = target.coverage + reference.coverage;
        const coverageAgreement = coverageTotal
            ? 1 - Math.abs(reference.coverage - target.coverage) / coverageTotal
            : 0;
        const coverage = clamp(sharedCoverage * 6 * coverageAgreement);

        state.hsl[id].hue = clamp(circularHueDifference(reference.hue, target.hue) / 0.6 * coverage * 0.65, -65, 65);
        state.hsl[id].saturation = clamp((reference.saturation - target.saturation) * 70 * coverage, -55, 55);
        state.hsl[id].luminance = clamp((reference.luminance - target.luminance) * 70 * coverage, -55, 55);
    }

    const confidence = Math.min(targetFeatures.confidence, referenceFeatures.confidence);

    return {
        state,
        confidence,
        summary: {
            temperature: state.adjustments.temperature,
            tint: state.adjustments.tint,
            contrast: state.adjustments.contrast,
            highlights: state.adjustments.highlights,
            shadows: state.adjustments.shadows,
            saturation: state.adjustments.saturation,
        },
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
    next.transform = { ...base.transform };
    next.crop = { ...base.crop };
    next.frame = { ...base.frame };
    next.match = { ...base.match };

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

function normalizeCrop(crop = DEFAULT_CROP) {
    const width = clamp(Number(crop.width ?? 1), 0.05, 1);
    const height = clamp(Number(crop.height ?? 1), 0.05, 1);

    return {
        mode: crop.mode ?? 'free',
        x: clamp(Number(crop.x ?? 0), 0, 1 - width),
        y: clamp(Number(crop.y ?? 0), 0, 1 - height),
        width,
        height,
    };
}

export function createCropForMode(mode, sourceWidth, sourceHeight, currentCrop = DEFAULT_CROP) {
    if (mode === 'original') return { ...DEFAULT_CROP };
    if (mode === 'free') return { ...normalizeCrop(currentCrop), mode: 'free' };

    const ratios = { '1:1': 1, '4:5': 4 / 5, '9:16': 9 / 16, '16:9': 16 / 9 };
    const targetRatio = ratios[mode] ?? sourceWidth / sourceHeight;
    const sourceRatio = sourceWidth / sourceHeight;
    const width = sourceRatio > targetRatio ? targetRatio / sourceRatio : 1;
    const height = sourceRatio > targetRatio ? 1 : sourceRatio / targetRatio;

    return {
        mode,
        x: (1 - width) / 2,
        y: (1 - height) / 2,
        width,
        height,
    };
}

function frameRatioValue(ratio) {
    return { '1:1': 1, '4:5': 4 / 5, '9:16': 9 / 16 }[ratio] ?? null;
}

function composePhoto(source, editState, {
    includeCrop = true,
    includeFrame = true,
    maxDimension = PREVIEW_MAX_DIMENSION,
} = {}) {
    const sourceWidth = source.width ?? source.naturalWidth;
    const sourceHeight = source.height ?? source.naturalHeight;
    const crop = includeCrop ? normalizeCrop(editState.crop) : { ...DEFAULT_CROP };
    const cropWidth = sourceWidth * crop.width;
    const cropHeight = sourceHeight * crop.height;
    const rotation = ((Number(editState.transform?.rotation ?? 0) % 360) + 360) % 360;
    const isQuarterTurn = rotation === 90 || rotation === 270;
    const transformedWidth = isQuarterTurn ? cropHeight : cropWidth;
    const transformedHeight = isQuarterTurn ? cropWidth : cropHeight;
    const scale = Math.min(1, maxDimension / Math.max(transformedWidth, transformedHeight));
    const photoWidth = Math.max(1, Math.round(transformedWidth * scale));
    const photoHeight = Math.max(1, Math.round(transformedHeight * scale));
    const photoCanvas = document.createElement('canvas');

    photoCanvas.width = photoWidth;
    photoCanvas.height = photoHeight;

    const photoContext = photoCanvas.getContext('2d', { alpha: true, willReadFrequently: true });

    photoContext.imageSmoothingEnabled = true;
    photoContext.imageSmoothingQuality = 'high';
    photoContext.translate(photoWidth / 2, photoHeight / 2);
    photoContext.rotate(rotation * Math.PI / 180);
    photoContext.scale(editState.transform?.flipX ? -1 : 1, editState.transform?.flipY ? -1 : 1);
    photoContext.drawImage(
        source,
        sourceWidth * crop.x,
        sourceHeight * crop.y,
        sourceWidth * crop.width,
        sourceHeight * crop.height,
        -cropWidth * scale / 2,
        -cropHeight * scale / 2,
        cropWidth * scale,
        cropHeight * scale,
    );

    const imageData = photoContext.getImageData(0, 0, photoWidth, photoHeight);

    applyAdjustmentsToPixels(imageData.data, editState.adjustments, {
        width: photoWidth,
        height: photoHeight,
        hsl: editState.hsl,
        effects: editState.effects,
        detail: editState.detail,
    });
    photoContext.putImageData(imageData, 0, 0);

    if (!includeFrame) return photoCanvas;

    const frame = { ...DEFAULT_FRAME, ...(editState.frame ?? {}) };
    const padding = Math.max(photoWidth, photoHeight) * clamp(Number(frame.size) / 100, 0, 0.3);
    const innerWidth = photoWidth + padding * 2;
    const innerHeight = photoHeight + padding * 2;
    const targetRatio = frameRatioValue(frame.ratio);
    let outputWidth = innerWidth;
    let outputHeight = innerHeight;

    if (targetRatio) {
        if (innerWidth / innerHeight > targetRatio) outputHeight = innerWidth / targetRatio;
        else outputWidth = innerHeight * targetRatio;
    }

    const frameCanvas = document.createElement('canvas');

    frameCanvas.width = Math.max(1, Math.ceil(outputWidth));
    frameCanvas.height = Math.max(1, Math.ceil(outputHeight));

    const frameContext = frameCanvas.getContext('2d', { alpha: true });

    if (frame.style === 'white' || frame.style === 'black') {
        frameContext.fillStyle = frame.style === 'white' ? '#ffffff' : '#000000';
        frameContext.fillRect(0, 0, frameCanvas.width, frameCanvas.height);
    } else {
        frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    }

    frameContext.imageSmoothingEnabled = true;
    frameContext.imageSmoothingQuality = 'high';
    frameContext.drawImage(
        photoCanvas,
        (frameCanvas.width - photoWidth) / 2,
        (frameCanvas.height - photoHeight) / 2,
    );

    return frameCanvas;
}

export function renderPreview({
    source,
    canvas,
    editState,
    original = false,
    includeCrop = true,
    includeFrame = true,
    maxDimension = PREVIEW_MAX_DIMENSION,
}) {
    const sourceWidth = source.width ?? source.naturalWidth;
    const sourceHeight = source.height ?? source.naturalHeight;
    const context = canvas.getContext('2d', { alpha: true, willReadFrequently: true });
    let output;

    if (original) {
        const originalSize = getPreviewSize(sourceWidth, sourceHeight, maxDimension);

        output = document.createElement('canvas');
        output.width = originalSize.width;
        output.height = originalSize.height;
        output.getContext('2d').drawImage(source, 0, 0, originalSize.width, originalSize.height);
    } else {
        output = composePhoto(source, editState, { includeCrop, includeFrame, maxDimension });
    }

    canvas.width = output.width;
    canvas.height = output.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.clearRect(0, 0, output.width, output.height);
    context.drawImage(output, 0, 0);

    return { width: output.width, height: output.height };
}
