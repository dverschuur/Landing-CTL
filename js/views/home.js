/**
 * Vista: Home (landing completa: hero + servicios + proyectos)
 *  - Fondo animado de velas japonesas.
 *  - Carrusel de casos de éxito.
 */
import { mountCarousel } from '../components/carousel.js';
import { mountStoryScroll } from '../components/storyScroll.js';

const NUM_CANDLES = 30;

let unmountCarousel = null;
let unmountStoryScroll = null;

function renderCandles(root) {
    const container = root.querySelector('#candlestick-container');
    if (!container) return;

    const frag = document.createDocumentFragment();

    for (let i = 0; i < NUM_CANDLES; i++) {
        const candle = document.createElement('div');
        const isGreen = Math.random() > 0.5;
        candle.classList.add('candlestick', isGreen ? 'candle-green' : 'candle-red');

        // Randomize position, height, and animation duration
        const left = Math.random() * 100;
        const height = Math.random() * 100 + 40;   // 40px a 140px
        const duration = Math.random() * 15 + 10;  // 10s a 25s
        const delay = Math.random() * -20;         // delay negativo: arrancan ya en pantalla

        candle.style.left = `${left}%`;
        candle.style.height = `${height}px`;
        candle.style.animationDuration = `${duration}s`;
        candle.style.animationDelay = `${delay}s`;

        frag.appendChild(candle);
    }

    container.appendChild(frag);
}

export function init(root) {
    renderCandles(root);
    unmountCarousel = mountCarousel(root);
    unmountStoryScroll = mountStoryScroll(root);
}

export function destroy() {
    if (unmountCarousel) unmountCarousel();
    unmountCarousel = null;
    if (unmountStoryScroll) unmountStoryScroll();
    unmountStoryScroll = null;
}
