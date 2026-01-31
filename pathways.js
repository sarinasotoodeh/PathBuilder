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
