/**
 * Componente: acordeón (Our Values).
 * Cada .value-item tiene un .value-trigger (botón) y un .value-panel
 * (contenido colapsable). Un solo item abierto a la vez.
 */

export function mountAccordion(root, { container: containerSel = '#valuesAccordion' } = {}) {
    const container = root.querySelector(containerSel);
    if (!container) return () => {};

    const items = Array.from(container.querySelectorAll('.value-item'));
    if (!items.length) return () => {};

    const close = (item) => {
        const trigger = item.querySelector('.value-trigger');
        const panel = item.querySelector('.value-panel');
        const icon = item.querySelector('.value-icon');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    };

    const open = (item) => {
        const trigger = item.querySelector('.value-trigger');
        const panel = item.querySelector('.value-panel');
        const icon = item.querySelector('.value-icon');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        icon.style.transform = 'rotate(45deg)';
    };

    const onClick = (item) => {
        const isOpen = item.querySelector('.value-trigger').getAttribute('aria-expanded') === 'true';
        items.forEach(close);
        if (!isOpen) open(item);
    };

    const handlers = items.map((item) => {
        const trigger = item.querySelector('.value-trigger');
        const handler = () => onClick(item);
        trigger.addEventListener('click', handler);
        return { trigger, handler };
    });

    items.forEach(close);

    return () => {
        handlers.forEach(({ trigger, handler }) => trigger.removeEventListener('click', handler));
    };
}
