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
            <div class="editor-status"><span class="status-dot"></span><span x-text="hasImage ? 'Ready to edit' : 'No photo selected'"></span></div>
            <div class="editor-actions">
                <button class="icon-button" type="button" aria-label="Undo" disabled><i data-lucide="undo-2" aria-hidden="true"></i></button>
                <button class="icon-button" type="button" aria-label="Redo" disabled><i data-lucide="redo-2" aria-hidden="true"></i></button>
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

            <section class="image-workspace" aria-label="Image workspace">
                <div class="workspace-empty" x-show="!hasImage">
                    <div class="empty-mark" aria-hidden="true"><i data-lucide="image-plus"></i></div>
                    <h1>Drop a photo here</h1>
                    <p>or</p>
                    <button type="button" class="button button--light" @click="$refs.fileInput.click()">Choose Photo</button>
                    <span class="empty-meta">JPG, PNG or WebP</span>
                    <input x-ref="fileInput" type="file" class="visually-hidden" accept="image/jpeg,image/png,image/webp" @change="selectFile($event)">
                    <p class="empty-error" x-show="error" x-text="error" role="alert"></p>
                </div>
                <div class="workspace-image" x-show="hasImage" x-cloak>
                    <img :src="imageUrl" alt="Selected photo preview">
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
                    <div x-show="activeTool === 'adjust'" class="panel-empty" x-cloak>
                        <p>Upload a photo to unlock the adjustment controls.</p>
                        <div class="panel-preview-lines" aria-hidden="true"><span></span><span></span><span></span></div>
                    </div>
                    <div x-show="activeTool !== 'adjust'" class="panel-empty" x-cloak>
                        <p><span x-text="panelTitle"></span> will appear here once a photo is loaded.</p>
                    </div>
                </div>
            </aside>
        </main>

        <footer class="canvas-controls">
            <div class="canvas-control-group">
                <button type="button" class="canvas-button" aria-label="Zoom out" disabled><i data-lucide="minus" aria-hidden="true"></i></button>
                <span class="zoom-value">Fit</span>
                <button type="button" class="canvas-button" aria-label="Zoom in" disabled><i data-lucide="plus" aria-hidden="true"></i></button>
            </div>
            <span class="canvas-note">Preview resolution will keep editing responsive.</span>
            <button type="button" class="before-button" disabled>Before</button>
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
