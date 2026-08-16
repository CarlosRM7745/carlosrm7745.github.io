// ============================================================
//  CONFIGURACIÓN (cambia estas variables con tus datos reales)
// ============================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec'; // <-- REEMPLAZAR
const RECAPTCHA_SITE_KEY = 'TU_SITE_KEY'; // <-- REEMPLAZAR

// ============================================================
//  DETECCIÓN DE PÁGINA Y EJECUCIÓN (mejorada)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Detecta si la URL actual contiene 'gracias.html' (considerando subcarpetas)
    const isThanksPage = window.location.pathname.includes('gracias.html');
    if (isThanksPage) {
        initThanksPage();
    } else {
        initFormPage();
    }
});

// ============================================================
//  PÁGINA DEL FORMULARIO (con redirección asegurada)
// ============================================================
function initFormPage() {
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('formStatus');

    // Limpiar errores al escribir
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => el.closest('.form-group')?.classList.remove('input-error'));
        el.addEventListener('change', () => el.closest('.form-group')?.classList.remove('input-error'));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusDiv.innerHTML = '';
        submitBtn.disabled = true;

        // Obtener elementos
        const nombre = document.getElementById('nombre');
        const telefono = document.getElementById('telefono');
        const email = document.getElementById('email');
        const municipio = document.getElementById('municipio');

        // Limpiar errores previos
        [nombre, telefono, email, municipio].forEach(el => el.closest('.form-group')?.classList.remove('input-error'));

        let valid = true;

        // ---- Validación de nombre ----
        const nombreVal = nombre.value.trim();
        if (!nombreVal || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreVal) || nombreVal.split(/\s+/).length < 2) {
            setError(nombre);
            valid = false;
        }

        // ---- Validación de teléfono ----
        const telefonoVal = telefono.value.trim().replace(/\s/g, '');
        if (!/^\d{10}$/.test(telefonoVal)) {
            setError(telefono);
            valid = false;
        }

        // ---- Validación de email ----
        const emailVal = email.value.trim();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailVal) {
            setError(email);
            valid = false;
        } else if (emailVal.length > 254 || !emailRegex.test(emailVal)) {
            setError(email);
            valid = false;
        }

        // ---- Validación de municipio ----
        const municipioVal = municipio.value.trim();
        if (!municipioVal || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(municipioVal) || municipioVal.length < 4) {
            setError(municipio);
            valid = false;
        }

        if (!valid) {
            submitBtn.disabled = false;
            statusDiv.innerHTML = '<span style="color:#e53e3e;">Por favor, corrige los campos marcados en rojo.</span>';
            return;
        }

        // Generar código de seguimiento
        const codigo = `AGP-CRM-${Date.now()}`;

        // Preparar datos
        const formData = {
            nombre: nombreVal,
            telefono: telefonoVal,
            email: emailVal,
            municipio: municipioVal,
            tamanio: document.getElementById('tamanio').value,
            como_conocio: document.getElementById('como_conocio').value,
            codigo: codigo,
        };

        try {
            // Ejecutar reCAPTCHA (si está configurado)
            const token = await executeRecaptcha();
            formData.recaptchaToken = token;

            // Enviar datos al backend (con timeout para no bloquear)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (error) {
            // Si falla el envío, mostramos un mensaje pero igual redirigimos
            console.warn('Error en el envío (pero continuamos):', error);
            statusDiv.innerHTML = '<span style="color:#e67e22;">⚠️ No se pudo enviar los datos, pero tu código ha sido generado.</span>';
        } finally {
            // **SIEMPRE** redirigimos a gracias.html, incluso si el fetch falla
            window.location.href = `gracias.html?codigo=${encodeURIComponent(codigo)}&email=${encodeURIComponent(emailVal)}`;
        }
    });
}

function setError(el) {
    el.closest('.form-group')?.classList.add('input-error');
}

function executeRecaptcha() {
    return new Promise((resolve) => {
        if (typeof grecaptcha !== 'undefined' && RECAPTCHA_SITE_KEY !== 'TU_SITE_KEY') {
            grecaptcha.ready(() => {
                grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
                    .then(token => resolve(token))
                    .catch(() => resolve('fake-token-for-testing')); // Si falla, continuamos
            });
        } else {
            resolve('fake-token-for-testing');
        }
    });
}

// ============================================================
//  PÁGINA DE AGRADECIMIENTO (sin cambios)
// ============================================================
function initThanksPage() {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo') || 'AGP-CRM-000000';
    const email = params.get('email') || 'usuario@correo.com';

    document.getElementById('codigoTexto').textContent = codigo;
    document.getElementById('emailUsuario').textContent = email;

    // Configurar WhatsApp
    const waLink = document.getElementById('whatsappLink');
    const phone = '5219511704701';
    const text = `Mi código de seguimiento es ${codigo}`;
    waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    // Descargar imagen
    const downloadBtn = document.getElementById('downloadBtn');
    const recuadro = document.getElementById('codigoRecuadro');

    downloadBtn.addEventListener('click', () => {
        if (typeof html2canvas === 'undefined') {
            alert('La librería html2canvas no está cargada. Revisa tu conexión.');
            return;
        }
        html2canvas(recuadro, {
            scale: 2,
            backgroundColor: '#2d3748',
            borderRadius: '14px',
            allowTaint: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `codigo_seguimiento_${codigo}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error(err);
            alert('No se pudo generar la imagen. Intenta de nuevo.');
        });
    });
}
