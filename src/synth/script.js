let synth;
let effect;
const data = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let html = '';

const masterVolume = new Tone.Volume(0).toDestination();

setSynth('PolySynth');
setEffect('None');

window.noteDown = function(elem, isSharp, event) {
    var note = elem.dataset.note;
    elem.style.background = isSharp ? 'black' : '#ccc';
    synth.triggerAttackRelease(note, "16n");
    event.stopPropagation();
};

window.noteUp = function(elem, isSharp) {
    elem.style.background = isSharp ? '#777' : 'white';
};

document.getElementById('synthSelector').addEventListener('change', function() {
    setSynth(this.value);
});

document.getElementById('effectSelector').addEventListener('change', function() {
    setEffect(this.value);
});

document.getElementById('volumeControl').addEventListener('input', function() {
    const volume = (parseInt(this.value) - 50) / 2;
    masterVolume.volume.value = volume;
});

document.getElementById('reverbDecay').addEventListener('input', function() {
    if (effect && effect instanceof Tone.Reverb) {
        effect.decay = parseFloat(this.value);
        effect.generate();
    }
});

document.getElementById('delayTime').addEventListener('input', function() {
    if (effect && effect instanceof Tone.FeedbackDelay) {
        effect.delayTime.value = parseFloat(this.value) / 1000;
    }
});

document.getElementById('chorusDepth').addEventListener('input', function() {
    if (effect && effect instanceof Tone.Chorus) {
        effect.depth.value = parseFloat(this.value);
    }
});

document.getElementById('distortion').addEventListener('input', function() {
    if (effect && effect instanceof Tone.Distortion) {
        effect.distortion = parseFloat(this.value);
    }
});

function setSynth(synthType) {
    if (synth) synth.disconnect();

    switch (synthType) {
        case 'FMSynth':
            synth = new Tone.FMSynth();
            break;
        case 'AMSynth':
            synth = new Tone.AMSynth();
            break;
        case 'MonoSynth':
            synth = new Tone.MonoSynth();
            break;
        case 'PluckSynth':
            synth = new Tone.PluckSynth();
            break;
        case 'MembraneSynth':
            synth = new Tone.MembraneSynth();
            break;
        default:
            synth = new Tone.PolySynth(Tone.Synth);
            break;
    }
    synth.connect(masterVolume);
    applyEffects();
}

function setEffect(effectType) {
    if (effect) {
        effect.disconnect();
        effect.dispose();
    }

    const effectControls = document.getElementById('effectControls');

    const allEffectSliders = document.querySelectorAll('.effect-slider');
    allEffectSliders.forEach(slider => {
        slider.style.opacity = 0;
    });

    if (effectType === 'None') {
        effect = null;
        effectControls.style.opacity = 0;
    } else {
        const selectedEffectSlider = document.getElementById(`${effectType.toLowerCase()}Controls`);
        if (selectedEffectSlider) {
            selectedEffectSlider.style.opacity = 1;
            effectControls.style.opacity = 1;
        }

        switch (effectType) {
            case 'Reverb':
                effect = new Tone.Reverb({
                    decay: parseFloat(document.getElementById('reverbDecay').value),
                    wet: 0.5
                });
                effect.generate();
                break;
            case 'Delay':
                effect = new Tone.FeedbackDelay({
                    delayTime: parseFloat(document.getElementById('delayTime').value) / 1000,
                    feedback: 0.5,
                    wet: 0.5
                });
                break;
            case 'Chorus':
                effect = new Tone.Chorus({
                    depth: parseFloat(document.getElementById('chorusDepth').value),
                    wet: 0.5
                });
                break;
            case 'Distortion':
                effect = new Tone.Distortion({
                    distortion: parseFloat(document.getElementById('distortion').value),
                    wet: 0.5
                });
                break;
            default:
                effect = null;
                break;
        }
    }
    applyEffects();
}

document.querySelectorAll('.effect-slider input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => {
        const selectedEffect = document.getElementById('effectSelector').value;
        setEffect(selectedEffect);
    });
});


function applyEffects() {
    if (synth) {
        if (effect) {
            synth.chain(effect, masterVolume);
        } else {
            synth.connect(masterVolume);
        }
    }
}


for (var octave = 0; octave < 2; octave++) {
    for (var i = 0; i < data.length; i++) {
        var note = data[i];
        var hasSharp = (['E', 'B'].indexOf(note) == -1);

        html += `<div class='whitenote' 
                    onmousedown='noteDown(this, false, event)' 
                    onmouseup='noteUp(this,false)' 
                    onmouseleave='noteUp(this,false)' 
                    data-note='${note + (octave+4)}'>`;

        if (hasSharp) {
            html += `<div class='blacknote' 
                        onmousedown='noteDown(this, true, event)' 
                        onmouseup='noteUp(this, true)' 
                        onmouseleave='noteUp(this,true)' 
                        data-note='${note + '#' + (octave+4)}'></div>`;
        }

        html += `</div>`;
    }
}

document.getElementById('container').innerHTML = html;

function noteUp(elem, isSharp) {
    elem.style.background = isSharp ? '#777' : '';
}

function noteDown(elem, isSharp, event) {
    var note = elem.dataset.note;
    elem.style.background = isSharp ? 'black' : '#ccc';
    synth.triggerAttackRelease(note, "16n");
    event.stopPropagation();
}

const keyMap = {
    'a': 'C4',
    'ㅁ': 'C4',
    'w': 'C#4',
    'ㅈ': 'C#4',
    's': 'D4',
    'ㄴ': 'D4',
    'e': 'D#4',
    'ㄷ': 'D#4',
    'd': 'E4',
    'ㅇ': 'E4',
    'f': 'F4',
    'ㄹ': 'F4',
    't': 'F#4',
    'ㅅ': 'F#4',
    'g': 'G4',
    'ㅎ': 'G4',
    'y': 'G#4',
    'ㅛ': 'G#4',
    'h': 'A4',
    'ㅗ': 'A4',
    'u': 'A#4',
    'ㅕ': 'A#4',
    'j': 'B4',
    'ㅓ': 'B4',
    'k': 'C5',
    'ㅏ': 'C5',
    'o': 'C#5',
    'ㅐ': 'C#5',
    'l': 'D5',
    'ㅣ': 'D5',
    'p': 'D#5',
    'ㅔ': 'D#5',
    ';': 'E5',
    '\'': 'F5',
    '1': 'F#5',
    '2': 'G5',
    '3': 'G#5',
    '4': 'A5',
    '5': 'A#5',
    '6': 'B5'
};

const pressedKeys = new Set();

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keyMap[key] && !pressedKeys.has(key)) {
        pressedKeys.add(key);
        const note = keyMap[key];
        synth.triggerAttackRelease(note, "16n");

        const noteElem = document.querySelector(`[data-note='${note}']`);
        if (noteElem) {
            noteElem.style.background = note.includes('#') ? 'black' : '#ccc';
        }
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keyMap[key] && pressedKeys.has(key)) {
        pressedKeys.delete(key);
        const note = keyMap[key];

        const noteElem = document.querySelector(`[data-note='${note}']`);
        if (noteElem) {
            noteElem.style.background = note.includes('#') ? '#777' : 'white';
        }
    }
});


let activeTab = document.getElementById('tap-N');

gsap.to(activeTab, {
    duration: 0,
    color: '#000',
});

gsap.to(activeTab.querySelector('.hover-bg'), {
    duration: 0,
    opacity: 1,
    scale: 1.1,
});

gsap.to(activeTab.querySelector('.hover-text'), {
    duration: 0,
    opacity: 1,
});

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');

    let activeTab = document.getElementById('tap-N');

    if (activeTab) {
        gsap.to(activeTab, {
            duration: 0,
            color: '#000',
        });

        gsap.to(activeTab.querySelector('.hover-bg'), {
            duration: 0,
            opacity: 1,
            scale: 1.1,
        });

        gsap.to(activeTab.querySelector('.hover-text'), {
            duration: 0,
            opacity: 1,
        });
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (item !== activeTab) {
                gsap.to(item, {
                    duration: 0.3,
                    color: '#000',
                });

                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1.1,
                });

                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 1,
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            if (item !== activeTab) {
                gsap.to(item, {
                    duration: 0.3,
                    color: '#fff',
                });

                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 0,
                    scale: 1,
                });

                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 0,
                });
            }
        });

        item.addEventListener('click', () => {
            activeTab = item;
        });
    });
});