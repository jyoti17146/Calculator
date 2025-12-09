// DOM ELEMENTS
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const themeCheckbox = document.getElementById("themeCheckbox");

let currentExpression = "";

// ---------- DISPLAY HELPERS ----------
function updateDisplay() {
  expressionEl.textContent = currentExpression || "0";
}

function showResult(value) {
  resultEl.textContent = value;
}

// ---------- EXPRESSION BUILDING ----------
function appendValue(value) {
  // Prevent two operators in a row
  const ops = "+-*/%";
  const lastChar = currentExpression.slice(-1);

  if (ops.includes(value) && ops.includes(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + value;
  } else {
    currentExpression += value;
  }
  updateDisplay();
}

function clearAll() {
  currentExpression = "";
  updateDisplay();
  showResult("0");
}

function deleteLast() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

// ---------- EVALUATION ----------
function evaluateExpression() {
  if (!currentExpression) return;

  // Only allow safe characters
  const safeExpr = currentExpression.replace(/[^0-9+\-*/%.()]/g, "");

  try {
    const result = eval(safeExpr); // for learning project
    if (result === undefined) return;

    showResult(result);
    addToHistory(currentExpression, result);
    currentExpression = String(result); // allow chaining
    updateDisplay();
  } catch (err) {
    showResult("Error");
  }
}

// ---------- HISTORY ----------
function addToHistory(expr, res) {
  // remove "no history" text
  const emptyNode = historyList.querySelector(".empty");
  if (emptyNode) historyList.removeChild(emptyNode);

  const li = document.createElement("li");
  const spanExpr = document.createElement("span");
  const spanRes = document.createElement("span");

  spanExpr.className = "expr";
  spanRes.className = "res";
  spanExpr.textContent = expr;
  spanRes.textContent = "= " + res;

  li.appendChild(spanExpr);
  li.appendChild(spanRes);

  // clicking a history item loads it
  li.addEventListener("click", () => {
    currentExpression = expr;
    updateDisplay();
    showResult(res);
  });

  historyList.prepend(li); // latest on top
}

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = '<li class="empty">No history yet</li>';
});

// ---------- BUTTON EVENTS ----------
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "clear") {
      clearAll();
    } else if (action === "del") {
      deleteLast();
    } else if (action === "equals") {
      evaluateExpression();
    } else if (value) {
      appendValue(value);
    }
  });
});

// ---------- KEYBOARD SUPPORT ----------
window.addEventListener("keydown", (e) => {
  const key = e.key;

  // numbers and dot
  if ((key >= "0" && key <= "9") || key === ".") {
    appendValue(key);
    return;
  }

  // operators
  if (["+", "-", "*", "/", "%"].includes(key)) {
    appendValue(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    e.preventDefault();
    evaluateExpression();
  }

  if (key === "Backspace") {
    deleteLast();
  }

  if (key.toLowerCase() === "c") {
    clearAll();
  }
});

// ---------- THEME TOGGLE (light/dark) ----------
themeCheckbox.addEventListener("change", () => {
  if (themeCheckbox.checked) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
});

// initial display
updateDisplay();
showResult("0");