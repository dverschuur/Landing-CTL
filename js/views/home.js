/**
 * Vista: Home (landing completa: hero + servicios + proyectos)
 *  - Fondo animado 3D "blueprint industrial" (Three.js) en el hero.
 *  - Carrusel de casos de éxito.
 */
import { mountCarousel } from '../components/carousel.js';
import { mountStoryScroll } from '../components/storyScroll.js';
import { mountBlueprintScene } from '../components/blueprintScene.js';

let unmountCarousel = null;
let unmountStoryScroll = null;
let unmountBlueprint = null;
let destroyed = false;

export function init(root) {
    destroyed = false;
    unmountCarousel = mountCarousel(root);
    unmountStoryScroll = mountStoryScroll(root);

    const blueprintContainer = root.querySelector('#blueprint-container');
    if (blueprintContainer) {
        mountBlueprintScene(blueprintContainer).then((unmount) => {
            // La vista pudo desmontarse mientras three.js cargaba de forma asíncrona.
            if (destroyed) { unmount(); return; }
            unmountBlueprint = unmount;
        });
    }
}

export function destroy() {
    destroyed = true;
    if (unmountCarousel) unmountCarousel();
    unmountCarousel = null;
    if (unmountStoryScroll) unmountStoryScroll();
    unmountStoryScroll = null;
    if (unmountBlueprint) unmountBlueprint();
    unmountBlueprint = null;
}
