// Año footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Animaciones reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
}

// Swiper inits
document.addEventListener('DOMContentLoaded', () => {
  if (window.Swiper) {
    // HERO
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 700,
      autoplay: { delay: 6000, disableOnInteraction: false },
      navigation: {
        prevEl: '.hero .swiper-button-prev',
        nextEl: '.hero .swiper-button-next',
      },
      keyboard: { enabled: true },
    });

    // SERVICIOS
    new Swiper('.services-swiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      speed: 600,
      grabCursor: true,
      navigation: {
        prevEl: '.service-section .swiper-button-prev',
        nextEl: '.service-section .swiper-button-next',
      },
      breakpoints: {
        0:   { slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
        768: { slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
        1200:{ slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
      },
    });

    // TESTIMONIOS
    new Swiper('.testi-swiper', {
      loop: true,
      speed: 600,
      autoHeight: true,
      slidesPerView: 1,
      navigation: {
        prevEl: '.testi .swiper-button-prev',
        nextEl: '.testi .swiper-button-next',
      },
      keyboard: { enabled: true },
    });
  }

  // Click en card de servicios → autoseleccionar en el form
  document.querySelectorAll('.services-swiper .swiper-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const servicio = slide.dataset.servicio;
      const select = document.querySelector('select[name="service"]');
      if (select && servicio) {
        const opt = Array.from(select.options).find(o => o.text.trim() === servicio);
        if (opt) select.value = opt.value || opt.text;
      }
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// Formulario
const form = document.getElementById('formBooking');
const msg  = document.getElementById('formMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const required = ['name','phone','email','service','date','address'];
  const missing = required.filter(k => !data[k]);
  if (missing.length) {
    msg.textContent = 'Por favor, completa todos los campos requeridos.';
    msg.style.color = '#fca5a5';
    return;
  }
  msg.textContent = '¡Gracias! Te contactaremos para confirmar 😊';
  msg.style.color = '#7dd3fc';
  form.reset();
});

/* ====== Header mobile nav (único bloque del menú) ====== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('menu');
  if (!toggle || !menu) return;

  const links  = Array.from(menu.querySelectorAll('a'));

  const openMenu = () => {
    menu.classList.add('open');
    document.body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    // foco accesible: llevar foco al primer enlace del menú
    setTimeout(() => links[0]?.focus(), 0);
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.focus();
  };

  const toggleMenu = () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  };

  // Botón hamburguesa
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // no propaga al documento
    toggleMenu();
  });

  // Cerrar al pulsar un enlace
  links.forEach(a => a.addEventListener('click', closeMenu));

  // Cerrar al tocar/clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    const clickInsideMenu = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickInsideMenu) closeMenu();
  });

  // Cerrar con ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  // Defensa: al cambiar de tamaño a desktop, resetea estado
  const mq = window.matchMedia('(min-width: 721px)');
  mq.addEventListener?.('change', (ev) => {
    if (ev.matches) closeMenu();
  });
})();
// Cookie modal
(() => {
  const modal = document.getElementById('cookie-modal');
  if (!modal) return;

  const acceptBtn = document.getElementById('cookie-accept');
  const backdrop = modal.querySelector('.cookie-modal__backdrop');

  const openModal = () => {
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Mirar si ya tenemos preferencia guardada
  let pref = null;
  try {
    pref = localStorage.getItem('cookiePreference');
  } catch (e) {}

  // Si no hay nada guardado, abrimos el modal
  if (!pref) {
    openModal();
  }

  // Aceptar cookies (solo técnicas)
  acceptBtn?.addEventListener('click', () => {
    try {
      localStorage.setItem('cookiePreference', 'necessary');
    } catch (e) {}
    closeModal();
  });

  // Cerrar haciendo clic en el fondo
  backdrop?.addEventListener('click', closeModal);

  // Cerrar con ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
