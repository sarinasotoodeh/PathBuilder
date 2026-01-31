// ===== Load profile =====
const userProfile = JSON.parse(localStorage.getItem("userProfile"));

if (!userProfile) {
  alert("No profile found. Please complete the intake form.");
  window.location.href = "index.html";
}

// ===== Pathway data =====
const pathways = {
  uni: {
    icon: "🎓",
    title: "University Degree",
    why: "Strong grades and interest in theory make this a good fit.",
    time: "4 years",
    cost: "High",
    style: "Academic"
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
    style: "Hands-on"
  },
  apprenticeship: {
    icon: "🛠️",
    title: "Apprenticeship",
    why: "Earn while you learn with real experience.",
    time: "2–5 years",
    cost: "Low",
    style: "Hands-on"
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

const detailPageMap = {
  uni: "uni-detail.html",
  college: "college-detail.html",
  bootcamp: "bootcamp-detail.html",
  apprenticeship: "apprenticeship-detail.html",
  military: "military-detail.html"
};

// ===== DOM references =====
const mapInfo = document.getElementById("mapInfo");
const careerHeader = document.getElementById("careerHeader");
const goalNode = document.getElementById("goalNode");

// ===== Header + goal node =====
const careerGoal = userProfile.careerGoal || "Career Goal";
if (careerHeader) careerHeader.textContent = `Career Goal: ${careerGoal}`;
if (goalNode) goalNode.textContent = careerGoal;

// ===== Profile summary =====
const profileContent = document.getElementById("profileContent");

if (profileContent && userProfile) {
  const fmtList = (arr) => (arr && arr.length ? arr.join(", ") : "—");
  const created = userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleString() : "—";

  profileContent.innerHTML = `
    <div><strong>Career goal:</strong> ${userProfile.careerGoal || "—"}</div>
    <div><strong>Year:</strong> ${userProfile.hsYear ? "Grade " + userProfile.hsYear : "—"}</div>
    <div><strong>Subjects:</strong> ${fmtList(userProfile.subjects)}</div>
    <div><strong>Interests:</strong> ${fmtList(userProfile.interests)}</div>
    <div><strong>Learning style:</strong> ${userProfile.learningStyle || "—"}</div>
    <div><strong>Average grade:</strong> ${userProfile.avgGrade ?? "—"}</div>
    <div><strong>Finance preference:</strong> ${userProfile.financePref || "—"}</div>
    <div style="color:rgba(120,120,140,0.9);font-size:0.9rem;margin-top:8px;">
      Saved: ${created}
    </div>
  `;

  const editBtn = document.getElementById("editAnswers");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      window.location.href = "index.html?edit=1";
    });
  }
}

// ===== SMART SCORING ENGINE =====
let scores = { uni: 0, college: 0, bootcamp: 0, apprenticeship: 0, military: 0 };
let reasons = { uni: [], college: [], bootcamp: [], apprenticeship: [], military: [] };

const avgGrade = Number(userProfile.avgGrade ?? 0);
const learningStyle = String(userProfile.learningStyle || "").toLowerCase();
const financePref = String(userProfile.financePref || "").toLowerCase();
const interests = Array.isArray(userProfile.interests) ? userProfile.interests : [];

// Grades
if (avgGrade >= 85) {
  scores.uni += 3;
  reasons.uni.push("Strong academic grades");
}
if (avgGrade >= 70) {
  scores.college += 2;
  reasons.college.push("Solid grades for applied programs");
}
if (avgGrade > 0 && avgGrade < 70) {
  scores.apprenticeship += 2;
  reasons.apprenticeship.push("Hands-on learning may be a better fit");
}

// Learning style
if (learningStyle.includes("hands-on")) {
  scores.bootcamp += 3;
  scores.apprenticeship += 3;
  reasons.bootcamp.push("Prefers hands-on learning");
  reasons.apprenticeship.push("Prefers hands-on learning");
}
if (learningStyle.includes("academic")) {
  scores.uni += 2;
  reasons.uni.push("Comfortable with academic learning");
}

// Financial preference
if (financePref.includes("low")) {
  scores.apprenticeship += 3;
  scores.military += 3;
  scores.uni -= 2;
  reasons.apprenticeship.push("Lower cost / earn while learning");
  reasons.military.push("Paid training and education benefits");
}

// Interests
if (interests.includes("Technology")) {
  scores.uni += 1;
  scores.bootcamp += 2;
  reasons.bootcamp.push("Interest in tech-focused skills");
}
if (interests.includes("Creativity")) {
  scores.college += 1;
  scores.bootcamp += 1;
}

// Rank
const rankedPaths = Object.entries(scores).sort((a, b) => b[1] - a[1]);

// Apply tags + personalize "why"
rankedPaths.forEach(([key], index) => {
  if (index === 0) pathways[key].tag = "Best match";
  if (index === 1) pathways[key].tag = "Strong alternative";
  if (index === 2) pathways[key].tag = "Another option";

  if (reasons[key].length) {
    pathways[key].why = reasons[key].join(" • ");
  }
});

// ===== UI helpers for new map =====
function clearActive() {
  // button highlights
  document.querySelectorAll(".pathNode").forEach((b) => b.classList.remove("active"));

  // line highlights
  document.querySelectorAll("#mapLines line").forEach((line) => line.classList.remove("active"));
}

function activateLines(pathKey) {
  const a = document.getElementById(`line-you-${pathKey}`);
  const b = document.getElementById(`line-${pathKey}-goal`);
  if (a) a.classList.add("active");
  if (b) b.classList.add("active");
}

function selectPath(key) {
  clearActive();

  // highlight selected pathway button
  const btn = document.querySelector(`.pathNode[data-path="${key}"]`);
  if (btn) btn.classList.add("active");

  // highlight the route lines
  activateLines(key);

  // update info panel
  const p = pathways[key];
  const tagHtml = p.tag
    ? `<div class="tag" style="margin-top:6px;margin-bottom:10px;">${p.tag}</div>`
    : "";

  mapInfo.innerHTML = `
    <h2>${p.icon} ${p.title}</h2>
    ${tagHtml}
    <p>${p.why}</p>
    <p><strong>Time:</strong> ${p.time}</p>
    <p><strong>Cost:</strong> ${p.cost}</p>
    <p><strong>Learning style:</strong> ${p.style}</p>
    <div style="margin-top:16px;">
      <a href="${detailPageMap[key]}"
         style="display:inline-block;padding:10px 16px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
         More information →
      </a>
    </div>
  `;
}

// Click handlers (NEW selector)
document.querySelectorAll(".pathNode").forEach((btn) => {
  btn.addEventListener("click", () => selectPath(btn.dataset.path));
});

// Auto-select best path on load
selectPath(rankedPaths[0][0]);

// ============================
// Curved map routes (REQUIRED)
// ============================
let activeRouteKey = null;

function centerOf(el, containerRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - containerRect.left + r.width / 2,
    y: r.top - containerRect.top + r.height / 2
  };
}

function curvePath(a, b) {
  const dx = b.x - a.x;
  const c1 = { x: a.x + dx * 0.35, y: a.y };
  const c2 = { x: b.x - dx * 0.35, y: b.y };
  return `M ${a.x},${a.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

function drawRoutes() {
  const map = document.getElementById("pathMap");
  const svg = document.getElementById("routeSvg");
  const start = document.querySelector(".startNode");
  const goal = document.getElementById("goalNode");
  if (!map || !svg || !start || !goal) return;

  svg.innerHTML = "";

  const mapRect = map.getBoundingClientRect();
  const startPt = centerOf(start, mapRect);
  const goalPt = centerOf(goal, mapRect);

  document.querySelectorAll(".pathNode").forEach(btn => {
    const key = btn.dataset.path;
    const midPt = centerOf(btn, mapRect);

    const d1 = curvePath(startPt, midPt);
    const d2 = curvePath(midPt, goalPt);

    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute("d", d1);
    p1.setAttribute("class", "route");
    p1.dataset.routeKey = key;

    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute("d", d2);
    p2.setAttribute("class", "route");
    p2.dataset.routeKey = key;

    svg.appendChild(p1);
    svg.appendChild(p2);
  });

  if (activeRouteKey) setActiveRoute(activeRouteKey);
}

function setActiveRoute(key) {
  activeRouteKey = key;
  document.querySelectorAll("#routeSvg .route").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(`#routeSvg .route[data-route-key="${key}"]`)
    .forEach(p => p.classList.add("active"));
}

// highlight when user clicks a pathway
document.querySelectorAll(".pathNode").forEach(btn => {
  btn.addEventListener("click", () => {
    setActiveRoute(btn.dataset.path);
    requestAnimationFrame(drawRoutes);
  });
});

// draw on load + resize
window.addEventListener("load", () => setTimeout(drawRoutes, 50));
window.addEventListener("resize", () => drawRoutes());

