/**
 * Vista: Compliance
 *  - Fade-up al hacer scroll sobre títulos y tarjetas de normativas.
 */
import { mountScrollReveal } from '../components/scrollReveal.js';

let unmountReveal = null;

export function init(root) {
    unmountReveal = mountScrollReveal(root);
}

export function destroy() {
    if (unmountReveal) unmountReveal();
    unmountReveal = null;
}
