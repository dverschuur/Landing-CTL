/**
 * router.js — Motor de enrutamiento del App Shell (hash routing).
 *
 * Responsabilidades:
 *  1. Interceptar la navegación (hashchange + carga inicial).
 *  2. Hacer fetch del fragmento HTML de la vista.
 *  3. Inyectarlo en #app-content.
 *  4. Ejecutar la lógica de la vista vía import() dinámico (ES6),
 *     ya que innerHTML no ejecuta <script>.
 *  5. Sincronizar el estado "activo" de la barra de navegación global.
 */
import { applyLang } from './i18n.js';
import { mountHeroSlider, syncHeroSlider } from './components/heroSlider.js';

// ---------------------------------------------------------------------------
// Tabla de rutas
// ---------------------------------------------------------------------------
const routes = {
    '/home':     { view: 'views/home.html',      module: './views/home.js',     title: 'CTL - Inicio' },
    '/about':    { view: 'views/about.html',     module: './views/about.js',    title: 'CTL - Quiénes somos' },
    '/services': { view: 'views/services.html',  module: './views/services.js', title: 'CTL - Servicios' },
    '/projects': { view: 'views/projects.html',  module: null,                  title: 'CTL - Proyectos' },
    '/proyectos': { view: 'views/proyectos.html', module: './views/proyectos.js', title: 'CTL - Proyectos Emblemáticos' },
    '/compliance': { view: 'views/compliance.html', module: './views/compliance.js', title: 'CTL - Compliance' },
    '/contact':  { view: 'views/contact.html',   module: './views/contact.js',  title: 'CTL - Contacto' },
};

const NOT_FOUND = { view: 'views/not-found.html', module: null, title: 'CTL - 404' };
const DEFAULT_ROUTE = '/home';

// ---------------------------------------------------------------------------
// Estado global de la aplicación
// ---------------------------------------------------------------------------
export const appState = {
    currentPath: null,
    lang: localStorage.getItem('ctl-lang') || 'ES',
    isLoading: false,
};

let activeModule = null;   // módulo de la vista montada (para destroy())
let navToken = 0;          // invalida respuestas fetch obsoletas (race conditions)

const cache = new Map();   // path -> markup (los fragmentos son estáticos)

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function normalizePath() {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw || raw === '/') return DEFAULT_ROUTE;
    return raw.split('?')[0].replace(/\/$/, '') || DEFAULT_ROUTE;
}

async function fetchView(url) {
    if (cache.has(url)) return cache.get(url);

    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`No se pudo cargar ${url} (HTTP ${res.status})`);

    const markup = await res.text();
    cache.set(url, markup);
    return markup;
}

function setActiveNav(path) {
    // Selector global (no solo #mainNav): también cubre los links del menú móvil.
    document.querySelectorAll('.nav-item').forEach((link) => {
        const target = (link.getAttribute('href') || '').replace(/^#/, '');
        const isActive = target === path;

        link.classList.toggle('nav-active', isActive);
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('font-semibold', isActive);
        link.classList.toggle('border-b-2', isActive);
        link.classList.toggle('border-primary', isActive);
        link.classList.toggle('text-on-surface/70', !isActive);

        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function setLoading(on) {
    appState.isLoading = on;
    document.getElementById('app-content')?.classList.toggle('opacity-0', on);
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
async function render(path) {
    const outlet = document.getElementById('app-content');
    if (!outlet) return;

    const route = routes[path] || NOT_FOUND;
    const token = ++navToken;

    setLoading(true);

    // Desmontaje de la vista anterior
    if (activeModule && typeof activeModule.destroy === 'function') {
        try { activeModule.destroy(); } catch (err) { console.error('[router] destroy:', err); }
    }
    activeModule = null;

    try {
        const markup = await fetchView(route.view);
        if (token !== navToken) return; // otra navegación ganó la carrera

        outlet.innerHTML = markup;

        // El markup de las vistas está en español (fuente de verdad): se
        // re-traduce en cada render. Va antes de mod.init() para que los
        // listeners de la vista se enganchen al DOM ya definitivo.
        applyLang(appState.lang);

        // innerHTML no ejecuta <script>: la lógica llega como módulo ES6.
        if (route.module) {
            const mod = await import(route.module);
            if (token !== navToken) return;
            activeModule = mod;
            if (typeof mod.init === 'function') mod.init(outlet);
        }

        document.title = route.title;
        appState.currentPath = path;
        setActiveNav(path);
        syncHeroSlider(path);

        // El salto de ruta debe ser instantáneo: se desactiva momentáneamente el
        // "scroll-behavior: smooth" global (CSS) para que no lo anime. La
        // restauración se difiere (setTimeout) para no pisar el salto antes de
        // que el navegador lo aplique.
        const scrollTarget = route.scrollTo && document.getElementById(route.scrollTo);
        const prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        if (scrollTarget) scrollTarget.scrollIntoView({ block: 'start' });
        else window.scrollTo(0, 0);
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = prevScrollBehavior;
        }, 0);
    } catch (err) {
        if (token !== navToken) return;
        console.error('[router]', err);
        outlet.innerHTML = `
            <section class="min-h-screen flex items-center justify-center bg-white px-lg">
              <div class="text-center">
                <h1 class="font-headline-lg text-[32px] text-primary mb-md">Error de carga</h1>
                <p class="font-body-lg text-[15px] text-on-surface/70">${err.message}</p>
              </div>
            </section>`;
    } finally {
        if (token === navToken) setLoading(false);
    }
}

// ---------------------------------------------------------------------------
// Chrome global (header, idioma) — vive fuera del ciclo de vida de las vistas
// ---------------------------------------------------------------------------
function initShell() {
    // Hero Slider global: navega la SPA real al deslizar/usar flechas o puntos.
    mountHeroSlider({ navigate });

    // Smart header: se oculta al bajar, reaparece al subir.
    const nav = document.getElementById('mainNav');
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            // El header permanece transparente en toda la página (sin estado sólido).
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Toggle de idioma (estado global persistente): traduce toda la página.
    const langToggle = document.getElementById('langToggle');
    applyLang(appState.lang);
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            appState.lang = appState.lang === 'ES' ? 'EN' : 'ES';
            localStorage.setItem('ctl-lang', appState.lang);
            applyLang(appState.lang);
        });
    }

    // Menú móvil (hamburguesa): solo visible por debajo del breakpoint md.
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileIcon = document.getElementById('mobileMenuIcon');
    if (mobileToggle && mobileMenu) {
        const closeMobileMenu = () => {
            mobileMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            mobileToggle.setAttribute('aria-expanded', 'false');
            if (mobileIcon) mobileIcon.textContent = 'menu';
            document.body.classList.remove('overflow-hidden');
        };
        const openMobileMenu = () => {
            mobileMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
            mobileToggle.setAttribute('aria-expanded', 'true');
            if (mobileIcon) mobileIcon.textContent = 'close';
            document.body.classList.add('overflow-hidden');
        };
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) closeMobileMenu(); else openMobileMenu();
        });
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
        window.addEventListener('hashchange', closeMobileMenu);
    }
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
export function navigate(path) {
    if (window.location.hash === `#${path}`) render(path);
    else window.location.hash = path;
}

function onHashChange() {
    render(normalizePath());
}

document.addEventListener('DOMContentLoaded', () => {
    initShell();
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) window.location.replace(`#${DEFAULT_ROUTE}`);
    render(normalizePath());
});
