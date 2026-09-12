import assert from 'node:assert/strict';
import {
    BUILT_IN_PRESETS,
    DEFAULT_CROP,
    DEFAULT_FRAME,
    DEFAULT_ADJUSTMENTS,
    DEFAULT_HSL,
    EXPORT_FORMAT_DEFINITIONS,
    EXPORT_SIZE_DEFINITIONS,
    applyAdjustmentsToPixels,
    copyEditState,
    createDefaultEditState,
    createCropForMode,
    deriveMatchState,
    editStatesEqual,
    extractImageFeatures,
    formatAdjustmentValue,
    getExportDimensions,
    getPreviewSize,
    interpolateEditStates,
    validateImageFile,
} from '../../resources/js/image-engine.js';

const neutralPixels = new Uint8ClampedArray([30, 90, 180, 255, 240, 120, 20, 128]);
const neutralResult = new Uint8ClampedArray(neutralPixels);

applyAdjustmentsToPixels(neutralResult, DEFAULT_ADJUSTMENTS);
assert.deepEqual(neutralResult, neutralPixels, 'neutral adjustments must preserve pixels');

const exposureResult = new Uint8ClampedArray([64, 64, 64, 255]);
applyAdjustmentsToPixels(exposureResult, { ...DEFAULT_ADJUSTMENTS, exposure: 1 });
assert.ok(exposureResult[0] > 64, 'positive exposure must lift the image');

const saturationResult = new Uint8ClampedArray([110, 90, 90, 255]);
applyAdjustmentsToPixels(saturationResult, { ...DEFAULT_ADJUSTMENTS, saturation: -100 });
assert.equal(saturationResult[0], saturationResult[1], 'negative saturation must neutralize red channel bias');
assert.equal(saturationResult[1], saturationResult[2], 'negative saturation must neutralize blue channel bias');

const redHslResult = new Uint8ClampedArray([255, 0, 0, 255]);
applyAdjustmentsToPixels(redHslResult, DEFAULT_ADJUSTMENTS, {
    width: 1,
    height: 1,
    hsl: { ...DEFAULT_HSL, red: { hue: 50, saturation: 0, luminance: 0 } },
});
assert.ok(redHslResult[1] > 0, 'HSL hue must move the selected color range');

const clampedHslResult = new Uint8ClampedArray([255, 0, 0, 255]);
const maxHslResult = new Uint8ClampedArray([255, 0, 0, 255]);
applyAdjustmentsToPixels(clampedHslResult, DEFAULT_ADJUSTMENTS, {
    width: 1,
    height: 1,
    hsl: { ...DEFAULT_HSL, red: { hue: 500, saturation: 500, luminance: 500 } },
});
applyAdjustmentsToPixels(maxHslResult, DEFAULT_ADJUSTMENTS, {
    width: 1,
    height: 1,
    hsl: { ...DEFAULT_HSL, red: { hue: 100, saturation: 100, luminance: 100 } },
});
assert.deepEqual(clampedHslResult, maxHslResult, 'HSL values must clamp to their supported range');

const neutralHslResult = new Uint8ClampedArray(neutralPixels);
applyAdjustmentsToPixels(neutralHslResult, DEFAULT_ADJUSTMENTS, { width: 2, height: 1, hsl: DEFAULT_HSL });
assert.deepEqual(neutralHslResult, neutralPixels, 'neutral HSL must preserve pixels');

const grainSource = new Uint8ClampedArray([120, 120, 120, 255, 120, 120, 120, 255]);
const grainOptions = { width: 2, height: 1, effects: { fade: 0, grain: 40, vignette: 0 } };
const grainFirst = new Uint8ClampedArray(grainSource);
const grainSecond = new Uint8ClampedArray(grainSource);
applyAdjustmentsToPixels(grainFirst, DEFAULT_ADJUSTMENTS, grainOptions);
applyAdjustmentsToPixels(grainSecond, DEFAULT_ADJUSTMENTS, grainOptions);
assert.deepEqual(grainFirst, grainSecond, 'grain must be deterministic while parameters stay unchanged');

const baseState = createDefaultEditState();
const presetState = { ...baseState, adjustments: { ...baseState.adjustments, contrast: 40 } };
assert.equal(interpolateEditStates(baseState, presetState, 0).adjustments.contrast, 0, 'preset intensity 0 must stay neutral');
assert.equal(interpolateEditStates(baseState, presetState, 1).adjustments.contrast, 40, 'preset intensity 100 must use full formula');
assert.equal(BUILT_IN_PRESETS.length, 12, 'the built-in preset set must contain twelve formulas');
assert.deepEqual(EXPORT_FORMAT_DEFINITIONS.map(({ id }) => id), ['jpg', 'png', 'webp']);
assert.deepEqual(EXPORT_SIZE_DEFINITIONS.map(({ id }) => id), ['original', 'instagram-portrait', 'instagram-square', 'story']);
assert.deepEqual(getExportDimensions(4000, 3000, baseState, 'instagram-portrait'), { width: 1080, height: 1350 });
assert.deepEqual(getExportDimensions(4000, 3000, baseState, 'instagram-square'), { width: 1080, height: 1080 });
assert.deepEqual(getExportDimensions(4000, 3000, baseState, 'story'), { width: 1080, height: 1920 });
assert.deepEqual(getExportDimensions(4000, 3000, baseState, 'original'), { width: 4000, height: 3000 });
assert.deepEqual(getExportDimensions(4000, 3000, {
    ...baseState,
    transform: { ...baseState.transform, rotation: 90 },
    frame: { ...baseState.frame, size: 5, ratio: '1:1' },
}, 'original'), { width: 4400, height: 4400 });

const transferableState = createDefaultEditState();
transferableState.adjustments.temperature = 24;
transferableState.hsl.green.hue = -18;
transferableState.crop = { mode: '1:1', x: 0.1, y: 0, width: 0.8, height: 1 };
transferableState.match = { id: 'reference-match', intensity: 80, confidence: 0.7 };
const copiedState = copyEditState(transferableState);
copiedState.adjustments.temperature = -20;
assert.equal(transferableState.adjustments.temperature, 24, 'copy must be an independent snapshot');
assert.equal(copiedState.hsl.green.hue, -18, 'copy must preserve HSL parameters');
assert.equal(copiedState.crop.mode, '1:1', 'copy must preserve composition parameters');
assert.equal(copiedState.match.id, null, 'copy must not carry reference-match metadata');

const targetFeatures = extractImageFeatures(new Uint8ClampedArray([80, 90, 100, 255, 110, 120, 130, 255]), 2, 1);
const referenceFeatures = extractImageFeatures(new Uint8ClampedArray([170, 130, 90, 255, 190, 150, 110, 255]), 2, 1);
assert.equal(targetFeatures.sampleCount, 2, 'feature extraction must report sampled pixels');
const matchResult = deriveMatchState(targetFeatures, referenceFeatures);
assert.ok(matchResult.state.adjustments.exposure > 0, 'a brighter reference must produce a positive exposure delta');
assert.ok(matchResult.state.adjustments.temperature > 0, 'a warmer reference must produce a positive temperature delta');
assert.equal(matchResult.state.crop.mode, 'original', 'matching must not change target geometry');
assert.ok(matchResult.confidence < 0.25, 'tiny samples must produce low-confidence match feedback');

const transparentFeatures = extractImageFeatures(new Uint8ClampedArray([255, 0, 0, 0]), 1, 1);
assert.equal(transparentFeatures.alphaCoverage, 0, 'transparent pixels must be detected');
assert.equal(transparentFeatures.confidence, 0, 'transparent references must have zero confidence');

const flatFeatures = extractImageFeatures(new Uint8ClampedArray([
    128, 128, 128, 255,
    128, 128, 128, 255,
]), 2, 1);
assert.ok(flatFeatures.confidence < 0.25, 'flat references must produce low-confidence feedback');

const redFeatures = extractImageFeatures(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1);
const blueFeatures = extractImageFeatures(new Uint8ClampedArray([0, 0, 255, 255]), 1, 1);
const dissimilarColorMatch = deriveMatchState(redFeatures, blueFeatures);
assert.equal(dissimilarColorMatch.state.hsl.red.hue, 0, 'HSL must ignore a color bucket missing from the reference');
assert.ok(Math.abs(dissimilarColorMatch.state.hsl.blue.hue) < Number.EPSILON, 'HSL must ignore a color bucket missing from the target');

assert.deepEqual(getPreviewSize(4000, 2000, 1800), { width: 1800, height: 900, scale: 0.45 });
assert.equal(formatAdjustmentValue(0.3, 2), '+0.30');
assert.equal(formatAdjustmentValue(-12, 0), '-12');
assert.ok(validateImageFile({ name: 'photo.jpg', type: 'image/jpeg', size: 100 }).valid);
assert.equal(validateImageFile({ name: 'photo.gif', type: 'image/gif', size: 100 }).valid, false);
assert.equal(validateImageFile({ name: 'photo.jpg', type: 'image/jpeg', size: 31 * 1024 * 1024 }).valid, false);
assert.equal(validateImageFile({ name: 'photo.gif', type: 'image/jpeg', size: 100 }).valid, false);

const state = createDefaultEditState();
assert.equal(editStatesEqual(state, createDefaultEditState()), true);
state.adjustments.contrast = 10;
assert.equal(editStatesEqual(state, createDefaultEditState()), false);

const squareCrop = createCropForMode('1:1', 4000, 2000);
assert.equal(squareCrop.width, 0.5, '1:1 crop must fit the source aspect ratio');
assert.equal(squareCrop.x, 0.25, 'fixed crop must be centered horizontally');
const portraitCrop = createCropForMode('4:5', 4000, 2000);
assert.equal(portraitCrop.height, 1, 'portrait crop should use the full source height when possible');
assert.equal(portraitCrop.mode, '4:5');
assert.deepEqual(createCropForMode('original', 4000, 2000), DEFAULT_CROP, 'original crop must cover the source');

const compositionState = createDefaultEditState();
compositionState.transform.rotation = 90;
compositionState.transform.flipX = true;
compositionState.crop = squareCrop;
compositionState.frame = { style: 'white', size: 12, ratio: '4:5' };
assert.equal(editStatesEqual(compositionState, createDefaultEditState()), false, 'composition parameters must participate in edit equality');
assert.deepEqual(DEFAULT_FRAME, { style: 'none', size: 0, ratio: 'original' });

console.log('image-engine tests passed');
