(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tips = [
        { text: 'Hi! I am DhanuTech Bee 🐝 — always flying to help you explore the site.', href: 'index.html', cta: 'Home' },
        { text: 'Discover laptops, desktops, CCTV and accessories in Products.', href: 'products.html', cta: 'Products' },
        { text: 'Need quick support? Open Contact and message us anytime.', href: 'contact.html', cta: 'Contact' }
    ];

    function startBeeAssistant() {
        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'bird-assistant bee-cartoon';
        bee.setAttribute('aria-label', 'DhanuTech bee assistant');
        bee.innerHTML = `
            <svg class="bird-svg" viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="beeYellow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#fff176"/>
                        <stop offset="100%" stop-color="#facc15"/>
                    </linearGradient>
                    <linearGradient id="wingBlue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.35"/>
                    </linearGradient>
                </defs>

                <ellipse class="bee-wing left" cx="86" cy="52" rx="20" ry="11" fill="url(#wingBlue)" stroke="#60a5fa" stroke-width="1.3"/>
                <ellipse class="bee-wing right" cx="105" cy="47" rx="20" ry="11" fill="url(#wingBlue)" stroke="#60a5fa" stroke-width="1.3"/>

                <ellipse cx="93" cy="90" rx="33" ry="22" fill="url(#beeYellow)" stroke="#7c4a16" stroke-width="2.6" transform="rotate(-12 93 90)"/>
                <path d="M69 84 Q91 72 115 78" stroke="#2b2b2b" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M66 95 Q89 83 113 89" stroke="#2b2b2b" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M64 106 Q87 95 109 101" stroke="#2b2b2b" stroke-width="6" fill="none" stroke-linecap="round"/>

                <circle cx="58" cy="75" r="20" fill="url(#beeYellow)" stroke="#7c4a16" stroke-width="2.4"/>
                <circle cx="51" cy="73" r="3.2" fill="#111827"/>
                <circle cx="63" cy="73" r="3.2" fill="#111827"/>
                <path d="M50 82 Q57 88 64 82" stroke="#9a3412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <path d="M53 58 Q49 46 42 41" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <path d="M66 58 Q70 46 77 41" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <circle cx="41" cy="40" r="2.4" fill="#2f2f2f"/>
                <circle cx="78" cy="40" r="2.4" fill="#2f2f2f"/>

                <path d="M95 106 L110 120" stroke="#4b5563" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M83 111 L96 126" stroke="#4b5563" stroke-width="2.4" stroke-linecap="round"/>
                <ellipse cx="112" cy="122" rx="6" ry="4" fill="#5b3a29"/>
                <ellipse cx="98" cy="128" rx="6" ry="4" fill="#5b3a29"/>

                <path d="M122 86 C132 90 136 96 142 110" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="143" cy="111" r="4" fill="#8b5e34"/>
            </svg>
        `;

        const tooltip = document.createElement('aside');
        tooltip.className = 'bird-tooltip';

        const joyLayer = document.createElement('div');
        joyLayer.className = 'bird-love-layer';

        document.body.appendChild(joyLayer);
        document.body.appendChild(bee);
        document.body.appendChild(tooltip);

        const state = {
            x: Math.max(40, window.innerWidth - 180),
            y: Math.max(95, window.innerHeight - 240),
            tx: Math.max(40, window.innerWidth - 180),
            ty: Math.max(95, window.innerHeight - 240),
            t: 0,
            angle: 0,
            retargetAt: performance.now() + 1200
        };

        let tipIndex = 0;
        let hideTimer;

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            tooltip.innerHTML = `<p>${item.text}</p><a class="bird-link" href="${item.href}">${item.cta}</a>`;
            tooltip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tooltip.classList.remove('show'), 2800);
        }

        function emitJoy(x, y) {
            const node = document.createElement('span');
            node.className = 'bird-love';
            node.textContent = Math.random() < 0.72 ? '❤' : '✨';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.setProperty('--dx', `${(Math.random() - 0.5) * 34}px`);
            joyLayer.appendChild(node);
            setTimeout(() => node.remove(), 1150);
        }

        function retarget() {
            const margin = 70;
            state.tx = margin + Math.random() * Math.max(120, window.innerWidth - margin * 2);
            state.ty = 95 + Math.random() * Math.max(100, window.innerHeight - 320);
            state.retargetAt = performance.now() + 1400 + Math.random() * 1200;
        }

        gsap.ticker.add(() => {
            state.t += 0.016;
            const now = performance.now();
            if (now > state.retargetAt || (Math.abs(state.tx - state.x) < 16 && Math.abs(state.ty - state.y) < 16)) retarget();

            const ox = Math.sin(state.t * 1.9) * 18;
            const oy = Math.cos(state.t * 2.4) * 10;

            state.x += (state.tx + ox - state.x) * 0.075;
            state.y += (state.ty + oy - state.y) * 0.075;
            state.angle += ((ox * 0.3) - state.angle) * 0.16;

            bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            bee.style.setProperty('--wing-fast', `${Math.sin(state.t * 46) * 26}deg`);

            tooltip.style.left = `${Math.max(12, Math.min(window.innerWidth - 246, state.x - 220))}px`;
            tooltip.style.top = `${Math.max(68, state.y - 8)}px`;

            if (Math.random() < 0.085) emitJoy(state.x + 32, state.y + 22);
        });

        bee.addEventListener('mouseenter', () => {
            showTip();
            emitJoy(state.x + 30, state.y + 10);
        });

        bee.addEventListener('click', () => {
            showTip();
            emitJoy(state.x + 20, state.y + 14);
            emitJoy(state.x + 44, state.y + 14);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') tooltip.classList.remove('show');
        });

        window.addEventListener('resize', retarget);
        retarget();
        showTip(0);
        setInterval(() => showTip(), 12000);
    }

    if (window.gsap) {
        startBeeAssistant();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        script.onload = startBeeAssistant;
        document.head.appendChild(script);
    }
})();
