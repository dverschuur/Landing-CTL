/**
 * Vista: Home (contenido debajo del hero global: servicios + estándares)
 *  - El hero (fondo 3D "globo/mapa" giratorio) ahora vive en el App Shell (heroSlider.js),
 *    persistente entre rutas, así que esta vista solo monta lo que le queda.
 */
import { mountCarousel } from '../components/carousel.js';
import { mountStoryScroll } from '../components/storyScroll.js';

let unmountCarousel = null;
let unmountStoryScroll = null;

export function init(root) {
    unmountCarousel = mountCarousel(root);
    unmountStoryScroll = mountStoryScroll(root);
}

export function destroy() {
    if (unmountCarousel) unmountCarousel();
    unmountCarousel = null;
    if (unmountStoryScroll) unmountStoryScroll();
    unmountStoryScroll = null;
}
