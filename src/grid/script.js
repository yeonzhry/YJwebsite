document.addEventListener('DOMContentLoaded', function() {
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

        gridItem.appendChild(mediaElement);

        const overlay = document.createElement('div');
        overlay.classList.add('cctv-overlay');
        overlay.textContent = media.label;
        gridItem.appendChild(overlay);
        gridContainer.appendChild(gridItem);
    });

    let activeTab = document.getElementById('tap-Y');

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
    const navItems = document.querySelectorAll('.nav-item');

    let activeTab = document.getElementById('tap-Y');

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