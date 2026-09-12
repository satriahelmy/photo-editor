import assert from 'node:assert/strict';
import {
    DEFAULT_ADJUSTMENTS,
    applyAdjustmentsToPixels,
    createDefaultEditState,
    editStatesEqual,
    formatAdjustmentValue,
    getPreviewSize,
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
