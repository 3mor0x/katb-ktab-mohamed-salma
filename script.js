/**
 * LUMIÈRE ARABIC - KATB KTAB EDITION
 * Connected to Firebase Realtime Database (wishes.json)
 */

// ==========================================
// كائن البيانات المركزية لكتب الكتاب
// ==========================================
const weddingData = {
    groom: "محمود",
    bride: "سلمى",
    date: "الخميس ٨ أكتوبر ٢٠٢٦",
    dateISO: "2026-10-08T20:00:00",
    time: "٠٨:٠٠ مساءً",
    venue: "مسجد المشير طنطاوي",
    hall: "قاعة السلام - Al Salam Hall",
    city: "القاهرة",
    googleMapsUrl: "https://maps.app.goo.gl/bfR3EQ5qBbwfPyZr9?g_st=iw",

    // FIREBASE ENDPOINT
    firebaseDbUrl: "https://wedding-apps-cc913-default-rtdb.firebaseio.com"
};

// ==========================================
// تهيئة التشغيل والربط
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initOpeningAnimation();
    initAudioSystem();
    initCountdown();
    initNavigation();
    initScrollAnimations();
    initGuestbook();
});

// 1. حركة فتح الظرف
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

// 2. الصوت والموسيقى
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
    }).catch(err => console.log("Audio play deferred: ", err));
}

// 3. العداد التنازلي
function initCountdown() {
    const targetDate = new Date(weddingData.dateISO).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
            document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdownTimer').innerHTML = `<p class="section-title">حَانَ المَوْعِدُ المَبَارَك</p>`;
        }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

// 4. القائمة
function initNavigation() {
    const btnNav = document.getElementById('btnNavToggle');
    const overlayNav = document.getElementById('overlayNav');
    const navLinks = document.querySelectorAll('.nav-link');

    btnNav.addEventListener('click', () => overlayNav.classList.toggle('active'));
    navLinks.forEach(link => link.addEventListener('click', () => overlayNav.classList.remove('active')));
}

// 5. انيميشن التمرير
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

// 6. سجل المباركات والتهاني (الربط بـ wishes.json)
function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const list = document.getElementById('guestbookList');
    const submitBtn = form.querySelector('button[type="submit"]');

    const renderNotes = async () => {
        list.innerHTML = `<p style="text-align:center; color: var(--color-sage); font-size: 0.8rem;">جاري تحميل المباركات...</p>`;

        try {
            const res = await fetch(`${weddingData.firebaseDbUrl}/wishes.json`);
            const data = await res.json();

            if (!data) {
                list.innerHTML = `
                    <div class="guestbook-note">
                        <div class="note-author">أحمد ونور</div>
                        <div class="note-message">"بارَكَ اللَّهُ لَكُما وبَارَكَ عَلَيْكُما وَجَمَعَ بَيْنَكُما فِي خَيْرٍ!"</div>
                        <div class="note-date">أكتوبر ٢٠٢٦</div>
                    </div>`;
                return;
            }

            const notes = Object.values(data).reverse();

            list.innerHTML = notes.map(note => `
                <div class="guestbook-note">
                    <div class="note-author">${escapeHtml(note.name)}</div>
                    <div class="note-message">"${escapeHtml(note.message)}"</div>
                    <div class="note-date">${note.date}</div>
                </div>
            `).join('');

        } catch (err) {
            console.error("Firebase fetch error:", err);
            list.innerHTML = `<p style="text-align:center; color: var(--color-sage);">تعذر تحميل التهاني.</p>`;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('gbName').value.trim();
        const message = document.getElementById('gbMessage').value.trim();

        if (!name || !message) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "جاري الإرسال...";

        const newNote = {
            name: name,
            message: message,
            date: "أكتوبر ٢٠٢٦",
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(`${weddingData.firebaseDbUrl}/wishes.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote)
            });

            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "إرسال التهنئة";
            renderNotes();
        } catch (err) {
            console.error("Firebase save error:", err);
            alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
            submitBtn.disabled = false;
            submitBtn.textContent = "إرسال التهنئة";
        }
    });

    renderNotes();
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}