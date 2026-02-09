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
        { x: 0.06, y: 0.78 },
        { x: 0.18, y: 0.88 },
        { x: 0.32, y: 0.82 },
        { x: 0.48, y: 0.9 },
        { x: 0.62, y: 0.8 },
        { x: 0.74, y: 0.88 },
        { x: 0.88, y: 0.82 }
    ];

    const bee = document.createElement('button');
    bee.type = 'button';
    bee.className = 'bee-assistant';
    bee.setAttribute('aria-label', 'Helpful bumble bee assistant');
    bee.innerHTML = `
        <svg class="bee-body" viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <defs>
                <radialGradient id="wingGlow" cx="50%" cy="40%" r="75%">
                    <stop offset="0%" stop-color="#ecfeff" stop-opacity="0.95"/>
                    <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.45"/>
                </radialGradient>
                <linearGradient id="bodyGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fde047"/>
                    <stop offset="45%" stop-color="#facc15"/>
                    <stop offset="100%" stop-color="#f59e0b"/>
                </linearGradient>
                <radialGradient id="headShade" cx="45%" cy="30%" r="80%">
                    <stop offset="0%" stop-color="#4b2e2a"/>
                    <stop offset="100%" stop-color="#1f1412"/>
                </radialGradient>
            </defs>

            <ellipse class="bee-wing wing-left" cx="84" cy="76" rx="29" ry="38" fill="url(#wingGlow)" opacity="0.88"/>
            <ellipse class="bee-wing wing-right" cx="160" cy="76" rx="29" ry="38" fill="url(#wingGlow)" opacity="0.88"/>

            <ellipse cx="124" cy="124" rx="62" ry="52" fill="url(#bodyGold)"/>
            <ellipse cx="124" cy="124" rx="62" ry="52" fill="none" stroke="#1f2937" stroke-width="9"/>
            <ellipse cx="124" cy="98" rx="44" ry="38" fill="url(#headShade)"/>

            <path d="M72 116 C95 106 153 106 176 116 L176 127 C154 120 94 120 72 127 Z" fill="#111827"/>
            <path d="M72 136 C95 126 153 126 176 136 L176 147 C154 140 94 140 72 147 Z" fill="#111827"/>

            <path d="M95 91 Q105 84 115 91" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M133 91 Q143 84 153 91" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>

            <circle cx="108" cy="104" r="13" fill="#fff"/>
            <circle cx="141" cy="104" r="13" fill="#fff"/>
            <circle cx="108" cy="106" r="7.6" fill="#0f172a"/>
            <circle cx="141" cy="106" r="7.6" fill="#0f172a"/>
            <circle cx="111" cy="102" r="2" fill="#fff"/>
            <circle cx="144" cy="102" r="2" fill="#fff"/>

            <ellipse cx="96" cy="114" rx="7" ry="5" fill="#fb7185" opacity="0.6"/>
            <ellipse cx="153" cy="114" rx="7" ry="5" fill="#fb7185" opacity="0.6"/>
            <path d="M107 124 Q124 138 141 124" stroke="#7c2d12" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M114 130 Q124 136 134 130" stroke="#fb7185" stroke-width="4" fill="none" stroke-linecap="round"/>

            <path d="M112 72 Q103 38 84 30" stroke="#1f2937" stroke-width="4" fill="none"/>
            <path d="M136 72 Q146 38 164 30" stroke="#1f2937" stroke-width="4" fill="none"/>
            <circle cx="82" cy="29" r="8" fill="#f59e0b"/>
            <circle cx="166" cy="29" r="8" fill="#f59e0b"/>

            <g class="bee-hand-wave">
                <ellipse cx="63" cy="138" rx="13" ry="11" fill="#f59e0b"/>
                <circle cx="53" cy="130" r="5.5" fill="#f59e0b"/>
                <circle cx="49" cy="139" r="5.5" fill="#f59e0b"/>
                <circle cx="54" cy="148" r="5.5" fill="#f59e0b"/>
            </g>
        </svg>
    `;


    const tooltip = document.createElement('aside');
    tooltip.className = 'bee-tooltip';

    const trailLayer = document.createElement('div');
    trailLayer.className = 'bee-trail-layer';

    const garden = document.createElement('div');
    garden.className = 'bee-garden';

    const nest = document.createElement('div');
    nest.className = 'bee-nest';
    nest.setAttribute('aria-hidden', 'true');

    document.body.appendChild(garden);
    document.body.appendChild(trailLayer);
    document.body.appendChild(nest);
    document.body.appendChild(bee);
    document.body.appendChild(tooltip);

    flowerSpots.forEach((spot, index) => {
        const flower = document.createElement('div');
        flower.className = `bee-flower flower-${index % 4}`;
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
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let lastMoveAt = Date.now();
    let nestX = 130;
    let nestY = window.innerHeight - 120;

    function positionGarden() {
        nestX = Math.max(90, Math.min(window.innerWidth - 120, window.innerWidth * 0.12));
        nestY = window.innerHeight - 102;
        nest.style.left = `${nestX}px`;
        nest.style.top = `${nestY}px`;

        flowerSpots.forEach((spot) => {
            spot.element.style.left = `${Math.round(window.innerWidth * spot.x)}px`;
            spot.element.style.top = `${Math.round(window.innerHeight * spot.y)}px`;
        });
    }

    function clearActiveFlower() {
        if (activeFlower) {
            activeFlower.classList.remove('is-visited');
            activeFlower = null;
        }
    }

    function setRandomTarget() {
        const margin = 90;
        targetX = margin + Math.random() * Math.max(120, window.innerWidth - margin * 2);
        targetY = margin + Math.random() * Math.max(120, window.innerHeight - margin * 2);
        resting = false;
        bee.classList.remove('is-resting');
        clearActiveFlower();
    }

    function setFlowerTarget() {
        const spot = flowerSpots[Math.floor(Math.random() * flowerSpots.length)];
        targetX = Math.round(window.innerWidth * spot.x) + 8;
        targetY = Math.round(window.innerHeight * spot.y) + 8;
        resting = true;
        bee.classList.add('is-resting');
        clearActiveFlower();
        activeFlower = spot.element;
        activeFlower.classList.add('is-visited');
    }

    function setNestTarget() {
        targetX = nestX;
        targetY = nestY;
        resting = true;
        bee.classList.add('is-resting');
        clearActiveFlower();
        nest.classList.add('is-active');
        setTimeout(() => nest.classList.remove('is-active'), 2800);
    }

    function setCursorTarget() {
        targetX = Math.min(window.innerWidth - 80, Math.max(80, mouseX + (Math.random() * 80 - 40)));
        targetY = Math.min(window.innerHeight - 120, Math.max(90, mouseY - 32 + (Math.random() * 50 - 25)));
        resting = true;
        bee.classList.add('is-resting');
        clearActiveFlower();
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

    function spawnLoveParticle(speed) {
        const love = document.createElement('span');
        love.className = Math.random() < 0.5 ? 'bee-sparkle heart' : 'bee-sparkle';
        love.style.left = `${x + 24 + Math.random() * 10}px`;
        love.style.top = `${y + 36 + Math.random() * 10}px`;
        love.style.setProperty('--sparkle-size', `${4 + Math.min(10, speed * 14)}px`);
        trailLayer.appendChild(love);
        love.addEventListener('animationend', () => love.remove());
    }

    function chooseNextTarget() {
        const idleTime = Date.now() - lastMoveAt;
        if (idleTime > 4200) {
            Math.random() < 0.5 ? setNestTarget() : setCursorTarget();
            return;
        }

        const roll = Math.random();
        if (roll < 0.3) {
            setFlowerTarget();
        } else if (roll < 0.45) {
            setCursorTarget();
        } else {
            setRandomTarget();
        }
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

            if (speed > 0.07 && frameCounter % 4 === 0) {
                spawnLoveParticle(speed);
            }

            if (Math.hypot(dx, dy) < 20) {
                if (resting) {
                    resting = false;
                    setTimeout(() => {
                        if (!paused) {
                            setRandomTarget();
                        }
                    }, 2000 + Math.random() * 1600);
                } else {
                    chooseNextTarget();
                }
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

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        lastMoveAt = Date.now();
    }, { passive: true });

    positionGarden();
    setRandomTarget();
    animate();
    showSuggestion(0);
    setInterval(() => showSuggestion(), 9000);

    window.addEventListener('resize', () => {
        positionGarden();
        setRandomTarget();
    });
})();
