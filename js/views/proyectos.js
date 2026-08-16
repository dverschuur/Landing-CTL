/**
 * Vista: Proyectos
 *  - Fade-up al hacer scroll sobre los títulos de sección.
 *  - Selector de años (línea de tiempo) que filtra las tarjetas del historial.
 *  - Cifras clave: scroll fijo con crossfade (mismo componente que el CTA de Inicio).
 */
import { mountScrollReveal } from '../components/scrollReveal.js';
import { mountStoryScroll } from '../components/storyScroll.js';

let unmountReveal = null;
let unmountStoryScroll = null;
let yearButtons = [];
let cards = [];

function setActiveYear(year) {
    yearButtons.forEach((btn) => {
        const active = btn.dataset.year === year;
        const icon = btn.querySelector('.year-icon');
        const label = btn.querySelector('.year-label');

        icon.classList.toggle('bg-primary', active);
        icon.classList.toggle('text-white', active);
        icon.classList.toggle('shadow-lg', active);
        icon.classList.toggle('bg-primary/10', !active);
        icon.classList.toggle('text-primary/50', !active);
        label.classList.toggle('text-primary', active);
        label.classList.toggle('font-semibold', active);
        label.classList.toggle('text-on-surface/60', !active);
    });

    cards.forEach((card) => {
        card.hidden = card.dataset.year !== year;
    });
}

function onYearClick(e) {
    setActiveYear(e.currentTarget.dataset.year);
}

export function init(root) {
    unmountReveal = mountScrollReveal(root);
    unmountStoryScroll = mountStoryScroll(root, { section: '#proyectos-stats-section', fade: 0.08 });

    yearButtons = Array.from(root.querySelectorAll('.proyecto-year-btn'));
    cards = Array.from(root.querySelectorAll('.proyecto-year-card'));

    yearButtons.forEach((btn) => {
        btn.style.marginTop = btn.dataset.offset === 'down' ? '76px' : '0px';
        btn.addEventListener('click', onYearClick);
    });

    const defaultYear = (root.querySelector('.proyecto-year-btn[data-year="2024"]') || yearButtons[0])?.dataset.year;
    if (defaultYear) setActiveYear(defaultYear);
}

export function destroy() {
    if (unmountReveal) unmountReveal();
    unmountReveal = null;
    if (unmountStoryScroll) unmountStoryScroll();
    unmountStoryScroll = null;
    yearButtons.forEach((btn) => btn.removeEventListener('click', onYearClick));
    yearButtons = [];
    cards = [];
}
