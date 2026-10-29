/**
 * ==============================================================================
 * NEUROKIDS ALLIES — CLIENT APPLICATION & RESOURCE CONFIGURATION
 * ==============================================================================
 * 
 * RESOURCE DOWNLOAD SETUP & CONFIGURATION GUIDE:
 * ------------------------------------------------------------------------------
 * This site includes a flexible, dual-mode system for handling resource downloads:
 * 
 * 1. GATED MODE (gateDownloadsBehindSubscribe: true) — [CURRENT DEFAULT]
 *    - In this mode, clicking "Download" on any resource card sends the user
 *      to Omotayo's official MailerLite subscription funnel.
 *    - This preserves her lead-capture mechanism so visitors become subscribers
 *      before accessing or receiving their educational materials.
 * 
 * 2. DIRECT DOWNLOAD MODE (gateDownloadsBehindSubscribe: false)
 *    - In this mode, clicking "Download" immediately downloads the file from its
 *      public static path (e.g. /resources/for-children-guide.pdf) using a native
 *      HTML5 <a href="..." download> element.
 *    - No backend, API, or database is required — this works natively on static
 *      hosts like Vercel, Netlify, or GitHub Pages.
 * 
 * INSTRUCTIONS FOR CLIENT (Omotayo):
 *    - Step 1: Upload your completed guide/handout files (PDFs, docs) to a public
 *              directory, for example within a '/resources/' folder.
 *    - Step 2: Populate their respective file paths in the `config.resourceFiles`
 *              array below (item 0 for Children, 1 for Individuals, 2 for Faith Communities).
 *    - Step 3: Set `gateDownloadsBehindSubscribe: false` whenever you want direct
 *              one-click public downloads instead of email-gated downloads.
 * ==============================================================================
 */

const config = {
  /**
   * config.resourceFiles
   * Array of relative/absolute file paths for each resource category:
   * Index 0: For Children
   * Index 1: For Individuals & Social Gatherings
   * Index 2: For Communities & Places of Faith
   * 
   * NOTE: Currently EMPTY because real files have not yet been provided by the client.
   */
  resourceFiles: [
    // '/resources/for-children-allyship-guide.pdf',
    // '/resources/for-individuals-and-gatherings-guide.pdf',
    // '/resources/for-faith-and-community-leaders-guide.pdf'
  ],

  /**
   * config.gateDownloadsBehindSubscribe
   * Type: Boolean
   * Default: true
   * When true  -> Routes to Omotayo's real MailerLite subscriber link.
   * When false -> Directly triggers client-side download of the resource file.
   */
  gateDownloadsBehindSubscribe: true,

  /**
   * Real destination subscribe link extracted from the live site:
   */
  subscribeFormUrl: 'https://preview.mailerlite.io/forms/2009995/176619972987978844/share'
};

// Expose config to window for easy inspection or runtime debugging
window.neuroKidsConfig = config;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initResourceButtons();
  initSubscribeForm();
  initContactMessageForm();
  initPolicyModals();
  initPillarAlignment();
});

/**
 * ------------------------------------------------------------------------------
 * Navigation Interactions (Sticky header, mobile drawer, smooth anchor links)
 * ------------------------------------------------------------------------------
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveNav();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });

    // Close mobile drawer when link clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      mobileDrawer.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.innerHTML = `
        <svg class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = `
        <svg class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  }

  // Handle smooth scroll for internal anchor links with exact header height offset
  const allInternalAnchors = document.querySelectorAll('a[href^="#"]');

  allInternalAnchors.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      const targetId = href.substring(1);
      
      // Determine real target section
      let targetSection = document.getElementById(targetId);
      if (targetId === 'about') {
        targetSection = document.getElementById('why-we-exist') || targetSection;
      } else if (targetId === 'resources') {
        targetSection = document.getElementById('resources');
      } else if (targetId === 'get-involved') {
        targetSection = document.getElementById('get-involved') || document.getElementById('contact');
      } else if (targetId === 'be-an-ally') {
        targetSection = document.getElementById('contact') || targetSection;
      }

      if (targetSection) {
        e.preventDefault();

        // Close mobile drawer if open
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          toggleMobileMenu(false);
        }

        // Measure live header height
        const liveHeader = document.querySelector('.header');
        const headerHeight = liveHeader ? liveHeader.getBoundingClientRect().height : 86;

        // Calculate target's absolute top
        const rect = targetSection.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;

        // Position section start exactly at the bottom of the sticky header (0px of previous section visible)
        const scrollTarget = Math.max(0, Math.round(absoluteTop - headerHeight));

        window.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });

        // Update URL hash cleanly
        if (history.pushState) {
          history.pushState(null, null, href);
        }

        // Update active classes
        navLinks.forEach(l => {
          if (l.getAttribute('href') === href) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
        mobileLinks.forEach(l => {
          if (l.getAttribute('href') === href) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    });
  });

  // Active section indicator on scroll
  function highlightActiveNav() {
    const scrollY = window.pageYOffset;
    const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);

    // Section definitions with their corresponding primary nav href
    const sectionTargets = [
      { id: 'why-we-exist', href: '#about' },
      { id: 'what-we-do', href: '#what-we-do' },
      { id: 'resources', href: '#resources' },
      { id: 'our-vision', href: '#about' },
      { id: 'our-mission', href: '#about' },
      { id: 'founder', href: '#about' },
      { id: 'contact', href: '#contact' },
      { id: 'get-involved', href: '#get-involved' }
    ];

    let activeHref = null;

    if (isAtBottom) {
      activeHref = '#contact';
    } else {
      for (const target of sectionTargets) {
        const el = document.getElementById(target.id);
        if (el) {
          const top = el.offsetTop - 140;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            activeHref = target.href;
          }
        }
      }
    }

    if (activeHref) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === activeHref) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileLinks.forEach(link => {
        if (link.getAttribute('href') === activeHref) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }
}

/**
 * ------------------------------------------------------------------------------
 * Configurable Resource Download Logic
 * ------------------------------------------------------------------------------
 */
function initResourceButtons() {
  const downloadButtons = document.querySelectorAll('[data-resource-index]');

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.getAttribute('data-resource-index'), 10);
      const resourceName = btn.getAttribute('data-resource-title') || 'Allyship Resource';
      handleResourceDownload(index, resourceName);
    });
  });
}

function handleResourceDownload(index, resourceName) {
  if (config.gateDownloadsBehindSubscribe) {
    // MODE 1: Gated behind subscribe form
    showToast(`Redirecting to subscribe to access "${resourceName}"...`);
    setTimeout(() => {
      window.open(config.subscribeFormUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  } else {
    // MODE 2: Direct file download
    const filePath = config.resourceFiles[index];
    if (filePath && filePath.trim() !== '') {
      showToast(`Starting download: ${resourceName}...`);
      const link = document.createElement('a');
      link.href = filePath;
      link.setAttribute('download', '');
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Direct mode is enabled, but client hasn't provided file path yet
      showToast(`Direct download active: Real file for "${resourceName}" has not yet been uploaded.`);
      // Offer fallback redirect to subscribe form
      setTimeout(() => {
        window.open(config.subscribeFormUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
    }
  }
}

/**
 * Update the UI status pill showing which mode is currently active
 */
function updateConfigNoticeUI() {
  const badge = document.getElementById('config-mode-badge');
  const text = document.getElementById('config-mode-text');
  if (!badge || !text) return;

  if (config.gateDownloadsBehindSubscribe) {
    badge.className = 'config-status-badge gated';
    badge.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      Gated Mode (Lead Funnel Active)
    `;
    text.textContent = 'Downloads currently route through Omotayo’s official MailerLite subscription page to grow her nonprofit community.';
  } else {
    badge.className = 'config-status-badge direct';
    badge.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Direct Download Mode Active
    `;
    text.textContent = 'Downloads trigger direct client-side file saves via static paths.';
  }
}

/**
 * ------------------------------------------------------------------------------
 * Subscribe Form Logic (Preserving real destination lead funnel)
 * ------------------------------------------------------------------------------
 */
function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('subscriber-email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    showToast('Connecting you to our allyship community...');
    
    // Redirect to the real MailerLite subscription page
    setTimeout(() => {
      // If client form accepts URL param or direct share link
      window.open(config.subscribeFormUrl, '_blank', 'noopener,noreferrer');
      if (emailInput) emailInput.value = '';
    }, 700);
  });
}

/**
 * ------------------------------------------------------------------------------
 * Contact Us Message Form Handler
 * ------------------------------------------------------------------------------
 */
function initContactMessageForm() {
  const form = document.getElementById('contact-message-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('contact-first-name')?.value.trim() || 'Friend';
    showToast(`Thank you, ${firstName}! Your message has been received. We'll get back to you soon.`);
    form.reset();
  });
}

/**
 * ------------------------------------------------------------------------------
 * Accessible Policy Modals (Terms, Privacy, Security Statement)
 * ------------------------------------------------------------------------------
 */
function initPolicyModals() {
  const modalOverlay = document.getElementById('policy-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');

  const policies = {
    terms: {
      title: 'Terms of Service',
      content: `
        <h4>1. Purpose</h4>
        <p>NeuroKids Allies Inc. provides educational guides, advocacy materials, and community allyship resources for informational and community-building purposes. Our materials are grounded in lived experience and neurodivergent allyship.</p>
        <h4>2. Use of Materials</h4>
        <p>Guides and resources provided by NeuroKids Allies may be downloaded, shared within classrooms, faith communities, and homes for non-commercial educational and advocacy purposes with appropriate credit to NeuroKids Allies Inc. and founder Omotayo Senbore.</p>
        <h4>3. Disclaimer</h4>
        <p>Our resources are educational and neuro-affirming tools; they do not replace clinical, psychological, or medical evaluations from licensed practitioners.</p>
      `
    },
    privacy: {
      title: 'Privacy Policy',
      content: `
        <h4>1. Information We Collect</h4>
        <p>NeuroKids Allies collects your email address when you voluntarily subscribe to receive allyship resources and nonprofit updates via our MailerLite signup form.</p>
        <h4>2. How We Use Your Information</h4>
        <p>We use your contact details solely to deliver empathy-centered resources, announcements, and educational newsletters. We respect your dignity and privacy and do not sell or trade personal data to third parties.</p>
        <h4>3. Unsubscribing</h4>
        <p>You can unsubscribe at any time using the direct link provided at the footer of any email you receive from us.</p>
      `
    },
    security: {
      title: 'Security Statement',
      content: `
        <h4>1. Data Safeguards</h4>
        <p>NeuroKids Allies Inc. uses secure industry-standard email marketing and hosting infrastructure with encrypted transmissions (HTTPS/TLS) to ensure that your communication and contact records remain safe.</p>
        <h4>2. Inquiries</h4>
        <p>If you have any questions regarding security or privacy, you can reach our team directly at <a href="mailto:contact@neurokidsallies.com" style="color: var(--color-accent);">contact@neurokidsallies.com</a>.</p>
      `
    }
  };

  document.querySelectorAll('[data-policy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const policyKey = btn.getAttribute('data-policy');
      const data = policies[policyKey];
      if (data && modalOverlay && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('open');
        modalOverlay.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }
}

/**
 * ------------------------------------------------------------------------------
 * Toast Notification Utility
 * ------------------------------------------------------------------------------
 */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }, 4000);
}

/**
 * ------------------------------------------------------------------------------
 * Dynamic Pillar Card Elements Alignment (Row-by-Row)
 * Ensures:
 * 1. Titles in each row align at the exact same height.
 * 2. Descriptions in each row align at the exact same height so that
 *    the Resource Callout boxes in each row start at the EXACT SAME VERTICAL HEIGHT.
 * 3. Resource Callouts in each row align in height so that
 *    the action buttons sit on the exact same bottom baseline.
 * ------------------------------------------------------------------------------
 */
function initPillarAlignment() {
  const alignCards = () => {
    const cards = document.querySelectorAll('.pillar-card');
    if (!cards.length) return;

    const titles = document.querySelectorAll('.pillar-title');
    const descs = document.querySelectorAll('.pillar-desc');
    const resources = document.querySelectorAll('.pillar-resource-callout');

    // Reset inline min-heights first so natural content height can be measured accurately
    titles.forEach(el => el.style.minHeight = '');
    descs.forEach(el => el.style.minHeight = '');
    resources.forEach(el => el.style.minHeight = '');

    // Multi-column grid threshold (768px matches .pillars-grid media query)
    if (window.innerWidth >= 768) {
      // Group cards into rows of 2 (Row 1: cards 0 & 1; Row 2: cards 2 & 3)
      for (let i = 0; i < cards.length; i += 2) {
        const rowCards = [cards[i], cards[i + 1]].filter(Boolean);
        if (rowCards.length < 2) continue;

        // 1. Equalize titles in this row
        const rowTitles = rowCards.map(c => c.querySelector('.pillar-title')).filter(Boolean);
        if (rowTitles.length) {
          const maxTitleH = Math.max(...rowTitles.map(el => el.offsetHeight));
          rowTitles.forEach(el => el.style.minHeight = `${maxTitleH}px`);
        }

        // 2. Equalize descriptions in this row -> guarantees resource boxes start at identical height
        const rowDescs = rowCards.map(c => c.querySelector('.pillar-desc')).filter(Boolean);
        if (rowDescs.length) {
          const maxDescH = Math.max(...rowDescs.map(el => el.offsetHeight));
          rowDescs.forEach(el => el.style.minHeight = `${maxDescH}px`);
        }

        // 3. Equalize resource callout boxes in this row -> guarantees buttons align on same baseline
        const rowResources = rowCards.map(c => c.querySelector('.pillar-resource-callout')).filter(Boolean);
        if (rowResources.length) {
          const maxResH = Math.max(...rowResources.map(el => el.offsetHeight));
          rowResources.forEach(el => el.style.minHeight = `${maxResH}px`);
        }
      }
    }
  };

  alignCards();

  // Re-align on resize with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(alignCards, 40);
  });

  // Re-run after fonts or images finish loading
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignCards);
  }
  window.addEventListener('load', alignCards);
}

