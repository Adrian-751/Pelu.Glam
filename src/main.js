// Carrusel automático en el hero
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Iniciar el carrusel automático (cambia cada 5 segundos)
if (totalSlides > 0) {
    setInterval(nextSlide, 3000);
}

// Efecto Parallax en el header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.hero-bg');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Función para toggle de dropdown
function toggleDropdown(svg) {
    const dropdown = svg.closest('.dropdown');
    dropdown.classList.toggle('active');
}

// Exportar la función globalmente
window.toggleDropdown = toggleDropdown;

// Cerrar dropdown cuando el cursor sale del área
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseleave', function () {
        this.classList.remove('active');
    });
});

// Cerrar dropdown al hacer clic en los enlaces
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function () {
        const dropdown = this.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });
});