(() => {
  'use strict';

  const windows = [...document.querySelectorAll('.window')];
  const taskApps = document.getElementById('taskApps');
  const startMenu = document.getElementById('startMenu');
  const toast = document.getElementById('toast');
  let topZ = 10;
  let activeWindow = null;
  let toastTimer;

  const appNames = {
    about: 'About', projects: 'Projects', design: 'UI/UX', marketing: 'Marketing',
    thinking: 'Thinking', experience: 'Experience', skills: 'Skills', contact: 'Contact',
    resume: 'Resume', case: 'Case notes'
  };

  const slides = [
    { tag: 'DIGITAL BUSINESS GRADUATE', title: 'Business thinking.<br>Human-centered design.', body: "I'm Alya, a Digital Business graduate from Universitas Negeri Surabaya with a 3.77/4.00 GPA. I enjoy connecting user needs, business goals and digital execution." },
    { tag: 'HOW I WORK', title: 'Curiosity to clarity to execution.', body: 'I like to understand the problem first, organize the information, then turn the idea into a useful digital experience or a well-executed campaign.' },
    { tag: 'EXPERIENCE', title: 'From marketplace operations to UI/UX.', body: 'My experience spans e-commerce operations, promotion setup, campaign QA, administration, content writing and collaborative website projects.' },
    { tag: 'WHAT I AM LOOKING FOR', title: 'Build things that make sense.', body: 'I am interested in opportunities across UI/UX, digital business, e-commerce operations and digital marketing, where analysis and execution work together.' }
  ];
  let slideIndex = 0;

  const cases = {
    baitul: { title: 'Baitul Hijrah - Client Website', role: 'WordPress website client project', overview: 'The CV describes requirement analysis, wireframes, interactive Figma prototypes, WordPress implementation and UI quality assurance.', proof: 'Add the real website URL, Figma prototype, selected screenshots, client requirements and your exact contribution. Remove any confidential information.' },
    sleep: { title: 'Central Java & Sleep Insight', role: 'Team web development and UI/UX challenge', overview: 'The CV describes user research, concept mapping, Figma UI prototypes and assistance with backend work using Node.js, Express and MySQL.', proof: 'Add the problem statement, research method, your exact contribution, prototype link and screenshots of the implemented interface.' },
    droozle: { title: 'Droozle Digital Campaign', role: 'Digital marketing coursework - team project', overview: 'The CV describes a promotional website for beverage products using Wix, plus marketing copy and blog content.', proof: 'Add landing page screenshots, copy examples, target audience assumptions and campaign metrics only if they can be verified.' },
    wise: { title: 'Wise Fund', role: 'FinTech analyst and product planner - team project', overview: 'The CV describes problem analysis, proposed solutions, competitor research, market sizing, a Business Model Canvas and website interface design for a crowdfunding concept.', proof: 'Add market-sizing assumptions, competitor matrix, BMC, user flow and interface prototype.' },
    sweet: { title: 'Sweet Memories', role: 'Design thinking coursework - team project', overview: 'The CV describes market analysis, target customer segments, acquisition funnel mapping, BMC and product catalogue materials for an informational website.', proof: 'Add research evidence, problem definition, ideation options, prototype and user validation only if validation was actually conducted.' }
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function updateTaskApps() {
    taskApps.replaceChildren();
    windows.filter(win => win.classList.contains('open')).forEach(win => {
      const id = win.dataset.window;
      const button = document.createElement('button');
      button.className = 'task-app' + (activeWindow === id ? ' active' : '');
      button.type = 'button';
      button.textContent = appNames[id] || id;
      button.title = 'Show ' + (appNames[id] || id);
      button.addEventListener('click', () => {
        if (activeWindow === id && win.classList.contains('open')) {
          closeWindow(id);
        } else {
          openWindow(id);
        }
      });
      taskApps.append(button);
    });
  }

  function openWindow(id) {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    startMenu.classList.remove('open');
    win.classList.add('open');
    win.style.zIndex = String(++topZ);
    activeWindow = id;
    windows.forEach(item => item.classList.toggle('focused', item === win));
    updateTaskApps();
  }

  function closeWindow(id) {
    const win = document.getElementById('win-' + id);
    if (!win) return;
    win.classList.remove('open', 'maximized');
    if (activeWindow === id) {
      const visible = windows.filter(item => item.classList.contains('open')).sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));
      activeWindow = visible[0]?.dataset.window || null;
    }
    windows.forEach(item => item.classList.toggle('focused', item.dataset.window === activeWindow));
    updateTaskApps();
  }

  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openWindow(button.dataset.open));
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeWindow(button.dataset.close)));
  document.querySelectorAll('[data-minimize]').forEach(button => button.addEventListener('click', () => closeWindow(button.dataset.minimize)));
  document.querySelectorAll('[data-maximize]').forEach(button => {
    button.addEventListener('click', () => {
      const win = document.getElementById('win-' + button.dataset.maximize);
      if (!win) return;
      win.classList.toggle('maximized');
      win.style.zIndex = String(++topZ);
      activeWindow = button.dataset.maximize;
      updateTaskApps();
    });
  });
  windows.forEach(win => win.addEventListener('pointerdown', () => {
    win.style.zIndex = String(++topZ);
    activeWindow = win.dataset.window;
    updateTaskApps();
  }));

  // Drag windows by the titlebar on desktop. Touch/mobile remains centered for easier use.
  document.querySelectorAll('.titlebar').forEach(bar => {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const win = bar.closest('.window');
    bar.addEventListener('pointerdown', event => {
      if (event.target.closest('.window-controls') || window.matchMedia('(max-width: 800px)').matches || win.classList.contains('maximized')) return;
      dragging = true;
      const rect = win.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;
      win.style.left = rect.left + 'px';
      win.style.top = rect.top + 'px';
      win.style.transform = 'none';
      bar.setPointerCapture(event.pointerId);
    });
    bar.addEventListener('pointermove', event => {
      if (!dragging) return;
      const left = Math.max(0, Math.min(window.innerWidth - 180, initialLeft + event.clientX - startX));
      const top = Math.max(0, Math.min(window.innerHeight - 110, initialTop + event.clientY - startY));
      win.style.left = left + 'px';
      win.style.top = top + 'px';
    });
    const stopDragging = () => { dragging = false; };
    bar.addEventListener('pointerup', stopDragging);
    bar.addEventListener('pointercancel', stopDragging);
  });

  document.getElementById('startBtn').addEventListener('click', () => startMenu.classList.toggle('open'));
  document.addEventListener('click', event => {
    if (!event.target.closest('#startMenu') && !event.target.closest('#startBtn') && !event.target.closest('[data-open]')) startMenu.classList.remove('open');
  });

  function renderSlide() {
    const slide = slides[slideIndex];
    const target = document.getElementById('slideContent');
    target.replaceChildren();
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = slide.tag;
    const title = document.createElement('h2');
    // The slide titles are authored constants; convert only the intentional line break.
    title.innerHTML = slide.title;
    const body = document.createElement('p');
    body.textContent = slide.body;
    target.append(tag, title, body);
    document.getElementById('slideCount').textContent = String(slideIndex + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    document.getElementById('prevSlide').disabled = slideIndex === 0;
    document.getElementById('nextSlide').textContent = slideIndex === slides.length - 1 ? 'Back to start' : 'Next';
  }
  document.getElementById('prevSlide').addEventListener('click', () => { slideIndex = Math.max(0, slideIndex - 1); renderSlide(); });
  document.getElementById('nextSlide').addEventListener('click', () => { slideIndex = (slideIndex + 1) % slides.length; renderSlide(); });

  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const item = cases[button.dataset.project];
    if (!item) return;
    document.getElementById('caseTitle').textContent = item.title;
    const content = document.getElementById('caseContent');
    content.replaceChildren();
    const label = document.createElement('span'); label.className = 'tag'; label.textContent = 'PROJECT CASE NOTES';
    const title = document.createElement('h2'); title.textContent = item.title;
    const role = document.createElement('p'); const bold = document.createElement('b'); bold.textContent = item.role; role.append(bold);
    const overviewTitle = document.createElement('h3'); overviewTitle.textContent = 'Project overview';
    const overview = document.createElement('p'); overview.textContent = item.overview;
    const proofTitle = document.createElement('h3'); proofTitle.textContent = 'What to add before publishing';
    const proof = document.createElement('p'); proof.textContent = item.proof;
    const notice = document.createElement('p'); notice.className = 'notice'; notice.textContent = 'These notes are based on the supplied CV. Add original evidence, clarify whether the work was individual or team-based, and do not invent performance outcomes.';
    const back = document.createElement('button'); back.className = 'btn secondary'; back.textContent = 'Back to projects'; back.addEventListener('click', () => openWindow('projects'));
    content.append(label, title, role, overviewTitle, overview, proofTitle, proof, notice, back);
    openWindow('case');
  }));

  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = prompt('Search portfolio: about, projects, experience, design, marketing, thinking, skills, contact, resume');
    if (!query) return;
    const key = query.toLowerCase().trim();
    const map = { about: 'about', projects: 'projects', project: 'projects', experience: 'experience', design: 'design', uiux: 'design', marketing: 'marketing', thinking: 'thinking', skills: 'skills', contact: 'contact', resume: 'resume', cv: 'resume' };
    const found = map[key] || Object.keys(map).find(item => item.includes(key) || key.includes(item));
    if (found) openWindow(map[found]); else showToast('No matching app. Try "projects" or "contact".');
  });

  function tickClock() {
    const now = new Date();
    document.getElementById('clockTime').textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clockDate').textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  tickClock();
  setInterval(tickClock, 30000);
  renderSlide();
})();
