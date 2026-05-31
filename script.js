// ==================== Global State ====================
const state = {
    animation: {
        text: 'Flash This!',
        type: 'ltr',
        speed: 1,
        layerGap: 26,
        loop: true,
        random: false,
    },
    text: {
        color: '#00ff00',
        font: "'Arial', sans-serif",
        bold: false,
        italic: false,
        underline: false,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowColor: '#000000',
        glowIntensity: 0,
        glowColor: '#00ff00',
        strokeWidth: 0,
        strokeColor: '#ffffff',
        size: 60,
        rotation: 0,
    },
    background: {
        type: 'solid',
        color: '#000000',
        gradientEnd: '#ff00ff',
    },
    effects: {
        visual: 'none',
        flashIntensity: 0,
        motionBlur: 0,
        screenShake: 0,
    },
    popup: {
        title: 'Hello!',
        message: 'This is a popup',
        width: 400,
        height: 250,
        textColor: '#ffffff',
        bgColor: '#1f2431',
        borderColor: '#4f6fab',
        borderWidth: 2,
        animation: 'fade',
        count: 1,
        style: 'modern',
        sequence: false,
    },
    followup: {
        enabled: false,
        delay: 2,
        title: 'Follow-up',
        message: 'This is the follow-up',
        width: 300,
        position: 'center',
    },
    presets: [],
    layers: [
        { id: 1, text: 'Flash This!', followupEnabled: false, followupMessage: '', followupLayers: [] }
    ],
    isPlaying: false,
};

let animationId = null;
let effectParticles = [];

// ==================== DOM Elements ====================
const previewCanvas = document.getElementById('previewCanvas');
const animationTextInput = document.getElementById('animationText');
const textLayersContainer = document.getElementById('textLayersContainer');
const addLayerBtn = document.getElementById('addLayerBtn');
const animationTypeSelect = document.getElementById('animationType');
const animationSpeedSlider = document.getElementById('animationSpeed');
const textSizeSlider = document.getElementById('textSize');
const textRotationSlider = document.getElementById('textRotation');
const textColorPicker = document.getElementById('textColor');
const layerGapSlider = document.getElementById('layerGap');
const backgroundTypeSelect = document.getElementById('backgroundType');
const backgroundColorPicker = document.getElementById('backgroundColor');
const gradientColorPicker = document.getElementById('gradientColor');
const fontFamilySelect = document.getElementById('fontFamily');
const boldCheckbox = document.getElementById('boldText');
const italicCheckbox = document.getElementById('italicText');
const underlineCheckbox = document.getElementById('underlineText');
const shadowXSlider = document.getElementById('shadowX');
const shadowYSlider = document.getElementById('shadowY');
const shadowBlurSlider = document.getElementById('shadowBlur');
const shadowColorPicker = document.getElementById('shadowColor');
const glowIntensitySlider = document.getElementById('glowIntensity');
const glowColorPicker = document.getElementById('glowColor');
const strokeWidthSlider = document.getElementById('strokeWidth');
const strokeColorPicker = document.getElementById('strokeColor');
const loopCheckbox = document.getElementById('loopAnimation');
const randomPatternCheckbox = document.getElementById('randomPattern');
const visualEffectSelect = document.getElementById('visualEffect');
const flashIntensitySlider = document.getElementById('flashIntensity');
const motionBlurSlider = document.getElementById('motionBlur');
const screenShakeSlider = document.getElementById('screenShake');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

// Popup inputs
const popupTitleInput = document.getElementById('popupTitle');
const popupMessageInput = document.getElementById('popupMessage');
const popupWidthSlider = document.getElementById('popupWidth');
const popupHeightSlider = document.getElementById('popupHeight');
const popupTextColorPicker = document.getElementById('popupTextColor');
const popupBgColorPicker = document.getElementById('popupBgColor');
const popupBorderColorPicker = document.getElementById('popupBorderColor');
const popupBorderWidthSlider = document.getElementById('popupBorderWidth');
const popupAnimationSelect = document.getElementById('popupAnimation');
const popupCountSlider = document.getElementById('popupCount');
const popupStyleSelect = document.getElementById('popupStyle');
const popupSequenceCheckbox = document.getElementById('popupSequence');
const enableFollowupCheckbox = document.getElementById('enableFollowup');
const followupSection = document.getElementById('followupSection');
const followupDelaySlider = document.getElementById('followupDelay');
const followupTitleInput = document.getElementById('followupTitle');
const followupMessageInput = document.getElementById('followupMessage');
const followupWidthSlider = document.getElementById('followupWidth');
const followupPositionSelect = document.getElementById('followupPosition');
const launchPopupBtn = document.getElementById('launchPopupBtn');

// Other elements
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const templateBtns = document.querySelectorAll('.template-btn');
const gradientLabel = document.getElementById('gradientLabel');
const gradientColorGroup = document.getElementById('gradientColorGroup');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const presetNameInput = document.getElementById('presetName');
const savePresetBtn = document.getElementById('savePresetBtn');
const presetsContainer = document.getElementById('presetsContainer');
const popupContainer = document.getElementById('popupContainer');
let activePopups = 0; // track how many main popups are currently open
const followupAfterAllCheckbox = document.getElementById('followupAfterAll');
let followupRunning = false; // prevent re-entrancy of followup chains

// ==================== Initialization ====================
function init() {
    setupEventListeners();
    loadPresetsFromStorage();
    renderTextLayers();
    updatePreview();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Tab navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Animation controls
    animationTypeSelect.addEventListener('change', (e) => {
        state.animation.type = e.target.value;
        updatePreview();
    });

    animationSpeedSlider.addEventListener('input', (e) => {
        state.animation.speed = parseFloat(e.target.value);
        document.getElementById('speedValue').textContent = e.target.value + 'x';
        updatePreview();
    });

    textSizeSlider.addEventListener('input', (e) => {
        state.text.size = parseInt(e.target.value);
        document.getElementById('sizeValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    textRotationSlider.addEventListener('input', (e) => {
        state.text.rotation = parseInt(e.target.value);
        document.getElementById('rotationValue').textContent = e.target.value + '°';
        updatePreview();
    });

    textColorPicker.addEventListener('change', (e) => {
        state.text.color = e.target.value;
        document.getElementById('colorValue').textContent = e.target.value;
        updatePreview();
    });

    layerGapSlider.addEventListener('input', (e) => {
        state.animation.layerGap = parseInt(e.target.value, 10);
        document.getElementById('layerGapValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    backgroundTypeSelect.addEventListener('change', (e) => {
        state.background.type = e.target.value;
        gradientLabel.style.display = e.target.value === 'gradient' ? 'block' : 'none';
        gradientColorGroup.style.display = e.target.value === 'gradient' ? 'flex' : 'none';
        updatePreview();
    });

    backgroundColorPicker.addEventListener('change', (e) => {
        state.background.color = e.target.value;
        document.getElementById('bgColorValue').textContent = e.target.value;
        updatePreview();
    });

    gradientColorPicker.addEventListener('change', (e) => {
        state.background.gradientEnd = e.target.value;
        document.getElementById('gradColorValue').textContent = e.target.value;
        updatePreview();
    });

    fontFamilySelect.addEventListener('change', (e) => {
        state.text.font = e.target.value;
        updatePreview();
    });

    boldCheckbox.addEventListener('change', (e) => {
        state.text.bold = e.target.checked;
        updatePreview();
    });

    italicCheckbox.addEventListener('change', (e) => {
        state.text.italic = e.target.checked;
        updatePreview();
    });

    underlineCheckbox.addEventListener('change', (e) => {
        state.text.underline = e.target.checked;
        updatePreview();
    });

    shadowXSlider.addEventListener('input', (e) => {
        state.text.shadowX = parseInt(e.target.value);
        document.getElementById('shadowXValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    shadowYSlider.addEventListener('input', (e) => {
        state.text.shadowY = parseInt(e.target.value);
        document.getElementById('shadowYValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    shadowBlurSlider.addEventListener('input', (e) => {
        state.text.shadowBlur = parseInt(e.target.value);
        document.getElementById('shadowBlurValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    shadowColorPicker.addEventListener('change', (e) => {
        state.text.shadowColor = e.target.value;
        updatePreview();
    });

    glowIntensitySlider.addEventListener('input', (e) => {
        state.text.glowIntensity = parseInt(e.target.value);
        document.getElementById('glowValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    glowColorPicker.addEventListener('change', (e) => {
        state.text.glowColor = e.target.value;
        updatePreview();
    });

    strokeWidthSlider.addEventListener('input', (e) => {
        state.text.strokeWidth = parseFloat(e.target.value);
        document.getElementById('strokeValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    strokeColorPicker.addEventListener('change', (e) => {
        state.text.strokeColor = e.target.value;
        updatePreview();
    });

    loopCheckbox.addEventListener('change', (e) => {
        state.animation.loop = e.target.checked;
    });

    randomPatternCheckbox.addEventListener('change', (e) => {
        state.animation.random = e.target.checked;
    });

    visualEffectSelect.addEventListener('change', (e) => {
        state.effects.visual = e.target.value;
        updatePreview();
    });

    flashIntensitySlider.addEventListener('input', (e) => {
        state.effects.flashIntensity = parseFloat(e.target.value);
        document.getElementById('flashValue').textContent = Math.round(e.target.value * 100) + '%';
        updatePreview();
    });

    motionBlurSlider.addEventListener('input', (e) => {
        state.effects.motionBlur = parseInt(e.target.value);
        document.getElementById('blurValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    screenShakeSlider.addEventListener('input', (e) => {
        state.effects.screenShake = parseInt(e.target.value);
        document.getElementById('shakeValue').textContent = e.target.value + 'px';
        updatePreview();
    });

    animationTextInput.addEventListener('input', (e) => {
        state.animation.text = e.target.value;
        if (state.layers.length > 0) {
            state.layers[0].text = e.target.value;
        }
        updatePreview();
        renderTextLayers();
    });

    addLayerBtn.addEventListener('click', addTextLayer);

    // Play/Stop/Reset buttons
    playBtn.addEventListener('click', startAnimation);
    stopBtn.addEventListener('click', stopAnimation);
    resetBtn.addEventListener('click', resetPreview);

    // Popup controls
    popupWidthSlider.addEventListener('input', (e) => {
        state.popup.width = parseInt(e.target.value);
        document.getElementById('popupWidthValue').textContent = e.target.value + 'px';
    });

    popupHeightSlider.addEventListener('input', (e) => {
        state.popup.height = parseInt(e.target.value);
        document.getElementById('popupHeightValue').textContent = e.target.value + 'px';
    });

    popupBorderWidthSlider.addEventListener('input', (e) => {
        state.popup.borderWidth = parseInt(e.target.value);
        document.getElementById('popupBorderValue').textContent = e.target.value + 'px';
    });

    popupTitleInput.addEventListener('input', (e) => {
        state.popup.title = e.target.value;
    });

    popupMessageInput.addEventListener('input', (e) => {
        state.popup.message = e.target.value;
    });

    popupTextColorPicker.addEventListener('change', (e) => {
        state.popup.textColor = e.target.value;
    });

    popupBgColorPicker.addEventListener('change', (e) => {
        state.popup.bgColor = e.target.value;
    });

    popupBorderColorPicker.addEventListener('change', (e) => {
        state.popup.borderColor = e.target.value;
    });

    popupAnimationSelect.addEventListener('change', (e) => {
        state.popup.animation = e.target.value;
    });

    popupCountSlider.addEventListener('input', (e) => {
        state.popup.count = parseInt(e.target.value, 10);
        document.getElementById('popupCountValue').textContent = e.target.value;
    });

    popupStyleSelect.addEventListener('change', (e) => {
        state.popup.style = e.target.value;
    });

    popupSequenceCheckbox.addEventListener('change', (e) => {
        state.popup.sequence = e.target.checked;
    });

    // Follow-up chain UI elements
    const followupList = document.getElementById('followupList');
    const addFollowupBtn = document.getElementById('addFollowupBtn');

    enableFollowupCheckbox.addEventListener('change', (e) => {
        state.followup.enabled = e.target.checked;
        followupSection.style.display = e.target.checked ? 'block' : 'none';
    });

    addFollowupBtn.addEventListener('click', () => {
        if (!state.popup.followupChain) state.popup.followupChain = [];
        state.popup.followupChain.push({ title: 'Follow-up', message: 'Next message...', delay: 0.5, width: 300, position: 'center', textColor: state.popup.textColor, target: 'all', animation: state.popup.animation });
        renderFollowupList();
    });

    function renderFollowupList() {
        followupList.innerHTML = '';
        const chain = state.popup.followupChain || [];
        if (chain.length === 0) {
            followupList.innerHTML = '<p class="empty-state">No follow-ups yet.</p>';
            return;
        }

        chain.forEach((f, i) => {
            const row = document.createElement('div');
            row.className = 'followup-row';
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '1fr 1fr 80px 40px';
            row.style.gap = '8px';
            row.style.alignItems = 'center';
            row.style.marginBottom = '8px';

            // build target options based on popup count
            let targetOptions = `<option value="all" ${f.target === 'all' ? 'selected' : ''}>All</option>`;
            for (let p = 1; p <= Math.max(1, state.popup.count); p++) {
                targetOptions += `<option value="${p}" ${f.target === p ? 'selected' : ''}>Popup ${p}</option>`;
            }

            row.innerHTML = `
                    <input type="text" class="form-input followup-title-input" data-index="${i}" value="${escapeHtml(f.title)}" placeholder="Title...">
                    <input type="text" class="form-input followup-message-input" data-index="${i}" value="${escapeHtml(f.message)}" placeholder="Message...">
                    <div style="display:flex; gap:8px; align-items:center;">
                        <select class="form-select followup-target-select" data-index="${i}">${targetOptions}</select>
                        <input type="color" class="followup-text-color" data-index="${i}" value="${f.textColor || state.popup.textColor}">
                        <input type="number" class="form-input followup-width-input" data-index="${i}" value="${f.width || state.popup.width}" min="100" max="1200" style="width:80px;" title="Width px">
                        <select class="form-select followup-position-select" data-index="${i}">
                            <option value="center" ${f.position==='center'?'selected':''}>Center</option>
                            <option value="bottom-right" ${f.position==='bottom-right'?'selected':''}>Bottom Right</option>
                            <option value="bottom-left" ${f.position==='bottom-left'?'selected':''}>Bottom Left</option>
                            <option value="top-right" ${f.position==='top-right'?'selected':''}>Top Right</option>
                            <option value="top-left" ${f.position==='top-left'?'selected':''}>Top Left</option>
                        </select>
                        <select class="form-select followup-animation-select" data-index="${i}">
                            <option value="fade" ${f.animation==='fade'?'selected':''}>Fade</option>
                            <option value="scale" ${f.animation==='scale'?'selected':''}>Scale</option>
                            <option value="slide" ${f.animation==='slide'?'selected':''}>Slide</option>
                            <option value="bounce" ${f.animation==='bounce'?'selected':''}>Bounce</option>
                            <option value="none" ${f.animation==='none'?'selected':''}>None</option>
                        </select>
                        <input type="number" class="form-input followup-delay-input" data-index="${i}" value="${f.delay}" min="0" step="0.25" title="Delay seconds" style="width:72px;">
                        <button class="btn-small remove-followup-btn" data-index="${i}">✕</button>
                    </div>
                `;

            followupList.appendChild(row);
        });

        // Attach handlers
        followupList.querySelectorAll('.followup-title-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].title = e.target.value;
            });
        });
        followupList.querySelectorAll('.followup-message-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].message = e.target.value;
            });
        });
        followupList.querySelectorAll('.followup-delay-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].delay = parseFloat(e.target.value) || 0;
            });
        });
        followupList.querySelectorAll('.followup-target-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
                state.popup.followupChain[idx].target = val;
            });
        });
        followupList.querySelectorAll('.followup-text-color').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].textColor = e.target.value;
            });
        });
        followupList.querySelectorAll('.followup-width-input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].width = parseInt(e.target.value, 10) || state.popup.width;
            });
        });
        followupList.querySelectorAll('.followup-position-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].position = e.target.value;
            });
        });
        followupList.querySelectorAll('.followup-animation-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain[idx].animation = e.target.value;
            });
        });
        followupList.querySelectorAll('.remove-followup-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                state.popup.followupChain.splice(idx, 1);
                renderFollowupList();
            });
        });
    }

    launchPopupBtn.addEventListener('click', launchPopup);

    // Template buttons
    templateBtns.forEach(btn => {
        btn.addEventListener('click', loadTemplate);
    });

    // Export/Import
    exportBtn.addEventListener('click', exportSettings);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importSettings);

    // Presets
    savePresetBtn.addEventListener('click', savePreset);
}

function renderTextLayers() {
    textLayersContainer.innerHTML = '';

    if (state.layers.length === 0) {
        textLayersContainer.innerHTML = '<p class="empty-state">No text layers yet.</p>';
        return;
    }

    state.layers.forEach((layer, index) => {
        const layerRow = document.createElement('div');
        layerRow.className = 'layer-row';
        layerRow.innerHTML = `
            <input type="text" class="form-input layer-input" data-index="${index}" value="${layer.text}" placeholder="Enter layer text...">
            <button type="button" class="btn-small remove-layer-btn" data-index="${index}" title="Remove layer">✕</button>
        `;
        textLayersContainer.appendChild(layerRow);
    });

    textLayersContainer.querySelectorAll('.layer-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            state.layers[index].text = e.target.value;
            if (index === 0) {
                state.animation.text = e.target.value;
                animationTextInput.value = e.target.value;
            }
            updatePreview();
        });
    });

    // no per-layer follow-ups anymore

    textLayersContainer.querySelectorAll('.remove-layer-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            removeTextLayer(index);
        });
    });
}

function addTextLayer() {
    state.layers.push({
        id: Date.now(),
        text: 'New Layer',
    });
    renderTextLayers();
    updatePreview();
}

function removeTextLayer(index) {
    state.layers.splice(index, 1);
    if (state.layers.length === 0) {
        state.layers.push({ id: 1, text: state.animation.text || 'Flash This!' });
    }
    renderTextLayers();
    updatePreview();
}

// ==================== Tab Switching ====================
function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Update active button
    navBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
}

// ==================== Preview Update ====================
function updatePreview() {
    previewCanvas.innerHTML = '';

    const layers = state.layers.length > 0 ? state.layers : [{ id: 1, text: state.animation.text }];

    // Set background
    if (state.background.type === 'gradient') {
        previewCanvas.style.background = `linear-gradient(135deg, ${state.background.color} 0%, ${state.background.gradientEnd} 100%)`;
    } else if (state.background.type === 'transparent') {
        previewCanvas.style.background = 'transparent';
    } else {
        previewCanvas.style.background = state.background.color;
    }

    // Apply screen effects
    if (state.effects.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.effects.screenShake;
        const shakeY = (Math.random() - 0.5) * state.effects.screenShake;
        previewCanvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
    } else {
        previewCanvas.style.transform = 'none';
    }

    layers.forEach((layer, index) => {
        const textEl = document.createElement('div');
        textEl.className = `animated-text animation-${state.animation.type}`;
        textEl.textContent = layer.text;
        textEl.style.top = '50%';
        textEl.style.left = '50%';

        const offset = (index - (layers.length - 1) / 2) * state.animation.layerGap;
        const offsetX = state.animation.type === 'diagonal' ? offset : 0;
        const offsetY = offset;

        applyTextStyling(textEl, offsetX, offsetY);

        const duration = 3 / state.animation.speed;
        textEl.style.animation = `${getAnimationName(state.animation.type)} ${duration}s ${state.animation.loop ? 'infinite' : '1'} linear`;

        if (index > 0) {
            textEl.style.opacity = '0.9';
        }

        previewCanvas.appendChild(textEl);
    });

    // Add visual effects
    if (state.effects.visual !== 'none' && state.isPlaying) {
        createVisualEffect();
    }

    // Apply flash overlay
    if (state.effects.flashIntensity > 0) {
        const flashOverlay = document.createElement('div');
        flashOverlay.style.position = 'absolute';
        flashOverlay.style.top = '0';
        flashOverlay.style.left = '0';
        flashOverlay.style.width = '100%';
        flashOverlay.style.height = '100%';
        flashOverlay.style.background = `rgba(255, 255, 255, ${state.effects.flashIntensity})`;
        flashOverlay.style.pointerEvents = 'none';
        flashOverlay.style.animation = 'flash 0.5s ease-in-out infinite';
        previewCanvas.appendChild(flashOverlay);
    }
}

function applyTextStyling(element, offsetX = 0, offsetY = 0) {
    const transformOffset = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${state.text.rotation}deg)`;
    const styles = {
        fontSize: state.text.size + 'px',
        fontFamily: state.text.font,
        color: state.text.color,
        fontWeight: state.text.bold ? 'bold' : 'normal',
        fontStyle: state.text.italic ? 'italic' : 'normal',
        textDecoration: state.text.underline ? 'underline' : 'none',
        textShadow: `${state.text.shadowX}px ${state.text.shadowY}px ${state.text.shadowBlur}px ${state.text.shadowColor}`,
        transform: transformOffset,
        whiteSpace: 'nowrap',
    };

    // Add glow effect
    if (state.text.glowIntensity > 0) {
        styles.textShadow = `0 0 ${state.text.glowIntensity}px ${state.text.glowColor}, ${state.text.shadowX}px ${state.text.shadowY}px ${state.text.shadowBlur}px ${state.text.shadowColor}`;
    }

    // Add stroke effect with -webkit-text-stroke
    if (state.text.strokeWidth > 0) {
        element.style.WebkitTextStroke = `${state.text.strokeWidth}px ${state.text.strokeColor}`;
    }

    // Apply motion blur if needed
    if (state.effects.motionBlur > 0) {
        element.style.filter = `blur(${state.effects.motionBlur}px)`;
    }

    Object.assign(element.style, styles);
}

function getAnimationName(type) {
    const animationMap = {
        'ltr': 'moveLeft',
        'rtl': 'moveRight',
        'ttb': 'moveDown',
        'btt': 'moveUp',
        'diagonal': 'moveDiagonal',
        'flash': 'flash',
        'bounce': 'bounceText',
        'rotate': 'spin',
        'zigzag': 'zigzagMove',
    };
    return animationMap[type] || 'moveLeft';
}

// ==================== Animation Control ====================
function startAnimation() {
    state.isPlaying = true;
    playBtn.textContent = '⏸ Pause';
    playBtn.style.background = '#ff9900';
    playBtn.removeEventListener('click', startAnimation);
    playBtn.addEventListener('click', pauseAnimation);
    updatePreview();
    createEffectLoop();
}

function pauseAnimation() {
    state.isPlaying = false;
    playBtn.textContent = '▶ Play';
    playBtn.style.background = '#00ff00';
    playBtn.removeEventListener('click', pauseAnimation);
    playBtn.addEventListener('click', startAnimation);
    cancelAnimationFrame(animationId);
}

function stopAnimation() {
    state.isPlaying = false;
    playBtn.textContent = '▶ Play';
    playBtn.style.background = '#00ff00';
    playBtn.removeEventListener('click', pauseAnimation);
    playBtn.addEventListener('click', startAnimation);
    cancelAnimationFrame(animationId);
    updatePreview();
}

function resetPreview() {
    stopAnimation();
    updatePreview();
}

function createEffectLoop() {
    if (!state.isPlaying) return;
    
    if (state.effects.visual !== 'none') {
        createVisualEffect();
    }
    
    if (state.animation.random) {
        // Change animation type randomly every 3 seconds
        if (Math.random() < 0.05) {
            const types = ['ltr', 'rtl', 'ttb', 'btt', 'diagonal', 'bounce'];
            state.animation.type = types[Math.floor(Math.random() * types.length)];
            updatePreview();
        }
    }
    
    animationId = requestAnimationFrame(createEffectLoop);
}

// ==================== Visual Effects ====================
function createVisualEffect() {
    const effect = state.effects.visual;
    
    switch(effect) {
        case 'sparkles':
            createSparkles();
            break;
        case 'particles':
            createParticles();
            break;
        case 'fire':
            createFire();
            break;
        case 'confetti':
            createConfetti();
            break;
        case 'lightning':
            createLightning();
            break;
        case 'matrix':
            createMatrixRain();
            break;
        case 'shapes':
            createShapes();
            break;
        case 'emojis':
            createEmojis();
            break;
    }
}

function createSparkles() {
    const count = Math.random() * 5 + 3;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        previewCanvas.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
}

function createParticles() {
    const count = Math.random() * 8 + 5;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = state.text.color;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `sparkleFloat 2s ease-out forwards`;
        previewCanvas.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function createConfetti() {
    const count = 10;
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '0';
        piece.style.background = randomColor();
        piece.style.position = 'absolute';
        piece.style.animation = `confettiFall 3s ease-out forwards`;
        previewCanvas.appendChild(piece);
        
        setTimeout(() => piece.remove(), 3000);
    }
}

function createFire() {
    const fire = document.createElement('div');
    fire.style.position = 'absolute';
    fire.style.left = '50%';
    fire.style.top = '50%';
    fire.style.width = '30px';
    fire.style.height = '50px';
    fire.style.background = 'radial-gradient(ellipse at center, #ff0000, transparent)';
    fire.style.borderRadius = '50% 50% 50% 50%';
    fire.style.filter = 'blur(5px)';
    fire.style.animation = 'spin 2s linear infinite';
    previewCanvas.appendChild(fire);
    
    setTimeout(() => fire.remove(), 2000);
}

function createLightning() {
    const lightning = document.createElement('div');
    lightning.style.position = 'absolute';
    lightning.style.left = Math.random() * 100 + '%';
    lightning.style.top = '0';
    lightning.style.width = '3px';
    lightning.style.height = '200px';
    lightning.style.background = 'linear-gradient(180deg, #ffff00, #0099ff)';
    lightning.style.boxShadow = '0 0 20px #0099ff';
    lightning.style.animation = 'moveDown 1s linear forwards';
    previewCanvas.appendChild(lightning);
    
    setTimeout(() => lightning.remove(), 1000);
}

function createMatrixRain() {
    const chars = ['0', '1', '█', '▓', '░', '═', '║', '╬'];
    const char = chars[Math.floor(Math.random() * chars.length)];
    const rain = document.createElement('div');
    rain.textContent = char;
    rain.style.position = 'absolute';
    rain.style.left = Math.random() * 100 + '%';
    rain.style.top = '0';
    rain.style.color = state.text.color;
    rain.style.fontSize = '20px';
    rain.style.opacity = '0.7';
    rain.style.animation = 'moveDown 3s linear forwards';
    previewCanvas.appendChild(rain);
    
    setTimeout(() => rain.remove(), 3000);
}

function createShapes() {
    const shapes = ['circle', 'square', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.background = state.text.color;
    el.style.animation = 'spin 3s linear infinite';
    
    if (shape === 'circle') {
        el.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
        el.style.width = '0';
        el.style.height = '0';
        el.style.borderLeft = '10px solid transparent';
        el.style.borderRight = '10px solid transparent';
        el.style.borderBottom = `20px solid ${state.text.color}`;
        el.style.background = 'transparent';
    }
    
    previewCanvas.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function createEmojis() {
    const emojis = ['✨', '⭐', '🌟', '💫', '🎉', '🎊', '🎈', '🎆'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const el = document.createElement('div');
    el.textContent = emoji;
    el.style.position = 'absolute';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.fontSize = '28px';
    el.style.animation = 'sparkleFloat 2s ease-out forwards';
    previewCanvas.appendChild(el);
    
    setTimeout(() => el.remove(), 2000);
}

function randomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== Popup System ====================
function launchPopup() {
    const delayStep = state.popup.sequence ? 350 : 0;
    for (let i = 0; i < state.popup.count; i++) {
        setTimeout(() => createPopupInstance(i), i * delayStep);
    }

    // Schedule per-layer follow-ups if enabled on layers
    const baseFollowupDelay = state.followup.delay * 1000 + (state.popup.sequence ? state.popup.count * delayStep : 0);
    state.layers.forEach((layer, idx) => {
        if (layer.followupEnabled && layer.followupMessage && layer.followupMessage.trim()) {
            // stagger per-layer followups slightly
            setTimeout(() => showLayerFollowup(layer, idx), baseFollowupDelay + idx * 300);
        }
    });
}

function showLayerFollowup(layer, index) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.background = 'rgba(0, 0, 0, 0.35)';

    const popup = document.createElement('div');
    popup.className = `popup-box ${state.popup.style}`;
    popup.style.width = state.followup.width + 'px';
    popup.style.backgroundColor = state.popup.style === 'classic' ? '#e8e8e8' : state.popup.bgColor;
    popup.style.borderWidth = state.popup.borderWidth + 'px';
    popup.style.borderStyle = 'solid';
    popup.style.borderColor = state.popup.style === 'classic' ? '#999' : state.popup.borderColor;
    popup.style.marginTop = `${index * 12}px`;
    popup.style.marginLeft = `${index * 12}px`;

    const content = document.createElement('div');
    content.className = state.popup.style === 'classic' ? 'popup-classic-content' : 'popup-content';

    // Title / header
    if (state.popup.style === 'classic') {
        const header = document.createElement('div');
        header.className = 'popup-classic-header';
        header.innerHTML = `
            <span>${escapeHtml(layer.text)}</span>
            <button class="popup-classic-close">✕</button>
        `;
        popup.appendChild(header);
    } else {
        const title = document.createElement('div');
        title.className = 'popup-title';
        title.style.color = state.popup.textColor;
        title.textContent = layer.text;
        content.appendChild(title);
    }

    // Follow-up content: either multiple followupLayers or legacy followupMessage
    if (layer.followupLayers && layer.followupLayers.length) {
        layer.followupLayers.forEach((fl, i) => {
            const line = document.createElement('div');
            line.className = 'popup-followup-layer';
            line.style.color = (fl.style && fl.style.color) || state.popup.textColor;
            line.style.marginTop = i === 0 ? '6px' : '4px';
            line.style.fontSize = ((fl.style && fl.style.fontSize) || 14) + 'px';
            if (fl.style && fl.style.bold) line.style.fontWeight = '700';
            if (fl.style && fl.style.italic) line.style.fontStyle = 'italic';
            line.textContent = fl.text || '';
            content.appendChild(line);
        });
    } else {
        const msg = document.createElement('div');
        msg.className = 'popup-message';
        msg.style.color = state.popup.textColor;
        msg.style.fontSize = '14px';
        msg.innerHTML = escapeHtml(layer.followupMessage || '');
        content.appendChild(msg);
    }

    const btnRow = document.createElement('div');
    btnRow.className = 'popup-buttons';
    btnRow.innerHTML = `<button class="popup-button">Close</button>`;
    content.appendChild(btnRow);

    popup.appendChild(content);

    overlay.appendChild(popup);
    popupContainer.appendChild(overlay);
    // track active main popups
    activePopups += 1;

    const closePopup = () => {
        overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });

    popup.querySelectorAll('.popup-button, .popup-classic-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closePopup();
            // trigger follow-up chain attached to popups when enabled
            if (state.followup.enabled && Array.isArray(state.popup.followupChain) && state.popup.followupChain.length) {
                // start chain after optional delay of first followup
                setTimeout(() => showFollowupChain(state.popup.followupChain, 0), 50);
            }
        });
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createPopupInstance(index) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = `popup-box ${state.popup.style}`;
    popup.style.width = state.popup.width + 'px';
    popup.style.height = state.popup.height + 'px';
    popup.style.backgroundColor = state.popup.style === 'classic' ? '#e8e8e8' : state.popup.bgColor;
    popup.style.borderWidth = state.popup.borderWidth + 'px';
    popup.style.borderStyle = 'solid';
    popup.style.borderColor = state.popup.style === 'classic' ? '#999' : state.popup.borderColor;
    popup.style.animation = getPopupAnimation(state.popup.animation);
    popup.style.marginTop = `${index * 14}px`;
    popup.style.marginLeft = `${index * 14}px`;

    if (state.popup.style === 'classic') {
        const header = document.createElement('div');
        header.className = 'popup-classic-header';
        header.innerHTML = `
            <span>${state.popup.title}</span>
            <button class="popup-classic-close">✕</button>
        `;
        const content = document.createElement('div');
        content.className = 'popup-classic-content';
        content.innerHTML = `
            <div class="popup-message" style="color: #111; font-size: 14px;">${state.popup.message}</div>
            <div class="popup-buttons">
                <button class="popup-button">OK</button>
            </div>
        `;
        popup.appendChild(header);
        popup.appendChild(content);
    } else {
        const content = document.createElement('div');
        content.className = 'popup-content';
        content.innerHTML = `
            <div class="popup-title" style="color: ${state.popup.textColor};">${state.popup.title}</div>
            <div class="popup-message" style="color: ${state.popup.textColor};">${state.popup.message}</div>
            <div class="popup-buttons">
                <button class="popup-button">OK</button>
            </div>
        `;
        popup.appendChild(content);
    }

    overlay.appendChild(popup);
    popupContainer.appendChild(overlay);

    const closePopup = () => {
        overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });

    popup.querySelectorAll('.popup-button, .popup-classic-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closePopup();
            activePopups = Math.max(0, activePopups - 1);

            if (!state.followup.enabled || !Array.isArray(state.popup.followupChain) || !state.popup.followupChain.length) return;
            if (followupRunning) return; // already running a followup chain

            // If configured to wait for all popups, only trigger when none remain
            if (state.popup.followupAfterAll || followupAfterAllCheckbox && followupAfterAllCheckbox.checked) {
                if (activePopups === 0) {
                    // trigger followups targeted to 'all'
                    const list = state.popup.followupChain.filter(f => f.target === 'all');
                    if (list.length) {
                        followupRunning = true;
                        showFollowupChain(list, 0);
                    }
                }
            } else {
                // trigger followups targeted to this popup index or 'all'
                const list = state.popup.followupChain.filter(f => f.target === index || f.target === 'all');
                if (list.length) {
                    followupRunning = true;
                    showFollowupChain(list, 0);
                }
            }
        });
    });
}

function showFollowupPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.background = 'rgba(0, 0, 0, 0.35)';
    
    const popup = document.createElement('div');
    popup.className = `popup-box ${state.popup.style}`;
    popup.style.width = state.followup.width + 'px';
    popup.style.backgroundColor = state.popup.style === 'classic' ? '#e8e8e8' : state.popup.bgColor;
    popup.style.borderWidth = state.popup.borderWidth + 'px';
    popup.style.borderStyle = 'solid';
    popup.style.borderColor = state.popup.style === 'classic' ? '#999' : state.popup.borderColor;

    const positionClass = state.followup.position;
    if (positionClass !== 'center') {
        overlay.style.justifyContent = positionClass.includes('left') ? 'flex-start' : 'flex-end';
        overlay.style.alignItems = positionClass.includes('top') ? 'flex-start' : 'flex-end';
        popup.style.margin = '20px';
    }

    if (state.popup.style === 'classic') {
        const header = document.createElement('div');
        header.className = 'popup-classic-header';
        header.innerHTML = `
            <span>${state.followup.title}</span>
            <button class="popup-classic-close">✕</button>
        `;
        const content = document.createElement('div');
        content.className = 'popup-classic-content';
        content.innerHTML = `
            <div class="popup-message" style="color: #111; font-size: 14px;">${state.followup.message}</div>
            <div class="popup-buttons">
                <button class="popup-button">Close</button>
            </div>
        `;
        popup.appendChild(header);
        popup.appendChild(content);
    } else {
        const content = document.createElement('div');
        content.className = 'popup-content';
        content.innerHTML = `
            <div class="popup-title" style="color: ${state.popup.textColor}; font-size: 18px;">${state.followup.title}</div>
            <div class="popup-message" style="color: ${state.popup.textColor}; font-size: 14px;">${state.followup.message}</div>
            <div class="popup-buttons">
                <button class="popup-button">Close</button>
            </div>
        `;
        popup.appendChild(content);
    }

    overlay.appendChild(popup);
    popupContainer.appendChild(overlay);
    
    const closePopup = () => {
        overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    };
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
    popup.querySelectorAll('.popup-button, .popup-classic-close').forEach(btn => {
        btn.addEventListener('click', closePopup);
    });
}

function showFollowupChain(chain, idx) {
    if (!chain || idx >= chain.length) return;
    const item = chain[idx];
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.background = 'rgba(0, 0, 0, 0.35)';

    const popup = document.createElement('div');
    popup.className = `popup-box ${state.popup.style}`;
    popup.style.width = (item.width || state.popup.width || 300) + 'px';
    popup.style.backgroundColor = state.popup.style === 'classic' ? '#e8e8e8' : state.popup.bgColor;
    popup.style.borderWidth = state.popup.borderWidth + 'px';
    popup.style.borderStyle = 'solid';
    popup.style.borderColor = state.popup.style === 'classic' ? '#999' : state.popup.borderColor;

    const positionClass = item.position || 'center';
    if (positionClass !== 'center') {
        overlay.style.justifyContent = positionClass.includes('left') ? 'flex-start' : 'flex-end';
        overlay.style.alignItems = positionClass.includes('top') ? 'flex-start' : 'flex-end';
        popup.style.margin = '20px';
    }

    if (state.popup.style === 'classic') {
        const header = document.createElement('div');
        header.className = 'popup-classic-header';
        header.innerHTML = `
            <span>${escapeHtml(item.title || '')}</span>
            <button class="popup-classic-close">✕</button>
        `;
        const content = document.createElement('div');
        content.className = 'popup-classic-content';
        content.innerHTML = `
            <div class="popup-message" style="color: #111; font-size: 14px;">${escapeHtml(item.message || '')}</div>
            <div class="popup-buttons">
                <button class="popup-button">Close</button>
            </div>
        `;
        popup.appendChild(header);
        popup.appendChild(content);
    } else {
        const content = document.createElement('div');
        content.className = 'popup-content';
        content.innerHTML = `
            <div class="popup-title" style="color: ${item.textColor || state.popup.textColor}; font-size: 18px;">${escapeHtml(item.title || '')}</div>
            <div class="popup-message" style="color: ${item.textColor || state.popup.textColor}; font-size: 14px;">${escapeHtml(item.message || '')}</div>
            <div class="popup-buttons">
                <button class="popup-button">Close</button>
            </div>
        `;
        popup.appendChild(content);
    }

    overlay.appendChild(popup);
    popupContainer.appendChild(overlay);

    const closePopup = () => {
        overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            // same close flow as button
            const nextIdx = idx + 1;
            closePopup();
            if (nextIdx < chain.length) {
                const delay = (chain[nextIdx].delay || 0) * 1000;
                setTimeout(() => showFollowupChain(chain, nextIdx), delay);
            } else {
                followupRunning = false;
            }
        }
    });
    popup.querySelectorAll('.popup-button, .popup-classic-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextIdx = idx + 1;
            closePopup();
            if (nextIdx < chain.length) {
                const delay = (chain[nextIdx].delay || 0) * 1000;
                setTimeout(() => showFollowupChain(chain, nextIdx), delay);
            } else {
                followupRunning = false;
            }
        });
    });
}

function getPopupAnimation(animationType) {
    const animations = {
        'fade': 'fadeIn 0.3s ease',
        'scale': 'scaleUp 0.4s ease',
        'slide': 'slideInFromBottom 0.4s ease',
        'bounce': 'popupBounce 0.6s ease',
        'none': 'none',
    };
    return animations[animationType] || 'fadeIn 0.3s ease';
}

// ==================== Templates ====================
const templates = {
    hello: {
        title: 'Hello! 👋',
        message: 'Welcome to Text Flash Animator! Create amazing animations and popups.',
        bgColor: '#1a1f3a',
        borderColor: '#00ff00',
    },
    warning: {
        title: '⚠️ Warning',
        message: 'This action cannot be undone. Are you sure you want to proceed?',
        bgColor: '#3a1a1a',
        borderColor: '#ff6600',
    },
    success: {
        title: '✅ Success',
        message: 'Operation completed successfully!',
        bgColor: '#1a3a1a',
        borderColor: '#00ff00',
    },
    error: {
        title: '❌ Error',
        message: 'Something went wrong. Please try again.',
        bgColor: '#3a1a1a',
        borderColor: '#ff0000',
    },
    meme: {
        title: 'Me: *exists*',
        message: 'Life: *introduces chaos*\n\n🤣 Relatable much?',
        bgColor: '#1a1f3a',
        borderColor: '#ffff00',
    },
    info: {
        title: 'ℹ️ Information',
        message: 'This is just an informational message. Have a great day!',
        bgColor: '#1a2a3a',
        borderColor: '#0099ff',
    },
};

function loadTemplate(e) {
    const templateName = e.target.closest('.template-btn').dataset.template;
    const template = templates[templateName];
    
    if (template) {
        popupTitleInput.value = template.title;
        popupMessageInput.value = template.message;
        popupBgColorPicker.value = template.bgColor;
        popupBorderColorPicker.value = template.borderColor;
        
        state.popup.title = template.title;
        state.popup.message = template.message;
        state.popup.bgColor = template.bgColor;
        state.popup.borderColor = template.borderColor;
        
        // Switch to popup tab
        document.querySelector('[data-tab="popup"]').click();
    }
}

// ==================== Export/Import ====================
function exportSettings() {
    const settings = {
        animation: state.animation,
        text: state.text,
        background: state.background,
        effects: state.effects,
        popup: state.popup,
        followup: state.followup,
        layers: state.layers,
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text-animator-settings.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importSettings(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const settings = JSON.parse(event.target.result);
            
            // Update state
            Object.assign(state.animation, settings.animation);
            Object.assign(state.text, settings.text);
            Object.assign(state.background, settings.background);
            Object.assign(state.effects, settings.effects);
            Object.assign(state.popup, settings.popup);
            Object.assign(state.followup, settings.followup);
            state.layers = Array.isArray(settings.layers) && settings.layers.length ? settings.layers : state.layers;
            if (!state.layers.length) {
                state.layers = [{ id: 1, text: state.animation.text }];
            }
            
            // Update UI
            updateUIFromState();
            renderTextLayers();
            updatePreview();
            
            alert('Settings imported successfully!');
        } catch (error) {
            alert('Error importing settings: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    importFile.value = '';
}

function updateUIFromState() {
    // Update animation controls
    animationTextInput.value = state.layers[0]?.text || state.animation.text;
    animationTypeSelect.value = state.animation.type;
    animationSpeedSlider.value = state.animation.speed;
    layerGapSlider.value = state.animation.layerGap;
    textSizeSlider.value = state.text.size;
    textRotationSlider.value = state.text.rotation;
    textColorPicker.value = state.text.color;
    loopCheckbox.checked = state.animation.loop;
    randomPatternCheckbox.checked = state.animation.random;
    
    // Update text styling
    fontFamilySelect.value = state.text.font;
    boldCheckbox.checked = state.text.bold;
    italicCheckbox.checked = state.text.italic;
    underlineCheckbox.checked = state.text.underline;
    
    // Update background
    backgroundTypeSelect.value = state.background.type;
    backgroundColorPicker.value = state.background.color;
    gradientColorPicker.value = state.background.gradientEnd;
    
    // Update shadows and effects
    shadowXSlider.value = state.text.shadowX;
    shadowYSlider.value = state.text.shadowY;
    shadowBlurSlider.value = state.text.shadowBlur;
    shadowColorPicker.value = state.text.shadowColor;
    glowIntensitySlider.value = state.text.glowIntensity;
    glowColorPicker.value = state.text.glowColor;
    strokeWidthSlider.value = state.text.strokeWidth;
    strokeColorPicker.value = state.text.strokeColor;
    
    // Update visual effects
    visualEffectSelect.value = state.effects.visual;
    flashIntensitySlider.value = state.effects.flashIntensity;
    motionBlurSlider.value = state.effects.motionBlur;
    screenShakeSlider.value = state.effects.screenShake;
    
    // Update popup settings
    popupTitleInput.value = state.popup.title;
    popupMessageInput.value = state.popup.message;
    popupWidthSlider.value = state.popup.width;
    popupHeightSlider.value = state.popup.height;
    popupTextColorPicker.value = state.popup.textColor;
    popupBgColorPicker.value = state.popup.bgColor;
    popupBorderColorPicker.value = state.popup.borderColor;
    popupBorderWidthSlider.value = state.popup.borderWidth;
    popupAnimationSelect.value = state.popup.animation;
    popupCountSlider.value = state.popup.count;
    popupStyleSelect.value = state.popup.style;
    popupSequenceCheckbox.checked = state.popup.sequence;
    
    // Update followup
    enableFollowupCheckbox.checked = state.followup.enabled;
    followupSection.style.display = state.followup.enabled ? 'block' : 'none';
    followupDelaySlider.value = state.followup.delay;
    followupTitleInput.value = state.followup.title;
    followupMessageInput.value = state.followup.message;
    followupWidthSlider.value = state.followup.width;
    followupPositionSelect.value = state.followup.position;
    
    // Update value displays
    document.getElementById('speedValue').textContent = state.animation.speed + 'x';
    document.getElementById('layerGapValue').textContent = state.animation.layerGap + 'px';
    document.getElementById('sizeValue').textContent = state.text.size + 'px';
    document.getElementById('rotationValue').textContent = state.text.rotation + '°';
    document.getElementById('colorValue').textContent = state.text.color;
    document.getElementById('bgColorValue').textContent = state.background.color;
    document.getElementById('gradColorValue').textContent = state.background.gradientEnd;
    document.getElementById('shadowXValue').textContent = state.text.shadowX + 'px';
    document.getElementById('shadowYValue').textContent = state.text.shadowY + 'px';
    document.getElementById('shadowBlurValue').textContent = state.text.shadowBlur + 'px';
    document.getElementById('glowValue').textContent = state.text.glowIntensity + 'px';
    document.getElementById('strokeValue').textContent = state.text.strokeWidth + 'px';
    document.getElementById('flashValue').textContent = Math.round(state.effects.flashIntensity * 100) + '%';
    document.getElementById('blurValue').textContent = state.effects.motionBlur + 'px';
    document.getElementById('shakeValue').textContent = state.effects.screenShake + 'px';
    document.getElementById('popupWidthValue').textContent = state.popup.width + 'px';
    document.getElementById('popupHeightValue').textContent = state.popup.height + 'px';
    document.getElementById('popupBorderValue').textContent = state.popup.borderWidth + 'px';
    document.getElementById('followupDelayValue').textContent = state.followup.delay + 's';
    document.getElementById('followupSizeValue').textContent = state.followup.width + 'px';
}

// ==================== Presets ====================
function savePreset() {
    const presetName = presetNameInput.value.trim();
    if (!presetName) {
        alert('Please enter a preset name');
        return;
    }
    
    const preset = {
        name: presetName,
        timestamp: new Date().toISOString(),
        data: {
            animation: { ...state.animation },
            text: { ...state.text },
            background: { ...state.background },
            effects: { ...state.effects },
            popup: { ...state.popup },
            followup: { ...state.followup },
            layers: state.layers.map(layer => ({ ...layer })),
        },
    };
    
    state.presets.push(preset);
    savePresetsToStorage();
    renderPresets();
    presetNameInput.value = '';
    alert('Preset saved successfully!');
}

function loadPresetsFromStorage() {
    const stored = localStorage.getItem('textAnimatorPresets');
    if (stored) {
        try {
            state.presets = JSON.parse(stored);
            renderPresets();
        } catch (error) {
            console.error('Error loading presets:', error);
        }
    }
}

function savePresetsToStorage() {
    localStorage.setItem('textAnimatorPresets', JSON.stringify(state.presets));
}

function renderPresets() {
    if (state.presets.length === 0) {
        presetsContainer.innerHTML = '<p class="empty-state">No saved presets yet</p>';
        return;
    }
    
    presetsContainer.innerHTML = state.presets.map((preset, index) => `
        <div class="preset-item">
            <div>
                <strong>${preset.name}</strong>
                <small style="display: block; color: #666; font-size: 11px;">
                    ${new Date(preset.timestamp).toLocaleDateString()}
                </small>
            </div>
            <div style="display: flex; gap: 5px;">
                <button onclick="loadPresetData(${index})" style="background: #00ff00; color: #000; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Load</button>
                <button onclick="deletePreset(${index})" style="background: #ff0000; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadPresetData(index) {
    const preset = state.presets[index];
    if (preset) {
        Object.assign(state.animation, preset.data.animation);
        Object.assign(state.text, preset.data.text);
        Object.assign(state.background, preset.data.background);
        Object.assign(state.effects, preset.data.effects);
        Object.assign(state.popup, preset.data.popup);
        Object.assign(state.followup, preset.data.followup);
        state.layers = Array.isArray(preset.data.layers) && preset.data.layers.length ? preset.data.layers : state.layers;
        if (!state.layers.length) {
            state.layers = [{ id: 1, text: state.animation.text }];
        }
        
        updateUIFromState();
        renderTextLayers();
        updatePreview();
        document.querySelector('[data-tab="animator"]').click();
        alert('Preset loaded successfully!');
    }
}

function deletePreset(index) {
    if (confirm('Are you sure you want to delete this preset?')) {
        state.presets.splice(index, 1);
        savePresetsToStorage();
        renderPresets();
    }
}

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', init);
