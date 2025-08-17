document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DO MENU HAMBÚRGUER (MOBILE) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            document.body.classList.toggle('nav-open');
        });
    }

    // --- LÓGICA DO CARROSSEL HERO ---
    const carouselContainer = document.querySelector('.hero-carousel');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.slide');
        const dots = carouselContainer.querySelectorAll('.carousel-dots .dot');
        const arrows = carouselContainer.querySelectorAll('.carousel-arrow');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            const newIndex = (index + slides.length) % slides.length;

            slides.forEach(slide => {
                const video = slide.querySelector('video');
                if (video) {
                    video.pause();
                }
            });

            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = newIndex;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            const activeVideo = slides[currentSlide].querySelector('video');
            if (activeVideo) {
                activeVideo.currentTime = 0;
                activeVideo.play().catch(error => {
                    console.log("Autoplay foi impedido pelo navegador.");
                });
            }
        }

        function changeSlide(direction) {
            showSlide(currentSlide + direction);
            resetInterval();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide(1), 7000);
        }

        arrows.forEach(arrow => {
            arrow.addEventListener('click', () => {
                const direction = parseInt(arrow.dataset.direction);
                changeSlide(direction);
            });
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });
        
        showSlide(0);
        resetInterval();
    }

    // --- LÓGICA DE ANIMAÇÃO NO SCROLL (INTERSECTION OBSERVER) ---
    const fadeElements = document.querySelectorAll('.fade-in-element');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // --- LÓGICA DO CARROSSEL DA SEÇÃO SOBRE NÓS ---
    const aboutCarousel = document.getElementById('about-us-carousel');
    if (aboutCarousel) {
        const imageSlides = aboutCarousel.querySelectorAll('.about-slide-image');
        const textSlides = aboutCarousel.querySelectorAll('.about-text-slide');
        const prevButton = aboutCarousel.querySelector('.about-arrow.prev');
        const nextButton = aboutCarousel.querySelector('.about-arrow.next');
        let currentAboutSlide = 0;

        function showAboutSlide(index) {
            imageSlides[currentAboutSlide].classList.remove('active');
            textSlides[currentAboutSlide].classList.remove('active');
            currentAboutSlide = (index + imageSlides.length) % imageSlides.length;
            imageSlides[currentAboutSlide].classList.add('active');
            textSlides[currentAboutSlide].classList.add('active');
        }

        prevButton.addEventListener('click', () => {
            showAboutSlide(currentAboutSlide - 1);
        });

        nextButton.addEventListener('click', () => {
            showAboutSlide(currentAboutSlide + 1);
        });
    }

    // --- LÓGICA PARA ENVIO DO FORMULÁRIO DE CONTATO VIA AJAX ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = e.target;
            const data = new FormData(form);
            const statusDiv = document.getElementById('form-status');

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    statusDiv.className = 'success visible';
                    statusDiv.innerHTML = `<span class="icon"><i class="fas fa-check-circle"></i></span> <span>Mensagem enviada com sucesso!</span>`;
                    form.reset();
                } else {
                    statusDiv.className = 'error visible';
                    statusDiv.innerHTML = `<span class="icon"><i class="fas fa-exclamation-circle"></i></span> <span>Ocorreu um erro. Tente novamente.</span>`;
                }
                setTimeout(() => {
                    statusDiv.classList.remove('visible');
                }, 4000);
            }).catch(error => {
                statusDiv.className = 'error visible';
                statusDiv.innerHTML = `<span class="icon"><i class="fas fa-exclamation-circle"></i></span> <span>Ocorreu um erro de conexão.</span>`;
                setTimeout(() => {
                    statusDiv.classList.remove('visible');
                }, 4000);
            });
        });
    }
});