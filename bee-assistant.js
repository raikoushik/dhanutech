(() => {
    if (window.__dhanuHoneyBeeInit) return;
    window.__dhanuHoneyBeeInit = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tips = [
        { text: 'Welcome to DhanuTech — your Honey Bee guide for power, computers, electronics and electrical solutions.', href: 'index.html', cta: 'Home' },
        { text: 'Explore Products: laptops, desktops, CCTV, accessories and business essentials.', href: 'products.html', cta: 'Products' },
        { text: 'Need custom setup or repair? Visit Services and Customization for quick support.', href: 'services.html', cta: 'Services' },
        { text: 'Read our latest blog updates and contact us anytime for help.', href: 'blog.html', cta: 'Blog' }
    ];

    function start() {
        if (!document.body) return;

        document.querySelector('.honey-bee-assistant')?.remove();
        document.querySelector('.honey-bee-tooltip')?.remove();

        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'honey-bee-assistant';
        bee.setAttribute('aria-label', 'DhanuTech honey bee assistant');
        bee.innerHTML = `
            <svg class="honey-bee-svg" viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="hb_y" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#ffe7a3"/>
                        <stop offset="60%" stop-color="#f7bf45"/>
                        <stop offset="100%" stop-color="#d89a2a"/>
                    </linearGradient>
                    <radialGradient id="hb_fur" cx="42%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.65"/>
                        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="hb_w" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ecfeff" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.34"/>
                    </linearGradient>
                </defs>
                <ellipse class="hb-wing hb-wing-left" cx="82" cy="50" rx="22" ry="12" fill="url(#hb_w)" stroke="#60a5fa" stroke-width="1.2"/>
                <ellipse class="hb-wing hb-wing-right" cx="103" cy="45" rx="22" ry="12" fill="url(#hb_w)" stroke="#60a5fa" stroke-width="1.2"/>
                <ellipse cx="94" cy="90" rx="34" ry="23" fill="url(#hb_y)" stroke="#6b3f1d" stroke-width="2.8" transform="rotate(-12 94 90)"/>
                <ellipse cx="90" cy="84" rx="26" ry="15" fill="url(#hb_fur)"/>
                <path d="M68 84 Q92 72 117 79" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M66 95 Q90 84 114 90" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M64 106 Q88 96 110 101" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="57" cy="74" r="20" fill="url(#hb_y)" stroke="#6b3f1d" stroke-width="2.4"/>
                <circle cx="50" cy="72" r="3.2" fill="#111827"/>
                <circle cx="62" cy="72" r="3.2" fill="#111827"/>
                <path d="M49 82 Q56 88 63 82" stroke="#9a3412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <path d="M53 58 Q48 46 41 40" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <path d="M66 58 Q70 45 77 40" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <circle cx="41" cy="39" r="2.4" fill="#2f2f2f"/>
                <circle cx="78" cy="39" r="2.4" fill="#2f2f2f"/>
                <path d="M113 84 L130 77 L118 92 L132 100" fill="#c07a22" stroke="#6b3f1d" stroke-width="1.8"/>
            </svg>
        `;

        const tip = document.createElement('aside');
        tip.className = 'honey-bee-tooltip';

        document.body.appendChild(bee);
        document.body.appendChild(tip);

        const state = {
            x: Math.max(80, window.innerWidth - 220),
            y: Math.max(110, window.innerHeight - 290),
            tx: Math.max(80, window.innerWidth - 220),
            ty: Math.max(110, window.innerHeight - 290),
            t: 0,
            angle: 0,
            retargetAt: performance.now() + 1000,
            paused: false,
            rafId: 0
        };

        let tipIndex = 0;
        let hideTimer;

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            tip.innerHTML = `<p>${item.text}</p><a href="${item.href}">${item.cta}</a>`;
            tip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tip.classList.remove('show'), 3300);
        }

        function retarget() {
            const margin = 90;
            state.tx = margin + Math.random() * Math.max(140, window.innerWidth - margin * 2);
            state.ty = 100 + Math.random() * Math.max(120, window.innerHeight - 330);
            state.retargetAt = performance.now() + 1100 + Math.random() * 800;
        }

        function tick(now) {
            state.t += 0.02;

            if (!state.paused) {
                if (now > state.retargetAt || (Math.abs(state.tx - state.x) < 16 && Math.abs(state.ty - state.y) < 16)) retarget();

                const ox = Math.sin(state.t * 1.9) * 18;
                const oy = Math.cos(state.t * 2.2) * 10;
                state.x += (state.tx + ox - state.x) * 0.082;
                state.y += (state.ty + oy - state.y) * 0.082;
                state.angle += ((ox * 0.28) - state.angle) * 0.18;
            }

            bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            bee.style.setProperty('--hb-wing', `${Math.sin(state.t * 52) * 30}deg`);

            tip.style.left = `${Math.max(12, Math.min(window.innerWidth - 260, state.x - 240))}px`;
            tip.style.top = `${Math.max(64, state.y - 4)}px`;

            state.rafId = requestAnimationFrame(tick);
        }

        bee.addEventListener('mouseenter', () => {
            state.paused = true;
            showTip();
        });
        bee.addEventListener('mouseleave', () => {
            state.paused = false;
        });
        bee.addEventListener('click', () => showTip());
        bee.addEventListener('focus', () => showTip());

        window.addEventListener('resize', retarget, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                state.paused = true;
                if (state.rafId) cancelAnimationFrame(state.rafId);
                state.rafId = 0;
            } else {
                state.paused = false;
                if (!state.rafId) state.rafId = requestAnimationFrame(tick);
            }
        });
        setInterval(() => showTip(), 12000);

        showTip(0);
        retarget();
        state.rafId = requestAnimationFrame(tick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
