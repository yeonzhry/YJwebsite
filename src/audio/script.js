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

// 컬러 프리뷰 초기 색상 설정
startColorPreview.style.backgroundColor = settings.startColor;
endColorPreview.style.backgroundColor = settings.endColor;

// 슬라이더 초기 값 설정
blurSlider.value = settings.blur;
opacitySlider.value = settings.opacity * 100; // 0 ~ 1 사이 값을 0 ~ 100으로 변환

applySettings();

// 색상 배열 정의 (업데이트된 부분)
const colorArray = [
    '#000000', '#0433FF', '#1A0A53', '#942192', '#791A3E', '#5C0000', '#EE4D31', '#FEBB25', '#005819',
    '#444444', '#53D5FD', '#8231FE', '#A048FE', '#D357FE', '#E4001D', '#FB7D56', '#FECC5A', '#459D34',
    '#929292', '#00FDFF', '#74A7FE', '#B18CFE', '#FF40FF', '#E63B7A', '#F6A680', '#FFF76B', '#79ED61',
    '#ffffff', '#BAF6FC', '#D4E3FE', '#D9CAFE', '#F1C9FE', '#F4A4C0', '#FFC4AB', '#FFE4A8', '#CCE8B5'
];

function generatePalette(paletteElement, colorArray) {
    paletteElement.innerHTML = ''; // 기존 내용 초기화
    colorArray.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('color-option');
        colorOption.style.backgroundColor = color;
        paletteElement.appendChild(colorOption);
    });
}

// 팔레트 생성
generatePalette(startColorPalette, colorArray);
generatePalette(endColorPalette, colorArray);

// 컨트롤 클릭 이벤트 추가
controls.forEach(control => {
    control.addEventListener('click', () => {
        // 모든 콘텐츠 아이템 숨기기
        contentItems.forEach(item => {
            item.classList.remove('active');
        });

        // 컨트롤 패널 확장 상태 토글
        if (controlPanel.classList.contains('expanded')) {
            controlPanel.classList.remove('expanded');
        } else {
            controlPanel.classList.add('expanded');

            // 클릭한 컨트롤에 해당하는 콘텐츠 아이템 찾기
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

// 시작 색상 팔레트 클릭 이벤트
startColorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
        const color = e.target.style.backgroundColor;
        settings.startColor = rgbToHex(color);
        startColorPreview.style.backgroundColor = settings.startColor;
        applySettings();
        // 팔레트 닫기
        controlPanel.classList.remove('expanded');
        startColorContent.classList.remove('active');
    }
});

// 끝 색상 팔레트 클릭 이벤트
endColorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
        const color = e.target.style.backgroundColor;
        settings.endColor = rgbToHex(color);
        endColorPreview.style.backgroundColor = settings.endColor;
        applySettings();
        // 팔레트 닫기
        controlPanel.classList.remove('expanded');
        endColorContent.classList.remove('active');
    }
});

// 슬라이더 변경 이벤트
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

// RGB 문자열을 HEX로 변환
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return '#' + rgbValues.map(val => {
        const hex = val.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// HEX를 RGB 객체로 변환
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// 색상 보간 함수
function interpolateColor(color1, color2, factor) {
    const result = {
        r: Math.round(color1.r + factor * (color2.r - color1.r)),
        g: Math.round(color1.g + factor * (color2.g - color1.g)),
        b: Math.round(color1.b + factor * (color2.b - color1.b))
    };
    return result;
}

// 비주얼라이저 그리기 함수
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

            // 색상 보간
            const factor = i / bufferLength;
            const color = interpolateColor(startRGB, endRGB, factor);

            // 막대 색상 설정
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

// AudioContext 생성 함수
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
            // 시작 버튼 숨기기
            startButton.style.display = 'none';
            // 다른 컨트롤들 표시
            playPauseButton.style.display = 'block';
            micButton.style.display = 'block';
            fileUploadLabel.style.display = 'block';

            // 재생 버튼 이미지 변경 (Pause)
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

// 재생/일시정지 버튼 클릭 이벤트
playPauseButton.addEventListener('click', function() {
    if (audio1.paused) {
        // AudioContext 상태가 Suspended인 경우 resume
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        audio1.play()
            .then(() => {
                isPlaying = true;
                // 버튼 이미지 변경 (Pause)
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
        // 버튼 이미지 변경 (Play)
        playPauseButton.querySelector('img').src = '../icon/play.png';
    }
});



// 파일 업로드 이벤트
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
            // 재생 버튼 이미지 변경 (Pause)
            playPauseButton.querySelector('img').src = '../icon/pause.png';
            // 컨트롤들 표시
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
            // 재생 버튼 이미지 변경 (Play)
            playPauseButton.querySelector('img').src = '../icon/play.png';
        });
});


let micStream = null;

// 마이크 버튼 클릭 이벤트
micButton.addEventListener('click', function() {
    if (!isMicActive) {
        // 마이크 활성화
        createAudioContext();

        // 기존 오디오 소스 연결 해제
        if (audioSource) {
            audioSource.disconnect();
            audioSource = null;
        }

        // 현재 오디오가 재생 중이라면 일시정지
        if (audio1 && !audio1.paused) {
            audio1.pause();
            isPlaying = false;
            // 재생 버튼 이미지 변경 (Play)
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
                // 마이크 버튼 이미지 변경 (Mic On)
                micButton.querySelector('img').src = '../icon/mic-on.png';
                drawVisualizer();
            })
            .catch(error => {
                console.error('마이크 접근 오류:', error);
                alert('마이크 접근을 허용하지 않았습니다.');
            });
    } else {
        // 마이크 비활성화
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
        // 마이크 버튼 이미지 변경 (Mic Off)
        micButton.querySelector('img').src = '../icon/mic-off.png';

        // 비주얼라이저 정지
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
});

// 오디오 종료 이벤트
audio1.addEventListener('ended', function() {
    // 재생 버튼 이미지 변경 (Play)
    playPauseButton.querySelector('img').src = '../icon/play.png';
    isPlaying = false;
});


// 창 크기 변경 시 캔버스 크기 조정
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// 초기 설정 적용
applySettings();

// 활성 탭 추적 변수 선언 및 초기 활성 탭 설정
let activeTab = document.getElementById('tap-E');

// 초기 활성 탭에 호버 효과 적용
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
    // 네비게이션 바 호버 및 클릭 효과
    const navItems = document.querySelectorAll('.nav-item');

    // 활성 탭 추적 변수 선언 및 초기 활성 탭 설정 (Y 탭으로 설정)
    let activeTab = document.getElementById('tap-E');

    // 초기 활성 탭에 호버 효과 적용
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
                // 텍스트 색상 변경
                gsap.to(item, {
                    duration: 0.3,
                    color: '#000',
                });

                // 흰색 박스 나타나기
                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1.1,
                });

                // 호버 텍스트 나타나기
                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 1,
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            if (item !== activeTab) {
                // 텍스트 색상 복귀
                gsap.to(item, {
                    duration: 0.3,
                    color: '#fff',
                });

                // 흰색 박스 숨기기
                gsap.to(item.querySelector('.hover-bg'), {
                    duration: 0.3,
                    opacity: 0,
                    scale: 1,
                });

                // 호버 텍스트 숨기기
                gsap.to(item.querySelector('.hover-text'), {
                    duration: 0.3,
                    opacity: 0,
                });
            }
        });

        // 클릭 이벤트에서 애니메이션 제거
        item.addEventListener('click', () => {
            // 활성 탭 업데이트 (필요 시)
            activeTab = item;
            // 클릭 시 추가 애니메이션을 적용하지 않습니다.
        });
    });
});