import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase config (same as index.js)
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
const db = getDatabase(app);

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    let bioDiv = document.getElementById("bioEditable");
    const bioRef = ref(db, 'content/epk/bio');
    onValue(bioRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            bioDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            bioDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Short About Me', err));

    let contactDiv = document.getElementById("contactEditable");
    const contactRef = ref(db, 'content/epk/contact');
    onValue(contactRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            contactDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            contactDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Contact Info', err));

    // Load photos from Realtime Database path 'content/epk/images'
    // (function loadPhotos() {
    //     const photosDiv = document.getElementById('photosdiv');
    //     if (!photosDiv) return;
    //     const photosRef = ref(db, 'content/epk/images');
    //     onValue(photosRef, (snapshot) => {
    //         const val = snapshot && snapshot.exists() ? snapshot.val() : null;
    //         photosDiv.innerHTML = '';
    //         if (!val) return;

    //         const entries = Array.isArray(val) ? val.map((v, i) => [i, v]) : Object.entries(val);
    //         entries.forEach(([key, item]) => {
    //             let src = '';
    //             let alt = '';
    //             if (typeof item === 'string') {
    //                 src = item;
    //                 alt = `Photo ${key}`;
    //             } else if (item && typeof item === 'object') {
    //                 src = item.data || item.url || item.src || '';
    //                 alt = item.alt || item.title || item.name || `Photo ${key}`;
    //             }
    //             if (!src) return;

    //             const wrapper = document.createElement('div');
    //             wrapper.className = 'photo-card';
    //             const img = document.createElement('img');
    //             img.src = src;
    //             img.alt = alt;
    //             img.loading = 'lazy';
    //             wrapper.appendChild(img);
    //             photosDiv.appendChild(wrapper);
    //         });
    //     }, (err) => console.error('Failed to read photos', err));
    // })();
    // Load cover image from Realtime Database at content/epk/coverImage
    try {
        const photosdiv = document.getElementById('photosdiv');
        if (photosdiv) {
            const coverImageRef = ref(db, 'content/epk/coverImage');
            onValue(coverImageRef, (snapshot) => {
                photosdiv.innerHTML = '';
                if (!snapshot || !snapshot.exists()) return;
                const data = snapshot.val() || {};
                if (data && data.data) {
                    const img = document.createElement('img');
                    img.src = data.data;
                    img.alt = data.name || 'Cover Image';
                    img.style.width = '100%';
                    photosdiv.appendChild(img);
                }
            }, (err) => console.error('Failed to read cover image', err));
        }
    } catch (err) {
        console.error('Error attaching cover image listener', err);
    }

    // Tab switching: show/hide pages and mark active tab
    (function setupTabs() {
        const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
        const pages = Array.from(document.querySelectorAll('.page'));
        const keyToId = {
            'home': 'homepage',
            'photos': 'photospage',
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

    // Load YouTube videos list from Realtime Database at content/youtubeiframes
    try {
        const videosRef = ref(db, 'content/epk/youtubeiframes');
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

    let TourDiv = document.getElementById("tourHistoryEditable");
    const TourRef = ref(db, 'content/epk/tourHistory');
    onValue(TourRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            TourDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            TourDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Tour History', err));

    let accoladesDiv = document.getElementById("accoladesEditable");
    const accoladesRef = ref(db, 'content/epk/accolades');
    onValue(accoladesRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            accoladesDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            accoladesDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Accolades', err));

    let pressClippingsDiv = document.getElementById("pressClippingsEditable");
    const pressClippingsRef = ref(db, 'content/epk/pressClippings');
    onValue(pressClippingsRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            pressClippingsDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            pressClippingsDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Press Clippings', err));

    let assetTextDiv = document.getElementById("assetTextEditable");
    const assetTextRef = ref(db, 'content/epk/assetText');
    onValue(assetTextRef, (snapshot) => {
        const val = snapshot && snapshot.exists() ? snapshot.val() : '';
        if (val) {
            assetTextDiv.innerHTML = escapeHtml(val).replace(/\n/g, '<br>');
        } else {
            assetTextDiv.innerHTML = '';
        }
    }, (err) => console.error('Failed to read Asset Text', err));

    // Load Asset Images from Realtime Database at content/epk/assetImages
    try {
        const assetImagesDiv = document.getElementById('assetImagesEditable');
        const assetImagesRef = ref(db, 'content/epk/assetImages');
        onValue(assetImagesRef, (snapshot) => {
            if (!assetImagesDiv) return;
            assetImagesDiv.innerHTML = '';
            if (!snapshot || !snapshot.exists()) {
                assetImagesDiv.textContent = 'No assets.';
                return;
            }
            const entries = [];
            snapshot.forEach((child) => {
                const data = child.val() || {};
                entries.push({ data: data.data || '', name: data.name || '', ts: data.timestamp || 0, order: data.order });
            });
            // Sort by 'order' (ascending). If no 'order', fall back to timestamp (ascending)
            entries.sort((a, b) => {
                const oa = (typeof a.order !== 'undefined') ? a.order : (a.ts || 0);
                const ob = (typeof b.order !== 'undefined') ? b.order : (b.ts || 0);
                return oa - ob;
            });
            entries.forEach((e) => {
                const src = (e.data || '').trim();
                if (!src) return;
                const wrapper = document.createElement('div');
                wrapper.style.marginBottom = '12px';
                const img = document.createElement('img');
                img.src = src;
                img.alt = e.name || 'Asset Image';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                wrapper.appendChild(img);
                assetImagesDiv.appendChild(wrapper);
            });
        }, (err) => console.error('Failed to read Asset Images', err));
    } catch (err) {
        console.error('Error attaching Asset Images listener', err);
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

    try {
        const slidesRef = ref(db, 'content/epk/images');
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
});