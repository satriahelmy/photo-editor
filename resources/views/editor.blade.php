@extends('layouts.app')

@section('title', 'Editor — Photo Editor')
@section('body-class', 'editor-body')

@section('content')
    <div class="editor-shell" x-data="editorShell()">
        <header class="editor-topbar">
            <div class="editor-brand-group">
                <a href="{{ route('home') }}" class="editor-back" aria-label="Back to home"><i data-lucide="arrow-left" aria-hidden="true"></i></a>
                <a href="{{ route('home') }}" class="brand brand--editor"><span class="brand-mark" aria-hidden="true">PE</span><span class="editor-brand-name">Photo Editor</span></a>
            </div>
            <div class="editor-status"><span class="status-dot" :class="{ 'is-ready': hasImage }"></span><span x-text="hasImage ? 'Ready to edit' : 'No photo selected'"></span></div>
            <div class="editor-actions">
                <button class="icon-button" type="button" aria-label="Undo" :disabled="!canUndo" @click="undo()"><i data-lucide="undo-2" aria-hidden="true"></i></button>
                <button class="icon-button" type="button" aria-label="Redo" :disabled="!canRedo" @click="redo()"><i data-lucide="redo-2" aria-hidden="true"></i></button>
                <button class="button button--light button--small editor-export" type="button" :disabled="!hasImage" @click="openExport()" aria-haspopup="dialog">Export</button>
            </div>
        </header>

        <main class="editor-main">
            <aside class="tool-rail" aria-label="Editing tools">
                <div class="tool-rail-heading">Tools</div>
                <nav class="tool-list">
                    <template x-for="tool in tools" :key="tool.id">
                        <button class="tool-item" type="button" :class="{ 'is-active': activeTool === tool.id }" @click="activateTool(tool.id)" :aria-current="activeTool === tool.id ? 'page' : undefined">
                            <i :data-lucide="tool.icon" aria-hidden="true"></i><span x-text="tool.label"></span>
                        </button>
                    </template>
                </nav>
                <div class="tool-rail-note"><i data-lucide="shield-check" aria-hidden="true"></i><span>Local-first editing</span></div>
            </aside>

            <section
                class="image-workspace"
                :class="{ 'is-dragging': dragActive }"
                aria-label="Image workspace"
                @dragover.prevent="dragActive = true"
                @dragleave.prevent="dragActive = false"
                @drop.prevent="handleDrop($event)"
                @pointerdown="startCanvasInteraction($event)"
                @pointermove="moveCanvasInteraction($event)"
                @pointerup="endCanvasInteraction($event)"
                @pointercancel="endCanvasInteraction($event)"
                @pointerleave="zoom <= 1 && endBefore()"
            >
                <div class="workspace-empty" x-show="!hasImage" @pointerdown.stop>
                    <div class="empty-mark" aria-hidden="true"><i data-lucide="image-plus"></i></div>
                    <h1>Drop a photo here</h1>
                    <p>or</p>
                    <button type="button" class="button button--light" @click="chooseFile()">Choose Photo</button>
                    <span class="empty-meta">JPG, PNG or WebP</span>
                    <input x-ref="fileInput" type="file" class="visually-hidden" accept="image/jpeg,image/png,image/webp" @change="selectFile($event)">
                    <span class="empty-loading" x-show="isLoading">Opening photo…</span>
                    <p class="empty-error" x-show="error" x-text="error" role="alert"></p>
                </div>
                <div class="workspace-canvas-wrap" x-show="hasImage" x-cloak :style="{ transform: canvasTransform }">
                    <canvas x-ref="canvas" class="workspace-canvas" aria-label="Edited photo preview"></canvas>
                    <div
                        class="crop-overlay"
                        x-ref="cropOverlay"
                        x-show="activeTool === 'crop'"
                        x-cloak
                        @pointerdown="startCropDrag($event)"
                        @pointermove="moveCrop($event)"
                        @pointerup="endCropDrag($event)"
                        @pointercancel="endCropDrag($event)"
                    >
                        <div class="crop-overlay-shade" aria-hidden="true"></div>
                        <div class="crop-selection" :style="cropSelectionStyle" aria-label="Crop selection">
                            <button type="button" class="crop-handle crop-handle--nw" aria-label="Resize crop from top left" @pointerdown.stop.prevent="startCropDrag($event, 'resize', 'nw')"></button>
                            <button type="button" class="crop-handle crop-handle--ne" aria-label="Resize crop from top right" @pointerdown.stop.prevent="startCropDrag($event, 'resize', 'ne')"></button>
                            <button type="button" class="crop-handle crop-handle--sw" aria-label="Resize crop from bottom left" @pointerdown.stop.prevent="startCropDrag($event, 'resize', 'sw')"></button>
                            <button type="button" class="crop-handle crop-handle--se" aria-label="Resize crop from bottom right" @pointerdown.stop.prevent="startCropDrag($event, 'resize', 'se')"></button>
                        </div>
                    </div>
                </div>
                <div class="workspace-image-meta" x-show="hasImage" x-cloak @pointerdown.stop>
                    <span x-text="fileLabel"></span>
                    <button type="button" class="workspace-replace" @click="replaceImage()">Replace</button>
                </div>
                <div class="workspace-loading" x-show="isLoading" x-cloak aria-live="polite">Opening photo…</div>
                <div class="drop-overlay" x-show="dragActive" x-cloak>
                    <span>Drop to open</span>
                </div>
                <div class="workspace-hint" x-show="!hasImage"><span>Start with one photo. Your original stays unchanged.</span></div>
            </section>

            <aside class="adjustment-panel" aria-label="Editing panel">
                <div class="panel-header">
                    <div>
                        <span class="panel-kicker" x-text="activeToolLabel">Adjust</span>
                        <h2 x-text="panelTitle">Adjustments</h2>
                    </div>
                    <div class="panel-header-actions" aria-label="Edit transfer actions">
                        <button type="button" class="panel-action" :disabled="!hasImage" @click="copyEdit()" title="Copy edit"><i data-lucide="copy" aria-hidden="true"></i><span>Copy</span></button>
                        <button type="button" class="panel-action" :disabled="!hasImage || !copiedEditState" @click="pasteEdit()" title="Paste edit"><i data-lucide="clipboard-paste" aria-hidden="true"></i><span>Paste</span></button>
                    </div>
                </div>

                <div class="panel-content">
                    <div x-show="activeTool === 'adjust'" class="adjustments-content">
                        <template x-for="section in sections" :key="section">
                            <section class="adjustment-section">
                                <div class="adjustment-section-header">
                                    <button type="button" class="adjustment-section-toggle" :aria-expanded="activeSection === section" @click="activeSection = activeSection === section ? '' : section">
                                        <span class="adjustment-section-title" x-text="section"></span>
                                        <span class="adjustment-section-chevron" :class="{ 'is-open': activeSection === section }" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="adjustment-section-reset" :disabled="!sectionHasEdits(section)" @click="resetSection(section)">Reset</button>
                                </div>
                                <div class="adjustment-section-body" x-show="activeSection === section">
                                    <div x-show="section === 'HSL'" class="hsl-color-picker">
                                        <span class="hsl-picker-label">Color range</span>
                                        <div class="hsl-color-grid" role="group" aria-label="HSL color range">
                                            <template x-for="color in hslColorDefinitions" :key="color.id">
                                                <button type="button" class="hsl-color-option" :class="{ 'is-active': activeHslColor === color.id }" :aria-pressed="activeHslColor === color.id" :aria-label="`${color.label} HSL controls`" @click="selectHslColor(color.id)">
                                                    <span class="hsl-color-dot" :style="{ backgroundColor: color.dot }" aria-hidden="true"></span>
                                                    <span x-text="color.label"></span>
                                                </button>
                                            </template>
                                        </div>
                                    </div>
                                    <template x-for="control in controlsForSection(section)" :key="control.key">
                                        <div class="adjustment-row">
                                            <div class="adjustment-label-row">
                                                <label :for="`adjustment-${section.toLowerCase()}-${control.key}`" x-text="control.label"></label>
                                                <output class="adjustment-value" :for="`adjustment-${section.toLowerCase()}-${control.key}`" x-text="displayValue(control)"></output>
                                                <button type="button" class="adjustment-reset" :aria-label="`Reset ${control.label}`" :disabled="controlValue(control) === 0" @click="resetControl(control)">Reset</button>
                                            </div>
                                            <input
                                                class="adjustment-slider"
                                                type="range"
                                                :id="`adjustment-${section.toLowerCase()}-${control.key}`"
                                                :data-group="control.group"
                                                :min="control.min"
                                                :max="control.max"
                                                :step="control.step"
                                                :value="controlValue(control)"
                                                :disabled="!hasImage"
                                                :aria-label="control.label"
                                                @input="updateControl(control, $event.target.value)"
                                                @change="commitAdjustment()"
                                                @pointerup="handleSliderPointerUp($event, control.key)"
                                                @dblclick="resetControl(control)"
                                            >
                                            <div class="slider-range" aria-hidden="true"><span x-text="control.min"></span><span x-text="control.max"></span></div>
                                        </div>
                                    </template>
                                </div>
                            </section>
                        </template>
                        <div class="reset-all-row">
                            <button type="button" class="reset-all-button" :disabled="!isDirty" @click="resetAll()">Reset all adjustments</button>
                        </div>
                    </div>
                    <div x-show="activeTool === 'presets'" class="presets-content" x-cloak>
                        <div class="preset-intensity-panel" x-show="activePreset">
                            <div class="preset-intensity-heading">
                                <span>Preset intensity</span>
                                <output class="adjustment-value" x-text="`${presetIntensity}%`"></output>
                            </div>
                            <input class="adjustment-slider" type="range" min="0" max="100" step="1" :value="presetIntensity" :disabled="!activePreset || !hasImage" aria-label="Preset intensity" @input="setPresetIntensity($event.target.value)" @change="commitAdjustment()">
                            <div class="slider-range" aria-hidden="true"><span>0</span><span>100</span></div>
                        </div>
                        <div class="preset-grid" aria-label="Built-in and custom presets">
                            <template x-for="presetItem in allPresets" :key="presetItem.id">
                                <div class="preset-card-wrap">
                                    <button type="button" class="preset-card" :class="{ 'is-active': activePresetId === presetItem.id }" :disabled="!hasImage" :aria-pressed="activePresetId === presetItem.id" @click="applyPreset(presetItem)">
                                        <span class="preset-thumbnail">
                                            <canvas class="preset-thumb-canvas" :data-preset-id="presetItem.id" width="180" height="120" x-show="hasImage" aria-hidden="true"></canvas>
                                            <span class="preset-placeholder" x-show="!hasImage" aria-hidden="true"></span>
                                        </span>
                                        <span class="preset-card-name" x-text="presetItem.name"></span>
                                    </button>
                                    <span class="preset-card-actions" x-show="presetItem.isCustom">
                                        <button type="button" @click="renameCustomPreset(presetItem)">Rename</button>
                                        <button type="button" @click="deleteCustomPreset(presetItem)">Delete</button>
                                    </span>
                                </div>
                            </template>
                        </div>
                        <div class="custom-preset-save">
                            <label for="custom-preset-name">Save current look</label>
                            <div class="custom-preset-fields">
                                <input id="custom-preset-name" type="text" maxlength="40" placeholder="Preset name" x-model="presetName" :disabled="!hasImage" @keydown.enter.prevent="saveCustomPreset()">
                                <button type="button" class="button button--light button--small" :disabled="!hasImage" @click="saveCustomPreset()">Save</button>
                            </div>
                            <p class="preset-error" x-show="presetError" x-text="presetError" role="alert"></p>
                        </div>
                    </div>
                    <div x-show="activeTool === 'crop'" class="composition-content" x-cloak>
                        <div class="composition-block">
                            <div class="composition-block-heading"><span>Crop ratio</span><span class="composition-value" x-text="editState.crop.mode"></span></div>
                            <div class="segmented-options" role="group" aria-label="Crop ratio">
                                <template x-for="option in cropModeOptions" :key="option.id">
                                    <button type="button" class="segmented-option" :class="{ 'is-active': editState.crop.mode === option.id }" :aria-pressed="editState.crop.mode === option.id" :disabled="!hasImage" @click="setCropMode(option.id)" x-text="option.label"></button>
                                </template>
                            </div>
                        </div>
                        <div class="composition-block">
                            <div class="composition-block-heading"><span>Transform</span><span class="composition-value" x-text="`${editState.transform.rotation}°`"></span></div>
                            <div class="composition-actions" role="group" aria-label="Transform controls">
                                <button type="button" class="composition-action" :disabled="!hasImage" @click="rotate(-1)">Rotate left</button>
                                <button type="button" class="composition-action" :disabled="!hasImage" @click="rotate(1)">Rotate right</button>
                                <button type="button" class="composition-action" :disabled="!hasImage" @click="toggleFlip('horizontal')">Flip horizontal</button>
                                <button type="button" class="composition-action" :disabled="!hasImage" @click="toggleFlip('vertical')">Flip vertical</button>
                            </div>
                        </div>
                        <div class="composition-block crop-keyboard-controls">
                            <div class="composition-block-heading"><span>Fine position</span><span class="composition-value">Keyboard / touch</span></div>
                            <div class="nudge-controls" role="group" aria-label="Nudge crop selection">
                                <button type="button" class="nudge-button" :disabled="!hasImage" aria-label="Move crop up" @click="nudgeCrop(0, -0.02)">↑</button>
                                <button type="button" class="nudge-button" :disabled="!hasImage" aria-label="Move crop left" @click="nudgeCrop(-0.02, 0)">←</button>
                                <button type="button" class="nudge-button" :disabled="!hasImage" aria-label="Move crop down" @click="nudgeCrop(0, 0.02)">↓</button>
                                <button type="button" class="nudge-button" :disabled="!hasImage" aria-label="Move crop right" @click="nudgeCrop(0.02, 0)">→</button>
                            </div>
                        </div>
                        <div class="composition-footer-actions">
                            <button type="button" class="button button--light button--small" :disabled="!hasImage" @click="applyCrop()">Apply crop</button>
                            <button type="button" class="reset-all-button" :disabled="!hasImage" @click="resetCrop()">Reset crop</button>
                        </div>
                    </div>
                    <div x-show="activeTool === 'frame'" class="composition-content" x-cloak>
                        <div class="composition-block">
                            <div class="composition-block-heading"><span>Frame</span><span class="composition-value" x-text="editState.frame.style"></span></div>
                            <div class="segmented-options" role="group" aria-label="Frame style">
                                <template x-for="option in frameStyleOptions" :key="option.id">
                                    <button type="button" class="segmented-option" :class="{ 'is-active': editState.frame.style === option.id }" :aria-pressed="editState.frame.style === option.id" :disabled="!hasImage" @click="setFrameStyle(option.id)" x-text="option.label"></button>
                                </template>
                            </div>
                        </div>
                        <div class="composition-block">
                            <div class="composition-block-heading"><span>Canvas ratio</span><span class="composition-value" x-text="editState.frame.ratio"></span></div>
                            <div class="segmented-options" role="group" aria-label="Frame canvas ratio">
                                <template x-for="option in frameRatioOptions" :key="option.id">
                                    <button type="button" class="segmented-option" :class="{ 'is-active': editState.frame.ratio === option.id }" :aria-pressed="editState.frame.ratio === option.id" :disabled="!hasImage" @click="setFrameRatio(option.id)" x-text="option.label"></button>
                                </template>
                            </div>
                        </div>
                        <div class="composition-block">
                            <div class="composition-block-heading"><span>Frame size</span><output class="composition-value" x-text="`${editState.frame.size}%`"></output></div>
                            <input class="adjustment-slider" type="range" min="0" max="30" step="1" :value="editState.frame.size" :disabled="!hasImage" aria-label="Frame size" @input="setFrameSize($event.target.value)" @change="commitFrameSize()">
                            <div class="slider-range" aria-hidden="true"><span>0</span><span>30</span></div>
                        </div>
                        <div class="composition-footer-actions">
                            <button type="button" class="reset-all-button" :disabled="!hasImage" @click="resetFrame()">Reset frame</button>
                        </div>
                    </div>
                    <div x-show="activeTool === 'match'" class="match-content" x-cloak>
                        <div class="match-preview-grid">
                            <figure class="match-preview-card">
                                <div class="match-preview-media">
                                    <canvas x-ref="matchTargetCanvas" x-show="hasImage" aria-label="Target photo preview"></canvas>
                                    <span class="match-preview-placeholder" x-show="!hasImage">Target</span>
                                </div>
                                <figcaption><span>Your photo</span><small x-text="hasImage ? fileLabel : 'Upload a target first'"></small></figcaption>
                            </figure>
                            <figure class="match-preview-card">
                                <div class="match-preview-media">
                                    <canvas x-ref="matchReferenceCanvas" x-show="hasReference" aria-label="Reference photo preview"></canvas>
                                    <span class="match-preview-placeholder" x-show="!hasReference">Reference</span>
                                </div>
                                <figcaption><span>Reference</span><small x-text="referenceFileLabel"></small></figcaption>
                            </figure>
                        </div>
                        <div class="reference-dropzone" :class="{ 'is-dragging': referenceDragActive }" @dragover.prevent="referenceDragActive = true" @dragleave.prevent="referenceDragActive = false" @drop.prevent="handleReferenceDrop($event)">
                            <input x-ref="referenceFileInput" type="file" class="visually-hidden" accept="image/jpeg,image/png,image/webp" @change="selectReferenceFile($event)">
                            <span class="reference-dropzone-label">Add a reference photo</span>
                            <button type="button" class="button button--light button--small" :disabled="!hasImage" @click="chooseReferenceFile()">Choose Reference</button>
                            <span class="reference-dropzone-meta">JPG, PNG or WebP · stays in this browser</span>
                        </div>
                        <p class="match-error" x-show="referenceError" x-text="referenceError" role="alert"></p>
                        <p class="match-error" x-show="matchError" x-text="matchError" role="alert"></p>
                        <div class="match-action-row">
                            <button type="button" class="button button--light button--small" :disabled="!hasImage || !hasReference || referenceLoading || matchStatus === 'matching'" @click="runMatch()">
                                <span x-show="matchStatus !== 'matching'">Match grade</span>
                                <span x-show="matchStatus === 'matching'">Matching…</span>
                            </button>
                            <button type="button" class="match-remove" :disabled="!hasReference" @click="removeReference()">Remove reference</button>
                        </div>
                        <div class="match-status" x-show="matchStatus === 'matching'" aria-live="polite"><span class="status-spinner" aria-hidden="true"></span>Matching color grade…</div>
                        <div class="match-result" x-show="matchFormulaState" x-cloak>
                            <div class="match-intensity-heading"><span>Match intensity</span><output class="adjustment-value" x-text="`${matchIntensity}%`"></output></div>
                            <input class="adjustment-slider" type="range" min="0" max="100" step="1" :value="matchIntensity" aria-label="Match intensity" @input="setMatchIntensity($event.target.value)" @change="commitMatchIntensity()">
                            <div class="slider-range" aria-hidden="true"><span>0</span><span>100</span></div>
                            <p class="match-result-label">Grade matched <span x-text="`· ${Math.round(matchConfidence * 100)}% confidence`"></span></p>
                            <p class="match-low-confidence" x-show="matchIsLowConfidence">Reference is small or visually uniform, so this is a gentle approximation.</p>
                            <div class="match-summary" x-show="matchSummary">
                                <span>Temperature <b x-text="formatAdjustmentValue(matchSummary?.temperature ?? 0, 0)"></b></span>
                                <span>Contrast <b x-text="formatAdjustmentValue(matchSummary?.contrast ?? 0, 0)"></b></span>
                                <span>Saturation <b x-text="formatAdjustmentValue(matchSummary?.saturation ?? 0, 0)"></b></span>
                            </div>
                            <button type="button" class="match-fine-tune" @click="goToAdjust()">Fine-tune in Adjust</button>
                        </div>
                        <p class="match-limitation">Match reproduces the overall color grading character; it does not guarantee an identical result. Lighting, camera, exposure, environment, skin tone, time of day, and dynamic range can change the outcome.</p>
                    </div>
                    <div x-show="!['adjust', 'presets', 'crop', 'frame', 'match'].includes(activeTool)" class="panel-empty" x-cloak>
                        <p><span x-text="panelTitle"></span> will appear here once a photo is loaded.</p>
                    </div>
                </div>
            </aside>
        </main>

        <div class="export-backdrop" x-show="showExportModal" x-cloak @click.self="closeExport()" @keydown.escape.window="closeExport()">
            <section class="export-modal" x-ref="exportModal" role="dialog" aria-modal="true" aria-labelledby="export-title" @keydown="trapExportFocus($event)">
                <div class="export-modal-header">
                    <div>
                        <p class="panel-kicker">Export</p>
                        <h2 id="export-title">Export photo</h2>
                    </div>
                    <button x-ref="exportCloseButton" type="button" class="panel-close" aria-label="Close export dialog" :disabled="isExporting" @click="closeExport()"><i data-lucide="x" aria-hidden="true"></i></button>
                </div>
                <div class="export-modal-content">
                    <fieldset class="export-fieldset">
                        <legend>Format</legend>
                        <div class="segmented-options" role="group" aria-label="Export format">
                            <template x-for="format in exportFormats" :key="format.id">
                                <button type="button" class="segmented-option" :class="{ 'is-active': exportFormat === format.id }" :aria-pressed="exportFormat === format.id" @click="setExportFormat(format.id)" x-text="format.label"></button>
                            </template>
                        </div>
                    </fieldset>
                    <fieldset class="export-fieldset">
                        <legend>Size</legend>
                        <div class="export-size-options" role="group" aria-label="Export size">
                            <template x-for="size in exportSizes" :key="size.id">
                                <button type="button" class="export-size-option" :class="{ 'is-active': exportSize === size.id }" :aria-pressed="exportSize === size.id" @click="setExportSize(size.id)">
                                    <span x-text="size.label"></span>
                                    <small x-text="exportSizeDimensions(size)"></small>
                                </button>
                            </template>
                        </div>
                    </fieldset>
                    <div class="export-quality" x-show="exportQualityVisible">
                        <div class="export-row-heading"><span>Quality</span><output x-text="`${exportQuality}%`"></output></div>
                        <input class="adjustment-slider" type="range" min="10" max="100" step="1" :value="exportQuality" aria-label="Export quality" @input="setExportQuality($event.target.value)">
                        <div class="slider-range" aria-hidden="true"><span>Low</span><span>Maximum</span></div>
                    </div>
                    <p class="export-quality-note" x-show="!exportQualityVisible">PNG exports are lossless.</p>
                    <div class="export-summary">
                        <span>Output</span><strong x-text="`${exportDimensionsLabel} · ${selectedExportFormat.label}`"></strong>
                        <span>Estimated size</span><strong><span x-show="exportEstimateLoading" class="export-estimate-spinner" aria-hidden="true"></span><span x-text="exportEstimate"></span></strong>
                    </div>
                    <p class="export-error" x-show="exportError" x-text="exportError" role="alert"></p>
                </div>
                <div class="export-modal-actions">
                    <button type="button" class="button button--quiet" :disabled="isExporting" @click="closeExport()">Cancel</button>
                    <button type="button" class="button button--light" :disabled="isExporting" @click="exportPhoto()"><span x-show="!isExporting">Export</span><span x-show="isExporting">Rendering…</span></button>
                </div>
            </section>
        </div>

        <footer class="canvas-controls">
            <div class="canvas-control-group">
                <button type="button" class="canvas-button" aria-label="Zoom out" :disabled="!hasImage || zoom <= 0.5" @click="zoomBy(-0.25)"><i data-lucide="minus" aria-hidden="true"></i></button>
                <button type="button" class="zoom-value zoom-fit" :disabled="!hasImage" @click="fitCanvas()" x-text="zoomLabel">100%</button>
                <button type="button" class="canvas-button" aria-label="Zoom in" :disabled="!hasImage || zoom >= 3" @click="zoomBy(0.25)"><i data-lucide="plus" aria-hidden="true"></i></button>
            </div>
            <span class="canvas-note" x-text="hasImage ? 'Hold the canvas or Before to compare.' : 'Preview resolution will keep editing responsive.'"></span>
            <button type="button" class="before-button" :disabled="!hasImage" @pointerdown.prevent="startBefore()" @pointerup="endBefore()" @pointerleave="endBefore()" @pointercancel="endBefore()">Before</button>
        </footer>

        <p class="editor-feedback" x-show="editFeedback" x-cloak x-text="editFeedback" role="status" aria-live="polite"></p>

        <nav class="mobile-tool-nav" aria-label="Mobile editing tools">
            <template x-for="tool in tools" :key="`mobile-${tool.id}`">
                <button class="mobile-tool-item" type="button" :class="{ 'is-active': activeTool === tool.id }" @click="activateTool(tool.id)">
                    <i :data-lucide="tool.icon" aria-hidden="true"></i><span x-text="tool.label"></span>
                </button>
            </template>
        </nav>
    </div>
@endsection
