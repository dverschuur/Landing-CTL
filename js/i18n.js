/**
 * i18n mínimo: traduce la capa persistente (nav + footer) vía [data-i18n].
 * El contenido de cada vista se mantiene en español (fuera de alcance aquí).
 */

const dict = {
    ES: {
        'nav.home': 'Inicio',
        'nav.about': 'Quiénes somos',
        'nav.services': 'Servicios',
        'nav.projects': 'Proyectos',
        'nav.proyectos': 'Proyectos',
        'nav.compliance': 'Certificados',
        'nav.contact': 'Contacto',
        'hero.scroll': 'Desliza',
        'footer.tagline': 'Soluciones de Grado Industrial.',
        'footer.directives': 'Directrices',
        'footer.privacy': 'Política de Privacidad',
        'footer.terms': 'Términos de Servicio',
        'footer.framework': 'Marco Normativo',
        'footer.compliance': 'Normas de Cumplimiento',
        'footer.cookies': 'Política de Cookies',
        'footer.copyright': '© 2024 Corporación Trading Latinoamérica (CTL). RIF: J-12345678-9. Todos los derechos reservados.',
    },
    EN: {
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'nav.services': 'Services',
        'nav.projects': 'Projects',
        'nav.proyectos': 'Projects',
        'nav.compliance': 'Compliance',
        'nav.contact': 'Contact',
        'hero.scroll': 'Scroll',
        'footer.tagline': 'Industrial Grade Solutions.',
        'footer.directives': 'Directives',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.framework': 'Framework',
        'footer.compliance': 'Compliance Norms',
        'footer.cookies': 'Cookie Policy',
        'footer.copyright': '© 2024 Corporación Trading Latinoamérica (CTL). RIF: J-12345678-9. All rights reserved.',
    },
};

export function applyLang(lang) {
    const table = dict[lang] || dict.ES;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (table[key]) el.textContent = table[key];
    });
    document.documentElement.lang = lang === 'EN' ? 'en' : 'es';

    const label = document.getElementById('langToggleLabel');
    if (label) label.textContent = lang === 'EN' ? 'EN' : 'ES';
}
