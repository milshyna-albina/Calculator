let currentConverter = "length";
let activeConverterInput = null;

const converters = {
    length: { mm: 0.001, cm: 0.01, m: 1, km: 1000 },
    weight: { g: 0.001, kg: 1, t: 1000 },
    area: { mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000 }
};

function noDuplicateUnits() {
    const from = document.getElementById("unitFrom");
    const to = document.getElementById("unitTo");

    if (!from || !to) return;

    Array.from(from.options).forEach(opt => { opt.disabled = false; opt.hidden = false; });
    Array.from(to.options).forEach(opt => { opt.disabled = false; opt.hidden = false; });

    const selectedTo = to.value;
    const optionInFrom = Array.from(from.options).find(opt => opt.value === selectedTo);
    if (optionInFrom) {
        optionInFrom.disabled = true;
        optionInFrom.hidden = true;
    }

    const selectedFrom = from.value;
    const optionInTo = Array.from(to.options).find(opt => opt.value === selectedFrom);
    if (optionInTo) {
        optionInTo.disabled = true;
        optionInTo.hidden = true;
    }
}

function updateUnits(type) {
    const from = document.getElementById("unitFrom");
    const to = document.getElementById("unitTo");
    if (!from || !to) {
        return;
    }

    from.innerHTML = "";
    to.innerHTML = "";
    for (let unit in converters[type]) {
        const opt1 = document.createElement("option");
        opt1.value = unit;
        opt1.textContent = unit;
        from.appendChild(opt1);
        const opt2 = document.createElement("option");
        opt2.value = unit;
        opt2.textContent = unit;
        to.appendChild(opt2);

        if (to.options.length > 1) {
        to.selectedIndex = 1;
    }

    noDuplicateUnits();
    }
}

function convert() {
    const input = document.getElementById("inputFrom");
    const result = document.getElementById("resultTo");
    const from = document.getElementById("unitFrom");
    const to = document.getElementById("unitTo");
    let expression = input.value;
    let value = 0;

    if (!input || !result) {
        return;
    }
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
            expression = expression.replace(/√(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");
            expression = expression.replace(/\^/g, "**");
            expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
            expression = expression.replace(/[+\-*/.]$/, '');

            value = new Function('return ' + expression)();
        } catch (error) {
            value = NaN;
        }
    }
    if (isNaN(value)) {
        result.textContent = "0";
        return;
    }

    const units = converters[currentConverter];
    const fromValue = units[from.value];
    const toValue = units[to.value];
    const converted = (value * fromValue) / toValue;
    result.textContent = parseFloat(converted.toFixed(6)).toString();
}

function swapUnits() {
    const from = document.getElementById("unitFrom");
    const to = document.getElementById("unitTo");

    if (!from || !to) {
        return;
    }

    const tempUnit = from.value;
    from.value = to.value;
    to.value = tempUnit;

    if (typeof noDuplicateUnits === "function") {
        noDuplicateUnits();
    }

    if (typeof convert === "function") {
        convert();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inputFrom = document.getElementById("inputFrom");
    const unitFrom = document.getElementById("unitFrom");
    const unitTo = document.getElementById("unitTo");
    const converterInputs = document.querySelectorAll('.conv-input, .card-input');
    const swapBtn = document.querySelector('.swap-btn');

    noDuplicateUnits();

    if (inputFrom) {
        inputFrom.addEventListener("input", convert);
    }
    if (unitFrom) {
        unitFrom.addEventListener("change", () => {
            noDuplicateUnits();
            convert();
        });
    }
    if (unitTo) {
        unitTo.addEventListener("change", () => {
            noDuplicateUnits();
            convert();
        });
    }

    if (swapBtn) {
        swapBtn.addEventListener("click", swapUnits);
    }

    converterInputs.forEach(inputField => {
        inputField.addEventListener('click', () => {
            activeConverterInput = inputField;
        });
    });
});
