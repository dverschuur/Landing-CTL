/**
 * Vista: Services (slider de servicios + accordion expandible)
 *  - Carrusel horizontal reutilizando mountCarousel.
 *  - Accordion con comportamiento exclusivo (solo uno abierto).
 */
import { mountCarousel } from '../components/carousel.js';

let unmountCarousel = null;

// -----------------------------------------------------------------------
// Accordion
// -----------------------------------------------------------------------
function collapsePanel(btn) {
    btn.setAttribute('aria-expanded', 'false');
    const panel = btn.parentElement.querySelector('.svc-accordion-panel');
    if (panel) {
        panel.style.maxHeight = '0px';
        panel.style.opacity = '0';
    }
}

function expandPanel(btn) {
    btn.setAttribute('aria-expanded', 'true');
    const panel = btn.parentElement.querySelector('.svc-accordion-panel');
    if (panel) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.opacity = '1';
    }
}

function handleAccordionClick(e) {
    const btn = e.currentTarget;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Cierra todos
    const allToggles = btn.closest('#services-accordion')
        .querySelectorAll('.svc-accordion-toggle');
    allToggles.forEach(collapsePanel);

    // Si estaba cerrado, ábrelo
    if (!isOpen) {
        expandPanel(btn);
    }
}

// -----------------------------------------------------------------------
// "View Details" links → scroll suave al accordion item
// -----------------------------------------------------------------------
function handleDetailLink(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#svc-accordion-')) return;

    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    // Expand the target accordion item
    const btn = target.querySelector('.svc-accordion-toggle');
    if (btn) {
        const allToggles = document.querySelectorAll('#services-accordion .svc-accordion-toggle');
        allToggles.forEach(collapsePanel);
        expandPanel(btn);
    }

    // Scroll suave con offset para el nav sticky
    const navHeight = 72;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
}

// -----------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------
export function init(root) {
    // Monte el carrusel reutilizando el componente existente
    unmountCarousel = mountCarousel(root, {
        track: '#servicesTrack',
        prev: '#servicesPrev',
        next: '#servicesNext',
    });

    // Accordion toggles
    root.querySelectorAll('.svc-accordion-toggle').forEach((btn) => {
        btn.addEventListener('click', handleAccordionClick);
    });

    // "View Details" links
    root.querySelectorAll('a[href^="#svc-accordion-"]').forEach((link) => {
        link.addEventListener('click', handleDetailLink);
    });
}

export function destroy() {
    if (unmountCarousel) unmountCarousel();
    unmountCarousel = null;
}
