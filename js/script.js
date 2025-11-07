// Global Variables
let currentTestimonial = 0;
let quizStep = 0;
let quizAnswers = {};

// DOM Elements
const loader = document.querySelector('.loader');
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav ul');
const filterBtns = document.querySelectorAll('.filter-btn');
const destinoCards = document.querySelectorAll('.destino-card');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const counters = document.querySelectorAll('.counter');
const searchInput = document.getElementById('searchDestinos');
const sliderTrack = document.querySelector('.slider-track');
const sliderDotsContainer = document.querySelector('.slider-dots');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
const forms = document.querySelectorAll('form');
const backToTop = document.querySelector('.back-to-top');

// Init on Load
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1500);

    // Create particles
    createParticles();

    // Init reveal observer
    initRevealObserver();

    // Init counters
    initCounters();

    // Create slider dots
    createSliderDots();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) smoothScroll(anchor.getAttribute('href'));
        });
    });

    // Active nav on scroll
    updateActiveNav();

    // Forms submit
    forms.forEach(form => form.addEventListener('submit', handleFormSubmit));
});

// Smooth Scroll
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Mobile Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navUl.classList.toggle('active');
});

// Header Scroll Effects
window.addEventListener('scroll', () => {
    // Header scrolled class
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Update active nav
    updateActiveNav();
});

// Update Active Nav
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
}

// Reveal Observer
function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Counters Animation
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target.querySelector('.counter'));
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.stat-item').forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + (target > 1 ? '+' : '');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + '+';
        }
    }, 20);
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        destinoCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Search
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    destinoCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        if (name.includes(term)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
});

// Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
    });
});

// Accordion
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const icon = header.querySelector('.icon');

        // Toggle current
        body.classList.toggle('active');
        icon.textContent = body.classList.contains('active') ? '−' : '+';

        // Close others
        accordionHeaders.forEach(h => {
            if (h !== header) {
                const b = h.nextElementSibling;
                const i = h.querySelector('.icon');
                b.classList.remove('active');
                i.textContent = '+';
            }
        });
    });
});

// Testimonial Slider
function createSliderDots() {
    const total = document.querySelectorAll('.testimonial-card').length;
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsContainer.appendChild(dot);
    }
}

const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
    currentTestimonial = n;
    sliderTrack.style.transform = `translateX(-${n * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[n].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + dots.length) % dots.length;
    goToSlide(currentTestimonial);
});

nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % dots.length;
    goToSlide(currentTestimonial);
});

// Auto slide
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % dots.length;
    goToSlide(currentTestimonial);
}, 5000);

// Quiz
function startQuiz() {
    quizStep = 0;
    quizAnswers = {};
    document.querySelector('.quiz-section button').style.display = 'none';
    const container = document.getElementById('quiz-container');
    container.style.display = 'block';
    showQuizStep();
}

function showQuizStep() {
    const questions = [
        {
            question: 'Qual é seu objetivo principal?',
            options: [
                { value: 'idioma', label: 'Aprender um novo idioma' },
                { value: 'estudantil', label: 'Estudar em universidade' },
                { value: 'trabalho', label: 'Trabalhar no exterior' }
            ]
        },
        {
            question: 'Qual duração você prefere?',
            options: [
                { value: 'curto', label: '3-6 meses' },
                { value: 'medio', label: '6-12 meses' },
                { value: 'longo', label: 'Mais de 1 ano' }
            ]
        },
        {
            question: 'Qual seu orçamento aproximado?',
            options: [
                { value: 'baixo', label: 'Até R$ 20.000' },
                { value: 'medio', label: 'R$ 20.000 - 30.000' },
                { value: 'alto', label: 'Acima de R$ 30.000' }
            ]
        }
    ];

    const q = questions[quizStep];
    let html = `
        <div class="quiz-progress">
            <div class="progress-bar" style="width: ${(quizStep + 1) / 3 * 100}%"></div>
        </div>
        <h4>Passo ${quizStep + 1} de 3</h4>
        <p>${q.question}</p>
    `;

    q.options.forEach(option => {
        const selected = quizAnswers[quizStep] === option.value ? 'selected' : '';
        html += `<button class="quiz-option ${selected}" onclick="selectQuizAnswer('${option.value}')">${option.label}</button>`;
    });

    html += `<button class="cta-secondary" onclick="finishQuiz()" style="${quizStep < 2 ? 'display:none;' : 'display:block;'}" id="finish-quiz">Finalizar e Ver Recomendação</button>`;

    document.getElementById('quiz-container').innerHTML = html;
}

function selectQuizAnswer(value) {
    quizAnswers[quizStep] = value;
    quizStep++;
    if (quizStep < 3) {
        showQuizStep();
    }
}

function finishQuiz() {
    let recommendation = '';
    const obj = quizAnswers[0];
    if (obj === 'idioma') recommendation = 'Cursos de Idiomas intensivos!';
    else if (obj === 'estudantil') recommendation = 'Intercâmbio Universitário com bolsas!';
    else recommendation = 'Programas de Trabalho como Working Holiday!';

    alert(`Recomendação Personalizada: ${recommendation}\n\nEntre em contato para detalhes!`);
    document.getElementById('quiz-container').style.display = 'none';
    document.querySelector('.quiz-section button').style.display = 'inline-flex';
}

// Modals
function openModal(id) {
    document.getElementById(`modal-${id}`).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(`modal-${id}`).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id.replace('modal-', ''));
        }
    });
});

// Form Submit
function handleFormSubmit(e) {
    e.preventDefault();
    // Simulate send
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Responderemos em breve.');
        e.target.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        closeModal('inscricao') || closeModal('consulta');
    }, 1500);
}

// Create Particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles-js');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.width = particle.style.height = (Math.random() * 4 + 1) + 'px';
        particlesContainer.appendChild(particle);
    }
}

// Typing Effect (already in CSS, but enhanced if needed)