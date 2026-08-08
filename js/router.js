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

// ---------------------------------------------------------------------------
// Tabla de rutas
// ---------------------------------------------------------------------------
const routes = {
    '/home':     { view: 'views/home.html',      module: './views/home.js',     title: 'CTL - Inicio' },
    '/about':    { view: 'views/about.html',     module: null,                  title: 'CTL - Quiénes somos' },
    '/services': { view: 'views/services.html',  module: './views/services.js', title: 'CTL - Servicios' },
    '/projects': { view: 'views/projects.html',  module: null,                  title: 'CTL - Proyectos' },
    '/contact':  { view: 'views/contact.html',   module: null,                  title: 'CTL - Contacto' },
};

const NOT_FOUND = { view: 'views/not-found.html', module: null, title: 'CTL - 404' };
const DEFAULT_ROUTE = '/home';

// ---------------------------------------------------------------------------
// Estado global de la aplicación
// ---------------------------------------------------------------------------
export const appState = {
    currentPath: null,
    lang: localStorage.getItem('ctl-lang') || 'ESP',
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
    document.querySelectorAll('#mainNav .nav-item').forEach((link) => {
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
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
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

    // Toggle de idioma (estado global persistente).
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const paint = () => { langToggle.textContent = appState.lang === 'ESP' ? 'ENG-ESP' : 'ESP-ENG'; };
        langToggle.addEventListener('click', () => {
            appState.lang = appState.lang === 'ESP' ? 'ENG' : 'ESP';
            localStorage.setItem('ctl-lang', appState.lang);
            document.documentElement.lang = appState.lang === 'ESP' ? 'es' : 'en';
            paint();
        });
        paint();
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
