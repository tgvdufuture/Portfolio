import './style.css'
import './animations.css'
import './responsive.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

// --- LOADER LOGIC ---
const loader = document.querySelector('#loader');
const loaderBar = document.querySelector('.loader-bar');
const loaderCounter = document.querySelector('.loader-counter');

// Empêcher le scroll et cacher le curseur pendant le chargement
document.body.style.overflow = 'hidden';
gsap.set(".cursor", { opacity: 0 });
gsap.set(".fleche", { xPercent: -50 });

let loaderValue = { value: 0 };
const loaderTimeline = gsap.timeline({
  onComplete: () => {
    // Une fois le chargement fini, on anime la sortie
    gsap.timeline()
      .to(".loader-content", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut"
      })
      .to(loader, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
      }, "+=0.2")
      .set(loader, { display: 'none' })
      .set("body", { overflow: 'auto' })
      .from("nav", {
        yPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.5")
      .to(".cursor", {
        opacity: 1,
        duration: 0.5
      }, "-=0.5")
      .from(".hero h1, .hero .img-wrapper, .hero h2, .hero p, .hero .fleche", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.8")
      .add(() => {
        // Refresh ScrollTrigger once everything is in place
        ScrollTrigger.refresh();
        // Petite animation de flottement pour la flèche
        gsap.to(".fleche", {
            y: "+=15",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
      });
  }
});

loaderTimeline.to(loaderValue, {
  value: 100,
  duration: 2.5,
  ease: "power1.inOut",
  onUpdate: () => {
    const roundedValue = Math.round(loaderValue.value);
    loaderCounter.textContent = `${roundedValue}%`;
    loaderBar.style.width = `${roundedValue}%`;
  }
});

// --- FIN LOADER LOGIC ---

const lenis = new Lenis({
  autoRaf: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
 
// Gestion du scroll fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      // Gestion des offsets personnalisés selon la section
      let offset = 0;
      if (targetId === '#hero') {
        offset = -200;
      } else if (targetId === '#a-propos') {
        offset = -100; 
      } else if (targetId === '#selected-works') {
        offset = 50; 
      }
      
      lenis.scrollTo(target, { offset: offset });
    }
  });
});

// --- ANIMATIONS REVEAL SECTION ABOUT ---
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+1234567890";

function scrambleText(element) {
  // On stocke le texte original la première fois pour ne jamais le perdre
  if (!element.dataset.value) {
    element.dataset.value = element.innerText;
  }
  
  const originalText = element.dataset.value;
  let iteration = 0;
  
  // Si une animation est déjà en cours, on l'arrête pour recommencer proprement
  if (element.scrambleInterval) {
    clearInterval(element.scrambleInterval);
  }
  
  element.scrambleInterval = setInterval(() => {
    element.innerText = originalText
      .split("")
      .map((char, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");
    
    if (iteration >= originalText.length) {
      clearInterval(element.scrambleInterval);
      element.innerText = originalText; // On s'assure que le texte final est parfait
    }
    
    iteration += 1 / 1.5; // On ralentit un peu pour que ce soit plus lisible et fluide
  }, 30);
}

// Animation reveal titres, paragraphes et listes
gsap.utils.toArray(".about-text hr, .about-text p, .selected-works h1, .works-list li, .skills h1, .skills h3, .skills .grid > div, .contact h1").forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 95%",
      toggleActions: "play reverse play reverse"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });
});

// Scramble effect pour les titres (désactivé sur mobile < 768px)
const sectionTitles = document.querySelectorAll(".about-text h1, .selected-works h1, .skills h1, .contact h1");
if (sectionTitles.length > 0) {
  let mm = gsap.matchMedia();
  mm.add("(min-width: 769px)", () => {
    sectionTitles.forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: "top 95%",
            onEnter: () => scrambleText(title),
            onEnterBack: () => scrambleText(title)
        });
    });
  });
}


// Effet de mouvement sur le titre PORTFOLIO
const heroTitles = document.querySelectorAll('.hero h1');
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  // Calcul du mouvement (plus ou moins fort selon vos envies)
  const xMove = (clientX / window.innerWidth - 0.5) * 30;
  const yMove = (clientY / window.innerHeight - 0.5) * 30;

  heroTitles.forEach((title, index) => {
    const factor = index === 0 ? 1 : 1.4; // Parallaxe entre les deux titres
    gsap.to(title, {
      x: xMove * factor,
      y: yMove * factor,
      duration: 0.8,
      ease: "power2.out"
    });
  });
});

const cursor = document.querySelector('.cursor');
const xTo = gsap.quickTo(cursor, "left", {duration: 0.4, ease: "power3"});
const yTo = gsap.quickTo(cursor, "top", {duration: 0.4, ease: "power3"});

window.addEventListener('mousemove', e => {
    xTo(e.clientX);
    yTo(e.clientY);
});

// --- INTERACTIVE CARDS IN ABOUT SECTION ---
document.querySelectorAll('.zone').forEach(zone => {
    const card = zone.querySelector('.discovery-card');
    
    zone.addEventListener('mousemove', (e) => {
        const rect = zone.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
            x: x * 0.2, // Faible intensité pour le suivi
            y: y * 0.2,
            xPercent: -50,
            yPercent: -50,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
    
    zone.addEventListener('mouseleave', () => {
        gsap.to(card, {
            x: 0,
            y: 0,
            xPercent: -50,
            yPercent: -50,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// Effets au survol des éléments interactifs (Délégation d'événement)
window.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) {
        gsap.to(cursor, {
            scale: 1.5,
            backgroundColor: "rgba(19, 41, 62, 0.1)",
            duration: 0.3
        });
    }
});

window.addEventListener('mouseout', e => {
    if (e.target.closest('a, button')) {
        gsap.to(cursor, {
            scale: 1,
            backgroundColor: "transparent",
            duration: 0.3
        });
    }
});

// --- WAVE PARTICLE SYSTEM ---
const canvas = document.getElementById('waves-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000, radius: 150 };

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.initialX = x;
            this.initialY = y;
            this.baseX = x;
            this.baseY = y;
            this.size = 1.5;
            this.density = (Math.random() * 20) + 5;
        }
        draw() {
            ctx.fillStyle = 'rgba(19, 41, 62, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            // Mouvement de vague permanent
            let time = Date.now() * 0.002;
            this.baseY = this.initialY + Math.sin(time + this.initialX * 0.01) * 15;
            this.baseX = this.initialX + Math.cos(time + this.initialY * 0.01) * 10;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 15;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 15;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        let gap = 20;
        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    window.addEventListener('resize', resizeCanvas);
    
    resizeCanvas();
    animateParticles();
}

// --- SELECTED WORKS INTERACTION ---
const projectItems = document.querySelectorAll('.works-list li');
const previewImg = document.getElementById('project-preview-img');
const previewLink = document.getElementById('project-preview-link');
const worksPreview = document.querySelector('.works-preview');

if (projectItems.length > 0) {
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            const link = item.getAttribute('data-link');
            const isAvailable = item.getAttribute('data-available') !== 'false';
            
            // On met à jour le contenu
            if (previewImg) {
                previewImg.src = imgSrc;
                previewImg.style.display = 'block'; // On garde l'aperçu visible
            }
            if (previewLink) {
                previewLink.href = isAvailable ? link : '#';
                previewLink.setAttribute('data-available', isAvailable ? 'true' : 'false');
            }
            
            // On affiche le preview
            worksPreview.classList.add('active');
            
            // Petit effet d'entrée de l'image avec GSAP
            gsap.fromTo(previewImg, 
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        });
        
        item.addEventListener('mouseleave', () => {
            // Optionnel
        });

        item.addEventListener('click', (e) => {
            const isAvailable = item.getAttribute('data-available') !== 'false';
            if (!isAvailable) {
                e.preventDefault();
                showUnavailableModal();
                return;
            }
            const link = item.getAttribute('data-link');
            if (link && link !== "#") window.open(link, '_blank');
        });
    });

    // --- MODAL LOGIC ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const closeBtnModal = document.querySelector('.close-btn-modal');

    function showUnavailableModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scroll
    }

    function hideUnavailableModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Resume scroll
    }

    if (modalClose) modalClose.addEventListener('click', hideUnavailableModal);
    if (closeBtnModal) closeBtnModal.addEventListener('click', hideUnavailableModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) hideUnavailableModal();
        });
    }
    
    // On cache le preview si on quitte la zone des projets
    const worksContainer = document.querySelector('.works-container');
    if (worksContainer) {
        worksContainer.addEventListener('mouseleave', () => {
            worksPreview.classList.remove('active');
        });
    }
}

// --- CONTACT SECTION INTERACTION ---
const contactItems = document.querySelectorAll('.contact-list li');
const contactPreviewImg = document.getElementById('contact-preview-img');
const contactPreview = document.querySelector('.contact-preview');

if (contactItems.length > 0) {
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            
            if (contactPreviewImg) contactPreviewImg.src = imgSrc;
            contactPreview.classList.add('active');
            
            gsap.fromTo(contactPreviewImg, 
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        });
        
        item.addEventListener('click', () => {
            const link = item.getAttribute('data-link');
            if (link && link !== "#") {
                if (link.startsWith('mailto:')) {
                    window.location.href = link;
                } else {
                    window.open(link, '_blank');
                }
            }
        });
    });
    
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        contactContainer.addEventListener('mouseleave', () => {
            contactPreview.classList.remove('active');
        });
    }
}

// Extension du curseur sur les projets et contacts
const allInteractiveItems = [
    ...Array.from(projectItems),
    ...Array.from(contactItems),
    previewLink
];

allInteractiveItems.forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', () => {
        const isContact = el.closest('.contact-list');
        const isProjectItem = el.closest('.works-list li');
        const isProjectPreview = el.id === 'project-preview-link';
        const isAvailable = (isProjectItem || isProjectPreview) ? (el.getAttribute('data-available') !== 'false') : true;

        if ((isProjectItem || isProjectPreview) && !isAvailable) {
            gsap.to(cursor, {
                scale: 2.2, // Back to normal project scale
                backgroundColor: "rgba(19, 41, 62, 0.05)",
                backdropFilter: "blur(4px)",
                duration: 0.3
            });
            cursor.innerHTML = `<span style="font-size: 8px; color: #13293E; font-family: Rubik; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; font-weight: 500;">VOIR</span>`;
        } else {
            gsap.to(cursor, {
                scale: 2.2,
                backgroundColor: "rgba(19, 41, 62, 0.05)",
                backdropFilter: "blur(4px)",
                duration: 0.3
            });
            cursor.innerHTML = `<span style="font-size: 8px; color: #13293E; font-family: Rubik; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; font-weight: 500;">${isContact ? 'CONTACTER' : 'VOIR'}</span>`;
        }
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            duration: 0.3
        });
        cursor.innerHTML = '';
    });
});