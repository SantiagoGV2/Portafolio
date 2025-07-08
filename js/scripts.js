// Función para modo oscuro mejorada
function oscuro() {
    const body = document.body;
    const icon = document.querySelector('.bi-moon, .bi-sun');
    const isDark = body.classList.contains('dark-mode');
    
    // Toggle del modo
    body.classList.toggle('dark-mode');
    
    // Cambiar icono
    if (icon) {
        if (isDark) {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
        } else {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        }
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', !isDark);
    
    // Mostrar notificación
    showNotification(`Modo ${!isDark ? 'oscuro' : 'claro'} activado`, 'info');
    
    // Aplicar efectos específicos del modo oscuro
    if (!isDark) {
        // Efectos adicionales al activar modo oscuro
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.animationDelay = '0.1s';
        });
    }
}

// Función para cargar preferencia de modo oscuro
function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    const body = document.body;
    const icon = document.querySelector('.bi-moon, .bi-sun');
    
    if (savedMode === 'true') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        }
    }
}

// Función para detectar preferencia del sistema
function detectSystemPreference() {
    if (localStorage.getItem('darkMode') === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            const icon = document.querySelector('.bi-moon');
            if (icon) {
                icon.classList.remove('bi-moon');
                icon.classList.add('bi-sun');
            }
            localStorage.setItem('darkMode', 'true');
        }
    }
}

// Función para sincronizar el modo oscuro entre páginas
function syncDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const body = document.body;
    const icon = document.querySelector('.bi-moon, .bi-sun');
    
    if (savedMode === 'true') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        }
    } else {
        body.classList.remove('dark-mode');
        if (icon) {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
        }
    }
}

// Escuchar cambios en el almacenamiento local para sincronizar entre pestañas
window.addEventListener('storage', function(e) {
    if (e.key === 'darkMode') {
        syncDarkMode();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('cv-download-btn');
    var countDiv = document.getElementById('cv-download-count');
    var count = localStorage.getItem('cvDownloadCount') || 0;
    countDiv.textContent = `Descargas en este navegador: ${count}`;

    btn.addEventListener('click', function () {
        count++;
        localStorage.setItem('cvDownloadCount', count);
        countDiv.textContent = `Descargas en este navegador: ${count}`;
        
        // Mostrar notificación
        showNotification('CV descargado exitosamente', 'success');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var videoModal = document.getElementById('videoModal');
    var projectVideo = document.getElementById('projectVideo');
    var videoSource = projectVideo.querySelector('source');
    var projectIframe = document.getElementById('projectIframe');
    var modalBody = projectVideo.parentElement;

    // Crear mensaje de error si no existe
    var errorMsg = document.createElement('div');
    errorMsg.className = 'text-center text-white py-5';
    errorMsg.style.display = 'none';
    errorMsg.textContent = 'No se encuentra el video para este proyecto.';

    if (!modalBody.contains(errorMsg)) {
        modalBody.appendChild(errorMsg);
    }

    document.querySelectorAll('.live-demo-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var videoUrl = btn.getAttribute('data-video');
            var youtubeUrl = btn.getAttribute('data-youtube');

            // Reset
            errorMsg.style.display = 'none';
            projectVideo.style.display = 'none';
            projectIframe.style.display = 'none';

            if (youtubeUrl && youtubeUrl.trim() !== "") {
                let embedUrl = youtubeUrl;
                // Si es un short, conviértelo a embed
                if (embedUrl.includes('/shorts/')) {
                    const id = embedUrl.split('/shorts/')[1].split(/[?&]/)[0];
                    embedUrl = `https://www.youtube.com/embed/${id}`;
                } else {
                    embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/");
                }
                projectIframe.src = embedUrl + "?autoplay=1";
                projectIframe.style.display = 'block';
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            } else if (videoUrl && videoUrl.trim() !== "") {
                videoSource.src = videoUrl;
                projectVideo.load();
                projectVideo.style.display = 'block';
                projectVideo.oncanplay = function() {
                    projectVideo.play();
                };
                projectVideo.onerror = function() {
                    projectVideo.style.display = 'none';
                    errorMsg.style.display = 'block';
                };
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            } else {
                errorMsg.style.display = 'block';
                var modal = new bootstrap.Modal(videoModal);
                modal.show();
            }

            // Limpiar al cerrar
            videoModal.addEventListener('hidden.bs.modal', function () {
                projectVideo.pause();
                projectVideo.currentTime = 0;
                videoSource.src = "";
                projectVideo.load();
                projectIframe.src = "";
                errorMsg.style.display = 'none';
                projectVideo.style.display = 'none';
                projectIframe.style.display = 'none';
            }, { once: true });
        });
    });
});

// === EFECTOS VISUALES AVANZADOS ===

// 1. Animaciones de Scroll - DESACTIVADA PARA MÓVIL
function initScrollAnimations() {
    // Verificar si estamos en móvil
    if (window.innerWidth <= 768) {
        // En móvil, forzar visibilidad de todos los elementos
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.display = 'block';
            el.style.animation = 'none';
            el.style.transform = 'none';
        });
        return; // No ejecutar animaciones en móvil
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.style.animationFillMode = 'forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos con animaciones
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// 2. Navegación Mejorada
function initEnhancedNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.add('navbar-enhanced');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Marcar enlace activo
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.add('nav-link-enhanced');
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
        });
    }
}

// 3. Efecto Typewriter - DESACTIVADO PARA MÓVIL
function initTypewriterEffect() {
    // Verificar si estamos en móvil
    if (window.innerWidth <= 768) {
        // En móvil, mostrar el texto completo sin animación
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            // Asegurar que el texto esté visible
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.display = 'inline';
            element.style.width = 'auto';
            element.style.borderRight = 'none';
        });
        return; // No ejecutar animación en móvil
    }

    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                element.style.borderRight = 'none';
            }
        }, 100);
    });
}

// 4. Contadores Animados
function initCounters() {
    const counters = document.querySelectorAll('.counter-animated');
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || '0');
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        counter.classList.add('animate');
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

// 5. Sistema de Notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 6. Efectos de Hover Mejorados
function initHoverEffects() {
    // Agregar efectos de hover a las tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('card-hover-effect');
    });

    // Agregar efectos a los botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('btn-glow');
    });

    // Agregar efectos a los iconos
    document.querySelectorAll('.tech-icon, .bi').forEach(icon => {
        icon.classList.add('icon-bounce');
    });
}

// 7. Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 8. Smooth Scroll para enlaces internos
function initSmoothScroll() {
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
}

// 9. Loader Spinner
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader-spinner position-fixed top-50 start-50 translate-middle';
    loader.style.zIndex = '9999';
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.querySelector('.loader-spinner');
    if (loader) {
        loader.remove();
    }
}

// 10. Efectos de Partículas
function initParticles() {
    const particlesContainer = document.querySelector('.particles-bg');
    if (particlesContainer) {
        // Crear partículas dinámicas
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(30, 48, 243, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// 11. Efectos de Texto con Glow
function initTextGlow() {
    const glowElements = document.querySelectorAll('.text-glow');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'running';
        });
        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'paused';
        });
    });
}

// 12. Modal Mejorado
function initEnhancedModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('modal-enhanced');
    });
}

// 13. Acordeón Personalizado
function initCustomAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        accordion.classList.add('accordion-custom');
    });
}

// 14. Pestañas Personalizadas
function initCustomTabs() {
    const tabContainers = document.querySelectorAll('.nav-tabs');
    tabContainers.forEach(container => {
        container.classList.add('tab-custom');
    });
}

// 15. Scroll Personalizado
function initCustomScrollbar() {
    document.body.classList.add('custom-scrollbar');
}

// Función principal para inicializar todos los efectos
function initAllEffects() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllEffects);
        return;
    }

    // Cargar preferencias del modo oscuro
    loadDarkModePreference();
    detectSystemPreference();
    syncDarkMode();

    // Inicializar todos los efectos
    initScrollAnimations();
    initEnhancedNavbar();
    initTypewriterEffect();
    initCounters();
    initHoverEffects();
    initParallax();
    initSmoothScroll();
    initParticles();
    initTextGlow();
    initEnhancedModals();
    initCustomAccordion();
    initCustomTabs();
    initCustomScrollbar();

    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a mi portafolio!', 'success');
    }, 1000);
}

// Inicializar efectos cuando se carga la página
initAllEffects();

// Reinicializar efectos cuando se navega entre páginas (SPA)
window.addEventListener('popstate', initAllEffects);

// Corregir visibilidad en móvil cuando cambie el tamaño de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, .display-1, .display-2, .display-3, .display-4, .display-5, .display-6, .typewriter, .text-glow, .animate-on-scroll').forEach(el => {
            if (!el.closest('.modal')) { // NO tocar si está dentro de un modal
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.display = 'block';
                el.style.animation = 'none';
                el.style.transform = 'none';
            }
        });
    }
});

// Ejecutar corrección inmediatamente si ya estamos en móvil
if (window.innerWidth <= 768) {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, .display-1, .display-2, .display-3, .display-4, .display-5, .display-6, .typewriter, .text-glow, .animate-on-scroll').forEach(el => {
        if (!el.closest('.modal')) { // NO tocar si está dentro de un modal
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.display = 'block';
            el.style.animation = 'none';
            el.style.transform = 'none';
        }
    });
}