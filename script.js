/**
 * AURA INVITATIONS - KATB KETAB (MAHMOUD & SALMA)
 */

const weddingData = {
    groom: "Mahmoud",
    bride: "Salma",
    targetDate: "October 8, 2026 20:00:00"
};

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initOpeningAnimation();
    initAudioSystem();
    initCountdown();
    initScrollAnimations();
});

// 1. DYNAMIC GOLD PARTICLES CANVAS
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.6,
            speedY: Math.random() * 0.4 + 0.15,
            speedX: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.6 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#D4AF37';

        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// 2. OPENING ENVELOPE
function initOpeningAnimation() {
    const btnOpen = document.getElementById('btnOpenInvitation');
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const openingScreen = document.getElementById('opening');
    const mainContent = document.getElementById('mainContent');

    const triggerOpen = () => {
        envelope.classList.add('open');
        setTimeout(() => {
            openingScreen.style.opacity = '0';
            openingScreen.style.transform = 'scale(1.05)';
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                openingScreen.style.display = 'none';
                triggerHeroTextAnimations();
            }, 1000);
        }, 1200);

        playAudio();
    };

    btnOpen.addEventListener('click', triggerOpen);
    waxSeal.addEventListener('click', triggerOpen);
}

// 3. AUDIO PLAYER
let isPlaying = false;
function initAudioSystem() {
    const audio = document.getElementById('weddingAudio');
    const btnMusic = document.getElementById('btnMusicToggle');

    btnMusic.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            btnMusic.classList.add('paused');
            isPlaying = false;
        } else {
            playAudio();
        }
    });
}

function playAudio() {
    const audio = document.getElementById('weddingAudio');
    const btnMusic = document.getElementById('btnMusicToggle');
    audio.play().then(() => {
        isPlaying = true;
        btnMusic.classList.remove('paused');
    }).catch(err => console.log("Audio playback deferred:", err));
}

// 4. COUNTDOWN TIMER
function initCountdown() {
    const target = new Date(weddingData.targetDate).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
            document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdownTimer').innerHTML = `<p class="section-title">THE MOMENT HAS ARRIVED</p>`;
        }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

// 5. SCROLL REVEAL ANIMATIONS
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));
}

function triggerHeroTextAnimations() {
    document.querySelectorAll('#hero .reveal-text').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 200);
    });
}