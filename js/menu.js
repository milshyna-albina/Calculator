const settingsBtn = document.querySelector(".toggle");
const settingsMenu = document.querySelector(".settings-menu");
const calculator = document.querySelector(".calculator");

settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle("open");
});

settingsMenu.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item || !item.dataset.mode) {
        return;
    }
    const selectedMode = item.dataset.mode;
    if (item.classList.contains("active")) {
        console.log("Этот режим уже включен, игнорируем клик");
        settingsMenu.classList.remove("open");
        return;
    }
    settingsMenu.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    item.classList.add("active");
    if (selectedMode === "advanced") {
        calculator.classList.add("mode-advanced");
        console.log("Переключено на Advanced");
    } else {
        calculator.classList.remove("mode-advanced");
        console.log("Возврат в Basic");
    }
    settingsMenu.classList.remove("open");
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
                console.log("Конвертер выключен, возврат к цифрам");
            } else {
                lengthBtn.classList.add("active");
                display.classList.add("mode-conv");
                console.log("Конвертер включен");
            }
            menu.classList.remove("open");
        });
    }
});
