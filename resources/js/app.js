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
    cloneEditState,
    createDefaultEditState,
    decodeImageFile,
    editStatesEqual,
    formatAdjustmentValue,
    releaseImageSource,
    renderPreview,
    validateImageFile,
} from './image-engine';

window.Alpine = Alpine;

window.editorShell = () => ({
    activeTool: 'adjust',
    activeSection: 'Light',
    tools: [
        { id: 'adjust', label: 'Adjust', icon: 'sliders-horizontal' },
        { id: 'presets', label: 'Presets', icon: 'layers-3' },
        { id: 'match', label: 'Match', icon: 'scan-search' },
        { id: 'crop', label: 'Crop', icon: 'crop' },
        { id: 'frame', label: 'Frame', icon: 'frame' },
    ],
    adjustmentDefinitions: ADJUSTMENT_DEFINITIONS,
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
    lastSliderTap: null,
    _renderFrame: null,
    _beforeHistoryState: null,
    init() {
        this.history = [cloneEditState(this.editState)];
        this.historyIndex = 0;
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
        return this.activeTool === 'adjust' ? 'Adjustments' : this.activeToolLabel;
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
    get sections() {
        return ['Light', 'Color'];
    },
    controlsForSection(section) {
        return this.adjustmentDefinitions.filter((control) => control.section === section);
    },
    adjustmentValue(key) {
        return this.editState.adjustments[key];
    },
    displayValue(control) {
        return formatAdjustmentValue(this.adjustmentValue(control.key), control.precision);
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
            });
            this._renderFrame = null;
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
            this.zoom = 1;
            this.panX = 0;
            this.panY = 0;
            this.activeTool = 'adjust';
            await this.$nextTick();
            this.scheduleRender();
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
    updateAdjustment(key, value) {
        this.editState.adjustments[key] = Number(value);
        this.scheduleRender();
    },
    commitAdjustment() {
        this.pushHistory();
    },
    resetAdjustment(key) {
        if (this.editState.adjustments[key] === 0) return;

        this.editState.adjustments[key] = 0;
        this.scheduleRender();
        this.pushHistory();
    },
    handleSliderPointerUp(event, key) {
        if (event.pointerType !== 'touch') return;

        const now = Date.now();
        const previousTap = this.lastSliderTap;

        if (previousTap?.key === key && now - previousTap.time < 350) {
            this.lastSliderTap = null;
            this.resetAdjustment(key);
            return;
        }

        this.lastSliderTap = { key, time: now };
    },
    resetSection(section) {
        const changed = this.controlsForSection(section).some(({ key }) => this.editState.adjustments[key] !== 0);

        if (!changed) return;

        this.controlsForSection(section).forEach(({ key }) => {
            this.editState.adjustments[key] = 0;
        });
        this.scheduleRender();
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
    cleanup() {
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
