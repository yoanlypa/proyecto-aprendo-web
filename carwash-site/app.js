/* ===== Utilidades ===== */

// Año footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Animaciones al hacer scroll (reveal)
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

/* ===== Swipers ===== */
document.addEventListener('DOMContentLoaded', () => {
  // HERO
  const heroEl = document.querySelector('.hero-swiper');
  if (heroEl && window.Swiper) {
    new Swiper(heroEl, {
      loop: true,
      speed: 700,
      effect: 'slide',
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: {
        nextEl: '.hero .swiper-button-next',
        prevEl: '.hero .swiper-button-prev',
      },
    });
  }

  // SERVICIOS
  const servicesEl = document.querySelector('.services-swiper');
  if (servicesEl && window.Swiper) {
    new Swiper(servicesEl, {
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      speed: 600,
      grabCursor: true,
      navigation: {
        nextEl: '.service-section .swiper-button-next',
        prevEl: '.service-section .swiper-button-prev',
      },
      breakpoints: {
        0:   { slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
        768: { slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
        1200:{ slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
      },
    });

    // Click en card de servicios → preselecciona servicio y baja al formulario
    document.querySelectorAll('.services-swiper .swiper-slide').forEach(slide=>{
      slide.addEventListener('click', ()=>{
        const servicio = slide.dataset.servicio;
        const select = document.querySelector('select[name="service"]');
        if (select && servicio) {
          const opt = Array.from(select.options).find(o => o.text.trim() === servicio);
          if (opt) select.value = opt.value || opt.text;
        }
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // TESTIMONIOS
  const testiEl = document.querySelector('.testi-swiper');
  if (testiEl && window.Swiper) {
    new Swiper(testiEl, {
      loop: true,
      speed: 600,
      autoHeight: true,
      slidesPerView: 1,
      navigation: {
        nextEl: '.testi .swiper-button-next',
        prevEl: '.testi .swiper-button-prev',
      },
    });
  }
});

/* ===== Formulario ===== */
const form = document.getElementById('formBooking');
const msg  = document.getElementById('formMsg');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !data.phone || !data.email || !data.service || !data.date || !data.address){
    msg.textContent = 'Por favor, completa todos los campos requeridos.';
    msg.style.color = '#fca5a5';
    return;
  }
  msg.textContent = '¡Gracias! Te contactaremos para confirmar 😊';
  msg.style.color = '#7dd3fc';
  form.reset();
});
