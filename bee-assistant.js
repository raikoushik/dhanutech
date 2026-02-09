(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tips = [
        { text: 'Hi! I am your hummingbird guide for DhanuTech services and solutions.', href: 'index.html', cta: 'Home' },
        { text: 'Need laptops, desktops, CCTV or accessories? Check Products.', href: 'products.html', cta: 'Products' },
        { text: 'Custom builds, service and support are available. Let us help you fast.', href: 'contact.html', cta: 'Contact' }
    ];

    function startBirdAssistant() {
        const bird = document.createElement('button');
        bird.type = 'button';
        bird.className = 'bird-assistant hummingbird';
        bird.setAttribute('aria-label', 'DhanuTech hummingbird assistant');
        bird.innerHTML = `
            <svg class="bird-svg" viewBox="0 0 170 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="hbBody" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ecfeff"/>
                        <stop offset="55%" stop-color="#67e8f9"/>
                        <stop offset="100%" stop-color="#22d3ee"/>
                    </linearGradient>
                    <linearGradient id="hbChest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="100%" stop-color="#facc15"/>
                    </linearGradient>
                </defs>
                <ellipse cx="94" cy="82" rx="34" ry="23" fill="url(#hbBody)" stroke="#0e7490" stroke-width="2.8"/>
                <ellipse cx="80" cy="88" rx="15" ry="12" fill="url(#hbChest)"/>
                <ellipse class="bird-wing left" cx="96" cy="70" rx="26" ry="10" fill="#dbeafe" fill-opacity="0.9"/>
                <ellipse class="bird-wing right" cx="112" cy="84" rx="24" ry="9" fill="#e0f2fe" fill-opacity="0.86"/>
                <circle cx="58" cy="76" r="13" fill="url(#hbBody)" stroke="#0e7490" stroke-width="2.3"/>
                <circle cx="54" cy="74" r="3.8" fill="#0f172a"/>
                <circle cx="55" cy="72.8" r="1" fill="#fff"/>
                <path d="M44 74 L16 72 L44 78" stroke="#d97706" stroke-width="3" stroke-linecap="round" fill="none"/>
                <path d="M126 82 L151 76 L132 90 L151 100 Z" fill="#0ea5e9" stroke="#0369a1" stroke-width="2"/>
                <path d="M84 102 Q90 106 97 102" stroke="#155e75" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
        `;

        const tooltip = document.createElement('aside');
        tooltip.className = 'bird-tooltip';

        const loveLayer = document.createElement('div');
        loveLayer.className = 'bird-love-layer';

        document.body.appendChild(loveLayer);
        document.body.appendChild(bird);
        document.body.appendChild(tooltip);

        const state = {
            x: Math.max(30, window.innerWidth - 160),
            y: Math.max(90, window.innerHeight - 240),
            tx: Math.max(30, window.innerWidth - 160),
            ty: Math.max(90, window.innerHeight - 240),
            t: 0,
            angle: 0
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
            hideTimer = setTimeout(() => tooltip.classList.remove('show'), 3000);
        }

        function emitLove(x, y) {
            const node = document.createElement('span');
            node.className = 'bird-love';
            node.textContent = Math.random() < 0.65 ? '❤' : '✨';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.setProperty('--dx', `${(Math.random() - 0.5) * 28}px`);
            loveLayer.appendChild(node);
            setTimeout(() => node.remove(), 1100);
        }

        function retarget() {
            state.tx = 40 + Math.random() * (window.innerWidth - 140);
            state.ty = 80 + Math.random() * (window.innerHeight - 260);
        }

        gsap.ticker.add(() => {
            state.t += 0.016;
            if (Math.abs(state.tx - state.x) < 18 && Math.abs(state.ty - state.y) < 18) retarget();

            const ox = Math.sin(state.t * 1.8) * 16;
            const oy = Math.cos(state.t * 2.5) * 10;

            state.x += (state.tx + ox - state.x) * 0.08;
            state.y += (state.ty + oy - state.y) * 0.08;
            state.angle += ((ox * 0.34) - state.angle) * 0.18;

            bird.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            bird.style.setProperty('--wing-fast', `${Math.sin(state.t * 52) * 35}deg`);

            tooltip.style.left = `${Math.max(12, state.x - 235)}px`;
            tooltip.style.top = `${Math.max(68, state.y - 6)}px`;

            if (Math.random() < 0.05) emitLove(state.x + 28, state.y + 22);
        });

        bird.addEventListener('mouseenter', () => {
            showTip();
            emitLove(state.x + 30, state.y + 10);
        });

        bird.addEventListener('click', () => {
            showTip();
            emitLove(state.x + 18, state.y + 14);
            emitLove(state.x + 42, state.y + 14);
        });

        window.addEventListener('resize', retarget);
        retarget();
        showTip(0);
        setInterval(() => showTip(), 10000);
    }

    if (window.gsap) {
        startBirdAssistant();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        script.onload = startBirdAssistant;
        document.head.appendChild(script);
    }
})();
