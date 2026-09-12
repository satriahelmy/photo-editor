import assert from 'node:assert/strict';
import {
    BUILT_IN_PRESETS,
    DEFAULT_ADJUSTMENTS,
    DEFAULT_HSL,
    applyAdjustmentsToPixels,
    createDefaultEditState,
    editStatesEqual,
    formatAdjustmentValue,
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

console.log('image-engine tests passed');
