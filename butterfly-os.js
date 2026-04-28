  // ─── REVEAL ON SCROLL ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ─── SEASON DETAIL — click to open ───
  const seasons = {
    1: {
      eyebrow: 'SEASON 01 · BEGINNING · EGG',
      title: 'Beginning.',
      sub: 'Starting over can feel uncertain.',
      body: 'Something real can begin before the world knows. New ventures, new identities, new chapters carried in private before they take public form. The egg is small. It is also where everything starts.',
      help: 'Patience with the unseen. Protect the early days. Tell one trusted person — not the world.',
      say: '"I\'m starting something. It\'s small. I don\'t want to talk about it yet."',
      heavy: 'If beginning feels too big, that\'s a sign to bring one person in — not to delay further.'
    },
    2: {
      eyebrow: 'SEASON 02 · GROWTH · CATERPILLAR',
      title: 'Growth.',
      sub: 'You\'re trying. It\'s slower than you want.',
      body: 'What looks slow is often preparation. The caterpillar sheds five times before it becomes anything else — every emergence looks the same from the outside. Comparison is the thief of this season.',
      help: 'Mark the small sheddings. Stay off the comparison feed. Trust effort that has not been rewarded yet.',
      say: '"I\'m doing the work. I just can\'t see it yet."',
      heavy: 'If growth has turned into self-criticism, that\'s the moment to ask for a witness — someone who can name what you can\'t see.'
    },
    3: {
      eyebrow: 'SEASON 03 · RETREAT · COCOON',
      title: 'Retreat.',
      sub: 'Some seasons feel heavy and alone.',
      body: 'The deepest work happens where no one can see. Burnout, withdrawal, loss, the sacred pause. The chrysalis is built from the caterpillar\'s own body — nothing is wasted, but nothing visible is happening either.',
      help: 'Rest is not failure. Lower the demands. Reach for one person, even when reaching feels impossible.',
      say: '"I\'m not gone. I\'m just under. I\'ll surface when I can."',
      heavy: 'If retreat has turned into despair or thoughts of harm, please reach out for crisis support now. Tap the help button at the bottom of this page.'
    },
    4: {
      eyebrow: 'SEASON 04 · CHANGE · METAMORPHOSIS',
      title: 'Change.',
      sub: 'Something is shifting.',
      body: 'A new form is appearing. The dissolution of who you were is becoming the fuel for who you are becoming. Tender. Real. Sometimes terrifying. The wings are forming from what looked like collapse.',
      help: 'Slow down. Name what is changing out loud. Find people who can hold both who you were and who you are becoming.',
      say: '"I\'m not who I was. I\'m not yet who I will be. Be patient with me."',
      heavy: 'If change has destabilized your basic functioning, that is a signal for professional support — not weakness.'
    },
    5: {
      eyebrow: 'SEASON 05 · ALIGNMENT · BUTTERFLY',
      title: 'Alignment.',
      sub: 'You feel more like yourself again.',
      body: 'Life is not only meant to be endured. It is lived. The caterpillar consumes; the butterfly pollinates. The shift from taking to giving back — to contribution — is the destination of this whole journey.',
      help: 'Give back. Pollinate. Tell someone who is in Cocoon that there is a way through. Use what you survived as fuel for someone else.',
      say: '"I see you. I\'ve been there. You are not alone."',
      heavy: 'Even in alignment, seasons return. That is not regression — that is the truth of the journey.'
    }
  };

  const detailPanel = document.getElementById('seasonDetail');
  const seasonButtons = document.querySelectorAll('.season-btn');
  let activeSeason = null;

  function closeSeasonDetail() {
    detailPanel.classList.remove('open');
    seasonButtons.forEach(b => b.classList.remove('is-active'));
    activeSeason = null;
  }

  function showSeasonDetail(card, id) {
    const data = seasons[id];
    // Colors tuned for dark-section detail panel
    const colors = ['#1de9c5', '#5eead4', '#67e8f9', '#5ba9ff', '#2d7dd2'];
    detailPanel.style.borderLeftColor = colors[id - 1];
    document.getElementById('detEyebrow').textContent = data.eyebrow;
    document.getElementById('detEyebrow').style.color = colors[id - 1];
    document.getElementById('detTitle').textContent = data.title;
    document.getElementById('detSub').textContent = data.sub;
    document.getElementById('detBody').textContent = data.body;
    document.getElementById('detHelp').textContent = data.help;
    document.getElementById('detSay').textContent = data.say;
    document.getElementById('detHeavy').textContent = data.heavy;
    seasonButtons.forEach(b => b.classList.remove('is-active'));
    card.classList.add('is-active');
    detailPanel.classList.add('open');
    activeSeason = id;
  }

  seasonButtons.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-season');
      if (id === activeSeason) {
        // Same card clicked — toggle closed
        closeSeasonDetail();
      } else if (activeSeason) {
        // Different card while one is open — switch content in place, no scroll
        showSeasonDetail(card, id);
      } else {
        // First open — scroll into view
        showSeasonDetail(card, id);
        detailPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // ─── HELP MODAL ───
  const helpModal = document.getElementById('helpModal');
  const helpOpenBtn = document.querySelector('[data-help-open]');
  const helpCloseTargets = helpModal ? helpModal.querySelectorAll('[data-help-close]') : [];
  let helpLastFocused = null;

  function openHelpModal() {
    if (!helpModal) return;
    helpLastFocused = document.activeElement;
    helpModal.hidden = false;
    requestAnimationFrame(() => helpModal.classList.add('open'));
    document.body.style.overflow = 'hidden';
    const closeBtn = helpModal.querySelector('.help-modal-close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', handleHelpKeydown);
  }

  function closeHelpModal() {
    if (!helpModal) return;
    helpModal.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleHelpKeydown);
    setTimeout(() => {
      helpModal.hidden = true;
      if (helpLastFocused && typeof helpLastFocused.focus === 'function') {
        helpLastFocused.focus();
      }
    }, 350);
  }

  function handleHelpKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeHelpModal();
      return;
    }
    if (e.key === 'Tab') {
      // Simple focus trap — keep tabbing inside the modal
      const focusables = helpModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (helpOpenBtn) helpOpenBtn.addEventListener('click', openHelpModal);
  helpCloseTargets.forEach(el => el.addEventListener('click', closeHelpModal));

  // ─── Cultural butterfly video — seamless crossfade loop ───
  // Two <video> elements playing the same clip. When the active one nears
  // its end, the passive one starts from 0 and they crossfade — hiding the
  // visible "snap" that occurs when a video naturally loops on a clip
  // whose first and last frames don't match.
  (function setupCulturalVideoLoop() {
    const a = document.querySelector('.viz-cultural-video-a');
    const b = document.querySelector('.viz-cultural-video-b');
    if (!a || !b) return;

    const OVERLAP = 0.7; // seconds of crossfade
    let activeIsA = true;
    let started = false;

    function tick() {
      if (!started) return;
      requestAnimationFrame(tick);
      if (!isFinite(a.duration) || !isFinite(b.duration)) return;

      const active = activeIsA ? a : b;
      const passive = activeIsA ? b : a;
      const dur = active.duration;
      const t = active.currentTime;
      const remaining = dur - t;

      // Start passive when active enters the crossfade window
      if (remaining <= OVERLAP && passive.paused) {
        passive.currentTime = 0;
        const p = passive.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }

      // Crossfade opacities
      if (remaining <= OVERLAP) {
        const fade = Math.max(0, Math.min(1, remaining / OVERLAP));
        active.style.opacity = String(fade);
        passive.style.opacity = String(1 - fade);
      } else {
        active.style.opacity = '1';
        passive.style.opacity = '0';
      }

      // Swap roles when active reaches its end
      if (t >= dur - 0.05) {
        active.pause();
        active.currentTime = 0;
        active.style.opacity = '0';
        activeIsA = !activeIsA;
      }
    }

    function maybeStart() {
      if (started) return;
      if (!isFinite(a.duration) || !isFinite(b.duration)) return;
      started = true;
      requestAnimationFrame(tick);
    }

    a.addEventListener('loadedmetadata', maybeStart);
    b.addEventListener('loadedmetadata', maybeStart);
    if (isFinite(a.duration) && isFinite(b.duration)) maybeStart();

    // Honor reduced motion: pause both, show first frame of A only
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a.pause();
      b.pause();
      a.style.opacity = '1';
      b.style.opacity = '0';
    }
  })();

  // ─── Mobile nav toggle ───
  (function setupMobileNav() {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navEl = document.querySelector('nav');
    if (!navToggle || !navEl) return;

    function setNavOpen(open) {
      navEl.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => {
      setNavOpen(!navEl.classList.contains('nav-open'));
    });

    // Close on link tap (so smooth-scroll runs on a closing menu)
    navEl.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navEl.classList.contains('nav-open')) {
        setNavOpen(false);
      }
    });

    // If the user resizes from mobile to desktop while the menu is open,
    // close it so the desktop layout doesn't render with body-scroll locked.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 740 && navEl.classList.contains('nav-open')) {
        setNavOpen(false);
      }
    });
  })();
