const keys = document.querySelectorAll('.but-num, .but-symb, .but-long');
const display_input = document.querySelector('.input-line');
const display_output = document.querySelector('.result-line');

let input = "";
let lastResult = null;
let justCalculated = false;
let changingSign = false;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (activeConverterInput) {
            if (value === "C") {
                activeConverterInput.value = "";
            } else if (/[0-9.]/.test(value)) {
                if (value === "." && activeConverterInput.value.includes(".")) return;
                activeConverterInput.value += value;
            }
            activeConverterInput.dispatchEvent(new Event('input'));
            return; 
        }

        if (justCalculated && /[0-9.]/.test(value)) {
            input = "";
            display_input.style.display = "none";
            display_output.innerHTML = "";
            justCalculated = false;
        }

        if (value === "C") {
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "0";
        } else if (value === "=") {
            if (input === "") return;
            try {
                let result = Function(`return ${PerpareInput(input)}`)();
                if (!isFinite(result)) {
                    display_output.innerHTML = "Undefined";
                } else {
                    display_output.innerHTML = CleanOutput(result);
                }
                display_input.style.display = "block";
                display_input.innerHTML = CleanInput(input);
                lastResult = result;
                input = "";
                justCalculated = true
            } catch (e) {
                display_output.innerHTML = "Error";
                input = "";
                justCalculated = true;
            }
        } else if (value === "+/-") {
            if (justCalculated && lastResult !== null) {
                input = lastResult.toString();
                display_input.style.display = "none";
                justCalculated = false;
            }

            if (input === "" || input === "0"){
                return;
            }

            const bracketMatch = input.match(/\(-\d+\.?\d*\)$/);
            if (bracketMatch) {
                input = input.slice(0, -bracketMatch[0].length) + bracketMatch[0].slice(2, -1);
            } else {
                const lastNumberMatch = input.match(/(\d+\.?\d*)$/);
                if (lastNumberMatch) {
                    let lastNumber = lastNumberMatch[0];
                    let beforeNumber = input.substring(0, lastNumberMatch.index);
                    let lastChar = beforeNumber.slice(-1);
                    if (lastChar === "-") {
                        let beforeMinus = beforeNumber.slice(0, -1);
                        if (beforeMinus !== "" && !/[+×÷-]/.test(beforeMinus.slice(-1))) {
                            input = beforeMinus + "+" + lastNumber;
                        } else {
                            input = beforeMinus + lastNumber;
                        }
                    }
                    else if (lastChar === "+") {
                        input = beforeNumber.slice(0, -1) + "-" + lastNumber;
                    }
                    else {
                        input = beforeNumber + "(-" + lastNumber + ")";
                    }
                }
            }
            display_output.innerHTML = CleanInput(input);
        } else {
            if (/[+\-×÷%]/.test(value) || value === "+/-") {
                if (justCalculated) {
                    display_input.style.display = "none";
                    input = lastResult?.toString() || "";
                    justCalculated = false;
                }
            }
            if (ValidateInput(value)) {let lastChar = input.slice(-1);
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

function CleanOutput(output) {
    let str = output.toString();
    let [integer, decimal] = str.split(".");
    let arr = integer.split("");

    if (arr.length > 3) {
        for (let i = arr.length - 3; i > 0; i -= 3) {
            arr.splice(i, 0, " ");
        }
    }

    if (decimal) {
        arr.push(".");
        arr.push(decimal);
    }

    return arr.join("");
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


function PerpareInput(input) {
    return input.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
}
