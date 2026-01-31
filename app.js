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
      if (val === "" || val === null || val === undefined) return false;
    }