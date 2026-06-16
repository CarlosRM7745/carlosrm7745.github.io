// ==================== MENÚ HAMBURGUESA (TOGGLE) ====================
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (event) {
        if (mainNav && mainNav.classList.contains('active')) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // ==================== ACTIVE LINK ON SCROLL ====================
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    });

    
    // ==================== VALIDACIÓN DEL FORMULARIO DE CONTACTO ====================
    const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); 
        
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';

        
        if (nombre === '' || email === '' || mensaje === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Ingresa un correo electrónico válido.');
            return;
        }

        
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo.');
                contactForm.reset(); 
            } else {
                alert('Hubo un problema al enviar el mensaje. Por favor, inténtalo más tarde.');
            }
        })
        .catch(error => {
            alert('Error de conexión. Asegúrate de estar conectado a internet.');
        });
    });
}


    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
