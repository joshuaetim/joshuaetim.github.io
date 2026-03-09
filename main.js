// Initialize
document.documentElement.classList.remove('no-js');
document.getElementById('year').textContent = new Date().getFullYear();

// GSAP Setup
if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// Lenis Smooth Scroll
let lenis;
try {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            ScrollTrigger.scrollerProxy(document.body, {
                scrollTop(v) { return arguments.length ? lenis.scrollTo(v, { immediate: true }) : lenis.scroll; },
                getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
                pinType: document.body.style.transform ? 'transform' : 'fixed'
            });
        }
    }
} catch(e) { console.warn('Lenis:', e); }

// Custom Cursor
function initCursor() {
    try {
        const cursor = document.getElementById('cursor'), cursorDot = document.getElementById('cursor-dot');
        const hoverTriggers = document.querySelectorAll('.hover-trigger');
        let mX=0, mY=0, cX=0, cY=0;
        if (cursor && cursorDot) {
            document.addEventListener('mousemove', e => { mX=e.clientX; mY=e.clientY; cursorDot.style.left=mX+'px'; cursorDot.style.top=mY+'px'; });
            function animateCursor() { cX+=(mX-cX)*0.15; cY+=(mY-cY)*0.15; cursor.style.left=cX+'px'; cursor.style.top=cY+'px'; requestAnimationFrame(animateCursor); }
            animateCursor();
            hoverTriggers.forEach(el => {
                el.addEventListener('mouseenter',()=>cursor.classList.add('hovered'));
                el.addEventListener('mouseleave',()=>cursor.classList.remove('hovered'));
            });
        }
    } catch(e) { console.warn('Cursor:', e); }
}

// Preloader
function hidePreloader() {
    const p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
    triggerHeroAnimations();
}

function triggerHeroAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.to('.fade-in',{opacity:1,duration:1,ease:'power2.out',stagger:0.2});
        gsap.to('.fade-up',{opacity:1,y:0,duration:1,ease:'power3.out',stagger:0.15});
    } else {
        document.querySelectorAll('.fade-in,.fade-up').forEach(el => {
            el.style.opacity='1'; el.style.transform='none';
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.fade-up').forEach(el => {
            gsap.fromTo(el,{opacity:0,y:60},{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,scroller:document.body,start:'top 85%',toggleActions:'play none none none'}});
        });
    } else {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle'), menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu'), mobileLinks = document.querySelectorAll('.mobile-link');
    if (menuToggle && mobileMenu) {
        function toggleMenu() {
            mobileMenu.classList.toggle('translate-x-full');
            document.body.style.overflow = mobileMenu.classList.contains('translate-x-full') ? '' : 'hidden';
        }
        menuToggle.addEventListener('click', toggleMenu);
        if (menuClose) menuClose.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }
}

// Initialize on load
if (typeof gsap !== 'undefined') {
    window.addEventListener('load', () => {
        const spans = document.querySelectorAll('.preloader-text span');
        if (spans.length) {
            gsap.fromTo(spans, {y:100,opacity:0}, {y:0,opacity:1,duration:0.8,stagger:0.05,ease:'power3.out', onComplete:()=>setTimeout(hidePreloader,800)});
        } else { hidePreloader(); }
    });
    setTimeout(()=>{const p=document.getElementById('preloader'); if(p&&!p.classList.contains('hidden'))hidePreloader();},5000);
} else {
    window.addEventListener('load', hidePreloader);
}

// Initialize all
initCursor();
initScrollAnimations();
initMobileMenu();

// Resize handler
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('resize', () => ScrollTrigger.refresh());

// Reduced motion preference
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typeof gsap !== 'undefined') gsap.globalTimeline.timeScale(0.01);
    if (lenis) lenis.stop();
}
