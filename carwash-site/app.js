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
/* ====== Header mobile nav ====== */
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('menu');

  if(!toggle || !menu) return;

  const links = menu.querySelectorAll('a');

  function openMenu(){
    menu.classList.add('open');
    document.body.classList.add('no-scroll');
    toggle.setAttribute('aria-expanded','true');
    // foco accesible
    setTimeout(()=> links[0]?.focus(), 0);
  }
  function closeMenu(){
    menu.classList.remove('open');
    document.body.classList.remove('no-scroll');
    toggle.setAttribute('aria-expanded','false');
    toggle.focus();
  }
  function toggleMenu(){
    (menu.classList.contains('open')) ? closeMenu() : openMenu();
  }

  toggle.addEventListener('click', toggleMenu);
  // cerrar al hacer click en un enlace
  links.forEach(a => a.addEventListener('click', closeMenu));
  // cerrar con ESC
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();
