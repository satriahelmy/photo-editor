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
                <button class="button button--light button--small editor-export" type="button" disabled>Export</button>
            </div>
        </header>

        <main class="editor-main">
            <aside class="tool-rail" aria-label="Editing tools">
                <div class="tool-rail-heading">Tools</div>
                <nav class="tool-list">
                    <template x-for="tool in tools" :key="tool.id">
                        <button class="tool-item" type="button" :class="{ 'is-active': activeTool === tool.id }" @click="activeTool = tool.id" :aria-current="activeTool === tool.id ? 'page' : undefined">
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
                    <button type="button" class="panel-close" aria-label="Panel options" disabled><i data-lucide="more-horizontal" aria-hidden="true"></i></button>
                </div>

                <div class="panel-content">
                    <div x-show="activeTool === 'adjust'" class="adjustments-content">
                        <template x-for="section in sections" :key="section">
                            <section class="adjustment-section">
                                <div class="adjustment-section-header">
                                    <button type="button" class="adjustment-section-toggle" :aria-expanded="activeSection === section" @click="activeSection = activeSection === section ? '' : section">
                                        <span class="adjustment-section-title" x-text="section"></span>
                                        <span class="adjustment-section-chevron" :class="{ 'is-open': activeSection === section }" aria-hidden="true">⌄</span>
                                    </button>
                                    <button type="button" class="adjustment-section-reset" :disabled="!controlsForSection(section).some(control => adjustmentValue(control.key) !== 0)" @click="resetSection(section)">Reset</button>
                                </div>
                                <div class="adjustment-section-body" x-show="activeSection === section">
                                    <template x-for="control in controlsForSection(section)" :key="control.key">
                                        <div class="adjustment-row">
                                            <div class="adjustment-label-row">
                                                <label :for="`adjustment-${control.key}`" x-text="control.label"></label>
                                                <output class="adjustment-value" :for="`adjustment-${control.key}`" x-text="displayValue(control)"></output>
                                                <button type="button" class="adjustment-reset" :aria-label="`Reset ${control.label}`" :disabled="adjustmentValue(control.key) === 0" @click="resetAdjustment(control.key)">Reset</button>
                                            </div>
                                            <input
                                                class="adjustment-slider"
                                                type="range"
                                                :id="`adjustment-${control.key}`"
                                                :min="control.min"
                                                :max="control.max"
                                                :step="control.step"
                                                :value="adjustmentValue(control.key)"
                                                :disabled="!hasImage"
                                                :aria-label="control.label"
                                                @input="updateAdjustment(control.key, $event.target.value)"
                                                @change="commitAdjustment()"
                                                @pointerup="handleSliderPointerUp($event, control.key)"
                                                @dblclick="resetAdjustment(control.key)"
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
                    <div x-show="activeTool !== 'adjust'" class="panel-empty" x-cloak>
                        <p><span x-text="panelTitle"></span> will appear here once a photo is loaded.</p>
                    </div>
                </div>
            </aside>
        </main>

        <footer class="canvas-controls">
            <div class="canvas-control-group">
                <button type="button" class="canvas-button" aria-label="Zoom out" :disabled="!hasImage || zoom <= 0.5" @click="zoomBy(-0.25)"><i data-lucide="minus" aria-hidden="true"></i></button>
                <button type="button" class="zoom-value zoom-fit" :disabled="!hasImage" @click="fitCanvas()" x-text="zoomLabel">100%</button>
                <button type="button" class="canvas-button" aria-label="Zoom in" :disabled="!hasImage || zoom >= 3" @click="zoomBy(0.25)"><i data-lucide="plus" aria-hidden="true"></i></button>
            </div>
            <span class="canvas-note" x-text="hasImage ? 'Hold the canvas or Before to compare.' : 'Preview resolution will keep editing responsive.'"></span>
            <button type="button" class="before-button" :disabled="!hasImage" @pointerdown.prevent="startBefore()" @pointerup="endBefore()" @pointerleave="endBefore()" @pointercancel="endBefore()">Before</button>
        </footer>

        <nav class="mobile-tool-nav" aria-label="Mobile editing tools">
            <template x-for="tool in tools" :key="`mobile-${tool.id}`">
                <button class="mobile-tool-item" type="button" :class="{ 'is-active': activeTool === tool.id }" @click="activeTool = tool.id">
                    <i :data-lucide="tool.icon" aria-hidden="true"></i><span x-text="tool.label"></span>
                </button>
            </template>
        </nav>
    </div>
@endsection
