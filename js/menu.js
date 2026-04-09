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
    const display = document.querySelector(".display");
    const menu = document.querySelector(".settings-menu");
    const input = document.getElementById("inputFrom");
    input.readOnly = true;
    const result = document.getElementById("resultTo");
    const from = document.getElementById("unitFrom");
    const to = document.getElementById("unitTo");
    const converterItems = document.querySelectorAll("[data-converter]");
    const buttons = document.querySelectorAll("[data-key]");
    const converterInputs = document.querySelectorAll('.conv-input, .card-input');

    let currentConverter = "length";
    const converters = {
        length: {
            mm: 0.001,
            cm: 0.01,
            m: 1,
            km: 1000
        },
        weight: {
            g: 0.001,
            kg: 1,
            t: 1000
        },
        area: {
            mm2: 0.000001,
            cm2: 0.0001,
            m2: 1,
            km2: 1000000
        }
    };

    function updateUnits(type) {
        from.innerHTML = "";
        to.innerHTML = "";
        const units = converters[type];
        for (let unit in units) {
            const option1 = document.createElement("option");
            option1.value = unit;
            option1.textContent = unit;
            from.appendChild(option1);
            const option2 = document.createElement("option");
            option2.value = unit;
            option2.textContent = unit;
            to.appendChild(option2);
        }

    }

    function convert() {
        let expression = input.value;
        let value = 0;

        if (expression) {
            let openBrackets = (expression.match(/\(/g) || []).length;
            let closeBrackets = (expression.match(/\)/g) || []).length;
            for (let i = 0; i < openBrackets - closeBrackets; i++) {
                expression += ")";
            }

            try {
                if (typeof calculateFactorial === "function") {
                    expression = expression.replace(/(\d+)!/g, (match, num) => calculateFactorial(parseInt(num)));
                }
                expression = expression.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
                expression = expression.replace(/\^/g, "**");
                expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
                expression = expression.replace(/[+\-*/.]$/, '');
                
                value = new Function('return ' + expression)();
            } catch (error) {
                value = NaN; 
            }
        }

        if (isNaN(value) || value === undefined) {
            result.textContent = "0";
            return;
        }

        const units = converters[currentConverter];
        const fromValue = units[from.value];
        const toValue = units[to.value];
        
        const baseValue = value * fromValue; 
        const converted = baseValue / toValue;
        
        if (converted === 0 && value !== 0) {
        result.textContent = converted.toPrecision(6);
    } else {
        result.textContent = parseFloat(converted.toFixed(6)).toString();
    }
    }

    input.addEventListener("input", convert);
    from.addEventListener("change", convert);
    to.addEventListener("change", convert);

    converterInputs.forEach(inputField => {
        inputField.type = 'text';
        inputField.readOnly = true; 

        inputField.addEventListener('click', () => {
            activeConverterInput = inputField;
        });
    });

    converterItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            if (item.classList.contains("active")) {
                converterItems.forEach(el => el.classList.remove("active"));
                display.classList.remove("mode-conv");
                menu.classList.remove("open");
                activeConverterInput = null;
                return;
            }
            converterItems.forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            const type = item.dataset.converter;
            currentConverter = type;
            updateUnits(type);
            display.classList.add("mode-conv");
            menu.classList.remove("open");
            activeConverterInput = input;
            if (activeConverterInput.value === "") {
                activeConverterInput.value = "0";
            }
            convert();
        });
    });

});
