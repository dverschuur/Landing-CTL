/**
 * Vista: About (Quiénes somos)
 *  - Fade-up al hacer scroll sobre los títulos de sección.
 *  - Acordeón de "Our Values".
 */
import { mountScrollReveal } from '../components/scrollReveal.js';
import { mountAccordion } from '../components/accordion.js';

let unmountReveal = null;
let unmountAccordion = null;

export function init(root) {
    unmountReveal = mountScrollReveal(root);
    unmountAccordion = mountAccordion(root);
}

export function destroy() {
    if (unmountReveal) unmountReveal();
    unmountReveal = null;
    if (unmountAccordion) unmountAccordion();
    unmountAccordion = null;
}
