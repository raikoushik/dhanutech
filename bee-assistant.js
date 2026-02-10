(() => {
    const LOW_END = (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2)
    );

    if (LOW_END) return;

    const WA_LINK = 'https://wa.me/919787959595?text=' + encodeURIComponent("Hi Dhanu Tech, I'd like to discuss an engineering requirement.");

    const state = {
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        vx: 0,
        vy: 0,
        t: 0,
        angle: 0,
        mode: 'patrol',
        cursorX: window.innerWidth * 0.7,
        cursorY: window.innerHeight * 0.35,
        lastPointerMove: performance.now(),
        lastInteractionAt: performance.now(),
        lastSectionIndex: -1,
        muted: true,
        hidden: false,
        cursorSpeed: 0,
        lastCursorX: window.innerWidth * 0.7,
        lastCursorY: window.innerHeight * 0.35
    };

    let bee;
    let tooltip;
    let sparkleLayer;
    let helperText;
    let controls;
    let audioCtx;
    let buzzOsc;
    let buzzGain;

    const sections = [];

    function q(sel) { return document.querySelector(sel); }
    function qa(sel) { return Array.from(document.querySelectorAll(sel)); }

    function createBeeMarkup() {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'honeybee-assistant';
        el.setAttribute('aria-label', 'Dhanu Tech helper bee');
        el.innerHTML = `
            <svg class="honeybee-svg" viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <radialGradient id="beeBody" cx="35%" cy="35%" r="72%">
                        <stop offset="0%" stop-color="#fde047"/>
                        <stop offset="55%" stop-color="#facc15"/>
                        <stop offset="100%" stop-color="#eab308"/>
                    </radialGradient>
                    <radialGradient id="beeWing" cx="50%" cy="30%" r="80%">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.88)"/>
                        <stop offset="100%" stop-color="rgba(125,211,252,0.34)"/>
                    </radialGradient>
                </defs>

                <ellipse class="honeybee-wing wing-back" cx="148" cy="58" rx="38" ry="52" transform="rotate(-14 148 58)"/>
                <ellipse class="honeybee-wing wing-front" cx="191" cy="82" rx="34" ry="48" transform="rotate(16 191 82)"/>

                <ellipse class="honeybee-body" cx="145" cy="115" rx="75" ry="50" transform="rotate(10 145 115)"/>
                <ellipse class="honeybee-stripe" cx="119" cy="110" rx="12" ry="42" transform="rotate(10 119 110)"/>
                <ellipse class="honeybee-stripe" cx="148" cy="116" rx="13" ry="44" transform="rotate(10 148 116)"/>
                <ellipse class="honeybee-stripe" cx="178" cy="122" rx="11" ry="41" transform="rotate(10 178 122)"/>
                <path class="honeybee-tail" d="M212 133 L244 152 L212 161 Z"/>

                <circle class="honeybee-head" cx="76" cy="102" r="54"/>
                <path class="honeybee-smile" d="M58 121 Q74 136 92 121"/>
                <ellipse class="honeybee-eye-open" cx="54" cy="95" rx="9" ry="13"/>
                <ellipse class="honeybee-eye-dot" cx="56" cy="90" rx="2.6" ry="3.4"/>
                <path class="honeybee-eye-wink" d="M85 95 Q98 85 106 95"/>
                <ellipse class="honeybee-cheek" cx="46" cy="113" rx="9" ry="5.5"/>
                <ellipse class="honeybee-cheek" cx="97" cy="113" rx="9" ry="5.5"/>

                <path class="honeybee-leg" d="M128 149 Q116 165 99 166"/>
                <path class="honeybee-leg" d="M170 153 Q184 167 201 168"/>

                <path class="honeybee-antenna" d="M52 59 Q37 27 24 21"/>
                <circle class="honeybee-antenna-tip" cx="21" cy="19" r="6"/>
                <path class="honeybee-antenna" d="M81 58 Q86 28 101 22"/>
                <circle class="honeybee-antenna-tip" cx="104" cy="20" r="6"/>
            </svg>
            <span class="honeybee-aura" aria-hidden="true"></span>
        `;
        return el;
    }

    function createTooltip() {
        const node = document.createElement('aside');
        node.className = 'honeybee-tooltip';
        node.innerHTML = '<p>Need help? Ask an Engineer 🐝</p>';
        return node;
    }

    function createHelperText() {
        const node = document.createElement('div');
        node.className = 'honeybee-helper-text';
        return node;
    }

    function createControls() {
        const node = document.createElement('div');
        node.className = 'honeybee-controls';
        node.innerHTML = `
            <button type="button" class="honeybee-control-btn" data-role="mute" aria-label="Toggle bee sound">🔇</button>
            <button type="button" class="honeybee-control-btn" data-role="hide" aria-label="Hide bee">🙈</button>
        `;
        return node;
    }

    function emitSparkle(x, y) {
        const sp = document.createElement('span');
        sp.className = 'honeybee-sparkle';
        sp.textContent = Math.random() < 0.55 ? '✦' : '•';
        sp.style.left = `${x}px`;
        sp.style.top = `${y}px`;
        sp.style.setProperty('--dx', `${(Math.random() - 0.5) * 26}px`);
        sparkleLayer.appendChild(sp);
        setTimeout(() => sp.remove(), 880);
    }

    function clampTarget() {
        const margin = 18;
        state.tx = Math.max(margin, Math.min(window.innerWidth - 130, state.tx));
        state.ty = Math.max(40, Math.min(window.innerHeight - 130, state.ty));
    }

    function nextPatrolTarget() {
        state.tx = 20 + Math.random() * Math.max(180, window.innerWidth - 150);
        state.ty = 40 + Math.random() * Math.max(220, window.innerHeight - 160);
        clampTarget();
    }

    function avoidBlockingInteractions() {
        const cx = state.x + 65;
        const cy = state.y + 55;
        const el = document.elementFromPoint(cx, cy);
        if (!el) return;
        const blocker = el.closest('button, a, input, textarea, select, .btn, .service-card, .contact-item');
        if (blocker) {
            state.tx += (Math.random() > 0.5 ? 1 : -1) * 120;
            state.ty -= 70;
            clampTarget();
        }
    }

    function setupAudio() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        buzzOsc = audioCtx.createOscillator();
        const buzzOsc2 = audioCtx.createOscillator();
        buzzGain = audioCtx.createGain();
        buzzGain.gain.value = 0;
        buzzOsc.type = 'sawtooth';
        buzzOsc.frequency.value = 210;
        buzzOsc2.type = 'triangle';
        buzzOsc2.frequency.value = 228;
        buzzOsc.connect(buzzGain);
        buzzOsc2.connect(buzzGain);
        buzzGain.connect(audioCtx.destination);
        buzzOsc.start();
        buzzOsc2.start();
    }

    function updateAudio() {
        if (!buzzGain) return;
        const target = state.muted || state.hidden ? 0 : 0.007;
        buzzGain.gain.value += (target - buzzGain.gain.value) * 0.08;
        if (buzzOsc) {
            const flutter = 205 + (Math.sin(state.t * 10) * 18);
            buzzOsc.frequency.value = flutter;
        }
    }

    function positionUI() {
        bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
        const flutterBase = Math.sin(state.t * 42) * 11;
        const flutterPulse = Math.sin(state.t * 7.5) * 3.8;
        bee.style.setProperty('--wing-flutter', `${flutterBase + flutterPulse}deg`);
        tooltip.style.left = `${Math.max(12, state.x - 120)}px`;
        tooltip.style.top = `${Math.max(66, state.y - 52)}px`;

        helperText.style.left = `${Math.max(12, state.x - 120)}px`;
        helperText.style.top = `${Math.max(66, state.y + 96)}px`;
    }

    function trackSections() {
        const list = qa('section, .page-header, .container, article');
        sections.push(...list.filter(Boolean));
    }

    function smartContextTarget() {
        const services = q('#services, .services-section');
        const contact = q('#contact, .contact-section');
        const blogTitle = q('article h1, .blog-post h1, .blog-header h1');

        if (blogTitle) {
            const r = blogTitle.getBoundingClientRect();
            state.tx = Math.min(window.innerWidth - 180, r.right + 25);
            state.ty = Math.max(88, r.top + 20);
            helperText.textContent = 'Exploring insights? I can guide you.';
            return;
        }

        if (contact) {
            const cr = contact.getBoundingClientRect();
            if (cr.top < window.innerHeight * 0.65 && cr.bottom > 120) {
                const wa = q('.whatsapp-float, .btn-whatsapp');
                if (wa) {
                    const wr = wa.getBoundingClientRect();
                    state.tx = Math.max(24, wr.left - 140);
                    state.ty = Math.max(90, wr.top - 40);
                    helperText.textContent = 'Ready to connect with our engineers?';
                    return;
                }
            }
        }

        if (services) {
            const sr = services.getBoundingClientRect();
            if (sr.top < window.innerHeight * 0.75 && sr.bottom > 140) {
                const card = q('.service-card, .service-item');
                if (card) {
                    const r = card.getBoundingClientRect();
                    state.tx = Math.max(24, r.left - 120);
                    state.ty = Math.max(88, r.top + 12);
                    helperText.textContent = 'These are our core engineering services.';
                    return;
                }
            }
        }

        helperText.textContent = '';
    }

    function onScroll() {
        const current = sections.findIndex((s) => {
            const r = s.getBoundingClientRect();
            return r.top <= window.innerHeight * 0.35 && r.bottom >= window.innerHeight * 0.35;
        });

        if (current >= 0 && current !== state.lastSectionIndex) {
            state.lastSectionIndex = current;
            const diagonalX = current % 2 ? (window.innerWidth - 180) : 28;
            state.tx = diagonalX + Math.random() * 100;
            state.ty = 42 + Math.random() * Math.max(220, window.innerHeight - 150);
            clampTarget();
        }

        if (Math.random() < 0.22) smartContextTarget();
    }

    function inactivityLoopBehavior(now) {
        const idleMs = now - state.lastPointerMove;
        if (idleMs > 12000 && idleMs < 14500) {
            state.mode = 'loop';
        } else if (idleMs <= 12000 && state.mode === 'loop') {
            state.mode = 'patrol';
        }
    }

    function exitIntentBehavior(e) {
        if (e.clientY <= 6) {
            state.tx = window.innerWidth - 220;
            state.ty = 82;
            helperText.textContent = 'Before you go, need help?';
            helperText.classList.add('show');
            setTimeout(() => helperText.classList.remove('show'), 3200);
        }
    }

    function animate(now) {
        state.t += 0.016;
        inactivityLoopBehavior(now);

        const cursorIdle = now - state.lastPointerMove > 700;
        if (!cursorIdle && state.cursorSpeed < 0.26) {
            state.mode = 'follow';
            state.tx += ((state.cursorX + 100) - state.tx) * 0.01;
            state.ty += ((state.cursorY - 68) - state.ty) * 0.01;
        } else if (state.mode === 'follow') {
            state.mode = 'patrol';
            nextPatrolTarget();
        }

        if (state.mode === 'loop') {
            const radius = 66;
            state.tx = state.cursorX + Math.cos(state.t * 1.8) * radius;
            state.ty = state.cursorY + Math.sin(state.t * 1.8) * radius * 0.75;
        } else if (Math.abs(state.tx - state.x) < 24 && Math.abs(state.ty - state.y) < 24 && Math.random() < 0.03) {
            nextPatrolTarget();
        }

        const driftX = Math.sin(state.t * 0.85) * 5;
        const driftY = Math.cos(state.t * 1.2) * 4;

        state.vx += ((state.tx + driftX) - state.x) * 0.0042;
        state.vy += ((state.ty + driftY) - state.y) * 0.0042;

        state.vx *= 0.9;
        state.vy *= 0.9;

        state.x += state.vx;
        state.y += state.vy;
        const roll = Math.sin(state.t * 0.9) * 1.8;
        state.angle += (((state.vx * 1.05) + roll) - state.angle) * 0.1;

        clampTarget();
        avoidBlockingInteractions();

        if (Math.random() < 0.022) emitSparkle(state.x + 34, state.y + 46);

        if (Math.random() < 0.0019) {
            bee.classList.add('cleaning');
            setTimeout(() => bee.classList.remove('cleaning'), 900);
        }

        if (Math.random() < 0.0009) {
            bee.classList.add('spin');
            setTimeout(() => bee.classList.remove('spin'), 620);
        }

        positionUI();
        updateAudio();
        requestAnimationFrame(animate);
    }

    function init() {
        if (q('.honeybee-assistant')) return;

        sparkleLayer = document.createElement('div');
        sparkleLayer.className = 'honeybee-sparkle-layer';
        bee = createBeeMarkup();
        tooltip = createTooltip();
        helperText = createHelperText();
        controls = createControls();

        document.body.appendChild(sparkleLayer);
        document.body.appendChild(bee);
        document.body.appendChild(tooltip);
        document.body.appendChild(helperText);
        document.body.appendChild(controls);

        const logo = q('.nav-logo');
        const lr = logo ? logo.getBoundingClientRect() : { right: 120, top: 20 };
        state.x = Math.max(12, lr.right - 24);
        state.y = Math.max(82, lr.top + 8);
        state.tx = window.innerWidth - 210;
        state.ty = Math.min(window.innerHeight - 220, 180);

        positionUI();
        trackSections();

        bee.addEventListener('mouseenter', () => {
            tooltip.classList.add('show');
            emitSparkle(state.x + 44, state.y + 52);
            state.lastInteractionAt = performance.now();
        });

        bee.addEventListener('mouseleave', () => tooltip.classList.remove('show'));

        bee.addEventListener('click', () => {
            window.open(WA_LINK, '_blank', 'noopener,noreferrer');
            emitSparkle(state.x + 30, state.y + 44);
            emitSparkle(state.x + 50, state.y + 44);
            state.lastInteractionAt = performance.now();
        });

        controls.addEventListener('click', (e) => {
            const btn = e.target.closest('.honeybee-control-btn');
            if (!btn) return;
            const role = btn.getAttribute('data-role');

            if (role === 'mute') {
                state.muted = !state.muted;
                if (!state.muted) setupAudio();
                btn.textContent = state.muted ? '🔇' : '🔊';
            }

            if (role === 'hide') {
                state.hidden = !state.hidden;
                bee.classList.toggle('is-hidden', state.hidden);
                tooltip.classList.toggle('is-hidden', state.hidden);
                helperText.classList.toggle('is-hidden', state.hidden);
                btn.textContent = state.hidden ? '🐝' : '🙈';
            }
        });

        window.addEventListener('mousemove', (e) => {
            const now = performance.now();
            const dt = Math.max(16, now - state.lastPointerMove);
            const dx = e.clientX - state.lastCursorX;
            const dy = e.clientY - state.lastCursorY;

            state.cursorSpeed = Math.hypot(dx, dy) / dt;
            state.cursorX = e.clientX;
            state.cursorY = e.clientY;
            state.lastCursorX = e.clientX;
            state.lastCursorY = e.clientY;
            state.lastPointerMove = now;
        }, { passive: true });

        window.addEventListener('scroll', onScroll, { passive: true });
        setInterval(nextPatrolTarget, 6500);
        window.addEventListener('resize', () => {
            clampTarget();
            nextPatrolTarget();
        });
        document.addEventListener('mouseleave', exitIntentBehavior);

        requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
