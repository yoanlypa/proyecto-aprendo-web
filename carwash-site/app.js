
/* ===== App.js - Funcionalidades ===== */

// Año footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ===== Hero Slider ===== */
class HeroSlider {
  constructor(root){
    this.root = root;
    this.slides = [...root.querySelectorAll('.slide')];
    this.dots = [...root.querySelectorAll('.dots button')];
    this.index = 0;
    this.timer = null;
    this.autoplay = parseInt(root.dataset.autoplay || '0', 10);

    root.querySelector('[data-prev]').addEventListener('click', ()=>this.go(this.index-1));
    root.querySelector('[data-next]').addEventListener('click', ()=>this.go(this.index+1));
    this.dots.forEach((btn,i)=>btn.addEventListener('click',()=>this.go(i)));

    this.go(0,false);
    if(this.autoplay) this.play();

    // Pause on hover
    root.addEventListener('mouseenter', ()=>this.pause());
    root.addEventListener('mouseleave', ()=>this.play());
  }

  go(i,animate=true){
    const n = this.slides.length;
    this.index = (i+n)%n;
    this.slides.forEach((s,idx)=>{
      s.classList.toggle('is-active', idx===this.index);
      s.style.opacity = idx===this.index ? '1' : '0';
      s.style.transition = animate ? 'opacity .6s ease' : 'none';
      s.style.position = idx===this.index ? 'relative' : 'absolute';
      s.style.inset = '0';
    });
    this.dots.forEach((d,idx)=>d.setAttribute('aria-selected', idx===this.index ? 'true' : 'false'));
  }
  play(){ if(!this.autoplay) return; this.pause(); this.timer = setInterval(()=>this.go(this.index+1), this.autoplay); }
  pause(){ if(this.timer) clearInterval(this.timer); }
}
document.querySelectorAll('.hero__slider').forEach(el=>new HeroSlider(el));

/* ===== Testimonios (mini slider) ===== */
class Testi {
  constructor(root){
    this.root = root;
    this.items = [...root.querySelectorAll('.t')];
    this.dots = [...root.querySelectorAll('.testi__dots button')];
    this.i = 0;
    this.timer = null;
    this.autoplay = parseInt(root.dataset.autoplay || '0', 10);

    root.querySelector('.testi__ctrl--prev').addEventListener('click',()=>this.go(this.i-1));
    root.querySelector('.testi__ctrl--next').addEventListener('click',()=>this.go(this.i+1));
    this.dots.forEach((d,idx)=>d.addEventListener('click',()=>this.go(idx)));

    this.go(0,false);
    if(this.autoplay) this.play();
    root.addEventListener('mouseenter',()=>this.pause());
    root.addEventListener('mouseleave',()=>this.play());
  }
  go(i,animate=true){
    const n = this.items.length;
    this.i = (i+n)%n;
    this.items.forEach((it,idx)=>{
      it.classList.toggle('is-active', idx===this.i);
      it.style.display = idx===this.i ? 'block' : 'none';
      it.style.opacity = idx===this.i ? '1' : '0';
      it.style.transition = animate ? 'opacity .35s ease' : 'none';
    });
    this.dots.forEach((d,idx)=>d.setAttribute('aria-selected', idx===this.i ? 'true':'false'));
  }
  play(){ if(!this.autoplay) return; this.pause(); this.timer = setInterval(()=>this.go(this.i+1), this.autoplay); }
  pause(){ if(this.timer) clearInterval(this.timer); }
}
document.querySelectorAll('.testi').forEach(el=>new Testi(el));

/* ===== Formulario ===== */
const form = document.getElementById('formBooking');
const msg  = document.getElementById('formMsg');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !data.phone || !data.email || !data.service || !data.date || !data.address){
    msg.textContent = 'Por favor, completa todos los campos requeridos.'; msg.style.color = '#fca5a5'; return;
  }
  msg.textContent = '¡Gracias! Te contactaremos para confirmar 😊'; msg.style.color = '#7dd3fc';
  form.reset();
});
/* ===== Carrusel Servicios (Swiper) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const servicesSwiper = new Swiper('.services-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 0,
    loop: true,
    speed: 600,
    grabCursor: true,

    navigation: {
      nextEl: '.services-swiper .swiper-button-next',
      prevEl: '.services-swiper .swiper-button-prev',
    },
    // Mejora de tacto en móvil
    touchStartPreventDefault: false,
    // Auto play opcional:
    // autoplay: { delay: 4000, disableOnInteraction: false },
    breakpoints: {
      0:   { slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
      768: { slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
      1200:{ slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
    },
  });
});
const io = new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting && e.target.classList.add('is-in')), {threshold:.12});
document.querySelectorAll('.section, .card, .swiper-slide').forEach(el=>{ el.classList.add('reveal'); io.observe(el); });
