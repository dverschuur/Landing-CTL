/**
 * Componente: scroll reveal (fade-up), a prueba de fallos.
 * El texto es visible por defecto (CSS no lo oculta). Solo al montar este
 * módulo se marca "reveal-pending" (oculto) y luego "is-visible" cuando
 * entra en pantalla; si el script no llega a ejecutarse, el contenido
 * nunca desaparece.
 */

export function mountScrollReveal(root, { selector = '.reveal-up', threshold = 0.2 } = {}) {
    const targets = Array.from(root.querySelectorAll(selector));
    if (!targets.length) return () => {};

    targets.forEach((el) => el.classList.add('reveal-pending'));

    const check = () => {
        const vh = window.innerHeight;
        targets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
            const isVisible = visible > rect.height * threshold;
            el.classList.toggle('is-visible', isVisible);
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            check();
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();

    return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
    };
}
