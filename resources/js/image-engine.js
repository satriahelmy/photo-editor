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
    { key: 'exposure', label: 'Exposure', min: -2, max: 2, step: 0.01, precision: 2, section: 'Light' },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, precision: 0, section: 'Light' },
    { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, precision: 0, section: 'Light' },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, precision: 0, section: 'Light' },
    { key: 'whites', label: 'Whites', min: -100, max: 100, step: 1, precision: 0, section: 'Light' },
    { key: 'blacks', label: 'Blacks', min: -100, max: 100, step: 1, precision: 0, section: 'Light' },
    { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, precision: 0, section: 'Color' },
    { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, precision: 0, section: 'Color' },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, precision: 0, section: 'Color' },
]);

export const DEFAULT_ADJUSTMENTS = Object.freeze(
    Object.fromEntries(ADJUSTMENT_DEFINITIONS.map(({ key }) => [key, 0])),
);

export function createDefaultEditState() {
    return {
        version: 1,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
    };
}

export function cloneEditState(state) {
    return {
        version: state.version ?? 1,
        adjustments: { ...state.adjustments },
    };
}

export function editStatesEqual(left, right) {
    return ADJUSTMENT_DEFINITIONS.every(({ key }) => left.adjustments[key] === right.adjustments[key]);
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

export function applyAdjustmentsToPixels(data, adjustments) {
    const exposure = Number(adjustments.exposure ?? 0);
    const contrast = Number(adjustments.contrast ?? 0) / 100;
    const highlights = Number(adjustments.highlights ?? 0) / 100;
    const shadows = Number(adjustments.shadows ?? 0) / 100;
    const whites = Number(adjustments.whites ?? 0) / 100;
    const blacks = Number(adjustments.blacks ?? 0) / 100;
    const temperature = Number(adjustments.temperature ?? 0) / 100;
    const tint = Number(adjustments.tint ?? 0) / 100;
    const saturation = Number(adjustments.saturation ?? 0) / 100;
    const exposureFactor = 2 ** exposure;
    const contrastFactor = 1 + contrast;

    for (let index = 0; index < data.length; index += 4) {
        let red = data[index] / 255;
        let green = data[index + 1] / 255;
        let blue = data[index + 2] / 255;

        red *= exposureFactor;
        green *= exposureFactor;
        blue *= exposureFactor;

        // Temperature and tint are intentionally restrained. They should move the
        // image's character without producing clipped, synthetic channel shifts.
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

        data[index] = Math.round(clamp(red) * 255);
        data[index + 1] = Math.round(clamp(green) * 255);
        data[index + 2] = Math.round(clamp(blue) * 255);
    }

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

export function renderPreview({ source, canvas, editState, original = false }) {
    const sourceWidth = source.width ?? source.naturalWidth;
    const sourceHeight = source.height ?? source.naturalHeight;
    const { width, height } = getPreviewSize(sourceWidth, sourceHeight);
    const context = canvas.getContext('2d', { alpha: true, willReadFrequently: true });

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.clearRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    if (!original) {
        const imageData = context.getImageData(0, 0, width, height);
        applyAdjustmentsToPixels(imageData.data, editState.adjustments);
        context.putImageData(imageData, 0, 0);
    }

    return { width, height };
}
