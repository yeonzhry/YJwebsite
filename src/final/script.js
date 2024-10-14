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

document.querySelector('.project-container').addEventListener('wheel', (e) => {
    e.preventDefault();
    document.querySelector('.project-container').scrollLeft += e.deltaY;
});

let activeTab = document.getElementById('tap-E!');

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

    let activeTab = document.getElementById('tap-E!');

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