// Carrusel automático en el hero
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function ensureSlideBg(slide) {
    if (!slide) return
    // Evitar re-setear si ya está cargada
    if (slide.dataset?.bgLoaded === '1') return
    const bg = slide.getAttribute('data-bg')
    if (!bg) return
    slide.style.backgroundImage = `url('${bg}')`
    slide.dataset.bgLoaded = '1'
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
            // Cargar el fondo solo cuando se necesita (mejora enorme de performance)
            ensureSlideBg(slide)
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Iniciar el carrusel automático (cambia cada 5 segundos)
if (totalSlides > 0) {
    // Cargar el primer slide apenas arranca
    ensureSlideBg(slides[0])
    setInterval(nextSlide, 3000);
}

// Lazy-load para imágenes y videos fuera de pantalla
// - img: loading=lazy + decoding=async
// - video: preload=none (evita descargar MBs al abrir)
try {
    document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy')
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async')
    })
    document.querySelectorAll('video').forEach((v) => {
        if (!v.hasAttribute('preload')) v.setAttribute('preload', 'none')
    })
} catch {
    // ignore
}

// Bootstrap carousels: reproducir SOLO el video del slide activo (evita bugs en Safari/iOS)
function initCarouselVideos() {
    const carousels = document.querySelectorAll('.carousel')
    if (!carousels.length) return

    const pauseAll = (root) => {
        root.querySelectorAll('video').forEach((v) => {
            try {
                v.pause()
            } catch { /* ignore */ }
        })
    }

    const playActive = (root) => {
        const activeVideo = root.querySelector('.carousel-item.active video')
        if (!activeVideo) return
        try {
            // Reforzar flags necesarios para autoplay programático en mobile
            activeVideo.muted = true
            activeVideo.playsInline = true
            // Intentar reproducir (si el navegador lo bloquea, no rompemos la UI)
            const p = activeVideo.play?.()
            if (p && typeof p.catch === 'function') p.catch(() => { })
        } catch {
            // ignore
        }
    }

    const sync = (root) => {
        pauseAll(root)
        playActive(root)
    }

    carousels.forEach((c) => {
        // Estado inicial
        sync(c)
        // Cuando el carrusel termina de deslizar, sincronizar
        c.addEventListener('slid.bs.carousel', () => sync(c))
    })
}

try {
    initCarouselVideos()
} catch {
    // ignore
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

// Mobile nav (<details class="mobile-nav">): cerrar al navegar, al tocar afuera o con ESC
const mobileNav = document.querySelector('details.mobile-nav');
if (mobileNav) {
    const closeMobileNav = () => {
        mobileNav.removeAttribute('open');
        mobileNav.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
    };

    mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => closeMobileNav());
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });

    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target)) closeMobileNav();
    });
}