let activeTab = document.getElementById('tap-A');

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
    let activeTab = document.getElementById('tap-A');

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

const mainImage = document.getElementById("mainImage");
let clickCount = 0;

document.getElementById("mainImage").addEventListener("click", function() {
    if (clickCount > 0) return; // 클릭이 한 번 이상 되었으면 실행되지 않도록 설정
    clickCount++;

    for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
            // 원본 이미지 요소를 복사
            let clone = this.cloneNode(true);

            // 새로운 위치 설정 (왼쪽 아래로 x축, y축 방향으로 각각 30px씩 이동)
            clone.style.position = 'absolute';
            clone.style.left = (this.offsetLeft + 372) + 'px';
            clone.style.top = (this.offsetTop + 262) + 'px';
            clone.style.transform = `translate(${-30 * i}px, ${30 * i}px)`;
            clone.style.zIndex = -1;

            document.body.appendChild(clone);

            // 마지막 clone이 나타날 때 버튼 복제
            if (i === 5) {
                const buttonsContainer = document.querySelector('.buttons-container');
                const buttonsClone = buttonsContainer.cloneNode(true);
                buttonsClone.style.position = 'absolute';
                buttonsClone.style.left = (buttonsContainer.offsetLeft + 220) + 'px';
                buttonsClone.style.top = (buttonsContainer.offsetTop + 412) + 'px';
                buttonsClone.style.width = buttonsContainer.offsetWidth + 'px';
                buttonsClone.style.height = buttonsContainer.offsetHeight + 'px';
                document.body.appendChild(buttonsClone);
            }
        }, i * 250);
    }
});