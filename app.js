// ---------- Helpers ----------
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function getCheckedValues(name) {
    return qsa(`input[name="${name}"]:checked`).map(el => el.value);
}

function getRadioValue(name) {
    const el = qs(`input[name="${name}"]:checked`);
    return el ? el.value : "";
}

function setText(id, text) {
    const el = qs("#" + id);
    if (el) el.textContent = text || "";
}

function isNumberInRange(val, min, max) {
    const n = Number(val);
    return Number.isFinite(n) && n >= min && n <= max;
}

// ---------- Validation ----------
function validate() {
    let ok = true;

    const careerGoal = qs("#careerGoal").value;
    const hsYear = qs("#hsYear").value;
    const interests = getCheckedValues("interests");
    const learningStyle = getRadioValue("learningStyle");
    const avgGrade = qs("#avgGrade").value;
    const financePref = getRadioValue("financePref");

    setText("basicsError", "");
    setText("interestsError", "");
    setText("learningError", "");
    setText("gradeError", "");
    setText("financeError", "");
    setText("statusText", "");

    if (!careerGoal || !hsYear) {
        ok = false;
        setText("basicsError", "Please select a career goal and year in high school.");
    }

    if (interests.length < 1) {
        ok = false;
        setText("interestsError", "Please choose at least one interest.");
    }

    if (!learningStyle) {
        ok = false;
        setText("learningError", "Please choose a learning style.");
    }

    if (!isNumberInRange(avgGrade, 0, 100)) {
        ok = false;
        setText("gradeError", "Enter a number between 0 and 100.");
    }

    if (!financePref) {
        ok = false;
        setText("financeError", "Please choose a financial preference.");
    }

    return ok;
}

// ---------- Lightweight check (for enabling submit) ----------
function lightweightCheck() {
    const ok =
        qs("#careerGoal").value &&
        qs("#hsYear").value &&
        getCheckedValues("interests").length > 0 &&
        getRadioValue("learningStyle") &&
        isNumberInRange(qs("#avgGrade").value, 0, 100) &&
        getRadioValue("financePref");

    qs("#submitBtn").disabled = !ok;
    setText("statusText", "");
}

// ---------- Reset UI State ----------
function resetFormState() {
    setText("basicsError", "");
    setText("interestsError", "");
    setText("learningError", "");
    setText("gradeError", "");
    setText("financeError", "");
    setText("statusText", "");

    qs("#submitBtn").disabled = true;
    qs("#outputSection").style.display = "none";
}

// ---------- Main ----------
const form = qs("#intakeForm");
const resetBtn = qs("#resetBtn");
const output = qs("#output");

// Populate form from saved profile (so Edit returns with selections intact)
function populateFormFromStorage() {
    try {
        const raw = localStorage.getItem("userProfile");
        if (!raw) return;
        const stored = JSON.parse(raw);

        if (stored.careerGoal) qs("#careerGoal").value = stored.careerGoal;
        if (stored.hsYear !== undefined && stored.hsYear !== null) qs("#hsYear").value = String(stored.hsYear);
        if (stored.avgGrade !== undefined && stored.avgGrade !== null) qs("#avgGrade").value = String(stored.avgGrade);

        // checkboxes (subjects, interests)
        if (Array.isArray(stored.subjects)) {
            qsa('input[name="subjects"]').forEach(cb => cb.checked = stored.subjects.includes(cb.value));
        }
        if (Array.isArray(stored.interests)) {
            qsa('input[name="interests"]').forEach(cb => cb.checked = stored.interests.includes(cb.value));
        }

        // radios (learningStyle, financePref)
        if (stored.learningStyle) {
            qsa('input[name="learningStyle"]').forEach(r => r.checked = r.value === stored.learningStyle);
        }
        if (stored.financePref) {
            qsa('input[name="financePref"]').forEach(r => r.checked = r.value === stored.financePref);
        }

        lightweightCheck();
    } catch (err) {
        console.warn('Could not populate form from storage', err);
    }
}

// populate on load only when navigated from the summary Edit button
const _params = new URLSearchParams(window.location.search);
if (_params.get("edit") === "1") populateFormFromStorage();

form.addEventListener("input", lightweightCheck);
form.addEventListener("change", lightweightCheck);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validate()) return;

  const userProfile = {
    careerGoal: qs("#careerGoal").value,
    hsYear: Number(qs("#hsYear").value),
    subjects: getCheckedValues("subjects"),
    interests: getCheckedValues("interests"),
    learningStyle: getRadioValue("learningStyle"),
    avgGrade: Number(qs("#avgGrade").value),
    financePref: getRadioValue("financePref"),
    createdAt: new Date().toISOString()
  };

  // SAVE
  localStorage.setItem("userProfile", JSON.stringify(userProfile));

  // GO TO PAGE 2
  window.location.href = "pathways.html";
});


resetBtn.addEventListener("click", () => {
    form.reset();
    resetFormState();
    qs("#careerGoal").focus();
    // go back to first step when resetting
    if (typeof showStep === "function") showStep(0);
});

// Initial state
qs("#submitBtn").disabled = true;

// PAGE-BY-PAGE QUIZ NAVIGATION
const steps = Array.from(form.querySelectorAll("fieldset"));
let currentStep = 0;
const backBtn = qs("#backBtn");
const nextBtn = qs("#nextBtn");
const progress = qs("#progress");

function showStep(i) {
    currentStep = i;
    steps.forEach((s, idx) => s.style.display = idx === i ? "block" : "none");
    backBtn.style.display = i === 0 ? "none" : "inline-block";
    nextBtn.style.display = i === steps.length - 1 ? "none" : "inline-block";
    qs("#submitBtn").style.display = i === steps.length - 1 ? "inline-block" : "none";
    setText("statusText", "");
    if (progress) progress.textContent = `Question ${i + 1} of ${steps.length}`;
    lightweightCheck();
}

backBtn.addEventListener("click", () => showStep(Math.max(0, currentStep - 1)));
nextBtn.addEventListener("click", () => showStep(Math.min(steps.length - 1, currentStep + 1)));

// show first step
if (steps.length > 0) showStep(0);
