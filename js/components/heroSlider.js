/**
 * Componente: Hero Slider global y persistente (App Shell).
 * Un slide por ruta principal (Home, About, Services, Proyectos, Compliance).
 * Deslizar (drag/swipe), las flechas o los puntos navegan la SPA real
 * (llaman a router.navigate). También se sincroniza en sentido inverso:
 * si la ruta cambia por otro medio (nav, atrás/adelante del navegador),
 * el slider se re-posiciona sin volver a disparar una navegación (evita loops).
 */
const ROUTES = ['/home', '/about', '/services', '/proyectos', '/compliance'];
const DRAG_THRESHOLD_RATIO = 0.15;

let section = null;
let track = null;
let slides = [];
let dots = [];
let prevBtn = null;
let nextBtn = null;
let scrollHintBtn = null;
let navigateFn = () => {};
let currentIndex = 0;
let sectionWidth = 0;

let dragging = false;
let startX = 0;
let dragDelta = 0;

function applyTransform(animate) {
    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(${-currentIndex * sectionWidth}px)`;
}

function updateUI() {
    dots.forEach((dot, i) => {
        const active = i === currentIndex;
        dot.classList.toggle('bg-primary', active);
        dot.classList.toggle('w-8', active);
        dot.classList.toggle('bg-on-surface/30', !active);
        dot.classList.toggle('w-[10px]', !active);
    });
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
}

function goTo(index, { silent = false, animate = true } = {}) {
    currentIndex = Math.max(0, Math.min(slides.length - 1, index));
    applyTransform(animate);
    updateUI();
    if (!silent) navigateFn(ROUTES[currentIndex]);
}

function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    dragDelta = 0;
    sectionWidth = section.clientWidth;
    track.style.transition = 'none';
    track.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e) {
    if (!dragging) return;
    dragDelta = e.clientX - startX;
    track.style.transform = `translateX(${-currentIndex * sectionWidth + dragDelta}px)`;
}

function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    const threshold = sectionWidth * DRAG_THRESHOLD_RATIO;
    if (dragDelta < -threshold && currentIndex < slides.length - 1) {
        goTo(currentIndex + 1);
    } else if (dragDelta > threshold && currentIndex > 0) {
        goTo(currentIndex - 1);
    } else {
        applyTransform(true);
    }
    dragDelta = 0;
}

function onResize() {
    if (!section) return;
    sectionWidth = section.clientWidth;
    applyTransform(false);
}

export function mountHeroSlider({ navigate } = {}) {
    section = document.getElementById('heroSlider');
    track = document.getElementById('heroSliderTrack');
    if (!section || !track) return;

    slides = Array.from(track.querySelectorAll('.hero-slide'));
    dots = Array.from(document.querySelectorAll('#heroDots .hero-dot'));
    prevBtn = document.getElementById('heroPrev');
    nextBtn = document.getElementById('heroNext');
    scrollHintBtn = document.getElementById('heroScrollHint');
    navigateFn = typeof navigate === 'function' ? navigate : () => {};

    sectionWidth = section.clientWidth;
    applyTransform(false);
    updateUI();

    prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Señalización de scroll: baja hasta el contenido de la vista actual.
    scrollHintBtn?.addEventListener('click', () => {
        document.getElementById('app-content')?.scrollIntoView({ behavior: 'smooth' });
    });

    track.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', onResize);

}

/** Llamado por el router tras cada render(): re-posiciona el slider sin navegar. */
export function syncHeroSlider(path) {
    if (!section) return;
    const index = ROUTES.indexOf(path);
    section.classList.toggle('hidden', index === -1);
    if (index === -1) return;
    if (index !== currentIndex) goTo(index, { silent: true });
}
