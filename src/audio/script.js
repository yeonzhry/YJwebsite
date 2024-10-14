const canvas = document.getElementById('canvas1');
const audio1 = document.getElementById('audio1');
const playPauseButton = document.getElementById('playPauseButton');
const fileUpload = document.getElementById('fileupload');
const fileUploadLabel = document.getElementById('fileUploadLabel');
const micButton = document.getElementById('micButton');
const startButton = document.getElementById('startButton');


const controlPanel = document.getElementById('control-panel');
const controls = document.querySelectorAll('.control');
const contentItems = document.querySelectorAll('.content-item');

const startColorControl = document.getElementById('start-color-control');
const endColorControl = document.getElementById('end-color-control');
const blurControl = document.getElementById('blur-control');
const opacityControl = document.getElementById('opacity-control');

const startColorContent = document.getElementById('start-color-content');
const endColorContent = document.getElementById('end-color-content');
const blurContent = document.getElementById('blur-content');
const opacityContent = document.getElementById('opacity-content');

const startColorPreview = document.getElementById('start-color-preview');
const endColorPreview = document.getElementById('end-color-preview');
const startColorPalette = document.getElementById('start-color-palette');
const endColorPalette = document.getElementById('end-color-palette');

const blurSlider = document.getElementById('blur-slider');
const opacitySlider = document.getElementById('opacity-slider');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let audioContext;
let audioSource;
let micSource;
let analyser;
let animationId;
let isPlaying = false;
let isMicActive = false;

const settings = {
    startColor: '#D4E3FE',
    endColor: '#0433FF',
    blur: 1,
    opacity: 1
};

startColorPreview.style.backgroundColor = settings.startColor;
endColorPreview.style.backgroundColor = settings.endColor;

blurSlider.value = settings.blur;
opacitySlider.value = settings.opacity * 100;

applySettings();

const colorArray = [
    '#000000', '#0433FF', '#1A0A53', '#942192', '#791A3E', '#5C0000', '#EE4D31', '#FEBB25', '#005819',
    '#444444', '#53D5FD', '#8231FE', '#A048FE', '#D357FE', '#E4001D', '#FB7D56', '#FECC5A', '#459D34',
    '#929292', '#00FDFF', '#74A7FE', '#B18CFE', '#FF40FF', '#E63B7A', '#F6A680', '#FFF76B', '#79ED61',
    '#ffffff', '#BAF6FC', '#D4E3FE', '#D9CAFE', '#F1C9FE', '#F4A4C0', '#FFC4AB', '#FFE4A8', '#CCE8B5'
];

function generatePalette(paletteElement, colorArray) {
    paletteElement.innerHTML = '';
    colorArray.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('color-option');
        colorOption.style.backgroundColor = color;
        paletteElement.appendChild(colorOption);
    });
}

generatePalette(startColorPalette, colorArray);
generatePalette(endColorPalette, colorArray);

controls.forEach(control => {
    control.addEventListener('click', () => {
        contentItems.forEach(item => {
            item.classList.remove('active');
        });

        if (controlPanel.classList.contains('expanded')) {
            controlPanel.classList.remove('expanded');
        } else {
            controlPanel.classList.add('expanded');

            switch (control.id) {
                case 'start-color-control':
                    startColorContent.classList.add('active');
                    break;
                case 'end-color-control':
                    endColorContent.classList.add('active');
                    break;
                case 'blur-control':
                    blurContent.classList.add('active');
                    break;
                case 'opacity-control':
                    opacityContent.classList.add('active');
                    break;
            }
        }
    });
});

startColorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
        const color = e.target.style.backgroundColor;
        settings.startColor = rgbToHex(color);
        startColorPreview.style.backgroundColor = settings.startColor;
        applySettings();
        controlPanel.classList.remove('expanded');
        startColorContent.classList.remove('active');
    }
});

endColorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
        const color = e.target.style.backgroundColor;
        settings.endColor = rgbToHex(color);
        endColorPreview.style.backgroundColor = settings.endColor;
        applySettings();
        controlPanel.classList.remove('expanded');
        endColorContent.classList.remove('active');
    }
});

blurSlider.addEventListener('input', () => {
    settings.blur = blurSlider.value;
    applySettings();
});

opacitySlider.addEventListener('input', () => {
    settings.opacity = opacitySlider.value;
    applySettings();
});

function applySettings() {
    canvas.style.filter = `blur(${settings.blur}px)`;
}

function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return '#' + rgbValues.map(val => {
        const hex = val.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function interpolateColor(color1, color2, factor) {
    const result = {
        r: Math.round(color1.r + factor * (color2.r - color1.r)),
        g: Math.round(color1.g + factor * (color2.g - color1.g)),
        b: Math.round(color1.b + factor * (color2.b - color1.b))
    };
    return result;
}

function drawVisualizer() {
    if (!analyser) {
        console.error('AnalyserNode가 초기화되지 않았습니다.');
        return;
    }

    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / 2) / bufferLength;

    function animate() {
        if (!isPlaying) {
            cancelAnimationFrame(animationId);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);

        const startRGB = hexToRgb(settings.startColor);
        const endRGB = hexToRgb(settings.endColor);

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] * 2;

            const factor = i / bufferLength;
            const color = interpolateColor(startRGB, endRGB, factor);

            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${settings.opacity})`;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(i + Math.PI * 2 / bufferLength);
            ctx.fillRect(0, 0, barWidth, barHeight);
            ctx.restore();
        }
        animationId = requestAnimationFrame(animate);
    }
    animate()

}

function createAudioContext() {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
    }
}

startButton.addEventListener('click', function() {
    createAudioContext();

    audio1.play()
        .then(() => {
            isPlaying = true;
            startButton.style.display = 'none';
            playPauseButton.style.display = 'block';
            micButton.style.display = 'block';
            fileUploadLabel.style.display = 'block';

            playPauseButton.querySelector('img').src = '../icon/pause.png';

            if (!audioSource) {
                audioSource = audioContext.createMediaElementSource(audio1);
                analyser = audioContext.createAnalyser();
                audioSource.connect(analyser);
                analyser.connect(audioContext.destination);
            }

            drawVisualizer();
        })
        .catch(error => {
            console.error('오디오 재생 오류:', error);
            alert('오디오를 재생할 수 없습니다.');
        });
});

playPauseButton.addEventListener('click', function() {
    if (audio1.paused) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        audio1.play()
            .then(() => {
                isPlaying = true;
                playPauseButton.querySelector('img').src = '../icon/pause.png';

                if (!audioSource) {
                    audioSource = audioContext.createMediaElementSource(audio1);
                    analyser = audioContext.createAnalyser();
                    audioSource.connect(analyser);
                    analyser.connect(audioContext.destination);
                }

                drawVisualizer();
            })
            .catch(error => {
                console.error('오디오 재생 오류:', error);
                alert('오디오를 재생할 수 없습니다.');
            });
    } else {
        audio1.pause();
        isPlaying = false;
        playPauseButton.querySelector('img').src = '../icon/play.png';
    }
});


fileUpload.addEventListener('change', function() {
    const files = this.files;
    if (files.length === 0) return;
    const file = files[0];

    createAudioContext();

    const fileURL = URL.createObjectURL(file);
    audio1.src = fileURL;
    audio1.load();
    audio1.play()
        .then(() => {
            isPlaying = true;
            playPauseButton.querySelector('img').src = '../icon/pause.png';
            playPauseButton.style.display = 'block';
            micButton.style.display = 'block';
            fileUploadLabel.style.display = 'block';

            if (!audioSource) {
                audioSource = audioContext.createMediaElementSource(audio1);
                analyser = audioContext.createAnalyser();
                audioSource.connect(analyser);
                analyser.connect(audioContext.destination);
            } else {
                if (!analyser) {
                    analyser = audioContext.createAnalyser();
                    audioSource.connect(analyser);
                    analyser.connect(audioContext.destination);
                }
            }

            drawVisualizer();
        })
        .catch(error => {
            console.error('업로드된 오디오 재생 오류:', error);
            playPauseButton.querySelector('img').src = '../icon/play.png';
        });
});


let micStream = null;

micButton.addEventListener('click', function() {
    if (!isMicActive) {
        createAudioContext();

        if (audioSource) {
            audioSource.disconnect();
            audioSource = null;
        }

        if (audio1 && !audio1.paused) {
            audio1.pause();
            isPlaying = false;
            playPauseButton.querySelector('img').src = '../icon/play.png';
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                micStream = stream;
                micSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                micSource.connect(analyser);
                analyser.connect(audioContext.destination);

                isPlaying = true;
                isMicActive = true;
                micButton.querySelector('img').src = '../icon/mic-on.png';
                drawVisualizer();
            })
            .catch(error => {
                console.error('마이크 접근 오류:', error);
                alert('마이크 접근을 허용하지 않았습니다.');
            });
    } else {
        if (micSource) {
            micSource.disconnect();
            micSource = null;
        }

        if (analyser) {
            analyser.disconnect();
            analyser = null;
        }

        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }

        isMicActive = false;
        micButton.querySelector('img').src = '../icon/mic-off.png';

        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
});

audio1.addEventListener('ended', function() {
    playPauseButton.querySelector('img').src = '../icon/play.png';
    isPlaying = false;
});


window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


applySettings();

let activeTab = document.getElementById('tap-E');

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

    let activeTab = document.getElementById('tap-E');

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