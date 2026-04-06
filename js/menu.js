const settingsBtn = document.querySelector(".toggle");
const settingsMenu = document.querySelector(".settings-menu");
const calculator = document.querySelector(".calculator");

settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle("open");
});

settingsMenu.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item) {
        return;
    }
    const mode = item.dataset.mode;
    if (mode) {
        if (item.classList.contains("active")) {
            settingsMenu.classList.remove("open");
            return;
        }
        settingsMenu.querySelectorAll('li[data-mode]').forEach(li => {
            li.classList.remove("active");
        });
        item.classList.add("active");
        if (mode === "advanced") {
            calculator.classList.add("mode-advanced");
        } else {
            calculator.classList.remove("mode-advanced");
        }
        settingsMenu.classList.remove("open");
    }
});

document.addEventListener("click", () => {
    settingsMenu.classList.remove("open");
});

document.addEventListener("DOMContentLoaded", () => {
    const lengthBtn = document.querySelector('[data-converter="length"]');
    const display = document.querySelector(".display");
    const menu = document.querySelector(".settings-menu");
    if (lengthBtn) {
        lengthBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = lengthBtn.classList.contains("active");
            if (isActive) {
                lengthBtn.classList.remove("active");
                display.classList.remove("mode-conv");
            } else {
                lengthBtn.classList.add("active");
                display.classList.add("mode-conv");
            }
            menu.classList.remove("open");
        });
    }
});
