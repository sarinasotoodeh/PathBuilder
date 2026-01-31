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
    mapInfo.innerHTML = `
    <h2>${p.icon} ${p.title}</h2>
    <p>${p.why}</p>
    <p><strong>Time:</strong> ${p.time}</p>
    <p><strong>Cost:</strong> ${p.cost}</p>
    <p><strong>Learning style:</strong> ${p.style}</p>
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
