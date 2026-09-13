@extends('layouts.app')

@section('title', 'Pancarona — Beautiful color grading')
@section('description', 'Pancarona is a local-first photo editor for beautiful color grading and reference matching.')
@section('body-class', 'site-body')

@section('content')
    <div class="site-shell" x-data="{ mobileMenu: false }">
        <header class="site-header page-width">
            <a href="{{ route('home') }}" class="brand" aria-label="Pancarona home">
                <span class="brand-mark" aria-hidden="true"><img src="{{ asset('pancarona-mark.svg') }}" alt=""></span>
                <span>Pancarona</span>
            </a>

            <nav class="site-nav" :class="{ 'is-open': mobileMenu }" aria-label="Main navigation">
                <a href="#how-it-works">How it works</a>
                <a href="#presets">Presets</a>
                <a href="#privacy">Privacy</a>
                <a href="{{ route('editor') }}" class="button button--small button--light nav-cta">Edit a Photo <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
            </nav>

            <button class="menu-toggle" type="button" aria-label="Toggle navigation" :aria-expanded="mobileMenu" @click="mobileMenu = !mobileMenu">
                <i data-lucide="menu" aria-hidden="true"></i>
            </button>
        </header>

        <main>
            <section class="hero page-width">
                <div class="hero-copy">
                    <p class="eyebrow">A quiet tool for better color</p>
                    <h1>Beautiful color grading.<br><em>Right in your browser.</em></h1>
                    <p class="hero-lede">Edit your photos, create your own presets, or match the color grade of a reference photo.</p>
                    <div class="hero-actions">
                        <a href="{{ route('editor') }}" class="button button--light">Edit a Photo <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
                        <span class="quiet-note">Free <span aria-hidden="true">·</span> No signup <span aria-hidden="true">·</span> No watermark</span>
                    </div>
                </div>

                <div class="hero-preview" aria-label="Pancarona workspace preview">
                    <div class="preview-toolbar">
                        <span class="preview-brand"><span class="brand-mark brand-mark--small" aria-hidden="true"><img src="{{ asset('pancarona-mark.svg') }}" alt=""></span> Pancarona</span>
                        <span class="preview-actions"><i data-lucide="undo-2" aria-hidden="true"></i><i data-lucide="redo-2" aria-hidden="true"></i><span class="preview-export">Export</span></span>
                    </div>
                    <div class="preview-body">
                        <div class="preview-tools">
                            <span class="preview-tool is-active"><i data-lucide="sliders-horizontal" aria-hidden="true"></i>Adjust</span>
                            <span class="preview-tool"><i data-lucide="layers-3" aria-hidden="true"></i>Presets</span>
                            <span class="preview-tool"><i data-lucide="scan-search" aria-hidden="true"></i>Match</span>
                        </div>
                        <div class="preview-image-wrap">
                            <img src="{{ asset('images/editorial-coast.jpg') }}" alt="Editorial coastal road at golden hour" class="preview-image">
                            <span class="preview-chip">Original</span>
                        </div>
                        <div class="preview-panel">
                            <div class="preview-panel-title">LIGHT <span>0</span></div>
                            @foreach (['Exposure', 'Contrast', 'Highlights'] as $control)
                                <div class="preview-control">
                                    <div><span>{{ $control }}</span><span>0</span></div>
                                    <span class="mini-slider"><span></span></span>
                                </div>
                            @endforeach
                            <div class="preview-panel-title preview-panel-title--color">COLOR <span>0</span></div>
                            <div class="preview-control">
                                <div><span>Temperature</span><span>0</span></div>
                                <span class="mini-slider"><span></span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" class="section page-width">
                <div class="section-heading">
                    <p class="eyebrow">See the difference</p>
                    <h2>Small adjustments. A different feeling.</h2>
                    <p>Color grading should make the photograph feel more like itself, not bury it under an interface.</p>
                </div>

                <div class="comparison" x-data="{ split: 52 }">
                    <div class="comparison-stage">
                        <img src="{{ asset('images/editorial-coast.jpg') }}" alt="Before color grading" class="comparison-image">
                        <div class="comparison-after" :style="`clip-path: inset(0 0 0 ${split}%)`">
                            <img src="{{ asset('images/editorial-coast.jpg') }}" alt="After color grading" class="comparison-image comparison-image--graded">
                        </div>
                        <div class="comparison-divider" :style="`left: ${split}%`" aria-hidden="true"><span></span></div>
                        <input x-model="split" class="comparison-input" type="range" min="4" max="96" aria-label="Compare before and after color grading">
                        <span class="comparison-label comparison-label--before">Before</span>
                        <span class="comparison-label comparison-label--after">After</span>
                    </div>
                    <p class="comparison-caption">Drag to compare · A warm, softer grade applied to the same photograph</p>
                </div>
            </section>

            <section class="section section--match page-width">
                <div class="section-heading section-heading--split">
                    <div>
                        <p class="eyebrow">Match Reference</p>
                        <h2>Start with a feeling you already like.</h2>
                    </div>
                    <p>Use another photo as a visual source. Pancarona reads its tonal and color character, then gives you an editable starting point.</p>
                </div>

                <div class="match-story">
                    <div class="match-card">
                        <span class="match-label">Your photo</span>
                        <img src="{{ asset('images/editorial-coast.jpg') }}" alt="Target photo" class="match-image">
                    </div>
                    <div class="match-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><span>Match grade</span></div>
                    <div class="match-card match-card--reference">
                        <span class="match-label">Reference</span>
                        <img src="{{ asset('images/editorial-coast.jpg') }}" alt="Reference photo" class="match-image match-image--reference">
                    </div>
                    <div class="match-result">
                        <span class="match-label">Editable result</span>
                        <img src="{{ asset('images/editorial-coast.jpg') }}" alt="Matched result" class="match-image match-image--result">
                    </div>
                </div>
            </section>

            <section id="presets" class="section section--presets page-width">
                <div class="section-heading">
                    <p class="eyebrow">Presets</p>
                    <h2>A considered starting point.</h2>
                    <p>Use a built-in look, tune its intensity, then make it yours. Your own presets stay in your browser.</p>
                </div>
                <div class="preset-strip">
                    @foreach ([['Natural', 'natural'], ['Warm Film', 'warm'], ['Soft', 'soft'], ['Moody', 'moody']] as [$name, $tone])
                        <div class="preset-sample">
                            <div class="preset-image preset-image--{{ $tone }}"><img src="{{ asset('images/editorial-coast.jpg') }}" alt="{{ $name }} preset preview"></div>
                            <div class="preset-name"><span>{{ $name }}</span><span>0%</span></div>
                        </div>
                    @endforeach
                </div>
            </section>

            <section id="privacy" class="privacy-band">
                <div class="page-width privacy-inner">
                    <div>
                        <p class="eyebrow">Private by default</p>
                        <h2>Your photos stay on your device.</h2>
                    </div>
                    <p>Editing is designed to happen in your browser. No account, no cloud library, and no watermark on the export.</p>
                </div>
            </section>

            <section class="final-cta page-width">
                <p class="eyebrow">Make the first edit</p>
                <h2>Give your photos a little room to breathe.</h2>
                <a href="{{ route('editor') }}" class="button button--light">Edit a Photo <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
            </section>
        </main>

        <footer class="site-footer page-width">
            <a href="{{ route('home') }}" class="brand"><span class="brand-mark" aria-hidden="true"><img src="{{ asset('pancarona-mark.svg') }}" alt=""></span><span>Pancarona</span></a>
            <p>Simple tools for thoughtful color.</p>
        </footer>
    </div>
@endsection
