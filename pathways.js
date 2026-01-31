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
const cards = document.getElementById("cards");

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
  if (editBtn) editBtn.addEventListener("click", () => (window.location.href = "index.html"));
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

// Build cards
for (const key in pathways) {
    const p = pathways[key];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    ${p.tag ? `<div class="tag">${p.tag}</div>` : ""}
    <h3>${p.icon} ${p.title}</h3>
    <p>${p.why}</p>
    <p><strong>Time:</strong> ${p.time}</p>
    <p><strong>Cost:</strong> ${p.cost}</p>
    <p><strong>Style:</strong> ${p.style}</p>
    `;
    cards.appendChild(card);
}
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
selectPath(bestPath);
