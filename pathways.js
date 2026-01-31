const userProfile = JSON.parse(localStorage.getItem("userProfile"));

if (!userProfile) {
  alert("No profile found. Please complete the intake form.");
  window.location.href = "index.html"; // intake page
}

const pathways = {
  uni: {
    icon: "🎓",
    title: "University Degree",
    why: "Strong grades and interest in theory make this a good fit.",
    time: "4 years",
    cost: "High",
    style: "Academic",
    tag: "Best match"
  },
  college: {
    icon: "🏫",
    title: "College Diploma",
    why: "Hands-on learning with faster entry to jobs.",
    time: "2–3 years",
    cost: "Medium",
    style: "Mixed"
  },
  bootcamp: {
    icon: "💻",
    title: "Bootcamp",
    why: "Fast, intensive, and skill-focused.",
    time: "6–12 months",
    cost: "Medium",
    style: "Hands-on",
    tag: "Fastest"
  },
  apprenticeship: {
    icon: "🛠️",
    title: "Apprenticeship",
    why: "Earn while you learn with real experience.",
    time: "2–5 years",
    cost: "Low",
    style: "Hands-on",
    tag: "Lowest cost"
  },
  military: {
    icon: "🎖️",
    title: "Military",
    why: "Structured training with paid education options.",
    time: "Varies",
    cost: "Low",
    style: "Structured"
  }
};

const mapInfo = document.getElementById("mapInfo");

// Render a concise, readable summary of the saved profile
const profileContent = document.getElementById("profileContent");
if (profileContent && userProfile) {
  const fmtList = (arr) => (arr && arr.length ? arr.join(", ") : "—");
  const created = userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleString() : "";
  profileContent.innerHTML = `
    <div><strong>Career goal:</strong> ${userProfile.careerGoal || '—'}</div>
    <div><strong>Year:</strong> ${userProfile.hsYear ? 'Grade ' + userProfile.hsYear : '—'}</div>
    <div><strong>Subjects:</strong> ${fmtList(userProfile.subjects)}</div>
    <div><strong>Interests:</strong> ${fmtList(userProfile.interests)}</div>
    <div><strong>Learning style:</strong> ${userProfile.learningStyle || '—'}</div>
    <div><strong>Average grade:</strong> ${userProfile.avgGrade ?? '—'}</div>
    <div><strong>Finance preference:</strong> ${userProfile.financePref || '—'}</div>
    <div style="color:rgba(180,180,200,0.9);font-size:0.9rem;margin-top:8px;">Saved: ${created}</div>
  `;

  const editBtn = document.getElementById("editAnswers");
  if (editBtn) editBtn.addEventListener("click", () => {
    // Navigate to intake with an edit flag so the form will be populated
    window.location.href = "index.html?edit=1";
  });
}

function selectPath(key) {
  document.querySelectorAll(".mapIcon").forEach(b => b.classList.remove("active"));
  document.querySelector(`.mapIcon[data-path="${key}"]`).classList.add("active");

  const p = pathways[key];
  const detailPageMap = {
    uni: "uni-detail.html",
    college: "college-detail.html",
    bootcamp: "bootcamp-detail.html",
    apprenticeship: "apprenticeship-detail.html",
    military: "military-detail.html"
  };
  mapInfo.innerHTML = `
    <h2>${p.icon} ${p.title}</h2>
    <p>${p.why}</p>
    <p><strong>Time:</strong> ${p.time}</p>
    <p><strong>Cost:</strong> ${p.cost}</p>
    <p><strong>Learning style:</strong> ${p.style}</p>
    <div style="margin-top:16px;">
        <a href="${detailPageMap[key]}" style="display:inline-block;padding:10px 16px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;font-weight:600;">More information →</a>
    </div>
    `;
}

document.querySelectorAll(".mapIcon").forEach(btn => {
  btn.addEventListener("click", () => selectPath(btn.dataset.path));
});

document.getElementById("careerHeader").textContent =
  `Career Goal: ${userProfile.careerGoal}`;
let bestPath = "college";

if (userProfile.learningStyle === "hands-on") {
  bestPath = "bootcamp";
}
if (userProfile.avgGrade >= 85) {
  bestPath = "uni";
}
if (userProfile.financePref === "low") {
  bestPath = "apprenticeship";
}
// ---------- SMART SCORING ENGINE ----------

// 1. Initialize scores + reasons
let scores = {
  uni: 0,
  college: 0,
  bootcamp: 0,
  apprenticeship: 0,
  military: 0
};

let reasons = {
  uni: [],
  college: [],
  bootcamp: [],
  apprenticeship: [],
  military: []
};

// 2. Grades
if (userProfile.avgGrade >= 85) {
  scores.uni += 3;
  reasons.uni.push("Strong academic grades");
}
if (userProfile.avgGrade >= 70) {
  scores.college += 2;
  reasons.college.push("Solid grades for applied programs");
}
if (userProfile.avgGrade < 70) {
  scores.apprenticeship += 2;
  reasons.apprenticeship.push("Grades suggest hands-on learning may be better");
}

// 3. Learning style
if (userProfile.learningStyle.toLowerCase().includes("hands-on")) {
  scores.bootcamp += 3;
  scores.apprenticeship += 3;
  reasons.bootcamp.push("Prefers hands-on learning");
  reasons.apprenticeship.push("Prefers hands-on learning");
}
if (userProfile.learningStyle.toLowerCase().includes("academic")) {
  scores.uni += 2;
  reasons.uni.push("Comfortable with academic learning");
}

// 4. Financial situation
if (userProfile.financePref.toLowerCase().includes("low")) {
  scores.apprenticeship += 3;
  scores.military += 3;
  scores.uni -= 2;
  reasons.apprenticeship.push("Lower cost / earn while learning");
  reasons.military.push("Paid training and education benefits");
}

// 5. Interests
if (userProfile.interests.includes("Technology")) {
  scores.uni += 1;
  scores.bootcamp += 2;
  reasons.bootcamp.push("Interest in technology-focused skills");
}
if (userProfile.interests.includes("Creativity")) {
  scores.college += 1;
  scores.bootcamp += 1;
}

// 6. Rank pathways
const rankedPaths = Object.entries(scores)
  .sort((a, b) => b[1] - a[1]);

// 7. Apply ranking + reasons to UI
rankedPaths.forEach(([key], index) => {
  if (index === 0) pathways[key].tag = "Best match";
  if (index === 1) pathways[key].tag = "Strong alternative";
  if (index === 2) pathways[key].tag = "Another option";

  pathways[key].why = reasons[key].length
    ? reasons[key].join(" • ")
    : pathways[key].why;
});

// 8. Auto-select best path on load
selectPath(rankedPaths[0][0]);
// ===== SVG curved pathways (copy this to the end of `pathways.js`) =====

function ensureSvg() {
  let svg = document.getElementById('mapSvg');
  if (!svg) {
    const container = document.getElementById('pathMap');
    if (!container) return null;
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'mapSvg';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    container.insertBefore(svg, container.firstChild);
  }
  return svg;
}

function ensurePathDefs(svg) {
  if (svg.querySelector('#pathGradient')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(ns, 'defs');

  const grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', 'pathGradient');
  grad.setAttribute('x1', '0'); grad.setAttribute('x2', '1');
  const s1 = document.createElementNS(ns, 'stop'); s1.setAttribute('offset', '0'); s1.setAttribute('stop-color', '#7c3aed');
  const s2 = document.createElementNS(ns, 'stop'); s2.setAttribute('offset', '1'); s2.setAttribute('stop-color', '#06b6d4');
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);

  svg.appendChild(defs);
}

function drawCurvedPaths() {
  const svg = ensureSvg();
  const container = document.getElementById('pathMap');
  const center = document.querySelector('.centerNode');
  if (!svg || !container || !center) return;
  ensurePathDefs(svg);

  // remove previous paths (keep defs)
  [...svg.querySelectorAll('path.map-path, path.map-path--glow')].forEach(n => n.remove());

  const sRect = container.getBoundingClientRect();
  const cRect = center.getBoundingClientRect();
  const cx = cRect.left - sRect.left + cRect.width / 2;
  const cy = cRect.top - sRect.top + cRect.height / 2;

  document.querySelectorAll('.mapIcon').forEach(icon => {
    const r = icon.getBoundingClientRect();
    const ix = r.left - sRect.left + r.width / 2;
    const iy = r.top - sRect.top + r.height / 2;

    const dx = ix - cx;
    const cx1 = cx + dx * 0.28;
    const cy1 = cy - Math.sign(dx) * Math.max(20, Math.abs(dx) * 0.12);
    const cx2 = cx + dx * 0.72;
    const cy2 = iy + Math.sign(dx) * Math.max(20, Math.abs(dx) * 0.12);
    const d = `M ${cx},${cy} C ${cx1},${cy1} ${cx2},${cy2} ${ix},${iy}`;

    const ns = 'http://www.w3.org/2000/svg';
    // glow (blurred wider stroke)
    const glow = document.createElementNS(ns, 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'map-path map-path--glow');
    glow.setAttribute('stroke', '#7c3aed');
    glow.setAttribute('stroke-width', '8');
    svg.appendChild(glow);

    // main path with gradient
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'map-path');
    path.setAttribute('stroke', 'url(#pathGradient)');
    svg.appendChild(path);
  });
}

// listeners + safe initial redraw
window.addEventListener('load', drawCurvedPaths);
window.addEventListener('resize', drawCurvedPaths);
document.querySelectorAll('.mapIcon').forEach(b => b.addEventListener('click', () => setTimeout(drawCurvedPaths, 0)));
setTimeout(drawCurvedPaths, 80);g