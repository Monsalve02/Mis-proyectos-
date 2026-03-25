/* ================================================================
   IMPLAMAC – JavaScript principal
   Archivo: js/main.js
   ================================================================
   Índice:
   1. Navbar: clase .scrolled al hacer scroll
   2. Menú hamburguesa (móvil)
   3. Scroll reveal con IntersectionObserver
   4. Contadores animados (estadísticas del hero)
   5. Smooth scroll para links de anclaje (#sección)
   ================================================================ */


/* ----------------------------------------------------------------
   1. NAVBAR — Agrega clase .scrolled cuando el usuario baja 60px
   ---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Si se scrolleó más de 60px → agrega .scrolled (fondo + logo visibles)
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ----------------------------------------------------------------
   2. MENÚ HAMBURGUESA (móvil)
   ---------------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Abrir / cerrar al clic del ícono
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Cerrar el menú cuando el usuario hace clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


/* ----------------------------------------------------------------
   3. SCROLL REVEAL
   Observa los elementos con clase .reveal y les agrega .visible
   cuando entran en el viewport → activa la transición CSS
   ---------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animar solo una vez
    }
  });
}, {
  threshold: 0.12 // el elemento debe ser 12% visible para activarse
});

revealEls.forEach(el => revealObserver.observe(el));


/* ----------------------------------------------------------------
   4. CONTADORES ANIMADOS (estadísticas del hero)
   ---------------------------------------------------------------- */

/**
 * Anima un contador numérico del 0 al valor objetivo.
 * @param {HTMLElement} el       - Elemento cuyo textContent se actualiza
 * @param {number}      target   - Valor final
 * @param {number}      duration - Duración en ms (por defecto 1800)
 */
function animateCounter(el, target, duration = 1800) {
  let current = 0;
  const step  = target / (duration / 16); // ~60fps

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}

// Datos de los contadores: [valor, sufijo]
const COUNTER_DATA = [
  { value: 10,  suffix: '+' }, // Años de experiencia
  { value: 10,  suffix: ''  }, // Años de garantía
];

const heroStatEls    = document.querySelectorAll('.stat-num');
let   countersStarted = false;

// Activar contadores una sola vez cuando el hero es visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;

    heroStatEls.forEach((el, i) => {
      el.dataset.suffix = COUNTER_DATA[i].suffix;
      animateCounter(el, COUNTER_DATA[i].value);
    });
  }
}, {
  threshold: 0.5
});

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);


/* ----------------------------------------------------------------
   5. SMOOTH SCROLL para links de anclaje
   Intercepta los clics en <a href="#seccion"> y hace scroll suave
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    const target   = document.querySelector(targetId);

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
