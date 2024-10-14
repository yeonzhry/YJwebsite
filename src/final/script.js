document.querySelectorAll('.project-video').forEach(video => {
    video.addEventListener('mouseenter', () => {
        video.play();
        video.style.transform = 'scale(1.3)';
    });
    video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
        video.style.transform = 'scale(1)';
    });
});


gsap.registerPlugin(ScrollTrigger);
gsap.fromTo(
    "#section", { x: 0 }, {
        x: () => `-${document.querySelector('.project-section').scrollWidth - window.innerWidth}px`,
        ease: 'none',
        scrollTrigger: {
            trigger: ".project-container",
            start: "top top",
            end: () => `+=${document.querySelector('.project-section').scrollWidth - window.innerWidth}`,
            scrub: 0.7,
            pin: true
        }
    }
);

// 가로 스크롤을 마우스 휠로 제어
document.querySelector('.project-container').addEventListener('wheel', (e) => {
    e.preventDefault();
    document.querySelector('.project-container').scrollLeft += e.deltaY;
});

// 활성 탭 추적 변수 선언 및 초기 활성 탭 설정
let activeTab = document.getElementById('tap-E!');

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
    let activeTab = document.getElementById('tap-E!');

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