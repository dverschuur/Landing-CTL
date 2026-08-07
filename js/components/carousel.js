/**
 * Componente: carrusel horizontal con scroll-snap.
 * Reutilizable por cualquier vista que contenga la estructura
 * .compliance-track + botones prev/next.
 */

export function mountCarousel(root, {
    track: trackSel = '#complianceTrack',
    prev: prevSel = '#compliancePrev',
    next: nextSel = '#complianceNext',
} = {}) {
    const track = root.querySelector(trackSel);
    const prev = root.querySelector(prevSel);
    const next = root.querySelector(nextSel);
    if (!track || !prev || !next) return () => {};

    const step = () => {
        const card = track.querySelector('.compliance-card');
        if (!card) return track.clientWidth;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card.offsetWidth + gap;
    };

    const syncButtons = () => {
        const max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
    };

    const onPrev = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
    const onNext = () => track.scrollBy({ left: step(), behavior: 'smooth' });

    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);
    track.addEventListener('scroll', syncButtons, { passive: true });
    window.addEventListener('resize', syncButtons);
    syncButtons();

    // Solo el listener sobre `window` sobrevive al desmontaje del DOM.
    return () => window.removeEventListener('resize', syncButtons);
}
