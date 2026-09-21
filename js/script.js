/**
 * AKKADAN MUSIX — CLIENT SCRIPT
 * Brand: AKKADAN MUSIX
 * Tagline: Music • Production • Sound
 * 
 * Features:
 * - Reusable HTML5 Audio Player with Web Audio API instant fallback synthesizer
 * - Sticky blurred navigation with scroll spy
 * - Mobile drawer navigation
 * - Dynamic portfolio category filtering
 * - Interactive hero audio visualizer canvas
 * - Contact form validation and feedback
 * - Scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroVisualizer();
  initPortfolioFilter();
  initAudioPlayer();
  initContactForm();
  initScrollReveal();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky navbar with background blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  // Mobile menu toggle
  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenu || !mobileToggle) return;
    const isOpen = forceClose ? false : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('active', isOpen);
    mobileBackdrop?.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  }

  mobileToggle?.addEventListener('click', () => toggleMobileMenu());
  mobileBackdrop?.addEventListener('click', () => toggleMobileMenu(true));

  // Close mobile menu on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });

  // Close drawer on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu?.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });
  });

  // Scroll spy active link updater
  function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`)
          .forEach(el => el.classList.add('active'));
      } else {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`)
          .forEach(el => el.classList.remove('active'));
      }
    });
  }
}

/* ==========================================================================
   2. HERO WAVEFORM & EQUALIZER CANVAS
   ========================================================================== */
function initHeroVisualizer() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight * 0.65 : 300;
  }

  resize();
  window.addEventListener('resize', resize);

  let phase = 0;
  const waves = [
    { freq: 0.008, amp: 45, speed: 0.02, color: 'rgba(37, 99, 235, 0.45)', width: 2 },
    { freq: 0.012, amp: 30, speed: 0.025, color: 'rgba(56, 189, 248, 0.55)', width: 2.5 },
    { freq: 0.006, amp: 60, speed: 0.015, color: 'rgba(14, 165, 233, 0.35)', width: 1.5 },
    { freq: 0.015, amp: 20, speed: 0.035, color: 'rgba(240, 246, 255, 0.25)', width: 1 },
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);
    phase += 0.02;

    const baseLine = height * 0.65;

    waves.forEach(w => {
      ctx.beginPath();
      ctx.lineWidth = w.width;
      ctx.strokeStyle = w.color;

      for (let x = 0; x < width; x += 4) {
        const envelope = Math.sin((x / width) * Math.PI); // Pin ends to zero
        const y = baseLine + Math.sin(x * w.freq + phase * (w.speed * 40)) * w.amp * envelope;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // Draw equalizer bars at bottom center
    const barCount = 48;
    const barWidth = 3;
    const barGap = 6;
    const totalBarsWidth = barCount * (barWidth + barGap);
    const startX = (width - totalBarsWidth) / 2;

    for (let i = 0; i < barCount; i++) {
      const factor = Math.sin((i / barCount) * Math.PI);
      const dynamicHeight = (Math.sin(phase * 2 + i * 0.3) * 0.5 + 0.5) * 35 * factor + 5;
      const x = startX + i * (barWidth + barGap);
      const y = height - dynamicHeight - 10;

      const grad = ctx.createLinearGradient(0, y, 0, height);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0.15)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, dynamicHeight);
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   3. PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tab');
  const cards = document.querySelectorAll('.work-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. AUDIO PLAYER COMPONENT
   ========================================================================== */
/**
 * Track catalogue definition.
 * Note for owner: To use your own recordings, place your audio files in /audio/
 * and update the `audio` file paths below.
 */
const TRACKS = [
  {
    id: 1,
    title: 'Midnight Velvet',
    category: 'Music Production',
    durationStr: '3:42',
    durationSec: 222,
    audio: '/audio/project-01.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
    theme: 'lofi',
  },
  {
    id: 2,
    title: 'Echoes of Silence',
    category: 'Cover Songs',
    durationStr: '4:15',
    durationSec: 255,
    audio: '/audio/project-02.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    theme: 'acoustic',
  },
  {
    id: 3,
    title: 'Nocturne in C Minor',
    category: 'Piano Covers',
    durationStr: '2:58',
    durationSec: 178,
    audio: '/audio/project-03.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1520523839898-50712743e9a7?auto=format&fit=crop&w=400&q=80',
    theme: 'piano',
  },
  {
    id: 4,
    title: 'Aura Cinematic Spark',
    category: 'Advertisement Scores',
    durationStr: '1:30',
    durationSec: 90,
    audio: '/audio/project-04.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    theme: 'trailer',
  },
  {
    id: 5,
    title: 'Horizon Pulse',
    category: 'Background Scores',
    durationStr: '3:10',
    durationSec: 190,
    audio: '/audio/project-05.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=400&q=80',
    theme: 'ambient',
  },
  {
    id: 6,
    title: 'Neural Frequency',
    category: 'Sound Design',
    durationStr: '2:24',
    durationSec: 144,
    audio: '/audio/project-06.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    theme: 'synth',
  },
];

class AkkadanAudioPlayer {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isSynthetic = false;
    this.synthInterval = null;
    this.syntheticTime = 0;
    this.audioCtx = null;
    this.synthOsc = null;
    this.synthGain = null;

    // Elements
    this.playerContainer = document.getElementById('global-audio-player');
    this.thumbnailEl = document.getElementById('player-thumb');
    this.titleEl = document.getElementById('player-track-title');
    this.categoryEl = document.getElementById('player-track-category');
    this.playPauseBtn = document.getElementById('player-play-pause-btn');
    this.prevBtn = document.getElementById('player-prev-btn');
    this.nextBtn = document.getElementById('player-next-btn');
    this.progressBar = document.getElementById('player-progress-bar');
    this.progressFill = document.getElementById('player-progress-fill');
    this.currentTimeEl = document.getElementById('player-current-time');
    this.durationEl = document.getElementById('player-duration');
    this.volumeSlider = document.getElementById('player-volume-slider');
    this.volumeBtn = document.getElementById('player-volume-btn');
    this.closeBtn = document.getElementById('player-close-btn');

    this.lastVolume = 0.8;
    this.audioElement.volume = this.lastVolume;
    if (this.volumeSlider) this.volumeSlider.value = this.lastVolume;

    this.initEvents();
  }

  initEvents() {
    // Play/Pause button
    this.playPauseBtn?.addEventListener('click', () => {
      this.togglePlay();
    });

    // Prev / Next
    this.prevBtn?.addEventListener('click', () => {
      this.playPrev();
    });
    this.nextBtn?.addEventListener('click', () => {
      this.playNext();
    });

    // Close / Dock player
    this.closeBtn?.addEventListener('click', () => {
      this.pause();
      this.playerContainer?.classList.remove('active');
    });

    // Audio element native events
    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.isSynthetic) {
        this.updateProgress(this.audioElement.currentTime, this.audioElement.duration || 0);
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.playNext();
    });

    this.audioElement.addEventListener('error', () => {
      // Fallback seamlessly to web audio preview tone so user hears actual sound immediately
      this.startSyntheticPreview();
    });

    // Progress bar seeking
    this.progressBar?.addEventListener('click', (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const track = TRACKS[this.currentTrackIndex];
      const targetDuration = (this.audioElement.duration && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0)
        ? this.audioElement.duration
        : track.durationSec;

      const seekTime = percentage * targetDuration;
      if (this.isSynthetic) {
        this.syntheticTime = seekTime;
        this.updateProgress(this.syntheticTime, targetDuration);
      } else {
        this.audioElement.currentTime = seekTime;
      }
    });

    // Volume controls
    this.volumeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.setVolume(val);
    });

    this.volumeBtn?.addEventListener('click', () => {
      if (this.audioElement.volume > 0) {
        this.lastVolume = this.audioElement.volume;
        this.setVolume(0);
      } else {
        this.setVolume(this.lastVolume || 0.8);
      }
    });

    // Card play button bindings
    document.querySelectorAll('.play-work-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const trackId = parseInt(btn.getAttribute('data-track-id') || '1', 10);
        const trackIndex = TRACKS.findIndex(t => t.id === trackId);
        if (trackIndex !== -1) {
          if (this.currentTrackIndex === trackIndex && this.isPlaying) {
            this.pause();
          } else {
            this.loadAndPlay(trackIndex);
          }
        }
      });
    });
  }

  setVolume(val) {
    this.audioElement.volume = val;
    if (this.volumeSlider) this.volumeSlider.value = val;
    if (this.synthGain) this.synthGain.gain.setValueAtTime(val * 0.15, this.audioCtx ? this.audioCtx.currentTime : 0);

    // Update volume icon
    if (this.volumeBtn) {
      if (val === 0) {
        this.volumeBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>`;
      } else {
        this.volumeBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>`;
      }
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  updateProgress(current, duration) {
    const validDuration = duration > 0 ? duration : TRACKS[this.currentTrackIndex].durationSec;
    const pct = Math.min(100, Math.max(0, (current / validDuration) * 100));
    if (this.progressFill) this.progressFill.style.width = `${pct}%`;
    if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(current);
    if (this.durationEl) this.durationEl.textContent = this.formatTime(validDuration);
  }

  loadAndPlay(index) {
    this.currentTrackIndex = index;
    const track = TRACKS[this.currentTrackIndex];

    this.playerContainer?.classList.add('active');
    if (this.thumbnailEl) this.thumbnailEl.src = track.thumbnail;
    if (this.titleEl) this.titleEl.textContent = track.title;
    if (this.categoryEl) this.categoryEl.textContent = track.category;
    if (this.durationEl) this.durationEl.textContent = track.durationStr;
    if (this.currentTimeEl) this.currentTimeEl.textContent = '0:00';
    if (this.progressFill) this.progressFill.style.width = '0%';

    this.stopSyntheticPreview();
    this.audioElement.src = track.audio;

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isSynthetic = false;
          this.setPlayState(true);
        })
        .catch(() => {
          // File not found or autopolicy blocked -> engage synth preview
          this.startSyntheticPreview();
        });
    }
  }

  /**
   * Built-in Web Audio API preview synth:
   * Generates smooth atmospheric chords so preview sounds amazing out of the box!
   */
  startSyntheticPreview() {
    this.isSynthetic = true;
    this.syntheticTime = 0;
    this.setPlayState(true);

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx && AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stopSyntheticPreview();

      const track = TRACKS[this.currentTrackIndex];
      // Musical scales for melodic harmonic textures
      const chordFrequencies = {
        lofi: [220, 261.63, 329.63, 392.00],        // Am7
        acoustic: [196, 246.94, 293.66, 392],       // G
        piano: [174.61, 220, 261.63, 349.23],       // F
        trailer: [110, 164.81, 220, 329.63],        // A low power
        ambient: [130.81, 196, 261.63, 392],        // C5
        synth: [146.83, 220, 293.66, 440],          // Dm
      };

      const notes = chordFrequencies[track.theme] || chordFrequencies.lofi;
      const oscillators = [];

      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.setValueAtTime(this.audioElement.volume * 0.08, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      this.synthGain.connect(filter);
      filter.connect(this.audioCtx.destination);

      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.connect(this.synthGain);
        osc.start();
        oscillators.push(osc);
      });

      this.synthOsc = oscillators;

      // Timer progression simulation
      this.synthInterval = setInterval(() => {
        if (!this.isPlaying) return;
        this.syntheticTime += 0.5;
        this.updateProgress(this.syntheticTime, track.durationSec);

        // Filter gentle modulation
        if (filter && this.audioCtx) {
          const mod = 700 + Math.sin(this.syntheticTime * 0.8) * 300;
          filter.frequency.setValueAtTime(mod, this.audioCtx.currentTime);
        }

        if (this.syntheticTime >= track.durationSec) {
          this.playNext();
        }
      }, 500);

    } catch {
      // Audio context fallback if restricted
    }
  }

  stopSyntheticPreview() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthOsc && Array.isArray(this.synthOsc)) {
      this.synthOsc.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.synthOsc = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (!this.audioElement.src || this.audioElement.src.endsWith('/')) {
        this.loadAndPlay(this.currentTrackIndex);
      } else if (this.isSynthetic) {
        this.startSyntheticPreview();
      } else {
        this.audioElement.play()
          .then(() => this.setPlayState(true))
          .catch(() => this.startSyntheticPreview());
      }
    }
  }

  pause() {
    this.audioElement.pause();
    this.stopSyntheticPreview();
    this.setPlayState(false);
  }

  setPlayState(playing) {
    this.isPlaying = playing;
    this.playerContainer?.classList.toggle('playing', playing);

    // Update player button icon
    if (this.playPauseBtn) {
      if (playing) {
        this.playPauseBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          </svg>`;
      } else {
        this.playPauseBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4"></polygon>
          </svg>`;
      }
    }

    // Sync all portfolio cards
    const currentTrack = TRACKS[this.currentTrackIndex];
    document.querySelectorAll('.work-card').forEach(card => {
      const cardTrackId = parseInt(card.getAttribute('data-track-id') || '0', 10);
      const isThisCard = cardTrackId === currentTrack.id;
      card.classList.toggle('now-playing', isThisCard && playing);

      const playBtn = card.querySelector('.play-work-btn');
      if (playBtn) {
        if (isThisCard && playing) {
          playBtn.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>`;
        } else {
          playBtn.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>`;
        }
      }
    });
  }

  playNext() {
    const nextIndex = (this.currentTrackIndex + 1) % TRACKS.length;
    this.loadAndPlay(nextIndex);
  }

  playPrev() {
    const prevIndex = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    this.loadAndPlay(prevIndex);
  }
}

let playerInstance = null;
function initAudioPlayer() {
  playerInstance = new AkkadanAudioPlayer();
}

/* ==========================================================================
   5. CONTACT FORM VALIDATION & ENQUIRY DISPATCH
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const projectTypeInput = document.getElementById('form-project-type');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const projectType = projectTypeInput?.value;
    const message = messageInput?.value.trim();

    // Frontend validation
    if (!name) {
      showFormAlert('Please enter your full name.', 'error');
      nameInput?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFormAlert('Please enter a valid email address.', 'error');
      emailInput?.focus();
      return;
    }

    if (!message || message.length < 10) {
      showFormAlert('Please provide a brief description of your project (min 10 characters).', 'error');
      messageInput?.focus();
      return;
    }

    // Processing animation
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending Enquiry...
      `;
    }

    /**
     * ----------------------------------------------------------------------
     * BACKEND / API INTEGRATION NOTICE FOR DEVELOPERS:
     * ----------------------------------------------------------------------
     * This form currently performs client-side validation and demonstrates
     * a responsive feedback workflow. To hook up your production email/API:
     *
     * Example 1 (EmailJS):
     * emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
     *   from_name: name,
     *   from_email: email,
     *   phone: phone,
     *   project_type: projectType,
     *   message: message
     * });
     *
     * Example 2 (Server endpoint):
     * await fetch('/api/enquiry', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ name, email, phone, projectType, message })
     * });
     * ----------------------------------------------------------------------
     */

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Enquiry</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }

      showFormAlert(`Thank you, ${name}! Your enquiry for ${projectType} has been received. Akkadan Musix will review your project details and reach out shortly.`, 'success');
      form.reset();
    }, 900);
  });

  function showFormAlert(message, type) {
    if (!alertBox) return;
    alertBox.className = `form-status-alert ${type}`;
    alertBox.textContent = message;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   6. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. SMOOTH SCROLL & BACK TO TOP
   ========================================================================== */
function initSmoothScroll() {
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
