import './bootstrap';

import Alpine from 'alpinejs';
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Crop,
    Frame,
    ImagePlus,
    Layers3,
    Menu,
    Minus,
    MoreHorizontal,
    Plus,
    Redo2,
    ScanSearch,
    ShieldCheck,
    SlidersHorizontal,
    Undo2,
    createIcons,
} from 'lucide';
import {
    ADJUSTMENT_DEFINITIONS,
    BUILT_IN_PRESETS,
    DETAIL_DEFINITIONS,
    EFFECT_DEFINITIONS,
    HSL_COLOR_DEFINITIONS,
    HSL_CONTROL_DEFINITIONS,
    cloneEditState,
    createCropForMode,
    createDefaultEditState,
    decodeImageFile,
    editStatesEqual,
    formatAdjustmentValue,
    interpolateEditStates,
    releaseImageSource,
    renderPreview,
    validateImageFile,
} from './image-engine';

const CUSTOM_PRESET_STORAGE_KEY = 'photo-editor.custom-presets.v1';

window.Alpine = Alpine;

window.editorShell = () => ({
    activeTool: 'adjust',
    activeSection: 'Light',
    activeHslColor: 'red',
    cropModeOptions: [
        { id: 'original', label: 'Original' },
        { id: 'free', label: 'Free' },
        { id: '1:1', label: '1:1' },
        { id: '4:5', label: '4:5' },
        { id: '9:16', label: '9:16' },
        { id: '16:9', label: '16:9' },
    ],
    frameStyleOptions: [
        { id: 'none', label: 'None' },
        { id: 'white', label: 'White' },
        { id: 'black', label: 'Black' },
    ],
    frameRatioOptions: [
        { id: 'original', label: 'Original' },
        { id: '1:1', label: '1:1' },
        { id: '4:5', label: '4:5' },
        { id: '9:16', label: '9:16' },
    ],
    sections: ['Light', 'Color', 'HSL', 'Effects', 'Detail'],
    tools: [
        { id: 'adjust', label: 'Adjust', icon: 'sliders-horizontal' },
        { id: 'presets', label: 'Presets', icon: 'layers-3' },
        { id: 'match', label: 'Match', icon: 'scan-search' },
        { id: 'crop', label: 'Crop', icon: 'crop' },
        { id: 'frame', label: 'Frame', icon: 'frame' },
    ],
    adjustmentDefinitions: ADJUSTMENT_DEFINITIONS,
    hslColorDefinitions: HSL_COLOR_DEFINITIONS,
    hslControlDefinitions: HSL_CONTROL_DEFINITIONS,
    effectDefinitions: EFFECT_DEFINITIONS,
    detailDefinitions: DETAIL_DEFINITIONS,
    builtInPresets: BUILT_IN_PRESETS,
    customPresets: [],
    editState: createDefaultEditState(),
    initialState: createDefaultEditState(),
    history: [],
    historyIndex: -1,
    source: null,
    sourceFileName: '',
    sourceDimensions: { width: 0, height: 0 },
    showOriginal: false,
    dragActive: false,
    isLoading: false,
    error: '',
    zoom: 1,
    panX: 0,
    panY: 0,
    panStart: null,
    cropDrag: null,
    lastSliderTap: null,
    presetIntensity: 100,
    activePresetId: null,
    presetBaseState: null,
    presetName: '',
    presetError: '',
    _renderFrame: null,
    init() {
        this.history = [cloneEditState(this.editState)];
        this.historyIndex = 0;
        this.loadCustomPresets();
    },
    get hasImage() {
        return Boolean(this.source);
    },
    get isDirty() {
        return !editStatesEqual(this.editState, this.initialState);
    },
    get activeToolLabel() {
        return this.tools.find((tool) => tool.id === this.activeTool)?.label ?? 'Tool';
    },
    get panelTitle() {
        if (this.activeTool === 'adjust') return 'Adjustments';

        return this.activeToolLabel;
    },
    get canUndo() {
        return this.historyIndex > 0;
    },
    get canRedo() {
        return this.historyIndex >= 0 && this.historyIndex < this.history.length - 1;
    },
    get canvasTransform() {
        return `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`;
    },
    get zoomLabel() {
        return `${Math.round(this.zoom * 100)}%`;
    },
    get fileLabel() {
        if (!this.sourceFileName) return 'No photo selected';

        return `${this.sourceFileName} · ${this.sourceDimensions.width}×${this.sourceDimensions.height}`;
    },
    get allPresets() {
        return [
            ...this.builtInPresets,
            ...this.customPresets.map((item) => ({ ...item, isCustom: true })),
        ];
    },
    get activePreset() {
        return this.allPresets.find((item) => item.id === this.activePresetId) ?? null;
    },
    controlsForSection(section) {
        if (section === 'Light' || section === 'Color') {
            return this.adjustmentDefinitions.filter((control) => control.section === section);
        }

        if (section === 'HSL') return this.hslControlDefinitions;
        if (section === 'Effects') return this.effectDefinitions;
        if (section === 'Detail') return this.detailDefinitions;

        return [];
    },
    controlValue(control) {
        if (control.group === 'hsl') return this.editState.hsl[this.activeHslColor][control.key];

        return this.editState[control.group][control.key];
    },
    displayValue(control) {
        return formatAdjustmentValue(this.controlValue(control), control.precision);
    },
    sectionHasEdits(section) {
        return this.controlsForSection(section).some((control) => this.controlValue(control) !== 0);
    },
    activateTool(toolId) {
        this.activeTool = toolId;
        this.scheduleRender();

        if (toolId === 'presets') this.$nextTick(() => this.renderPresetThumbnails());
    },
    selectHslColor(colorId) {
        this.activeHslColor = colorId;
    },
    scheduleRender() {
        if (!this.source || !this.$refs.canvas) return;
        if (this._renderFrame) cancelAnimationFrame(this._renderFrame);

        this._renderFrame = requestAnimationFrame(() => {
            renderPreview({
                source: this.source,
                canvas: this.$refs.canvas,
                editState: this.editState,
                original: this.showOriginal,
                includeCrop: this.activeTool !== 'crop',
                includeFrame: this.activeTool !== 'crop',
            });
            this._renderFrame = null;
        });
    },
    renderPresetThumbnails() {
        if (!this.source) return;

        this.$root.querySelectorAll('.preset-thumb-canvas').forEach((canvas) => {
            const presetItem = this.allPresets.find((item) => item.id === canvas.dataset.presetId);

            if (!presetItem) return;

            const formula = presetItem.state ?? presetItem;
            const state = cloneEditState(formula);

            renderPreview({ source: this.source, canvas, editState: state, maxDimension: 360 });
        });
    },
    async selectFile(event) {
        const file = event.target.files?.[0];

        await this.loadFile(file);
        event.target.value = '';
    },
    async handleDrop(event) {
        this.dragActive = false;
        await this.loadFile(event.dataTransfer.files?.[0]);
    },
    async loadFile(file) {
        const validation = validateImageFile(file);

        if (!validation.valid) {
            this.error = validation.error;
            return;
        }

        this.error = '';
        this.isLoading = true;

        try {
            const source = await decodeImageFile(file);

            releaseImageSource(this.source);
            this.source = source;
            this.sourceFileName = file.name;
            this.sourceDimensions = {
                width: source.width ?? source.naturalWidth,
                height: source.height ?? source.naturalHeight,
            };
            this.editState = createDefaultEditState();
            this.initialState = cloneEditState(this.editState);
            this.history = [cloneEditState(this.editState)];
            this.historyIndex = 0;
            this.showOriginal = false;
            this.activePresetId = null;
            this.presetBaseState = null;
            this.presetIntensity = 100;
            this.cropDrag = null;
            this.zoom = 1;
            this.panX = 0;
            this.panY = 0;
            this.activeTool = 'adjust';
            await this.$nextTick();
            this.scheduleRender();
            this.renderPresetThumbnails();
        } catch (loadError) {
            this.error = loadError.message || "This image couldn't be opened. Try a JPG, PNG, or WebP file.";
        } finally {
            this.isLoading = false;
        }
    },
    chooseFile() {
        if (this.isDirty && !window.confirm('Replace this photo? Your current edits will be cleared.')) return;

        this.$refs.fileInput.click();
    },
    replaceImage() {
        this.chooseFile();
    },
    updateControl(control, value) {
        const numericValue = Number(value);

        if (control.group === 'hsl') this.editState.hsl[this.activeHslColor][control.key] = numericValue;
        else this.editState[control.group][control.key] = numericValue;

        this.scheduleRender();
    },
    resetControl(control) {
        if (this.controlValue(control) === 0) return;

        this.updateControl(control, 0);
        this.pushHistory();
    },
    resetSection(section) {
        if (!this.sectionHasEdits(section)) return;

        this.controlsForSection(section).forEach((control) => this.updateControl(control, 0));
        this.pushHistory();
    },
    pushHistory() {
        const current = cloneEditState(this.editState);
        const previous = this.history[this.historyIndex];

        if (previous && editStatesEqual(previous, current)) return;

        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(current);
        this.historyIndex = this.history.length - 1;
    },
    applyHistory(index) {
        const snapshot = this.history[index];

        if (!snapshot) return;

        this.historyIndex = index;
        this.editState = cloneEditState(snapshot);
        this.activePresetId = this.editState.preset.id;
        this.presetIntensity = this.editState.preset.intensity;
        this.scheduleRender();
    },
    undo() {
        if (this.canUndo) this.applyHistory(this.historyIndex - 1);
    },
    redo() {
        if (this.canRedo) this.applyHistory(this.historyIndex + 1);
    },
    resetAll() {
        if (!this.isDirty) return;
        if (!window.confirm('Reset all edits and return to the original photo?')) return;

        this.editState = cloneEditState(this.initialState);
        this.activePresetId = null;
        this.presetBaseState = null;
        this.presetIntensity = 100;
        this.pushHistory();
        this.scheduleRender();
    },
    startBefore() {
        if (!this.source) return;

        this.showOriginal = true;
        this.scheduleRender();
    },
    endBefore() {
        if (!this.showOriginal) return;

        this.showOriginal = false;
        this.scheduleRender();
    },
    zoomBy(amount) {
        this.zoom = Math.min(3, Math.max(0.5, Number((this.zoom + amount).toFixed(2))));
        if (this.zoom <= 1) {
            this.panX = 0;
            this.panY = 0;
        }
    },
    fitCanvas() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
    },
    startPan(event) {
        if (!this.source || this.zoom <= 1 || event.pointerType === 'touch') return;

        this.panStart = { x: event.clientX, y: event.clientY, panX: this.panX, panY: this.panY };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    movePan(event) {
        if (!this.panStart) return;

        this.panX = this.panStart.panX + event.clientX - this.panStart.x;
        this.panY = this.panStart.panY + event.clientY - this.panStart.y;
    },
    endPan(event) {
        if (!this.panStart) return;

        event.currentTarget.releasePointerCapture?.(event.pointerId);
        this.panStart = null;
    },
    startCanvasInteraction(event) {
        if (this.zoom > 1 && event.pointerType !== 'touch') {
            this.startPan(event);
            return;
        }

        this.startBefore();
    },
    moveCanvasInteraction(event) {
        if (this.panStart) this.movePan(event);
    },
    endCanvasInteraction(event) {
        if (this.panStart) {
            this.endPan(event);
            return;
        }

        this.endBefore();
    },
    handleSliderPointerUp(event, key) {
        if (event.pointerType !== 'touch') return;

        const now = Date.now();
        const previousTap = this.lastSliderTap;

        if (previousTap?.key === key && now - previousTap.time < 350) {
            this.lastSliderTap = null;
            this.resetControl({ group: event.currentTarget.dataset.group ?? 'adjustments', key });
            return;
        }

        this.lastSliderTap = { key, time: now };
    },
    get cropSelectionStyle() {
        const crop = this.editState.crop;

        return `left: ${crop.x * 100}%; top: ${crop.y * 100}%; width: ${crop.width * 100}%; height: ${crop.height * 100}%;`;
    },
    setCropMode(mode) {
        if (!this.source) return;

        this.editState.crop = createCropForMode(
            mode,
            this.source.width ?? this.source.naturalWidth,
            this.source.height ?? this.source.naturalHeight,
            this.editState.crop,
        );
        this.pushHistory();
        this.scheduleRender();
    },
    startCropDrag(event, mode = 'move', handle = '') {
        if (!this.source) return;

        const rect = this.$refs.cropOverlay?.getBoundingClientRect();

        if (!rect) return;

        this.cropDrag = {
            mode,
            handle,
            startX: event.clientX,
            startY: event.clientY,
            width: rect.width,
            height: rect.height,
            crop: { ...this.editState.crop },
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    moveCrop(event) {
        if (!this.cropDrag) return;

        const drag = this.cropDrag;
        const deltaX = (event.clientX - drag.startX) / drag.width;
        const deltaY = (event.clientY - drag.startY) / drag.height;
        const start = drag.crop;
        const next = { ...start };

        if (drag.mode === 'move') {
            next.x = Math.min(1 - start.width, Math.max(0, start.x + deltaX));
            next.y = Math.min(1 - start.height, Math.max(0, start.y + deltaY));
            this.editState.crop = next;
            return;
        }

        const minSize = 0.08;
        let left = start.x;
        let top = start.y;
        let right = start.x + start.width;
        let bottom = start.y + start.height;
        const resizingEast = drag.handle.includes('e');
        const resizingSouth = drag.handle.includes('s');
        const resizingWest = drag.handle.includes('w');
        const resizingNorth = drag.handle.includes('n');

        if (resizingEast) right = Math.min(1, Math.max(left + minSize, right + deltaX));
        if (resizingSouth) bottom = Math.min(1, Math.max(top + minSize, bottom + deltaY));
        if (resizingWest) left = Math.max(0, Math.min(right - minSize, left + deltaX));
        if (resizingNorth) top = Math.max(0, Math.min(bottom - minSize, top + deltaY));

        if (start.mode !== 'free' && start.mode !== 'original') {
            const sourceWidth = this.source.width ?? this.source.naturalWidth;
            const sourceHeight = this.source.height ?? this.source.naturalHeight;
            const sourceRatio = sourceWidth / sourceHeight;
            const targetRatio = { '1:1': 1, '4:5': 4 / 5, '9:16': 9 / 16, '16:9': 16 / 9 }[start.mode] ?? sourceRatio;
            const cropRatio = targetRatio / sourceRatio;
            const width = right - left;
            const height = bottom - top;

            if (resizingEast || resizingWest) {
                const adjustedHeight = Math.min(height, width / cropRatio);

                if (resizingNorth) top = bottom - adjustedHeight;
                else bottom = top + adjustedHeight;
            } else if (resizingNorth || resizingSouth) {
                const adjustedWidth = Math.min(width, height * cropRatio);

                if (resizingWest) left = right - adjustedWidth;
                else right = left + adjustedWidth;
            }
        }

        this.editState.crop = {
            ...next,
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
        };
    },
    endCropDrag(event) {
        if (!this.cropDrag) return;

        event.currentTarget.releasePointerCapture?.(event.pointerId);
        this.cropDrag = null;
        this.pushHistory();
        this.scheduleRender();
    },
    nudgeCrop(deltaX, deltaY) {
        if (!this.source) return;

        const crop = this.editState.crop;

        this.editState.crop.x = Math.min(1 - crop.width, Math.max(0, crop.x + deltaX));
        this.editState.crop.y = Math.min(1 - crop.height, Math.max(0, crop.y + deltaY));
        this.pushHistory();
        this.scheduleRender();
    },
    applyCrop() {
        if (!this.source) return;

        this.pushHistory();
        this.activeTool = 'adjust';
        this.scheduleRender();
    },
    resetCrop() {
        if (!this.source) return;

        this.editState.crop = { mode: 'original', x: 0, y: 0, width: 1, height: 1 };
        this.pushHistory();
        this.scheduleRender();
    },
    rotate(direction) {
        if (!this.source) return;

        const rotation = this.editState.transform.rotation + direction * 90;

        this.editState.transform.rotation = ((rotation % 360) + 360) % 360;
        this.pushHistory();
        this.scheduleRender();
    },
    toggleFlip(axis) {
        if (!this.source) return;

        const key = axis === 'horizontal' ? 'flipX' : 'flipY';

        this.editState.transform[key] = !this.editState.transform[key];
        this.pushHistory();
        this.scheduleRender();
    },
    setFrameStyle(style) {
        this.editState.frame.style = style;
        this.pushHistory();
        this.scheduleRender();
    },
    setFrameRatio(ratio) {
        this.editState.frame.ratio = ratio;
        this.pushHistory();
        this.scheduleRender();
    },
    setFrameSize(value) {
        this.editState.frame.size = Number(value);
        this.scheduleRender();
    },
    commitFrameSize() {
        this.pushHistory();
    },
    resetFrame() {
        this.editState.frame = { style: 'none', size: 0, ratio: 'original' };
        this.pushHistory();
        this.scheduleRender();
    },
    presetFormula(presetItem) {
        return presetItem.state ?? presetItem;
    },
    applyPreset(presetItem) {
        this.presetBaseState = cloneEditState(this.editState);
        this.activePresetId = presetItem.id;
        this.presetIntensity = 100;
        this.editState = interpolateEditStates(this.presetBaseState, this.presetFormula(presetItem), 1);
        this.editState.preset = { id: presetItem.id, intensity: 100 };
        this.pushHistory();
        this.scheduleRender();
    },
    setPresetIntensity(value) {
        if (!this.activePresetId || !this.presetBaseState) return;

        this.presetIntensity = Number(value);
        const presetItem = this.activePreset;

        if (!presetItem) return;

        this.editState = interpolateEditStates(this.presetBaseState, this.presetFormula(presetItem), this.presetIntensity / 100);
        this.editState.preset = { id: this.activePresetId, intensity: this.presetIntensity };
        this.scheduleRender();
    },
    loadCustomPresets() {
        try {
            const stored = JSON.parse(window.localStorage.getItem(CUSTOM_PRESET_STORAGE_KEY) ?? '[]');

            this.customPresets = Array.isArray(stored)
                ? stored.filter((item) => item?.id && item?.name && item?.state).map((item) => ({
                    version: 1,
                    id: item.id,
                    name: item.name,
                    state: cloneEditState(item.state),
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }))
                : [];
        } catch {
            this.customPresets = [];
        }
    },
    persistCustomPresets() {
        try {
            window.localStorage.setItem(CUSTOM_PRESET_STORAGE_KEY, JSON.stringify(this.customPresets));
            return true;
        } catch {
            this.presetError = 'Custom preset storage is unavailable or full.';
            return false;
        }
    },
    saveCustomPreset() {
        const name = this.presetName.trim();

        if (!name) {
            this.presetError = 'Give this preset a name first.';
            return;
        }

        if (this.allPresets.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
            this.presetError = 'A preset with that name already exists.';
            return;
        }

        const now = new Date().toISOString();
        const item = {
            version: 1,
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name,
            state: cloneEditState({ ...this.editState, preset: { id: null, intensity: 100 } }),
            createdAt: now,
            updatedAt: now,
        };

        this.customPresets = [...this.customPresets, item];
        if (this.persistCustomPresets()) {
            this.presetName = '';
            this.presetError = '';
        }
    },
    renameCustomPreset(presetItem) {
        const name = window.prompt('Rename custom preset', presetItem.name)?.trim();

        if (!name || name === presetItem.name) return;
        if (this.allPresets.some((item) => item.id !== presetItem.id && item.name.toLowerCase() === name.toLowerCase())) {
            this.presetError = 'A preset with that name already exists.';
            return;
        }

        this.customPresets = this.customPresets.map((item) => item.id === presetItem.id
            ? { ...item, name, updatedAt: new Date().toISOString() }
            : item);
        this.persistCustomPresets();
    },
    deleteCustomPreset(presetItem) {
        if (!window.confirm(`Delete custom preset “${presetItem.name}”?`)) return;

        this.customPresets = this.customPresets.filter((item) => item.id !== presetItem.id);
        if (this.activePresetId === presetItem.id) {
            this.activePresetId = null;
            this.presetBaseState = null;
        }
        this.persistCustomPresets();
    },
    cleanup() {
        if (this._renderFrame) cancelAnimationFrame(this._renderFrame);
        releaseImageSource(this.source);
        this.source = null;
    },
    destroy() {
        this.cleanup();
    },
});

window.addEventListener('beforeunload', () => {
    const editorElement = document.querySelector('.editor-shell');

    window.Alpine?.$data?.(editorElement)?.cleanup?.();
});

Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
    createIcons({
        icons: {
            ArrowLeft,
            ArrowRight,
            ArrowUpRight,
            Crop,
            Frame,
            ImagePlus,
            Layers3,
            Menu,
            Minus,
            MoreHorizontal,
            Plus,
            Redo2,
            ScanSearch,
            ShieldCheck,
            SlidersHorizontal,
            Undo2,
        },
    });
});
