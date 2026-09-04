/**
 * Componente: story scroll (contenedor fijo con crossfade "fade-up").
 * #story-section actúa como riel de scroll (altura = N * 100vh); su
 * interior queda anclado en pantalla (sticky) mientras cada .story-slide
 * se apila en el mismo lugar y hace fade-in/up al entrar en su tramo de
 * scroll y fade-out/up al salir.
 */

const DEFAULT_FADE = 0.25; // fracción del tramo de cada slide dedicada a entrar/salir
const OFFSET_PX = 32; // desplazamiento vertical del fade-up

export function mountStoryScroll(root, { section: sectionSel = '#story-section', fade: FADE = DEFAULT_FADE } = {}) {
    const section = root.querySelector(sectionSel);
    if (!section) return () => {};

    const slides = Array.from(section.querySelectorAll('.story-slide'));
    const count = slides.length;
    if (!count) return () => {};

    const update = () => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        if (total <= 0) return;

        const progress = Math.min(1, Math.max(0, -rect.top / total));

        slides.forEach((slide, i) => {
            const segStart = i / count;
            const segEnd = (i + 1) / count;
            const isLast = i === count - 1;
            const local = (progress - segStart) / (segEnd - segStart);

            let opacity;
            let translateY;

            if (local <= 0) {
                opacity = 0;
                translateY = OFFSET_PX;
            } else if (local < FADE) {
                opacity = local / FADE;
                translateY = OFFSET_PX * (1 - opacity);
            } else if (!isLast && local > 1 - FADE) {
                const t = Math.min(1, local);
                opacity = (1 - t) / FADE;
                translateY = -OFFSET_PX * (1 - opacity);
            } else if (!isLast && local >= 1) {
                opacity = 0;
                translateY = -OFFSET_PX;
            } else {
                opacity = 1;
                translateY = 0;
            }

            slide.style.opacity = String(opacity);
            slide.style.transform = `translateY(${translateY}px)`;
            slide.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
    };
}
