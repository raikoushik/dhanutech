(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function start() {
        const tips = [
            { text: 'Explore our latest products and offers.', href: 'products.html', cta: 'View Products' },
            { text: 'Need a custom website? We offer web design services.', href: 'services.html', cta: 'Web Design' },
            { text: 'Talk to us directly on WhatsApp for quick support.', href: 'https://wa.me/919591555095', cta: 'Chat Now' }
        ];

        const canvas = document.createElement('canvas');
        canvas.className = 'bee-particle-canvas github-style';

        const flowers = document.createElement('div');
        flowers.className = 'bee-flower-field';
        const flowerSpots = [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9].map((x, i) => {
            const f = document.createElement('div');
            f.className = `bee-mini-flower flower-${i % 3}`;
            f.innerHTML = '<span class="c"></span>';
            flowers.appendChild(f);
            return { x, y: 0.84 + (i % 2 ? 0.04 : 0), el: f };
        });

        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'bee-assistant github-style';
        bee.setAttribute('aria-label', 'DhanuTech assistant bee');
        bee.innerHTML = `
            <svg class="bee-body" viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="rb_y" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#fef3a0"/>
                        <stop offset="48%" stop-color="#f7c948"/>
                        <stop offset="100%" stop-color="#d99a1f"/>
                    </linearGradient>
                    <radialGradient id="rb_face" cx="44%" cy="32%" r="78%">
                        <stop offset="0%" stop-color="#ffe4a6"/>
                        <stop offset="55%" stop-color="#f2c768"/>
                        <stop offset="100%" stop-color="#d9a33d"/>
                    </radialGradient>
                    <radialGradient id="rb_w" cx="52%" cy="35%" r="85%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.86"/>
                        <stop offset="100%" stop-color="#dbeafe" stop-opacity="0.2"/>
                    </radialGradient>
                </defs>

                <ellipse class="bee-wing wing-left" cx="124" cy="47" rx="20" ry="35" fill="url(#rb_w)" transform="rotate(-20 124 47)"/>
                <ellipse class="bee-wing wing-right" cx="151" cy="55" rx="19" ry="31" fill="url(#rb_w)" transform="rotate(10 151 55)"/>
                <ellipse cx="101" cy="96" rx="58" ry="41" fill="url(#rb_y)" stroke="#2a1d17" stroke-width="3.5"/>
                <ellipse cx="83" cy="81" rx="35" ry="27" fill="url(#rb_face)"/>
                <path d="M47 95 C74 84 118 84 145 95 L144 103 C118 96 74 96 48 104 Z" fill="#2a1d17"/>
                <path d="M52 112 C80 101 122 103 149 116 L148 124 C122 115 80 114 53 122 Z" fill="#2a1d17"/>
                <g fill="#e7b52f" opacity="0.85">
                    <path d="M57 63 l4 -7 l4 7z"/><path d="M67 58 l4 -7 l4 7z"/><path d="M77 55 l4 -6 l4 7z"/>
                    <path d="M88 54 l4 -6 l4 7z"/><path d="M98 55 l4 -6 l4 7z"/>
                </g>
                <ellipse cx="78" cy="83" rx="9" ry="10" fill="#fff"/>
                <ellipse cx="100" cy="85" rx="8" ry="9" fill="#fff"/>
                <ellipse cx="78" cy="84" rx="5.2" ry="6.1" fill="#111827"/>
                <ellipse cx="100" cy="86" rx="4.8" ry="5.6" fill="#111827"/>
                <circle cx="79.5" cy="81.5" r="1.3" fill="#fff"/>
                <circle cx="101.4" cy="83.4" r="1.2" fill="#fff"/>
                <path d="M70 75 Q77 71 84 75" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <path d="M92 77 Q99 73 106 77" stroke="#1f2937" stroke-width="2.1" fill="none" stroke-linecap="round"/>
                <path d="M82 95 Q89 100 96 95" stroke="#7c2d12" stroke-width="2.3" fill="none" stroke-linecap="round"/>
                <path d="M74 121 L73 140" stroke="#2a1d17" stroke-width="3" stroke-linecap="round"/>
                <path d="M94 126 L94 146" stroke="#2a1d17" stroke-width="3" stroke-linecap="round"/>
                <path d="M113 121 L114 140" stroke="#2a1d17" stroke-width="3" stroke-linecap="round"/>
                <ellipse cx="73" cy="142" rx="5.2" ry="3.2" fill="#2a1d17"/>
                <ellipse cx="94" cy="148" rx="5.2" ry="3.2" fill="#2a1d17"/>
                <ellipse cx="114" cy="142" rx="5.2" ry="3.2" fill="#2a1d17"/>
                <path d="M78 66 Q70 45 56 38" stroke="#2a1d17" stroke-width="2.4" fill="none"/>
                <path d="M98 67 Q99 46 112 37" stroke="#2a1d17" stroke-width="2.4" fill="none"/>
                <ellipse cx="55" cy="37" rx="3.8" ry="3" fill="#2a1d17"/>
                <ellipse cx="113" cy="36" rx="3.8" ry="3" fill="#2a1d17"/>
            </svg>
        `;

        const tip = document.createElement('aside');
        tip.className = 'bee-tooltip github-style';

        document.body.appendChild(flowers);
        document.body.appendChild(canvas);
        document.body.appendChild(bee);
        document.body.appendChild(tip);

        const ctx = canvas.getContext('2d');
        const particles = [];
        let tipIndex = 0;
        let hideTimer;

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            flowerSpots.forEach((f) => {
                f.el.style.left = `${Math.round(window.innerWidth * f.x)}px`;
                f.el.style.top = `${Math.round(window.innerHeight * f.y)}px`;
            });
        }

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            const external = item.href.startsWith('http');
            tip.innerHTML = `<p>${item.text}</p><a href="${item.href}" class="bee-tooltip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${item.cta}</a>`;
            tip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tip.classList.remove('show'), 3200);
        }

        function emit(x, y) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 0.24,
                vy: -0.16 - Math.random() * 0.18,
                a: 0.9,
                r: 1.8 + Math.random() * 2.2,
                heart: Math.random() < 0.5
            });
        }

        function drawHeart(p) {
            const s = p.r * 1.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.bezierCurveTo(p.x + s, p.y - s, p.x + s * 1.8, p.y + s * 0.8, p.x, p.y + s * 1.7);
            ctx.bezierCurveTo(p.x - s * 1.8, p.y + s * 0.8, p.x - s, p.y - s, p.x, p.y);
            ctx.closePath();
            ctx.fillStyle = `rgba(251,113,133,${p.a})`;
            ctx.fill();
        }

        function drawParticles() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = particles.length - 1; i >= 0; i -= 1) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.a -= 0.016;
                if (p.a <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                if (p.heart) {
                    drawHeart(p);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(250,204,21,${p.a})`;
                    ctx.fill();
                }
            }
        }

        function parseLuminance(color) {
            const m = color && color.match(/rgba?\(([^)]+)\)/);
            if (!m) return 1;
            const [r, g, b] = m[1].split(',').slice(0, 3).map((n) => Number.parseFloat(n.trim()) / 255);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        function updateContrastMode(x, y) {
            const el = document.elementFromPoint(Math.max(0, Math.min(window.innerWidth - 1, x)), Math.max(0, Math.min(window.innerHeight - 1, y)));
            let node = el;
            let lum = 1;
            while (node && node !== document.documentElement) {
                const bg = getComputedStyle(node).backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    lum = parseLuminance(bg);
                    break;
                }
                node = node.parentElement;
            }
            bee.classList.toggle('on-dark', lum < 0.45);
        }

        const state = {
            x: window.innerWidth - 120,
            y: window.innerHeight - 170,
            targetX: window.innerWidth - 120,
            targetY: window.innerHeight - 170,
            t: 0,
            z: 0,
            angle: 0,
            loop: 0
        };

        gsap.ticker.add(() => {
            state.t += 0.011;
            const ox = Math.sin(state.t * 1.15) * 20;
            const oy = Math.cos(state.t * 1.73) * 14;
            state.z = (Math.sin(state.t * 0.63) + 1) * 0.5; // 4D feel: x,y,z over time

            state.x += ((state.targetX + ox) - state.x) * 0.072;
            state.y += ((state.targetY + oy) - state.y) * 0.072;
            state.angle += ((ox * 0.22) - state.angle) * 0.12;

            const loopY = Math.sin(state.loop * Math.PI * 2) * 26;
            const scale = 0.86 + state.z * 0.28;
            bee.style.transform = `translate3d(${state.x}px, ${state.y - loopY}px, 0) rotate(${state.angle}deg) scale(${scale})`;
            tip.style.left = `${Math.max(12, state.x - 210)}px`;
            tip.style.top = `${Math.max(70, state.y - 10)}px`;

            updateContrastMode(state.x + 42, state.y + 42);

            if (Math.random() < 0.58) emit(state.x + 38, state.y + 58);
            drawParticles();

            flowerSpots.forEach((f) => {
                const d = Math.hypot(state.x - window.innerWidth * f.x, state.y - window.innerHeight * f.y);
                f.el.classList.toggle('is-bloom', d < 130);
            });
        });

        function moveToCurrentSection() {
            const sections = [...document.querySelectorAll('section, .service-section, .page-header')];
            const mid = window.scrollY + window.innerHeight * 0.5;
            let nearest = null;
            let min = Infinity;
            sections.forEach((s) => {
                const d = Math.abs(s.offsetTop - mid);
                if (d < min) {
                    min = d;
                    nearest = s;
                }
            });
            if (!nearest) return;
            const rect = nearest.getBoundingClientRect();
            state.targetY = Math.min(window.innerHeight - 140, Math.max(120, rect.top + rect.height * 0.28));
            state.targetX = window.innerWidth - 120;
        }

        bee.addEventListener('mouseenter', () => {
            showTip();
            gsap.to(state, { duration: 0.75, loop: 1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
        });

        bee.addEventListener('click', () => showTip());
        window.addEventListener('scroll', moveToCurrentSection, { passive: true });
        window.addEventListener('resize', () => {
            resizeCanvas();
            state.targetX = window.innerWidth - 120;
        });

        resizeCanvas();
        showTip(0);
        setInterval(() => showTip(), 10000);
    }

    if (window.gsap) {
        start();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        s.onload = start;
        document.head.appendChild(s);
    }
})();
