document.addEventListener('DOMContentLoaded', function() {
    // 미디어 리스트
    const mediaList = [
        { type: 'image', src: '../image/img1.jpg', label: 'CAM 01' },
        { type: 'image', src: '../image/img2.jpg', label: 'CAM 02' },
        { type: 'image', src: '../image/img3.jpg', label: 'CAM 03' },
        { type: 'image', src: '../image/img4.jpg', label: 'CAM 04' },
        { type: 'image', src: '../image/img5.jpg', label: 'CAM 05' },
        { type: 'image', src: '../image/img6.jpg', label: 'CAM 06' },
        { type: 'image', src: '../image/img7.jpg', label: 'CAM 07' },
        { type: 'image', src: '../image/img8.jpg', label: 'CAM 08' },
        { type: 'video', src: '../image/img16.mov', label: 'CAM 09' },
        { type: 'image', src: '../image/img9.jpg', label: 'CAM 10' },
        { type: 'video', src: '../image/img18.mov', label: 'CAM 11' },
        { type: 'image', src: '../image/img10.jpg', label: 'CAM 12' },
        { type: 'image', src: '../image/img11.jpg', label: 'CAM 13' },
        { type: 'image', src: '../image/img12.jpg', label: 'CAM 14' },
        { type: 'video', src: '../image/img22.mov', label: 'CAM 15' },
        { type: 'image', src: '../image/img14.jpg', label: 'CAM 16' },
        { type: 'image', src: '../image/img15.jpg', label: 'CAM 17' },
        { type: 'video', src: '../image/img17.mov', label: 'CAM 18' },
        { type: 'image', src: '../image/img21.jpg', label: 'CAM 19' },
        { type: 'image', src: '../image/img20.jpg', label: 'CAM 20' }

    ];

    const gridContainer = document.querySelector('.grid-container');

    mediaList.forEach((media, index) => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        // 미디어 타입에 따라 요소 생성
        let mediaElement;
        if (media.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = media.src;
            mediaElement.alt = `CCTV Image ${index + 1}`;
        } else if (media.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = media.src;
            mediaElement.autoplay = true;
            mediaElement.muted = true;
            mediaElement.loop = true;
        }

        // 미디어 요소 추가
        gridItem.appendChild(mediaElement);

        // 오버레이 텍스트 추가
        const overlay = document.createElement('div');
        overlay.classList.add('cctv-overlay');
        overlay.textContent = media.label;
        gridItem.appendChild(overlay);

        // 그리드 컨테이너에 그리드 아이템 추가
        gridContainer.appendChild(gridItem);
    });


    // 활성 탭 추적 변수 선언 및 초기 활성 탭 설정
    let activeTab = document.getElementById('tap-Y');

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
});

document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 바 호버 및 클릭 효과
    const navItems = document.querySelectorAll('.nav-item');

    // 활성 탭 추적 변수 선언 및 초기 활성 탭 설정 (Y 탭으로 설정)
    let activeTab = document.getElementById('tap-Y');

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