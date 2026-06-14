// ==========================================
// LOGOS VECTORIALES CORREGIDOS
// ==========================================
const logoBlancoData = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 100'><g stroke='%23ffffff' stroke-width='8' fill='none' stroke-linecap='square' stroke-linejoin='miter'><polyline points='30,75 55,25 80,75'/><path d='M 140,35 A 25,25 0 1,0 140,65 A 25,25 0 0,0 145,50 H 125'/><circle cx='190' cy='50' r='25'/><path d='M 240,75 V 25 H 255 A 15,15 0 0,1 255,55 H 240 M 255,55 L 270,75'/><polyline points='290,75 315,25 340,75'/></g></svg>";
const logoNegroData = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 100'><g stroke='%23000000' stroke-width='8' fill='none' stroke-linecap='square' stroke-linejoin='miter'><polyline points='30,75 55,25 80,75'/><path d='M 140,35 A 25,25 0 1,0 140,65 A 25,25 0 0,0 145,50 H 125'/><circle cx='190' cy='50' r='25'/><path d='M 240,75 V 25 H 255 A 15,15 0 0,1 255,55 H 240 M 255,55 L 270,75'/><polyline points='290,75 315,25 340,75'/></g></svg>";

const carouselContainer = document.getElementById('session-carousel');
const agoraSplash = document.getElementById('agora-splash');
const dynamicLogo = document.getElementById('dynamic-logo');
const globalPatternLayer = document.getElementById('global-pattern-layer');
const screen = document.querySelector('.screen');
const focusContent = document.getElementById('focus-dynamic-content');

let currentHardwareTheme = 'none';
let currentTab = 'view-attention';
let splashTimeout;
let sanctuaryCycleInterval;
let currentSanctuaryTabActive = false;
let currentStratDay = 5; 
let currentSpatialContext = ''; 

// BASES DE DATOS ESPACIALES
const locationsPerTheme = {
  active: [ { id: 'university', name: 'Óbuda Campus' }, { id: 'formpuck', name: 'Form Puck Lab' }, { id: 'add_new', name: '+ Add New Spatial Anchor...' } ],
  calm: [ { id: 'library', name: 'Central Library' }, { id: 'home', name: 'Home Studio' }, { id: 'add_new', name: '+ Add New Spatial Anchor...' } ],
  shield: [ { id: 'office', name: 'Corporate HQ' }, { id: 'innovation', name: 'Innovation Lab' }, { id: 'add_new', name: '+ Add New Spatial Anchor...' } ]
};

const focusBlueprints = {
  university: { name: "Óbuda Campus", params: [ { label: "Lecture Token Cycle", input: `<span style="font-weight:600; font-family:'Space Mono';">50 Min Blocks</span>` }, { label: "Classroom Haptics", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "CAD/MATLAB Sync", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` } ] },
  formpuck: { name: "Form Puck Lab", params: [ { label: "Edge AI Processing", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Hardware Sprint", input: `<span style="font-weight:600; font-family:'Space Mono';">45 Min Sprints</span>` }, { label: "Telemetry Stream", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` } ] },
  library: { name: "Central Library", params: [ { label: "Binaural Noise Cancel", input: `<span style="font-weight:600;">White Noise</span>` }, { label: "Reading Audio Mode", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Quiet Perimeter Shield", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` } ] },
  home: { name: "Home Studio", params: [ { label: "Soundscape Engine", input: `<span style="font-weight:600;">Forest Stream</span>` }, { label: "Visual Breathe Guide", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Domestic Denylist", input: `<span style="font-weight:600; opacity:0.7;">SmartTV Blocked</span>` } ] },
  office: { name: "Corporate HQ", params: [ { label: "NDA Protection Enclave", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Anti-Exploit Air-Gap", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Restricted Cloud Sync", input: `<label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label>` } ] },
  innovation: { name: "Innovation Lab", params: [ { label: "Meeting Shield Protocol", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` }, { label: "Local Firewall", input: `<span style="font-weight:600; color:#38a169;">Strict</span>` }, { label: "Manager Allowlist", input: `<label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>` } ] },
  add_new: { name: "Scanning Area...", params: [ { label: "Geofence Status", input: `<span style="font-weight:600; font-family:'Space Mono'; color:#e53e3e;">Calibrating...</span>` }, { label: "Detecting Networks", input: `<span style="font-weight:600; opacity:0.7;">Searching</span>` } ] }
};

const strategistReports = {
  active: { 1: { time: "1.2h", text: "Kicked off the week building solid foundations." }, 2: { time: "3.4h", text: "Uninterrupted design flow. Great structural progress." }, 3: { time: "2.1h", text: "Solved complex problems today. Keep the momentum." }, 4: { time: "4.0h", text: "Peak productivity. Your prototype is taking real shape." }, 5: { time: "2.8h", text: "Strong end to the week. Focused iterations." }, 6: { time: "1.5h", text: "Weekend technical review. Well done." }, 7: { time: "0.5h", text: "Active strategic rest. Ready for the next iteration." } },
  calm: { 1: { time: "1.0h", text: "Decompression Monday. Started with a clear mind." }, 2: { time: "2.5h", text: "Perfect biological sync. Low stress levels." }, 3: { time: "1.8h", text: "Maintained your center amidst the chaos. Excellent control." }, 4: { time: "3.2h", text: "Fluid inspiration day. Ideas breathed with you." }, 5: { time: "2.0h", text: "Ideal balance between work and well-being." }, 6: { time: "4.1h", text: "Creative exploration without pressure. Great state of mind." }, 7: { time: "1.5h", text: "Recharge Sunday. Mental battery is at 100%." } },
  shield: { 1: { time: "3.0h", text: "Perimeter secured. Monday of unbreakable focus." }, 2: { time: "4.5h", text: "Total isolation. Maximum intellectual property protection." }, 3: { time: "2.2h", text: "Zero interruptions. Defended your attention like a pro." }, 4: { time: "5.1h", text: "Extended Bunker Mode. Impeccable confidential work." }, 5: { time: "3.8h", text: "Closed the week shielding your key processes." }, 6: { time: "1.0h", text: "Local security review. Zero breaches." }, 7: { time: "0.0h", text: "Absolute disconnection. The best shield is an offline system." } },
  none: { 1: { time: "--", text: "Awaiting Hardware." }, 2: { time: "--", text: "Awaiting Hardware." }, 3: { time: "--", text: "Awaiting Hardware." }, 4: { time: "--", text: "Awaiting Hardware." }, 5: { time: "--", text: "Awaiting Hardware." }, 6: { time: "--", text: "Awaiting Hardware." }, 7: { time: "--", text: "Awaiting Hardware." } }
};

function updateAttentionContent(theme) {
  const attentionContainer = document.getElementById('view-attention');
  const content = {
    active: { quote: "Attention is the engine of creation.", statVal: "4.2h", statLabel: "Alex's Cognitive Immersion", timeline: [ { time: "09:00 AM", desc: "CAD Geometric Validation", type: "active" }, { time: "11:30 AM", desc: "Design Sprint Session", type: "active" }, { time: "02:00 PM", desc: "Material Tolerances Check", type: "active" } ] },
    calm: { quote: "Stillness accelerates growth.", statVal: "1.8h", statLabel: "Mia's Restorative Clarity", timeline: [ { time: "07:30 AM", desc: "Pre-Class Somatosensory Reset", type: "calm" }, { time: "01:15 PM", desc: "Library Digital Detox", type: "calm" }, { time: "09:30 PM", desc: "Pre-Sleep Deceleration", type: "calm" } ] },
    shield: { quote: "Silence is the ultimate perimeter.", statVal: "3.5h", statLabel: "Marcus's Secure Isolation", timeline: [ { time: "08:00 AM", desc: "NDA Boardroom Lock", type: "shield" }, { time: "10:30 AM", desc: "Cryptographic Enclave Active", type: "shield" }, { time: "03:00 PM", desc: "Air-Gapped Core Modeling", type: "shield" } ] },
    none: { quote: "Attention is a finite currency.", statVal: "--", statLabel: "Awaiting Token Handshake", timeline: [] }
  };
  const data = content[theme] || content.none;
  let timelineHtml = data.timeline.map(item => `<div class="timeline-block block-${item.type}"><span class="time">${item.time}</span><span class="desc">${item.desc}</span></div>`).join('');
  if(data.timeline.length === 0) { timelineHtml = `<div style="text-align:center; opacity:0.5; padding:20px; font-family:'Space Mono', monospace; font-size:12px;">NO HARDWARE BOUNDARY LOADED</div>`; }
  attentionContainer.innerHTML = `<h1 class="daily-quote">"${data.quote}"</h1><div class="stat-card"><span class="stat-value">${data.statVal}</span><span class="stat-label">${data.statLabel}</span></div><div class="timeline">${timelineHtml}</div>`;
}

function updateFocusContent(theme) {
  const focusContainer = document.getElementById('focus-dynamic-content');
  if (theme === 'none') { focusContainer.innerHTML = `<p style="opacity: 0.7;">Dock a module to access Blueprints.</p>`; return; }
  const locationList = locationsPerTheme[theme];
  const currentSpace = focusBlueprints[currentSpatialContext];
  const badgeHtml = `<div class="location-badge"><span>📍 Network Beacon</span><span class="location-status">${currentSpace.name} Mesh</span></div>`;
  const spatialSelectorHtml = `<div class="spatial-selector-row"><span class="spatial-label">Spatial Context:</span><select id="blueprint-location-select" class="spatial-select">${locationList.map(loc => `<option value="${loc.id}" ${currentSpatialContext === loc.id ? 'selected' : ''}>${loc.name}</option>`).join('')}</select></div>`;
  const rowsHtml = currentSpace.params.map(item => `<div class="blueprint-row"><span>${item.label}</span>${item.input}</div>`).join('');
  focusContainer.innerHTML = `${badgeHtml}${spatialSelectorHtml}<div class="blueprint-card">${rowsHtml}</div><button class="app-manager-btn">Configure allowed apps for this space</button>`;
}

function updateSettingsContent(theme) {
  const settingsContainer = document.getElementById('view-settings');
  const profiles = {
    active: { initials: "AM", name: "Alex (Prosumer Tier)", role: "Freelance Designer & Nomad" },
    calm: { initials: "MD", name: "Mia (Universal Tier)", role: "Obuda University Student" },
    shield: { initials: "MS", name: "Marcus (Security Tier)", role: "Systems Architect & CTO" },
    none: { initials: "SM", name: "Santiago Márquez", role: "Unauthenticated Sandbox" }
  };
  const activeProfile = profiles[theme] || profiles.none;
  const userProfileHtml = `<div class="user-profile-card"><div class="user-avatar">${activeProfile.initials}</div><div class="user-info"><span class="user-name">${activeProfile.name}</span><span class="user-role">${activeProfile.role}</span></div></div>`;

  const hardwareDiagnosticData = {
    active: [ { key: "Token Specification", val: "The Active Token (Clay)" }, { key: "NFC Architecture", val: "NTAG215 (Passive Induction)" }, { key: "Physical Surface", val: "Textured Matte (High Friction)" } ],
    calm: [ { key: "Token Specification", val: "The Calm Token (Deep Sage)" }, { key: "GSR Biomarker", val: "Calibrated (Stress Tracking)" }, { key: "Acoustic Dampening", val: "Resonant Low-Freq Clack" } ],
    shield: [ { key: "Token Specification", val: "The Shield Token (Graphite)" }, { key: "Cryptographic Core", val: "AES-256 Verifiable Air-Gap" }, { key: "Perimeter State", val: "Hermetic Isolated Enclave" } ],
    none: [ { key: "Hardware Link", val: "Awaiting token placement..." } ]
  };
  const currentDiagnostics = hardwareDiagnosticData[theme] || hardwareDiagnosticData.none;
  const diagnosticsHtml = `<div class="settings-section-title">Hardware Diagnostics</div><div class="settings-box">${currentDiagnostics.map(row => `<div class="settings-row"><span>${row.key}</span><span class="settings-val-tech">${row.val}</span></div>`).join('')}</div>`;
  const systemRulesHtml = `<div class="settings-section-title">System Mechanics</div><div class="settings-box"><div class="settings-row"><span>Resonant Haptic Feedback</span><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div><div class="settings-row"><span>Automatic Geofencing Scan</span><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div></div><div class="settings-section-title">Core Legal Info</div><div class="settings-box"><div class="settings-row"><span>Firmware Build</span><span class="settings-val-tech">v2.0.26_agora</span></div><div class="settings-row"><span>Sovereignty State</span><span class="settings-val-tech">Zero-Knowledge Mesh</span></div></div>`;
  settingsContainer.innerHTML = `<h2 class="view-title">Settings</h2>${userProfileHtml}${diagnosticsHtml}${systemRulesHtml}`;
}

document.addEventListener('change', function(e) {
  if (e.target && e.target.id === 'blueprint-location-select') {
    currentSpatialContext = e.target.value;
    updateFocusContent(currentHardwareTheme); 
  }
});

function getLabContent(theme) {
  const content = {
    active: { title: "Telemetry Feed", tag: "Active Build", items: [{ label: "Project", val: "Industrial Case" }, { label: "Creation State", val: "Drafting..." }, { label: "Focus", val: "Deep Work" }] },
    calm: { title: "Vitals Matrix", tag: "Bio-Sync", items: [{ label: "Heart Rate", val: "68 BPM" }, { label: "Mind State", val: "Balanced" }, { label: "Noise", val: "Canceled" }] },
    shield: { title: "Threat Radar", tag: "Privacy Scan", items: [{ label: "External Noise", val: "0% (Blocked)" }, { label: "Signal", val: "Isolated" }, { label: "Perimeter", val: "Secure" }] },
    none: { title: "System Diagnostics", tag: "Idle", items: [{ label: "Status", val: "Awaiting Hardware" }] }
  };
  const data = content[theme] || content.none;
  return `<h2 style="font-weight:300; font-size:32px; margin-bottom:15px; text-align:left; letter-spacing:-1px;">${data.title}</h2><div class="lab-container"><div class="lab-header"><span class="lab-live-tag">${data.tag}</span></div><div class="lab-data-box">${data.items.map(i => `<div class="lab-data-row"><div class="lab-data-label">${i.label}</div><div class="lab-data-value">${i.val}</div></div>`).join('')}</div></div>`;
}

function getSummitContent(theme) {
  const content = {
    active: { title: "Team Channels", items: [{ node: "London Studio", status: "Active Node", active: true }, { node: "Fab Lab Beta", status: "Processing Mesh", active: true }, { node: "Tokyo HQ", status: "Standby Stream", active: false }] },
    calm: { title: "Core Circle", items: [{ node: "Family Network", status: "Secure Node", active: true }, { node: "Primary Partner", status: "Available", active: true }, { node: "Inner Support", status: "Rest Mode", active: false }] },
    shield: { title: "Interceptions", items: [{ node: "Emergency Node", status: "Allowlisted", active: true }, { node: "Critical Patch", status: "Encrypted", active: true }, { node: "External Traffic", status: "Isolated", active: false }] },
    none: { title: "Channels", items: [{ node: "Awaiting Enclave", noactive: true, node: "No Active Connections", active: false }] }
  };
  const data = content[theme] || content.none;
  return `<h2 style="font-weight:300; font-size:32px; margin-bottom:20px; text-align:left; letter-spacing:-0.5px;">${data.title}</h2><div class="summit-list">${data.items.map(i => `<div class="summit-item"><div class="dot" style="${i.active ? '' : 'background:#a0aec0; box-shadow:none;'}"></div><div style="text-align:left;"><b style="font-size:15px; font-weight:500;">${i.node}</b><br><span style="font-size:12px; opacity:0.6">${i.status}</span></div></div>`).join('')}</div>`;
}

function getStudioContent(theme) {
  const content = {
    active: { items: [{ label: "Workspace", val: "3D_Model.step" }, { label: "Mesh", val: "Active" }, { label: "Scale", val: "1:1" }] },
    calm: { items: [{ label: "Moodboard", val: "SageBotanics" }, { label: "Palette", val: "Organic" }, { label: "Flow", val: "Calm" }] },
    shield: { items: [{ label: "Status", val: "Isolated local" }, { label: "Cloud handshake", val: "Rejected" }, { label: "IP Perimeter", val: "Secure" }] },
    none: { items: [{ label: "Blueprint", val: "Awaiting Dock" }] }
  };
  const data = content[theme] || content.none;
  return `<h2 style="font-weight:300; font-size:32px; margin-bottom:15px; text-align:left; letter-spacing:-1px;">Canvas Area</h2><div class="studio-blueprint-block"><span class="studio-title">Current Workspace Params</span>${data.items.map(i => `<div class="studio-param-row"><div class="studio-p-label">${i.label}</div><div class="studio-p-val">${i.val}</div></div>`).join('')}</div>`;
}

function getStrategistContent(theme, day) {
  const themeData = strategistReports[theme] || strategistReports.none;
  const report = themeData[day];
  let daysHtml = '';
  for(let i=1; i<=7; i++) {
    const isMarked = (i === day) ? 'marked' : '';
    daysHtml += `<div class="cal-day strat-day ${isMarked}" data-day="${i}">${i}</div>`;
  }
  return `<h2 style="font-weight:300; font-size:32px; margin-bottom:5px; text-align:left;">Weekly Focus</h2><div class="calendar-grid"><div style="opacity:0.5">M</div><div style="opacity:0.5">T</div><div style="opacity:0.5">W</div><div style="opacity:0.5">T</div><div style="opacity:0.5">F</div><div style="opacity:0.5">S</div><div style="opacity:0.5">S</div>${daysHtml}</div><div class="strat-report-box" id="strat-report-box"><div class="report-time">${report.time} Connected</div><div>${report.text}</div></div>`;
}

const sessionsData = [
  { id: 'lab', title: 'The Lab', shape: 'lines' },
  { id: 'summit', title: 'The Summit', shape: 'summit-rain' },
  { id: 'studio', title: 'The Studio', shape: 'studio-grid' }, 
  { 
    id: 'vault', title: 'The Vault', shape: 'eclipse', 
    html: `<div class="content-vault"><div class="vault-top"><div class="vault-title">ENCLAVE LOCKED</div><div class="vault-timer">ISO: 01:24:05</div></div><div class="vault-bottom"><button class="vault-btn">Emergency Kill</button></div></div>` 
  },
  { id: 'sanctuary', title: 'The Sanctuary', shape: 'rings', html: `<div class="breathe-text sanctuary-guide">Inhale</div>` },
  { id: 'strategist', title: 'The Strategist', shape: 'strategist-squares' } 
];

function renderCarousel() {
  carouselContainer.innerHTML = '';
  const infiniteSessions = [...sessionsData, ...sessionsData, ...sessionsData];
  
  infiniteSessions.forEach((s) => {
    const card = document.createElement('div');
    card.className = 'session-card';
    card.dataset.shape = s.shape;
    card.dataset.id = s.id;
    
    let contentHtml = s.html;
    if (s.id === 'lab') contentHtml = getLabContent(currentHardwareTheme);
    if (s.id === 'summit') contentHtml = getSummitContent(currentHardwareTheme);
    if (s.id === 'studio') contentHtml = getStudioContent(currentHardwareTheme);
    if (s.id === 'strategist') contentHtml = getStrategistContent(currentHardwareTheme, currentStratDay);
    
    if (s.id === 'vault') {
      card.innerHTML = contentHtml + `<div class="s-title-bottom">${s.title}</div>`;
    } else {
      card.innerHTML = `<div class="s-content">${contentHtml}</div><div class="s-title-bottom">${s.title}</div>`;
    }
    
    carouselContainer.appendChild(card);
  });
}

let isDown = false; let startX; let scrollLeft;
carouselContainer.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - carouselContainer.offsetLeft; scrollLeft = carouselContainer.scrollLeft; });
carouselContainer.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - carouselContainer.offsetLeft; carouselContainer.scrollLeft = scrollLeft - ((x - startX) * 2); });

function handleInfiniteScrollJump(activeCard) {
  if (isDown) return; 
  const cards = Array.from(document.querySelectorAll('.session-card'));
  const index = cards.indexOf(activeCard);
  const setSize = sessionsData.length; 
  
  if (index < setSize) {
    carouselContainer.style.scrollSnapType = 'none';
    carouselContainer.scrollLeft += (carouselContainer.clientWidth * setSize);
    void carouselContainer.offsetWidth; 
    carouselContainer.style.scrollSnapType = 'x mandatory';
  } else if (index >= setSize * 2) {
    carouselContainer.style.scrollSnapType = 'none';
    carouselContainer.scrollLeft -= (carouselContainer.clientWidth * setSize);
    void carouselContainer.offsetWidth;
    carouselContainer.style.scrollSnapType = 'x mandatory';
  }
}

carouselContainer.addEventListener('mouseup', () => { 
  isDown = false; 
  const active = document.querySelector('.session-card.is-active-card');
  if(active) handleInfiniteScrollJump(active);
});
carouselContainer.addEventListener('mouseleave', () => { 
  isDown = false; 
  const active = document.querySelector('.session-card.is-active-card');
  if(active) handleInfiniteScrollJump(active);
});

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('strat-day')) {
    const selectedDay = parseInt(e.target.dataset.day);
    currentStratDay = selectedDay;
    document.querySelectorAll('.strat-day').forEach(el => { el.classList.remove('marked'); if (parseInt(el.dataset.day) === selectedDay) el.classList.add('marked'); });
    const themeData = strategistReports[currentHardwareTheme] || strategistReports.none;
    const report = themeData[selectedDay];
    document.querySelectorAll('.strat-report-box').forEach(box => { box.innerHTML = `<div class="report-time">${report.time} Connected</div><div>${report.text}</div>`; });
  }
});

function renderShape(shape) {
  if (shape === 'rings') { globalPatternLayer.innerHTML = `<div class="calm-global-rings"><div class="global-ring g-ring-1"></div><div class="global-ring g-ring-2"></div><div class="global-ring g-ring-3"></div></div>`; } 
  else if (shape === 'lines') { globalPatternLayer.innerHTML = `<div class="active-global-lines"></div>`; } 
  else if (shape === 'eclipse') { globalPatternLayer.innerHTML = `<div class="eclipse-container"><div class="eclipse-glow"></div><div class="eclipse-core"></div></div>`; } 
  else if (shape === 'summit-rain') { globalPatternLayer.innerHTML = `<div class="summit-rain-container"><div class="rain-triangle rt-1"></div><div class="rain-triangle rt-2"></div><div class="rain-triangle rt-3"></div><div class="rain-triangle rt-4"></div><div class="rain-triangle rt-5"></div><div class="rain-triangle rt-6"></div></div>`; }
  else if (shape === 'strategist-squares') { globalPatternLayer.innerHTML = `<div class="strategist-squares-container"><div class="strat-square sq-1"></div><div class="strat-square sq-2"></div><div class="strat-square sq-3"></div><div class="strat-square sq-4"></div><div class="strat-square sq-5"></div></div>`; }
  else { globalPatternLayer.innerHTML = ''; }
}

function handleSanctuaryGuide() {
  const guides = document.querySelectorAll('.sanctuary-guide');
  if (guides.length === 0) return;
  clearInterval(sanctuaryCycleInterval);
  if (currentTab === 'view-session' && currentSanctuaryTabActive) {
    let state = 'inhale'; guides.forEach(g => g.innerText = 'Inhale');
    sanctuaryCycleInterval = setInterval(() => { state = (state === 'inhale') ? 'exhale' : 'inhale'; guides.forEach(g => g.innerText = (state === 'inhale') ? 'Inhale' : 'Exhale'); }, 8000); 
  } else { clearInterval(sanctuaryCycleInterval); }
}

function syncBackground() {
  screen.classList.remove('is-studio-background');
  if (currentHardwareTheme === 'none') { renderShape('none'); return; }
  if (currentTab === 'view-session') {
    const activeCard = document.querySelector('.session-card.is-active-card');
    if (activeCard) {
      if (activeCard.dataset.id === 'studio') { screen.classList.add('is-studio-background'); renderShape('none'); } 
      else { renderShape(activeCard.dataset.shape); }
      currentSanctuaryTabActive = (activeCard.dataset.id === 'sanctuary'); handleSanctuaryGuide();
    }
  } else {
    let defaultShape = currentHardwareTheme === 'calm' ? 'rings' : currentHardwareTheme === 'active' ? 'lines' : 'eclipse';
    renderShape(defaultShape); currentSanctuaryTabActive = false; handleSanctuaryGuide();
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.session-card').forEach(c => c.classList.remove('is-active-card'));
      entry.target.classList.add('is-active-card');
      if (currentTab === 'view-session') syncBackground();
      if (!isDown) { handleInfiniteScrollJump(entry.target); }
    }
  });
}, { root: carouselContainer, threshold: 0.6 });

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
    item.classList.add('active');
    currentTab = item.dataset.target;
    document.getElementById(currentTab).classList.add('active-view');
    syncBackground();
    if(currentTab === 'view-session' && carouselContainer.scrollLeft === 0) { scrollToSession(0); }
  });
});

function scrollToSession(index) {
  setTimeout(() => {
    const cards = document.querySelectorAll('.session-card');
    const targetCard = cards[index + sessionsData.length];
    if(targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, 100);
}

document.addEventListener('click', function(e) {
  // Ahora el botón Emergency Kill no cambia un menú, sino que redirige a la URL sin token
  if (e.target && e.target.classList.contains('vault-btn')) { 
    window.history.pushState({}, '', window.location.pathname);
    triggerHardwareConnection('none'); 
  }
});

// ==========================================
// FUNCIÓN PRINCIPAL DE CAMBIO DE ESTADO
// ==========================================
function triggerHardwareConnection(theme) {
  clearTimeout(splashTimeout);
  currentHardwareTheme = theme;
  
  if (theme !== 'none') { currentSpatialContext = locationsPerTheme[theme][0].id; }
  
  const logo = theme === 'shield' ? logoBlancoData : logoNegroData;

  agoraSplash.style.transition = 'none';
  agoraSplash.classList.add('is-active');
  
  if (theme === 'none') {
    dynamicLogo.className = 'dynamic-logo logo-hidden';
  } else {
    dynamicLogo.style.backgroundImage = `url("${logo}")`;
    dynamicLogo.style.transition = 'none';
    dynamicLogo.className = 'dynamic-logo logo-splash';
  }

  setTimeout(() => {
    if (theme === 'none') {
      screen.removeAttribute('data-theme');
      updateAttentionContent('none');
      updateFocusContent('none'); 
      updateSettingsContent('none');
      syncBackground();
    } else {
      screen.setAttribute('data-theme', theme);
      updateAttentionContent(theme);
      renderCarousel(); 
      document.querySelectorAll('.session-card').forEach(card => observer.observe(card));
      updateFocusContent(theme);
      updateSettingsContent(theme);
      
      document.querySelector('[data-target="view-session"]').click();
      
      if(theme === 'active') scrollToSession(0); 
      if(theme === 'calm') scrollToSession(4);   
      if(theme === 'shield') scrollToSession(3); 
    }

    setTimeout(() => {
      agoraSplash.style.transition = 'opacity 0.8s ease';
      agoraSplash.classList.remove('is-active');
      if (theme !== 'none') {
         dynamicLogo.style.transition = 'all 0.9s cubic-bezier(0.65, 0, 0.05, 1)';
         dynamicLogo.className = 'dynamic-logo logo-header';
      }
    }, 600); 
  }, 50); 
}

// ==========================================
// INICIALIZADOR VÍA URL (EL CEREBRO DEL NFC)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Leemos la URL para ver si el iPhone pasó un parámetro (ej: ?token=active)
  const urlParams = new URLSearchParams(window.location.search);
  const nfcToken = urlParams.get('token');

  if (nfcToken && ['active', 'calm', 'shield'].includes(nfcToken)) {
    // Si detecta el parámetro en la URL, arranca el módulo automáticamente
    triggerHardwareConnection(nfcToken);
  } else {
    // Si abres la página normal, inicia desconectado y esperando el hardware
    updateAttentionContent('none');
    renderCarousel();
    document.querySelectorAll('.session-card').forEach(card => observer.observe(card));
    updateFocusContent('none');
    updateSettingsContent('none');
  }
});
