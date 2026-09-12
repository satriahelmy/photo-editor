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

window.Alpine = Alpine;

window.editorShell = () => ({
    activeTool: 'adjust',
    hasImage: false,
    imageUrl: '',
    error: '',
    tools: [
        { id: 'adjust', label: 'Adjust', icon: 'sliders-horizontal' },
        { id: 'presets', label: 'Presets', icon: 'layers-3' },
        { id: 'match', label: 'Match', icon: 'scan-search' },
        { id: 'crop', label: 'Crop', icon: 'crop' },
        { id: 'frame', label: 'Frame', icon: 'frame' },
    ],
    get activeToolLabel() {
        return this.tools.find((tool) => tool.id === this.activeTool)?.label ?? 'Tool';
    },
    get panelTitle() {
        return this.activeTool === 'adjust' ? 'Adjustments' : this.activeToolLabel;
    },
    selectFile(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            this.error = "This image couldn't be opened. Try a JPG, PNG, or WebP file.";
            return;
        }

        this.error = '';
        this.hasImage = true;
        this.imageUrl = URL.createObjectURL(file);
    },
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
