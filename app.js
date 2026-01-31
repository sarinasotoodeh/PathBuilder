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

form.addEventListener("input", lightweightCheck);
form.addEventListener("change", lightweightCheck);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
        setText("statusText", "Please fix the highlighted fields.");
        return;
    }

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

    console.log("userProfile:", userProfile);

    output.textContent = JSON.stringify(userProfile, null, 2);
    qs("#outputSection").style.display = "block";
    setText("statusText", "Saved! (Printed below and logged to console.)");
});

resetBtn.addEventListener("click", () => {
    form.reset();
    resetFormState();
    qs("#careerGoal").focus();
});

// Initial state
qs("#submitBtn").disabled = true;
