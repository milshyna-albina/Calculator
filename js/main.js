const keys = document.querySelectorAll('.but-num, .but-symb, .but-long, .but-mem');
const display_input = document.querySelector('.input-line');
const display_output = document.querySelector('.result-line');

let input = "";
let lastResult = null;
let justCalculated = false;
let changingSign = false;
let replaceNextNumber = false;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (justCalculated && /[0-9.]/.test(value)) {
            input = "";
            display_input.style.display = "none";
            justCalculated = false;
        }

        if (value === "C") {
            const state = clear();
            input = state.input;
            display_output.innerHTML = state.out;
            display_input.innerHTML = "";
        }
        else if (value === "=") {
            const res = calculate(input);
            if (res === "Error" || !isFinite(res)) {
                display_output.innerHTML = res === "Error" ? "Error" : "Undefined";
                input = "";
            } else {
                display_output.innerHTML = format(res);
                display_input.innerHTML = CleanInput(input);
                display_input.style.display = "block";
                lastResult = res;
                input = "";
            }
            justCalculated = true;
        }
        else if (value === "+/-") {
            input = toggleSign(input, lastResult, justCalculated);
            justCalculated = false;
            display_output.innerHTML = CleanInput(input);
        } else if (value === "MR") {
            let mem = memoryRecall();
            if (mem === 0) {
                input = "0";
            } else {
                const lastNumberMatch = input.match(/(\(-\d+\.?\d*\)?|(?<=[+×÷%-])-|\d+\.?\d*)$/);
                if (lastNumberMatch) {
                    input = input.substring(0, lastNumberMatch.index) + mem.toString();
                } else {
                    input += mem.toString();
                }
            }
            display_output.innerHTML = CleanInput(input);
        } else if (value === "MC") {
            memoryClear();
        } else if (value === "M+") {
            let number = parseFloat(input || lastResult || 0);
            memoryAdd(number);
            replaceNextNumber = true;
        } else if (value === "M-") {
            let number = parseFloat(input || lastResult || 0);
            memorySubtract(number);
            replaceNextNumber = true;
        } else {
            if (/[+\-×÷%]/.test(value) || value === "+/-") {
                if (justCalculated) {
                    display_input.style.display = "none";
                    input = lastResult?.toString() || "";
                    justCalculated = false;
                }
            }
            if (ValidateInput(value)) {
                if (replaceNextNumber && /[0-9.]/.test(value)) {
                    input = input.replace(/\d+\.?\d*$/, "");
                    replaceNextNumber = false;
                }
                const lastNumberMatch = input.match(/(\d+\.?\d*)$/);
                if (lastNumberMatch && lastNumberMatch[0] === "0" && value !== ".") {
                    input = input.substring(0, lastNumberMatch.index);
                }
                let lastChar = input.slice(-1);
                if (lastChar === ")" && /[0-9.]/.test(value)) {
                    input += "×";
                }
                input += value;
                display_output.innerHTML = CleanInput(input);
            }
        }
    });
}

function CleanInput(input) {
    if (!input) {
        return "";
    }
    return input.split("").map(char => {
        switch(char) {
            case "×": return "×";
            case "÷": return "÷";
            case "+": return "+";
            case "-": return "-";
            case "%": return "%";
            default: return char;
        }
    }).join("");
}

function ValidateInput(value) {
    if (changingSign) return true;
    let last = input.slice(-1);
    const operators = ["+", "-", "×", "÷", "%"];
    if (operators.includes(value) && ["×", "÷", "%"].includes(input.slice(-2, -1)) && last === "-") {
        input = input.slice(0, -1);
        last = input.slice(-1);
    }
    if (value === "-" && ["×", "÷", "%"].includes(last)) {
        return true;
    }
    if ((value === "." && input.trim() === "") || (value === "." && operators.includes(last))) {
        input += "0";
        return true;
    }
    if (value === "." && last === ".") {
        return false;
    }
    if (operators.includes(value) && operators.includes(last)) {
        if (value === "-" && ["×", "÷", "%"].includes(last)) {
            return true;
        }
        input = input.slice(0, -1);
        return true;
    }
    return true;
}

