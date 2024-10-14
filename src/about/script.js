let activeTab = document.getElementById('tap-A');

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

    let activeTab = document.getElementById('tap-A');

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

const mainImage = document.getElementById("mainImage");
let clickCount = 0;

document.getElementById("mainImage").addEventListener("click", function() {
    if (clickCount > 0) return;
    clickCount++;

    for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
            let clone = this.cloneNode(true);

            clone.style.position = 'absolute';
            clone.style.left = (this.offsetLeft + 372) + 'px';
            clone.style.top = (this.offsetTop + 262) + 'px';
            clone.style.transform = `translate(${-30 * i}px, ${30 * i}px)`;
            clone.style.zIndex = -1;

            document.body.appendChild(clone);

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