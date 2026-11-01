(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const easing = 'cubic-bezier(.22, 1, .36, 1)';

  // Rövid, csoportonként eltolt megjelenés, egyszer minden elemnél.
  document.querySelectorAll('.stagger-list, .stagger-copy').forEach((group) => {
    [...group.children].forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index * 75, 225)}ms`);
    });
  });
  if (!motion.matches && 'IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  let menuAnimation;
  function closeMenu(immediately = false) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü megnyitása');
    if (mobileNav.hidden) return;
    menuAnimation?.cancel();
    mobileNav.inert = true;
    if (immediately || motion.matches) {
      mobileNav.hidden = true;
      return;
    }
    const animation = mobileNav.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-8px)' },
    ], { duration: 190, easing, fill: 'forwards' });
    menuAnimation = animation;
    animation.finished.then(() => {
      if (menuAnimation !== animation) return;
      mobileNav.hidden = true;
      animation.cancel();
      menuAnimation = null;
    }, () => {});
  }
  function openMenu() {
    menuAnimation?.cancel();
    mobileNav.hidden = false;
    mobileNav.inert = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Menü bezárása');
    if (!motion.matches) {
      menuAnimation = mobileNav.animate([
        { opacity: 0, transform: 'translateY(-8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 380, easing });
    }
  }
  menuToggle.addEventListener('click', () => {
    if (menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', () => closeMenu(true));

  // Szemléltető mondatpárok; nem szó szerinti könyvrészletek.
  const examples = {
    meeting: {
      before: '“We have a problem and we are slipping from the deadline.”',
      after: '“We\'ve run into an issue and we\'re slightly behind schedule.”',
      explanation: 'A probléma ugyanaz. A megfogalmazás higgadtabb és természetesebb.',
    },
    explain: {
      before: '“I explain.”',
      after: '“Let me explain.”',
      explanation: 'Két apró szó, és máris természetesebben vezeted be a gondolatodat.',
    },
    clarify: {
      before: '“Speak slower. I don\'t understand.”',
      after: '“Could you say that a little more slowly, please?”',
      explanation: 'Ugyanazt kéred. A hangnem udvariasabb, a kérés könnyebben fogadható.',
    },
  };
  const tabs = [...document.querySelectorAll('[data-example]')];
  const tabList = document.querySelector('.example-tabs');
  const phraseGrid = document.querySelector('.phrase-grid');
  const phraseExplanation = document.getElementById('phrase-explanation');
  const panel = document.getElementById('phrase-panel');
  let phraseSequence = 0;
  let phraseAnimations = [];
  let activeExample = 'meeting';

  function moveIndicator() {
    const tab = tabs.find((item) => item.getAttribute('aria-selected') === 'true');
    tabList.style.setProperty('--tab-left', `${tab.offsetLeft}px`);
    tabList.style.setProperty('--tab-width', `${tab.offsetWidth}px`);
  }
  function setExampleText(example) {
    document.getElementById('phrase-before').textContent = example.before;
    document.getElementById('phrase-after').textContent = example.after;
    phraseExplanation.textContent = example.explanation;
  }
  async function selectExample(tab) {
    if (tab.dataset.example === activeExample) return;
    activeExample = tab.dataset.example;
    const example = examples[activeExample];
    const sequence = ++phraseSequence;
    phraseAnimations.forEach((animation) => animation.cancel());
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    moveIndicator();
    if (motion.matches) {
      setExampleText(example);
      return;
    }
    const elements = [phraseGrid, phraseExplanation];
    phraseAnimations = elements.map((element) => element.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-7px)' },
    ], { duration: 160, easing: 'ease-in', fill: 'forwards' }));
    try {
      await Promise.all(phraseAnimations.map((animation) => animation.finished));
      if (sequence !== phraseSequence) return;
      setExampleText(example);
      phraseAnimations.forEach((animation) => animation.cancel());
      phraseAnimations = elements.map((element, index) => element.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 550, delay: index * 40, easing, fill: 'backwards' }));
    } catch { /* Új választás esetén a legutóbbi átmenet folytatódik. */ }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectExample(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
        selectExample(tabs[next]);
      }
    });
  });
  moveIndicator();
  document.fonts.ready.then(moveIndicator);

  // A natív details-elemek billentyűzettel is működnek. Az animáció
  // megfordítható; gyors egymás utáni kattintásoknál sincs magasságugrás.
  const detailGroups = new Map();
  const detailAnimations = new Map();
  document.querySelectorAll('details[name]').forEach((details) => {
    const group = details.getAttribute('name');
    if (!detailGroups.has(group)) detailGroups.set(group, []);
    detailGroups.get(group).push(details);
    details.removeAttribute('name');
    details.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      const expanding = !(detailAnimations.get(details)?.expanding ?? details.open);
      if (expanding) {
        detailGroups.get(group).forEach((other) => {
          if (other !== details && (other.open || detailAnimations.get(other)?.expanding)) animateDetails(other, false);
        });
      }
      animateDetails(details, expanding);
    });
  });
  function animateDetails(details, expanding) {
    const start = details.getBoundingClientRect().height;
    detailAnimations.get(details)?.animation.cancel();
    details.dataset.expanding = String(expanding);
    if (expanding) details.open = true;
    if (motion.matches) {
      details.open = expanding;
      details.style.height = '';
      details.style.overflow = '';
      delete details.dataset.expanding;
      detailAnimations.delete(details);
      return;
    }
    const summaryHeight = details.querySelector('summary').getBoundingClientRect().height;
    const end = summaryHeight + (expanding ? details.querySelector('.detail-content').getBoundingClientRect().height : 0) + 1;
    details.style.height = `${start}px`;
    details.style.overflow = 'hidden';
    const animation = details.animate([
      { height: `${start}px` }, { height: `${end}px` },
    ], { duration: 500, easing, fill: 'forwards' });
    detailAnimations.set(details, { animation, expanding });
    animation.finished.then(() => {
      if (detailAnimations.get(details)?.animation !== animation) return;
      details.open = expanding;
      details.style.height = '';
      details.style.overflow = '';
      delete details.dataset.expanding;
      detailAnimations.delete(details);
      animation.cancel();
    }, () => {});
  }
  function finishDetails() {
    detailAnimations.forEach(({ animation, expanding }, details) => {
      animation.cancel();
      details.open = expanding;
      details.style.height = '';
      details.style.overflow = '';
      delete details.dataset.expanding;
    });
    detailAnimations.clear();
  }

  const art = document.querySelector('.hero-art');
  const book = document.getElementById('hero-book');
  const bookStage = document.querySelector('.book-stage');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    art.addEventListener('pointermove', (event) => {
      if (motion.matches) return;
      const bounds = art.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      book.style.transform = `rotateY(${-12 + x * 12}deg) rotateX(${3 - y * 8}deg)`;
    });
    art.addEventListener('pointerleave', () => { book.style.transform = ''; });
  }
  let scrollFrame;
  function updateBook() {
    scrollFrame = null;
    const distance = Math.min(Math.max(window.scrollY, 0), 700);
    bookStage.style.setProperty('--book-shift', motion.matches ? '0px' : `${distance * -.045}px`);
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateBook);
  }, { passive: true });
  window.addEventListener('resize', () => {
    moveIndicator();
    finishDetails();
    updateBook();
  }, { passive: true });
  updateBook();

  const dialog = document.getElementById('purchase-dialog');
  let closingDialog;
  let purchaseUrl;
  try {
    const candidate = new URL(window.BOOK_SITE?.purchaseUrl || '');
    if (candidate.protocol === 'https:') purchaseUrl = candidate.href;
  } catch { /* Az üres beállítás a helyőrzőt mutatja. */ }
  if (purchaseUrl) document.querySelector('.purchase-status').textContent = 'A vásárlás a fizetési szolgáltató oldalán folytatódik.';
  document.querySelectorAll('[data-purchase]').forEach((button) => {
    button.addEventListener('click', () => {
      if (purchaseUrl) window.location.assign(purchaseUrl);
      else dialog.showModal();
    });
  });
  function closeDialog() {
    if (!dialog.open || closingDialog) return;
    if (motion.matches) {
      dialog.close();
      return;
    }
    closingDialog = dialog.animate([
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(7px) scale(.985)' },
    ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    closingDialog.finished.then(() => {
      dialog.close();
      closingDialog.cancel();
      closingDialog = null;
    }, () => {});
  }
  dialog.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => button.addEventListener('click', closeDialog));
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    root.classList.remove('js-motion');
    phraseSequence++;
    phraseAnimations.forEach((animation) => animation.cancel());
    setExampleText(examples[activeExample]);
    finishDetails();
    closeMenu(true);
    book.style.transform = '';
    updateBook();
    if (closingDialog) {
      closingDialog.cancel();
      closingDialog = null;
      dialog.close();
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
