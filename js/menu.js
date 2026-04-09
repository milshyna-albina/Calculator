const settingsBtn = document.querySelector(".toggle");
const settingsMenu = document.querySelector(".settings-menu");
const calculator = document.querySelector(".calculator");
const display = document.querySelector(".display");

window.globalValue = "0";

function switchMode(name) {
    if (!name) {
        return;
    }

    const convInput = document.getElementById("inputFrom");
    const numInput = document.getElementById("numeralInput");
    const mainInputLine = document.querySelector(".input-line");
    const mainResultLine = document.querySelector(".result-line");

    if (display.classList.contains("mode-conv") && convInput) {
        window.globalValue = convInput.value;
    } else if (display.classList.contains("mode-numeral") && numInput) {
        window.globalValue = numInput.value;
    } else {
        let valResult = mainResultLine ? mainResultLine.textContent.trim() : "";
        let valInput = mainInputLine ? mainInputLine.textContent.trim() : "";

        if (valResult !== "" && valResult !== "0") {
            window.globalValue = valResult;
        } else if (valInput !== "") {
            window.globalValue = valInput;
        } else {
            window.globalValue = "0";
        }
    }

    display.classList.remove("mode-conv", "mode-numeral");
    calculator.classList.remove("mode-advanced");
    settingsMenu.querySelectorAll('li').forEach(li => li.classList.remove("active"));

    const activeItem = settingsMenu.querySelector(`[data-mode="${name}"]`) ||
        settingsMenu.querySelector(`[data-converter="${name}"]`);
    if (activeItem) {
        activeItem.classList.add("active");
    }

    if (typeof converters !== 'undefined' && converters[name]) {
        currentConverter = name;
        display.classList.add("mode-conv");
        updateUnits(name);
        if (convInput) convInput.value = window.globalValue;
        activeConverterInput = convInput;
        convert();
    } else if (name === "numeral") {
        display.classList.add("mode-numeral");
        if (numInput) {
            let cleanValue = window.globalValue.replace(/[^0-9a-fA-F.]/g, '');
            numInput.value = cleanValue || "0";
            if (typeof convertNumeral === "function") {
                convertNumeral();
            }
        }
        activeConverterInput = numInput;
    } else {
        if (name === "advanced") {
            calculator.classList.add("mode-advanced");
        }
        if (mainResultLine) mainResultLine.textContent = window.globalValue;
        activeConverterInput = null;
    }

    settingsMenu.classList.remove("open");
}

settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle("open");
});

settingsMenu.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item) return;
    const target = item.dataset.mode || item.dataset.converter;
    if (target) switchMode(target);
});

document.addEventListener("click", () => {
    settingsMenu.classList.remove("open");
});

document.addEventListener("DOMContentLoaded", () => {
    switchMode("basic");
});
