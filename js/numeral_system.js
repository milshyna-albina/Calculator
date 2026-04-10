function convertNumeral() {
    const numeralInput = document.getElementById("numeralInput");
    const numeralResult = document.getElementById("numeralResult");
    const numeralFrom = document.getElementById("numeralFrom");
    const numeralTo = document.getElementById("numeralTo");
    if (!numeralInput || !numeralResult) {
        return;
    }

    let value = numeralInput.value.trim();
    if (!value || value === "0") {
        numeralResult.textContent = "0";
        return;
    }
    try {
        const fromBase = parseInt(numeralFrom.value);
        const toBase = parseInt(numeralTo.value);
        let preparedValue = value.replace(/×/g, '*').replace(/÷/g, '/');
        const decimalExpression = preparedValue.replace(/[0-9A-F]+/gi, (match) => {
            const parsed = parseInt(match, fromBase);
            return isNaN(parsed) ? match : parsed.toString(10);
        });

        let calcResult;
        try {
            calcResult = new Function(`return (${decimalExpression})`)();
        } catch(e) {
            numeralResult.textContent = "...";
            return;
        }

        if (calcResult !== undefined && isFinite(calcResult)) {
            const isResNegative = calcResult < 0;
            const absoluteValue = Math.abs(Math.trunc(calcResult));
            let finalStr = absoluteValue.toString(toBase).toUpperCase();
            numeralResult.textContent = isResNegative ? "-" + finalStr : finalStr;
        }
    } catch (e) {
        numeralResult.textContent = "Error";
    }
}

function updateHexButtons() {
    const fromSelect = document.getElementById("numeralFrom");
    const display = document.querySelector(".display");
    const calculator = document.querySelector(".calculator");

    if (!fromSelect || !display || !calculator) {
        return;
    }

    const base = parseInt(fromSelect.value);
    const isNumeralMode = display.classList.contains("mode-numeral");
    const buttons = document.querySelectorAll("[data-key]");
    const normalSymbols = ["!", "^", "%", "(", ")", "+/-"];
    const hexLetters = ["E", "F", "C", "A", "B", "D"];

    if (base === 16 && isNumeralMode) {
        calculator.classList.remove("mode-basic");
        calculator.classList.add("mode-advanced");
        calculator.classList.add("hide-memory");
    } else {
        calculator.classList.remove("hide-memory");
        if (isNumeralMode) {
            calculator.classList.remove("mode-advanced");
            calculator.classList.add("mode-basic");
        }
    }

    buttons.forEach(btn => {
        if (!btn.dataset.original) {
            btn.dataset.original = btn.dataset.key;
        }
        const originalKey = btn.dataset.original;

        if (base === 16 && isNumeralMode) {
            const index = normalSymbols.indexOf(originalKey);
            if (index !== -1) {
                btn.textContent = hexLetters[index];
                btn.dataset.key = hexLetters[index];
                btn.classList.add("hex-active");
            }
            if (originalKey === ".") {
                btn.textContent = "+/-";
                btn.dataset.key = "+/-";
            }
            if (originalKey === "√") {
                btn.textContent = "%";
                btn.dataset.key = "%";
            }
        } else {
            btn.dataset.key = originalKey;
            btn.classList.remove("hex-active");
            if (originalKey === "!") {
                btn.textContent = "x!";
            }
            else if (originalKey === "^") {
                btn.textContent = "xⁿ";
            }
            else if (originalKey === "√") {
                btn.textContent = "√x";
            }
            else btn.textContent = originalKey;
        }
    });

    const clearButtons = document.querySelectorAll('[data-original="C"]');
    clearButtons.forEach(btn => {
        if (base === 16 && isNumeralMode) {
            btn.textContent = "AC";
            btn.dataset.key = "AC";
        } else {
            btn.textContent = "C";
            btn.dataset.key = "C";
        }
    });
}

function resetButtonsToDefault() {
    const numeralInput = document.getElementById("numeralInput");
    const numeralResult = document.getElementById("numeralResult");
    if (numeralInput) {
        numeralInput.value = "0";
    }
    if (numeralResult) {
        numeralResult.textContent = "0";
    }
    const buttons = document.querySelectorAll("[data-key]");
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("disabled", "hex-active");
        if (btn.dataset.original) {
            btn.dataset.key = btn.dataset.original;
            btn.textContent = btn.dataset.original;
        }
        btn.style.display = "";
        if (btn.dataset.key === "C") {
            btn.textContent = "C";
        }
    });
}

function updateNumeralButtons() {
    const display = document.querySelector(".display");
    const fromSelect = document.getElementById("numeralFrom");

    if (!display || !display.classList.contains("mode-numeral")) {
        document.querySelectorAll("[data-key]").forEach(btn => {
            btn.disabled = false;
            btn.classList.remove("disabled");
        });
        return;
    }

    const base = parseInt(fromSelect.value);
    const buttons = document.querySelectorAll("[data-key]");

    buttons.forEach(btn => {
        const key = btn.dataset.key;
        btn.disabled = true;
        btn.classList.add("disabled");

        if (key === "C" || key === "AC" || ["+", "-", "×", "÷", "%", "+/-", "="].includes(key)) {
            btn.disabled = false;
            btn.classList.remove("disabled");
            return;
        }
        if (base === 2) {
            if (key === "0" || key === "1") {
                btn.disabled = false;
                btn.classList.remove("disabled");
            }
        } else if (base === 10) {
            if (!isNaN(key) && key.length === 1) {
                btn.disabled = false;
                btn.classList.remove("disabled");
            }
        } else if (base === 16) {
            const isHexLetter = ["A", "B", "C", "D", "E", "F"].includes(key);
            const isDigit = !isNaN(key) && key.length === 1;

            if (isDigit || isHexLetter) {
                btn.disabled = false;
                btn.classList.remove("disabled");
            }
        }
    });
}

function calculateNumeralExpression() {
    const numInput = document.getElementById("numeralInput");
    const fromSelect = document.getElementById("numeralFrom");
    if (!numInput || !fromSelect) {
        return;
    }

    const base = parseInt(fromSelect.value);
    let expression = numInput.value;
    try {
        const decimalExpression = expression.replace(/[0-9A-F]+/gi, (match) => {
            return parseInt(match, base).toString(10);
        });
        const resultDec = new Function(`return (${decimalExpression})`)();
        if (isNaN(resultDec) || !isFinite(resultDec)) {
            numInput.value = "Error";
        } else {
            if (base !== 2 && !/[+\-*/%()^√]/.test(expression)) {
                numInput.value = Math.floor(resultDec).toString(base).toUpperCase();
            }
        }
    } catch (e) {
        console.error(e);
        numInput.value = "Error";
    }
    if (typeof convertNumeral === "function") {
        convertNumeral();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const numeralInput = document.getElementById("numeralInput");
    const numeralFrom = document.getElementById("numeralFrom");
    const numeralTo = document.getElementById("numeralTo");
    if (numeralInput) {
        numeralInput.addEventListener("input", convertNumeral);
    }
    if (numeralFrom) {
        numeralFrom.addEventListener("change", () => {
            updateHexButtons();
            updateNumeralButtons();
            convertNumeral();
        });
    }
    if (numeralTo) {
        numeralTo.addEventListener("change", convertNumeral);
    }
    updateHexButtons();
    updateNumeralButtons();
});
