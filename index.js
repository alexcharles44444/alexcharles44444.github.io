import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2HKsO-TrReCH-tC3ATDozuQzaPjIqR0g",
    authDomain: "jeremymusic-c117d.firebaseapp.com",
    projectId: "jeremymusic-c117d",
    storageBucket: "jeremymusic-c117d.firebasestorage.app",
    messagingSenderId: "103099955855",
    appId: "1:103099955855:web:c1bc1a4a36c604945b8efa",
    measurementId: "G-4QEVLNKMVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Import Realtime Database functions
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Initialize Realtime Database
const db = getDatabase(app);

// Newsletter subscription handler
document.addEventListener('DOMContentLoaded', () => {
    // Load About Me content from Realtime Database using separate short and extended paths
    try {
        const aboutEl = document.getElementById('aboutEditable');
        if (!aboutEl) return;

        const shortRef = ref(db, 'content/aboutme_short');
        const longRef = ref(db, 'content/aboutme_long');

        // build DOM containers
        aboutEl.innerHTML = '';
        const shortDiv = document.createElement('div');
        shortDiv.id = 'aboutShortContent';
        const longDiv = document.createElement('div');
        longDiv.id = 'aboutLongContent';
        longDiv.style.display = 'none';
        longDiv.style.marginTop = '8px';

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = 'aboutShowMoreBtn';
        btn.textContent = 'Show more';
        btn.style.marginTop = '8px';
        btn.style.display = 'none';

        btn.addEventListener('click', () => {
            if (longDiv.style.display === 'none') {
                longDiv.style.display = 'block';
                btn.textContent = 'Show less';
            } else {
                longDiv.style.display = 'none';
                btn.textContent = 'Show more';
            }
        });

        aboutEl.appendChild(shortDiv);
        aboutEl.appendChild(longDiv);
        aboutEl.appendChild(btn);

        // listen for short content
        onValue(shortRef, (snapshot) => {
            const val = snapshot && snapshot.exists() ? snapshot.val() : '';
            if (val) {
                shortDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
            } else {
                shortDiv.innerHTML = '';
            }
        }, (err) => console.error('Failed to read Short About Me', err));

        // listen for long content
        onValue(longRef, (snapshot) => {
            const val = snapshot && snapshot.exists() ? snapshot.val() : '';
            if (val) {
                longDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
                btn.style.display = 'inline-block';
                // reset to collapsed state when content changes
                longDiv.style.display = 'none';
                btn.textContent = 'Show more';
            } else {
                longDiv.innerHTML = '';
                btn.style.display = 'none';
            }
        }, (err) => console.error('Failed to read Extended About Me', err));

    } catch (err) {
        console.error('Error attaching About Me listeners', err);
    }

    // Load Performances content from Realtime Database at content/performances
    try {
        const perfEl = document.getElementById('perfEditable');
        const perfRef = ref(db, 'content/performances');
        onValue(perfRef, (snapshot) => {
            if (!perfEl) return;
            const val = snapshot && snapshot.exists() ? snapshot.val() : '';
            if (val) {
                const escaped = escapeHtml(val);
                perfEl.innerHTML = escaped.replace(/\n/g, '<br>');
            } else {
                perfEl.innerHTML = '';
            }
        }, (err) => console.error('Failed to read Performances content', err));
    } catch (err) {
        console.error('Error attaching Performances listener', err);
    }

    // Load New Album content from Realtime Database at content/newalbum
    try {
        const updatesEl = document.getElementById('updatesEditable');
        const newAlbumRef = ref(db, 'content/newalbum');
        onValue(newAlbumRef, (snapshot) => {
            if (!updatesEl) return;
            const val = snapshot && snapshot.exists() ? snapshot.val() : '';
            if (val) {
                const escaped = escapeHtml(val);
                updatesEl.innerHTML = escaped.replace(/\n/g, '<br>');
            } else {
                updatesEl.innerHTML = '';
            }
        }, (err) => console.error('Failed to read New Album content', err));
    } catch (err) {
        console.error('Error attaching New Album listener', err);
    }

    // Load Lyrics from Realtime Database at content/lyrics
    try {
        const lyricsDiv = document.getElementById('lyricsdiv');
        const lyricsRef = ref(db, 'content/lyrics');
        onValue(lyricsRef, (snapshot) => {
            if (!lyricsDiv) return;
            lyricsDiv.innerHTML = '';
            if (!snapshot || !snapshot.exists()) {
                lyricsDiv.textContent = 'No lyrics.';
                return;
            }
            const entries = [];
            snapshot.forEach((child) => {
                const data = child.val() || {};
                entries.push({ key: child.key, title: data.title || '', content: data.content || '', ts: data.ts || 0 });
            });
            // newest first by timestamp
            entries.sort((a, b) => b.ts - a.ts);
            entries.forEach((e) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'card lyric-card';
                const h = document.createElement('h3');
                h.textContent = e.title || 'Untitled';

                const contentDiv = document.createElement('div');
                const contentId = 'lyric-' + (e.key || Math.random().toString(36).slice(2, 9));
                contentDiv.id = contentId;
                contentDiv.className = 'lyric-content collapsed';
                contentDiv.innerHTML = escapeHtml(e.content || '').replace(/\n/g, '<br>');

                wrapper.appendChild(h);
                wrapper.appendChild(contentDiv);

                const toggleBtn = document.createElement('button');
                toggleBtn.type = 'button';
                toggleBtn.className = 'lyric-toggle';
                toggleBtn.textContent = 'Show more';
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.setAttribute('aria-controls', contentId);
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    // toggle
                    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
                    if (isExpanded) {
                        // was expanded -> collapse
                        contentDiv.classList.add('collapsed');
                        toggleBtn.textContent = 'Show more';
                    } else {
                        // was collapsed -> expand
                        contentDiv.classList.remove('collapsed');
                        toggleBtn.textContent = 'Show less';
                    }
                });

                wrapper.appendChild(toggleBtn);
                lyricsDiv.appendChild(wrapper);
            });
        }, (err) => console.error('Failed to read Lyrics', err));
    } catch (err) {
        console.error('Error attaching Lyrics listener', err);
    }

    // Load YouTube iframe URL from Realtime Database at content/youtubeiframe
    try {
        const iframeEl = document.querySelector('iframe.youtubeIframe');
        const ytRef = ref(db, 'content/youtubeiframe');
        onValue(ytRef, (snapshot) => {
            if (!iframeEl) return;
            const val = snapshot && snapshot.exists() ? snapshot.val() : '';
            if (val) {
                // basic safety: only set if it looks like an http(s) url
                if (/^https?:\/\//.test(val)) iframeEl.src = val;
            }
        }, (err) => console.error('Failed to read YouTube iframe URL', err));
    } catch (err) {
        console.error('Error attaching YouTube iframe listener', err);
    }

    // Load YouTube videos list from Realtime Database at content/youtubeiframes
    try {
        const videosRef = ref(db, 'content/youtubeiframes');
        onValue(videosRef, (snapshot) => {
            const videosDiv = document.getElementById('videosdiv');
            if (!videosDiv) return;
            videosDiv.innerHTML = '';
            if (!snapshot || !snapshot.exists()) {
                videosDiv.textContent = 'No videos.';
                return;
            }
            const entries = [];
            snapshot.forEach((child) => {
                const data = child.val() || {};
                entries.push({ url: data.url || '', ts: data.timestamp || 0 });
            });
            // newest first by timestamp
            entries.sort((a, b) => b.ts - a.ts);
            entries.forEach((e) => {
                const url = (e.url || '').trim();
                if (!url) return;
                if (/^https:\/\/www\.youtube\.com\/embed\//.test(url)) {
                    const iframe = document.createElement('iframe');
                    iframe.src = url;
                    iframe.className = 'youtubeIframe2';
                    iframe.setAttribute('title', 'YouTube video player');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                    iframe.allowFullscreen = true;
                    const wrapper = document.createElement('div');
                    wrapper.style.marginBottom = '24px';
                    wrapper.appendChild(iframe);
                    videosDiv.appendChild(wrapper);
                } else {
                    const a = document.createElement('a');
                    a.href = url;
                    a.textContent = url;
                    a.target = '_blank';
                    videosDiv.appendChild(a);
                }
            });
        }, (err) => console.error('Failed to read YouTube videos list', err));
    } catch (err) {
        console.error('Error attaching YouTube videos list listener', err);
    }

    // Load images saved in Realtime Database at content/images and populate slideshow
    try {
        const slidesRef = ref(db, 'content/images');
        onValue(slidesRef, (snapshot) => {
            const slidesContainer = document.querySelector('.slideshow .slides');
            if (!slidesContainer) return;
            slidesContainer.innerHTML = '';
            if (!snapshot || !snapshot.exists()) {
                // nothing to show
            } else {
                const items = [];
                snapshot.forEach((child) => {
                    const data = child.val() || {};
                    items.push({ key: child.key, data });
                });
                // sort by order (ascending). If no 'order', fall back to timestamp (ascending)
                items.sort((a, b) => {
                    const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
                    const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
                    return oa - ob;
                });
                items.forEach((item) => {
                    const data = item.data || {};
                    if (data && data.data) {
                        const img = document.createElement('img');
                        img.src = data.data;
                        img.className = 'slide';
                        img.alt = data.name || '';
                        slidesContainer.appendChild(img);
                    }
                });
            }
            if (typeof initSlideshows === 'function') {
                try { initSlideshows(); } catch (e) { console.error('Failed to re-init slideshows', e); }
            }
        }, (err) => console.error('Failed to read images', err));
    } catch (err) {
        console.error('Error attaching images listener', err);
    }
    const submitBtn = document.querySelector('.newsletter-submit');
    if (!submitBtn) return;
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailInput = document.querySelector('input[type="email"].newsletter-input');
        const phoneInput = document.querySelector('input[type="tel"].newsletter-input');
        const addressInput = document.getElementById('mailingAddress');
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const address = addressInput ? addressInput.value.trim() : '';
        if (!email && !phone && !address) {
            alert('Please enter an email or phone number or mailing address.');
            return;
        }
        try {
            const subscribersRef = ref(db, 'subscribers');
            const newSubRef = push(subscribersRef);
            await set(newSubRef, { email, phone, address });
            alert('Thank you for subscribing!');
            if (emailInput) emailInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (addressInput) addressInput.value = '';
        } catch (err) {
            alert('Subscription failed. Please try again later.');
            console.error(err);
        }
    });

    // Testimonials: read and write to Realtime Database under 'testimonials'

    const listEl = document.getElementById('testimonials-list');
    const nameInput = document.getElementById('testimonial-name');
    const commentInput = document.getElementById('testimonial-comment');
    if (!listEl || !nameInput || !commentInput) return;

    const testimonialsRef = ref(db, 'testimonials');

    function escapeHtml(str = '') {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderSnapshot(snapshot) {
        listEl.innerHTML = '';
        const entries = [];
        snapshot.forEach((child) => {
            entries.push(child.val());
        });
        // show newest first
        entries.reverse();
        entries.forEach((data) => {
            const item = document.createElement('div');
            item.className = 'testimonial-item';
            item.style.padding = '8px 0';
            item.innerHTML = `\n                <div style="font-weight:600">${escapeHtml(data.name || 'Anonymous')}</div>\n                <div style="font-size:12px; color:#666">${escapeHtml(data.date || '')}</div>\n                <div style="margin-top:6px">${escapeHtml(data.comment || '')}</div>\n            `;
            listEl.appendChild(item);
        });
        // After rendering, (re)initialize the testimonials slideshow
        setupTestimonialsSlideshow();
    }

    // listen for changes
    onValue(testimonialsRef, (snapshot) => {
        renderSnapshot(snapshot);
    }, (err) => console.error('Failed to read testimonials', err));

    const testimonialsRef2 = ref(db, 'testimonialsPending');
    let submitButton = document.getElementById("testimonialSubmit");
    submitButton.addEventListener("click", async function () {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();
        if (!comment) {
            alert('Please enter a comment.');
            return;
        }
        const d = new Date();
        const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
        try {
            const newRef = push(testimonialsRef2);
            await set(newRef, { name, date: dateStr, comment });
            nameInput.value = '';
            commentInput.value = '';
            alert("Thank you for posting! Your testimonial will be reviewed.")
        } catch (err) {
            console.error('Failed to post testimonial', err);
            alert('Failed to post testimonial. Please try again later.');
        }
    });

    // Tab switching: show/hide pages and mark active tab
    (function setupTabs() {
        const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
        const pages = Array.from(document.querySelectorAll('.page'));
        const keyToId = {
            'home': 'homepage',
            'videos': 'videospage',
            'lyrics': 'lyricspage',
            'store': 'storepage'
        };

        const idToKey = Object.fromEntries(Object.entries(keyToId).map(([k, v]) => [v, k]));

        function showPageById(id) {
            pages.forEach(p => {
                if (p.id === id) {
                    p.style.display = '';
                } else {
                    p.style.display = 'none';
                }
            });
        }

        function setActiveButton(activeBtn) {
            tabButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeBtn);
                btn.setAttribute('aria-pressed', btn === activeBtn ? 'true' : 'false');
            });
        }

        // Read the desired tab from the URL (#tab or ?tab=)
        function getKeyFromUrl() {
            let key = '';
            if (location.hash && location.hash.length > 1) {
                key = location.hash.slice(1).toLowerCase();
            } else {
                const params = new URLSearchParams(location.search);
                if (params.has('tab')) key = String(params.get('tab') || '').toLowerCase();
            }
            if (!key || !keyToId[key]) return 'home';
            return key;
        }

        function setUrlKey(key, replace = false) {
            const newHash = '#' + key;
            const url = location.pathname + location.search + newHash;
            if (replace) history.replaceState({ tab: key }, '', url);
            else history.pushState({ tab: key }, '', url);
        }

        function showKey(key, replace = false) {
            const targetId = keyToId[key] || keyToId['home'];
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                showPageById(targetId);
            } else {
                showPageById('homepage');
            }
            const btn = tabButtons.find(b => b.textContent.trim().toLowerCase() === key);
            setActiveButton(btn || null);
            // Update URL so users can share / bookmark
            setUrlKey(key, replace);
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.textContent.trim().toLowerCase();
                showKey(key);
            });
        });

        // Handle back/forward navigation and manual hash changes
        window.addEventListener('popstate', () => {
            const keyFromState = (history.state && history.state.tab) ? history.state.tab : null;
            const key = keyFromState || getKeyFromUrl();
            const btn = tabButtons.find(b => b.textContent.trim().toLowerCase() === key);
            const tid = keyToId[key] || keyToId['home'];
            const targetEl = document.getElementById(tid);
            if (targetEl) showPageById(tid);
            setActiveButton(btn || null);
        });

        window.addEventListener('hashchange', () => {
            const key = getKeyFromUrl();
            const btn = tabButtons.find(b => b.textContent.trim().toLowerCase() === key);
            const tid = keyToId[key] || keyToId['home'];
            const targetEl = document.getElementById(tid);
            if (targetEl) showPageById(tid);
            setActiveButton(btn || null);
        });

        // initialize: pick tab from URL if present, else default to home
        const initialKey = getKeyFromUrl();
        const initialBtn = tabButtons.find(b => b.textContent.trim().toLowerCase() === initialKey)
            || tabButtons.find(b => b.textContent.trim().toLowerCase() === 'home')
            || tabButtons[0];
        const keyToShow = initialBtn ? initialBtn.textContent.trim().toLowerCase() : initialKey;
        showKey(keyToShow, true);
    })();
});



// Slideshow initialization
function initSlideshows() {
    const carousels = document.querySelectorAll('.slideshow');
    carousels.forEach((el) => {
        const slides = Array.from(el.querySelectorAll('.slide'));
        if (!slides.length) return;

        const indicators = el.querySelector('.sl-indicators');
        const prevBtn = el.querySelector('.sl-prev');
        const nextBtn = el.querySelector('.sl-next');
        const playBtn = el.querySelector('.sl-play');
        const pauseBtn = el.querySelector('.sl-pause');
        const autoplayAttr = el.dataset.autoplay === 'true';
        const interval = parseInt(el.dataset.interval || '4000', 10);

        let current = 0;
        let timer = null;

        // build indicators
        indicators.innerHTML = "";
        slides.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.title = `Slide ${i + 1}`;
            btn.addEventListener('click', () => { show(i); pause(); });
            indicators.appendChild(btn);
        });

        function updateIndicators() {
            const nodes = indicators.querySelectorAll('button');
            nodes.forEach((b, idx) => b.setAttribute('aria-selected', idx === current ? 'true' : 'false'));
        }

        function show(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            slides.forEach((s, i) => {
                s.classList.toggle('active', i === index);
            });
            current = index;
            updateIndicators();
        }

        function next() { show(current + 1); }
        function prev() { show(current - 1); }

        function play() {
            if (timer) return;
            timer = setInterval(next, interval);
            el.classList.add('playing');
        }

        function pause() {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
            el.classList.remove('playing');
        }

        // attach controls
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); pause(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pause(); });
        if (playBtn) playBtn.addEventListener('click', () => play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => pause());

        // keyboard support
        el.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); pause(); }
            if (e.key === 'ArrowRight') { next(); pause(); }
            if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); timer ? pause() : play(); }
        });

        // pause on hover
        el.addEventListener('mouseenter', () => pause());
        el.addEventListener('mouseleave', () => { if (autoplayAttr) play(); });

        // show first slide
        show(0);
        if (autoplayAttr) play();
    });
}

// Initialize when DOM ready
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSlideshows);
else initSlideshows();

// Testimonial slideshow logic
let _testimonialTimer = null;
let _testimonialCurrent = 0;
let _testimonialItems = [];
function setupTestimonialsSlideshow() {
    const list = document.getElementById('testimonials-list');
    if (!list) return;
    _testimonialItems = Array.from(list.querySelectorAll('.testimonial-item'));
    if (!_testimonialItems.length) {
        // no items, clear timer
        if (_testimonialTimer) { clearInterval(_testimonialTimer); _testimonialTimer = null; }
        return;
    }

    // hide all except current (or 0)
    if (_testimonialCurrent >= _testimonialItems.length) _testimonialCurrent = 0;
    _testimonialItems.forEach((it, i) => { it.style.display = i === _testimonialCurrent ? 'block' : 'none'; });

    // reset timer
    if (_testimonialTimer) { clearInterval(_testimonialTimer); _testimonialTimer = null; }
    _testimonialTimer = setInterval(() => { showTestimonial(_testimonialCurrent + 1); }, 3000);

    // attach controls (reset handlers safely)
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    if (prevBtn) { prevBtn.onclick = () => { showTestimonial(_testimonialCurrent - 1); resetTestimonialTimer(); }; }
    if (nextBtn) { nextBtn.onclick = () => { showTestimonial(_testimonialCurrent + 1); resetTestimonialTimer(); }; }
}

function showTestimonial(index) {
    if (!_testimonialItems.length) return;
    if (index < 0) index = _testimonialItems.length - 1;
    if (index >= _testimonialItems.length) index = 0;
    _testimonialItems.forEach((it, i) => { it.style.display = i === index ? 'block' : 'none'; });
    _testimonialCurrent = index;
}

function resetTestimonialTimer() {
    if (_testimonialTimer) { clearInterval(_testimonialTimer); _testimonialTimer = null; }
    _testimonialTimer = setInterval(() => { showTestimonial(_testimonialCurrent + 1); }, 3000);
}
