/**
 * contact.js — Lógica de la vista de Contacto.
 *
 * Responsabilidades:
 *  1. Capturar el submit del formulario #contact-form.
 *  2. Enviar los datos a Web3Forms vía fetch (sin redirección).
 *  3. Mostrar feedback visual: loading → éxito / error.
 *  4. Resetear el formulario tras un envío exitoso.
 */

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const ACCESS_KEY    = '09cf670c-494a-4702-a42b-eadb06cdd7d6';

let formEl    = null;
let submitBtn = null;
let toastEl   = null;

// ---------------------------------------------------------------------------
// Toast de feedback (se inyecta dinámicamente al montar la vista)
// ---------------------------------------------------------------------------
function createToast() {
    const toast = document.createElement('div');
    toast.id = 'contact-toast';
    toast.className = [
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]',
        'px-xl py-md rounded-xl shadow-2xl',
        'font-label-md text-[13px] tracking-wide',
        'flex items-center gap-sm',
        'opacity-0 translate-y-4 pointer-events-none',
        'transition-all duration-500 ease-out',
    ].join(' ');
    document.body.appendChild(toast);
    return toast;
}

function showToast(message, isError = false) {
    if (!toastEl) return;

    // Reset classes
    toastEl.classList.remove(
        'bg-green-600', 'bg-red-600',
        'opacity-100', 'translate-y-0',
        'opacity-0', 'translate-y-4',
    );

    const icon = isError ? 'error' : 'check_circle';
    toastEl.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">${icon}</span>
        <span>${message}</span>
    `;
    toastEl.classList.add(
        isError ? 'bg-red-600' : 'bg-green-600',
        'text-white',
        'opacity-100', 'translate-y-0',
    );

    // Auto-hide after 5 s
    setTimeout(() => {
        toastEl.classList.remove('opacity-100', 'translate-y-0');
        toastEl.classList.add('opacity-0', 'translate-y-4');
    }, 5000);
}

// ---------------------------------------------------------------------------
// Submit handler
// ---------------------------------------------------------------------------
async function handleSubmit(e) {
    e.preventDefault();
    if (!formEl || !submitBtn) return;

    // ── Validación nativa del navegador ──
    if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
    }

    // ── Estado "enviando" ──
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span>Sending…</span>
    `;

    // ── Construir datos (access_key ya viene del hidden input del form) ──
    const formData = new FormData(formEl);

    try {
        const res  = await fetch(WEB3FORMS_URL, { method: 'POST', body: formData });
        const json = await res.json();

        if (json.success) {
            showToast('Message sent successfully!');
            formEl.reset();
        } else {
            console.warn('[contact] Web3Forms rejected:', json);
            throw new Error(json.message || 'Submission failed');
        }
    } catch (err) {
        console.error('[contact] Web3Forms error:', err);
        showToast(err.message || 'Failed to send. Please try again.', true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

// ---------------------------------------------------------------------------
// Ciclo de vida (llamado por el router)
// ---------------------------------------------------------------------------
export function init(outlet) {
    formEl    = outlet.querySelector('#contact-form');
    submitBtn = outlet.querySelector('#contact-submit');
    toastEl   = createToast();

    if (formEl) {
        formEl.addEventListener('submit', handleSubmit);
    }
}

export function destroy() {
    if (formEl) {
        formEl.removeEventListener('submit', handleSubmit);
    }
    formEl    = null;
    submitBtn = null;

    // Limpiar toast del DOM
    if (toastEl && toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
    }
    toastEl = null;
}
