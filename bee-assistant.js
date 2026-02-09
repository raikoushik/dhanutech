(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const suggestions = [
        { text: 'Need a new laptop? Explore our latest products.', href: 'products.html', cta: 'View Products' },
        { text: 'Get quick support and pricing on WhatsApp.', href: 'https://wa.me/919591555095', cta: 'Chat on WhatsApp' },
        { text: 'Build your dream PC with our customization service.', href: 'customization.html', cta: 'Customize Now' },
        { text: 'Discover CCTV, power backup, and electrical services.', href: 'services.html', cta: 'See Services' },
        { text: 'Read useful tech tips and updates in our blog.', href: 'blog.html', cta: 'Read Blog' }
    ];

    const flowerSpots = [
        { x: 0.08, y: 0.8 },
        { x: 0.48, y: 0.88 },
        { x: 0.84, y: 0.78 }
    ];

    const bee = document.createElement('button');
    bee.type = 'button';
    bee.className = 'bee-assistant';
    bee.setAttribute('aria-label', 'Helpful bumble bee assistant');
    bee.innerHTML = `
        <svg class="bee-body" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <ellipse class="bee-wing wing-left" cx="84" cy="74" rx="27" ry="34" fill="#CFF3FF" opacity="0.88"/>
            <ellipse class="bee-wing wing-right" cx="143" cy="74" rx="27" ry="34" fill="#CFF3FF" opacity="0.88"/>
            <ellipse cx="113" cy="124" rx="56" ry="48" fill="#FACC15"/>
            <ellipse cx="113" cy="124" rx="56" ry="48" fill="none" stroke="#111827" stroke-width="10"/>
            <rect x="69" y="112" width="88" height="14" rx="7" fill="#111827"/>
            <rect x="69" y="133" width="88" height="14" rx="7" fill="#111827"/>
            <path d="M82 98 Q92 92 102 98" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M124 98 Q134 92 144 98" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="92" cy="112" r="13" fill="#fff"/>
            <circle cx="133" cy="112" r="13" fill="#fff"/>
            <circle cx="92" cy="114" r="8" fill="#111827"/>
            <circle cx="133" cy="114" r="8" fill="#111827"/>
            <circle cx="95" cy="110" r="2.2" fill="#fff"/>
            <circle cx="136" cy="110" r="2.2" fill="#fff"/>
            <ellipse cx="80" cy="124" rx="8" ry="6" fill="#FB7185" opacity="0.65"/>
            <ellipse cx="146" cy="124" rx="8" ry="6" fill="#FB7185" opacity="0.65"/>
            <path d="M95 138 Q113 152 131 138 Q129 154 113 158 Q97 154 95 138" fill="#7C2D12"/>
            <path d="M101 149 Q113 158 125 149" fill="#FB7185"/>
            <ellipse cx="113" cy="136" rx="5" ry="3.5" fill="#F59E0B"/>
            <path d="M102 75 Q92 36 72 30" stroke="#111827" stroke-width="4" fill="none"/>
            <path d="M124 75 Q135 36 154 30" stroke="#111827" stroke-width="4" fill="none"/>
            <circle cx="70" cy="29" r="8" fill="#F59E0B"/>
            <circle cx="156" cy="29" r="8" fill="#F59E0B"/>
            <g class="bee-hand-wave">
                <ellipse cx="53" cy="134" rx="14" ry="12" fill="#F59E0B"/>
                <circle cx="42" cy="126" r="6" fill="#F59E0B"/>
                <circle cx="38" cy="136" r="6" fill="#F59E0B"/>
                <circle cx="43" cy="146" r="6" fill="#F59E0B"/>
            </g>
        </svg>
    `;

    const tooltip = document.createElement('aside');
    tooltip.className = 'bee-tooltip';

    const trailLayer = document.createElement('div');
    trailLayer.className = 'bee-trail-layer';

    document.body.appendChild(trailLayer);
    document.body.appendChild(bee);
    document.body.appendChild(tooltip);

    flowerSpots.forEach((spot) => {
        const flower = document.createElement('div');
        flower.className = 'bee-flower';
        flower.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="50" cy="50" r="14" fill="#F59E0B"/>
                <ellipse cx="50" cy="22" rx="11" ry="18" fill="#F472B6"/>
                <ellipse cx="50" cy="78" rx="11" ry="18" fill="#F472B6"/>
                <ellipse cx="22" cy="50" rx="18" ry="11" fill="#F472B6"/>
                <ellipse cx="78" cy="50" rx="18" ry="11" fill="#F472B6"/>
                <ellipse cx="31" cy="31" rx="12" ry="9" fill="#F9A8D4"/>
                <ellipse cx="69" cy="31" rx="12" ry="9" fill="#F9A8D4"/>
            </svg>
        `;
        spot.element = flower;
        document.body.appendChild(flower);
    });

    let x = window.innerWidth * 0.28;
    let y = window.innerHeight * 0.32;
    let targetX = x;
    let targetY = y;
    let resting = false;
    let paused = false;
    let suggestionIndex = 0;
    let hideTipTimer;
    let activeFlower = null;
    let frameCounter = 0;

    function positionFlowers() {
        flowerSpots.forEach((spot) => {
            spot.element.style.left = `${Math.round(window.innerWidth * spot.x)}px`;
            spot.element.style.top = `${Math.round(window.innerHeight * spot.y)}px`;
        });
    }

    function setRandomTarget() {
        const margin = 90;
        targetX = margin + Math.random() * Math.max(120, window.innerWidth - margin * 2);
        targetY = margin + Math.random() * Math.max(120, window.innerHeight - margin * 2);
        resting = false;
        bee.classList.remove('is-resting');
        if (activeFlower) {
            activeFlower.classList.remove('is-visited');
            activeFlower = null;
        }
    }

    function setFlowerTarget() {
        const spot = flowerSpots[Math.floor(Math.random() * flowerSpots.length)];
        targetX = Math.round(window.innerWidth * spot.x) + 8;
        targetY = Math.round(window.innerHeight * spot.y) + 8;
        resting = true;
        bee.classList.add('is-resting');
        activeFlower = spot.element;
        activeFlower.classList.add('is-visited');
        setTimeout(() => {
            if (!paused) {
                setRandomTarget();
            }
        }, 2600 + Math.random() * 2400);
    }

    function updateTooltipPosition() {
        const left = Math.min(window.innerWidth - 260, x + 52);
        const top = Math.max(86, y - 30);
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    function showSuggestion(forceIndex) {
        if (typeof forceIndex === 'number') {
            suggestionIndex = forceIndex % suggestions.length;
        }
        const suggestion = suggestions[suggestionIndex];
        suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        const external = suggestion.href.startsWith('http');

        tooltip.innerHTML = `
            <p>${suggestion.text}</p>
            <a href="${suggestion.href}" class="bee-tooltip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${suggestion.cta}</a>
        `;
        updateTooltipPosition();
        tooltip.classList.add('show');

        clearTimeout(hideTipTimer);
        hideTipTimer = setTimeout(() => {
            tooltip.classList.remove('show');
        }, 4300);
    }

    function spawnTrailParticle(speed) {
        const sparkle = document.createElement('span');
        sparkle.className = 'bee-sparkle';
        sparkle.style.left = `${x + 24 + Math.random() * 10}px`;
        sparkle.style.top = `${y + 36 + Math.random() * 10}px`;
        sparkle.style.setProperty('--sparkle-size', `${4 + Math.min(8, speed * 12)}px`);
        trailLayer.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove());
    }

    function animate() {
        frameCounter += 1;

        if (!paused) {
            x += (targetX - x) * 0.02;
            y += (targetY - y) * 0.02;
            const dx = targetX - x;
            const dy = targetY - y;
            const speed = Math.hypot(dx, dy) * 0.01;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            bee.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle * 0.12}deg)`;

            if (speed > 0.08 && frameCounter % 4 === 0) {
                spawnTrailParticle(speed);
            }

            if (Math.hypot(dx, dy) < 20 && !resting) {
                Math.random() < 0.38 ? setFlowerTarget() : setRandomTarget();
            }
        }

        updateTooltipPosition();
        requestAnimationFrame(animate);
    }

    bee.addEventListener('click', () => {
        paused = !paused;
        bee.classList.toggle('is-paused', paused);
        showSuggestion();
        if (!paused) {
            setRandomTarget();
        }
    });

    bee.addEventListener('mouseenter', () => {
        paused = true;
        bee.classList.add('is-paused');
        showSuggestion();
    });

    bee.addEventListener('mouseleave', () => {
        paused = false;
        bee.classList.remove('is-paused');
        setRandomTarget();
    });

    positionFlowers();
    setRandomTarget();
    animate();
    showSuggestion(0);
    setInterval(() => showSuggestion(), 9000);

    window.addEventListener('resize', () => {
        positionFlowers();
        setRandomTarget();
    });
})();
