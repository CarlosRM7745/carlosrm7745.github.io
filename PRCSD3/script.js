// ============================================================
// Restaurant Campestre Santo Domingo — JavaScript (ES6+)
// Funciones: Menú móvil, Scroll suave, Formulario, Traducción
// ============================================================

(function () {
  'use strict';

  // ----- 1. MENÚ MÓVIL -----
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mainNav.classList.toggle('is-open');
      const icon = this.querySelector('i');
      if (mainNav.classList.contains('is-open')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (
      mainNav &&
      mainNav.classList.contains('is-open') &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      mainNav.classList.remove('is-open');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });

  // ----- 2. SCROLL SUAVE -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
        history.pushState(null, null, targetId);
      }
    });
  });

  // ----- 3. ACTIVE LINK ON SCROLL -----
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('load', updateActiveLink);

  // ----- 4. NAVBAR SHADOW -----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ----- 5. FORMULARIO DE CONTACTO -----
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (feedback) {
        feedback.style.display = 'none';
        feedback.className = 'form__feedback';
      }

      const nombre = document.getElementById('nombre');
      const email = document.getElementById('email');
      const mensaje = document.getElementById('mensaje');

      let isValid = true;
      let errorMsg = '';

      if (!nombre || nombre.value.trim() === '') {
        isValid = false;
        errorMsg += '• El nombre es obligatorio.\n';
        if (nombre) nombre.style.borderColor = '#dc3545';
      } else if (nombre) {
        nombre.style.borderColor = '';
      }

      if (!email || email.value.trim() === '') {
        isValid = false;
        errorMsg += '• El correo electrónico es obligatorio.\n';
        if (email) email.style.borderColor = '#dc3545';
      } else if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          isValid = false;
          errorMsg += '• Ingresa un correo electrónico válido.\n';
          email.style.borderColor = '#dc3545';
        } else {
          email.style.borderColor = '';
        }
      }

      if (!mensaje || mensaje.value.trim() === '') {
        isValid = false;
        errorMsg += '• El mensaje es obligatorio.\n';
        if (mensaje) mensaje.style.borderColor = '#dc3545';
      } else if (mensaje) {
        mensaje.style.borderColor = '';
      }

      if (!isValid) {
        if (feedback) {
          feedback.textContent = 'Por favor, corrige los siguientes errores:\n' + errorMsg;
          feedback.className = 'form__feedback error';
          feedback.style.display = 'block';
        } else {
          alert('Por favor, completa todos los campos obligatorios.');
        }
        return;
      }

      const formData = new FormData(contactForm);
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
        .then(function (response) {
          if (response.ok) {
            if (feedback) {
              feedback.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo.';
              feedback.className = 'form__feedback success';
              feedback.style.display = 'block';
            }
            contactForm.reset();
          } else {
            throw new Error('Error en el servidor');
          }
        })
        .catch(function (error) {
          console.error('Error al enviar:', error);
          if (feedback) {
            feedback.textContent = 'Hubo un problema al enviar el mensaje. Por favor, inténtalo más tarde.';
            feedback.className = 'form__feedback error';
            feedback.style.display = 'block';
          } else {
            alert('Error de conexión. Inténtalo de nuevo.');
          }
        });
    });
  }

  // ----- 6. TRADUCCIÓN (Español ↔ Inglés) -----
  const translations = {
    en: {
      // Navbar
      'nav.home': 'Home',
      'nav.history': 'History',
      'nav.identity': 'Identity',
      'nav.menu': 'Menu',
      'nav.info': 'Info',
      'nav.contact': 'Contact',

      // Hero (aunque no se usen en el HTML actual, se mantienen por si se restauran)
      'hero.welcome': 'Welcome to',
      'hero.name': 'Restaurant Campestre Santo Domingo',
      'hero.subtitle': 'Traditional Oaxacan cuisine · Atmosphere and Flavor that unites families',
      'hero.cta': 'Discover our menu',

      // Historia
      'history.badge': 'Our legacy',
      'history.title': 'A dream that began in 2018',
      'history.subtitle': 'An Oaxacan family promoting gastronomic culture and offering a unique experience',
      'history.p1': 'A project that started in <strong>2018</strong> by an Oaxacan family seeking to promote Oaxacan gastronomic culture and contact with nature.',
      'history.p2': 'At <strong>Restaurant Campestre Santo Domingo</strong>, we offer an authentic and welcoming gastronomic experience for all families, in a natural and countryside setting. Our commitment is to offer traditional dishes, prepared with <strong>the best ingredients from local suppliers</strong>.',
      'history.p3': 'We want every visit to be an <strong>opportunity for our diners to enjoy the best of Oaxacan land</strong> and create special family memories.',
      'history.note': 'All dishes are made to order; we appreciate your patience.',

      // Identidad
      'identity.badge': 'Our essence',
      'identity.title': 'Mission · Vision · Purpose',
      'identity.subtitle': 'What drives us every day',
      'identity.mission.title': 'Mission',
      'identity.mission.text': 'To offer a unique culinary experience blending local ingredients with traditional techniques in a unique and family-friendly atmosphere.',
      'identity.vision.title': 'Vision',
      'identity.vision.text': 'To be the benchmark of Oaxacan gastronomy in the region, recognized for our authenticity, warmth and quality.',
      'identity.purpose.title': 'Purpose',
      'identity.purpose.text': 'To rescue and preserve Oaxaca\'s culinary tradition, creating unforgettable moments around the table.',

      // Reconocimientos
      'recognition.badge': 'Recognition',
      'recognition.title': 'Restaurant Guru',
      'recognition.desc': 'Restaurant Campestre Santo Domingo has been awarded the Restaurant Guru Recommendation Badge, one of the largest gastronomic platforms in the world with over 30 million users. This achievement is thanks to the preference of all of you in Ocotlán de Morelos. Come celebrate with us and discover why we are a reference place!',
      'recognition.title.overlander': 'iOverlander',
      'recognition.desc.overlander': 'Awarded by the traveler community as a reference place in Ocotlán de Morelos.',

      // Menú
      'menu.badge': 'Gastronomy',
      'menu.title': 'Our menu',
      'menu.subtitle': 'Made with fresh ingredients and lots of love',

      'menu.breakfast.title': 'Breakfast Packages',
      'menu.breakfast.desc': 'Enjoy our <strong>breakfast packages</strong> that include a main dish, select fruit, coffee and freshly baked bread. Each option is made with <strong>top quality</strong> ingredients and homemade seasoning, offering you <strong>unique specialties</strong> and an <strong>unmatched flavor</strong> you won\'t find anywhere else.',
      'menu.breakfast.hours': '* Packages available from 7:30 am to 1:00 pm',

      'menu.lunch.title': 'Lunches',
      'menu.lunch.desc': 'Our <strong>traditional lunches</strong> are the perfect balance between <strong>homemade flavor</strong> and <strong>maximum quality</strong>. Enjoy everything from irresistible <strong>entomatadas, enchiladas and enfrijoladas</strong> with handmade tortillas, to juicy <strong>grilled meats</strong> with a <strong>unique and unmatched taste</strong>. The ideal feast to start your day!',
      'menu.lunch.portion': 'Generous portions!',

      'menu.dinner.title': 'Dinners',
      'menu.dinner.desc': 'Enjoy our <strong>regional dinners</strong> prepared fresh with local ingredients and the <strong>highest quality</strong>. Every day we offer a different variety of dishes with a <strong>unique and unmatched seasoning</strong>.',
      'menu.dinner.note': 'Coming soon to our dinner section! Savor the magic of <strong>chiles en nogada</strong> starting in mid-August. The <strong>authentic flavor</strong> of the season!',
      'menu.dinner.desc2': 'Come and live a <strong>unique culinary experience</strong> at our table! We invite you to discover a space where the warmth of service and the atmosphere come together to give you <strong>memorable moments</strong>. Let yourself be pampered by the magic of our cuisine and share an unparalleled moment with <strong>top‑level dishes</strong> that celebrate the art of good eating.',

      'menu.traditional.title': 'Traditional Flavor',
      'menu.traditional.desc': 'Enjoy our authentic <strong>memelas, tlayudas and quesadillas</strong> made with regional corn and handmade tortillas. The taste of Oaxaca in every bite.',
      'menu.traditional.handmade': 'Handmade tortillas',

      'menu.seafood.title': 'Seafood Fridays',
      'menu.seafood.desc': 'On Fridays, live an <strong>unmatched gastronomic experience</strong> with our exclusive selection of <strong>fresh seafood</strong>. We guarantee perfect textures and <strong>intense flavors of maximum quality</strong> in every dish. The ideal seafood feast to treat yourself with the <strong>authentic taste of the sea</strong>!',
      'menu.seafood.fresh': 'Always with maximum quality and freshness.',

      'menu.sunday.title': 'Family Sundays',
      'menu.sunday.desc': 'Sundays are for sharing big. We offer <strong>special dishes for the whole family</strong>, with generous portions and that homemade touch that characterizes us.<br>Ask about our daily specials.',
      'menu.sunday.note': 'Come with your family and enjoy an unforgettable Sunday.',

      'menu.cold.title': 'Cold Drinks',
      'menu.cold.desc': '<strong>Refresh your palate</strong> with our exclusive selection of <strong>natural flavored waters</strong>, artisanal juices and premium soft drinks. We prepare every drink <strong>completely fresh</strong> with seasonal fruits of <strong>maximum quality and ripeness</strong>. Let yourself be captivated by an <strong>authentic and deliciously refreshing taste</strong> in every sip!',

      'menu.hot.title': 'Hot Drinks',
      'menu.hot.desc': 'Enjoy the aroma of our <strong>traditional hot drinks</strong>, made with authentic ingredients of <strong>maximum quality</strong>. Savor our exquisite <strong>pot coffee</strong>, hand‑whipped traditional chocolate, creamy <strong>atoles</strong> and regional herb teas. Every cup gives you an <strong>unmatched flavor</strong> that comforts the soul!',

      'menu.cocktails.title': 'Cocktails',
      'menu.cocktails.desc': 'Our <strong>signature cocktails</strong> pay homage to Oaxaca with <strong>traditional mezcal</strong>, top‑tier tequila and premium liquors. Surprise your senses with the <strong>unmatched flavor</strong> of our specialties: exotic <strong>Mezcalinas</strong> and the sophisticated <strong>Mezcal Jabalí</strong>. A <strong>top‑quality</strong> experience in every sip!',

      'menu.pdf': 'View full menu',

      // Información práctica
      'info.badge': 'Visit us',
      'info.title': 'Hours and location',
      'info.subtitle': 'We await you with open arms',
      'info.hours.title': 'Opening hours',
      'info.hours.days': 'Monday to Sunday',
      'info.hours.time': '7:00 am – 7:00 pm',
      'info.hours.breakfast': 'Breakfast packages',
      'info.hours.breakfastTime': '7:30 am – 1:00 pm',
      'info.hours.note': 'We serve with pleasure every day!',
      'info.map.title': 'Location',
      'info.map.address': ' Ocotlán de Morelos, Oaxaca, Mexico',

      // Contacto
      'contact.badge': 'Get in touch',
      'contact.title': 'Do you have any questions?',
      'contact.subtitle': 'Book your table or request information',
      'contact.phone.title': 'Calls and WhatsApp',
      'contact.email.title': 'Email',
      'contact.social.title': 'Follow us',
      'contact.form.name': 'Full name',
      'contact.form.email': 'Email address',
      'contact.form.phone': 'Phone number',
      'contact.form.message': 'Message',
      'contact.form.submit': 'Send message',

      // Footer
      'footer.tagline': 'Traditional Oaxacan cuisine · Countryside atmosphere',
      'footer.quick.title': 'Quick links',
      'footer.payments.title': 'Payment methods',
      'footer.payments.cash': 'Cash',
      'footer.payments.transfer': 'Bank transfer',
      'footer.payments.terminal': 'Terminal (Cards)',
      'footer.payments.invoice': 'Invoicing available',
      'footer.rights': 'All rights reserved.',
      'footer.foundation': 'Founded in 2018 · Traditional Oaxacan cuisine',
    },
  };

  let currentLang = 'es';
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');

  // Guardar el contenido original en español de todos los elementos con data-i18n
  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(function (el) {
    el.setAttribute('data-original', el.innerHTML);
  });

  function setLanguage(lang) {
    currentLang = lang;
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    i18nElements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (lang === 'es') {
        el.innerHTML = el.getAttribute('data-original');
      } else if (lang === 'en' && translations.en && translations.en[key]) {
        el.innerHTML = translations.en[key];
      }
      // Si no hay traducción, se deja el original (español)
    });

    document.documentElement.lang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const newLang = currentLang === 'es' ? 'en' : 'es';
      setLanguage(newLang);
    });
  }

  // ----- 7. FOOTER: año actual -----
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ----- 8. INICIALIZAR TRADUCCIÓN -----
  setLanguage('es');

})();