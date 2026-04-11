const keys = document.querySelectorAll('.but-num, .but-symb, .but-long, .but-mem');
const display_input = document.querySelector('.input-line');
const display_output = document.querySelector('.result-line');

let input = "";
let lastResult = null;
let justCalculated = false;
let changingSign = false;
let replaceNextNumber = false;

for (let key of keys) {
    key.addEventListener('click', () => {
        const display = document.querySelector('.display');
        const isConverterMode = display.classList.contains('mode-conv');
        const isNumeralMode = display.classList.contains('mode-numeral');
        const value = key.dataset.key;

        if ((isConverterMode || isNumeralMode) && activeConverterInput) {
            const numeralFromElem = document.getElementById("numeralFrom");
            const fromBase = numeralFromElem ? parseInt(numeralFromElem.value) : 10;
            const mathValue = value.replace("×", "*").replace("÷", "/");

            if (value === "AC" || (value === "C" && (!isNumeralMode || fromBase !== 16))) {
                activeConverterInput.value = "0";
            } else if (value === "=") {
                if (isNumeralMode) {
                    if (typeof calculateNumeralExpression === "function") {
                        const inputField = document.getElementById("numeralInput");
                        const exprBefore = inputField ? inputField.value : "";
                        const fromBase = document.getElementById("numeralFrom")?.value || "10";
                        const toBase = document.getElementById("numeralTo")?.value || "2";
                        calculateNumeralExpression();
                        setTimeout(() => {
                            const resultField = document.getElementById("numeralResult");
                            const finalResult = resultField ? resultField.textContent : "";
                            if (exprBefore && finalResult) {
                                save(`${exprBefore} (B${fromBase})`, `${finalResult} (B${toBase})`);
                            }
                        }, 50);
                    }
                } else if (isConverterMode) {
                    const inputField = document.getElementById("inputFrom");
                    const resultField = document.getElementById("resultTo");
                    const fromUnit = document.getElementById("unitFrom");
                    const toUnit = document.getElementById("unitTo");
                    if (inputField && resultField && fromUnit && toUnit) {
                        const valBefore = inputField.value;
                        const valAfter = resultField.textContent || resultField.value;
                        const unit1 = fromUnit.value;
                        const unit2 = toUnit.value;
                        if (valBefore && valAfter) {
                            save(`${valBefore} ${unit1}`, `${valAfter} ${unit2}`);
                        }
                    }
                }
            } else if (value === "+/-") {
                if (activeConverterInput.value !== "0") {
                    activeConverterInput.value = activeConverterInput.value.startsWith("-")
                        ? activeConverterInput.value.substring(1)
                        : "-" + activeConverterInput.value;
                }
            } else {
                const displayOps = ["+", "-", "×", "÷", "%"];
                let currentVal = activeConverterInput.value;
                let lastChar = currentVal.slice(-1);
                let secondLastChar = currentVal.slice(-2, -1);

                if (displayOps.includes(value)) {
                    if (displayOps.includes(lastChar)) {
                        if (lastChar === "-" && displayOps.includes(secondLastChar)) {
                            if (value !== "-") {
                                activeConverterInput.value = currentVal.slice(0, -2) + value;
                                activeConverterInput.dispatchEvent(new Event('input'));
                            }
                            return; 
                        } else if (value === "-" && lastChar !== "-") {
                        } else {
                            activeConverterInput.value = currentVal.slice(0, -1) + value;
                            activeConverterInput.dispatchEvent(new Event('input'));
                            return; 
                        }
                    }
                }

                if (isNumeralMode) {
                    if (/[0-9A-Fa-f+\-*/%()!^√.]/.test(mathValue)) {
                        if (fromBase === 2) {
                            if (activeConverterInput.value === "0" && mathValue !== "0") {
                                activeConverterInput.value = mathValue.toUpperCase();
                            } else {
                                activeConverterInput.value += mathValue.toUpperCase();
                            }
                        }
                        else if (fromBase === 16 && mathValue.toUpperCase() === "C") {
                            activeConverterInput.value = (activeConverterInput.value === "0") ? "C" : activeConverterInput.value + "C";
                        }
                        else {
                            if (activeConverterInput.value === "0" && !/[+\-*/()]/.test(mathValue)) {
                                activeConverterInput.value = mathValue.toUpperCase();
                            } else {
                                activeConverterInput.value += mathValue.toUpperCase();
                            }
                        }
                    }
                } else if (isConverterMode) {
                    if (/[0-9.+\-*/%]/.test(mathValue)) {
                        if (mathValue === "." ) {
                            const parts = activeConverterInput.value.split(/[+\-×÷%]/);
                            if (parts[parts.length - 1].includes(".")) {
                                return;
                            }
                        }
                        activeConverterInput.value = (activeConverterInput.value === "0" && /[0-9(]/.test(mathValue)) ? mathValue : activeConverterInput.value + value;
                    }
                }
            }
            activeConverterInput.dispatchEvent(new Event('input'));
            return;
        }
        if (justCalculated && /[0-9.]/.test(value)) {
            input = "";
            display_input.style.display = "none";
            justCalculated = false;
        }
        if (value === "C") {
            const state = clear();
            input = state.input;
            display_output.innerHTML = state.out;
            adjustDisplay(display_output);
            display_input.innerHTML = "";
            adjustDisplay(display_input);
        } else if (value === "=") {
            const res = calculate(input);
            if (res === "Error" || !isFinite(res)) {
                display_output.innerHTML = res === "Error" ? "Error" : "Undefined";
                input = "";
            } else {
                save(input, res);
                display_output.innerHTML = format(res);
                
                display_input.innerHTML = CleanInput(input);
                display_input.style.fontSize = "20px"; 
                display_input.style.opacity = "0.8"; 
                display_input.scrollLeft = display_input.scrollWidth; 

                display_input.style.display = "block";
                lastResult = res;
                input = "";
            }
            justCalculated = true;
        } else if (value === "+/-") {
            input = toggleSign(input, lastResult, justCalculated);
            justCalculated = false;
            display_output.innerHTML = CleanInput(input);
            adjustDisplay(display_output);
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
            adjustDisplay(display_output);
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
                if (value === "(" && (/[0-9.]/.test(lastChar) || lastChar === ")")) {
                    input += "×";
                }
                input += value;
                display_output.innerHTML = CleanInput(input);
                adjustDisplay(display_output);
            }
        }
    });
}

function adjustDisplay(element) {
    if (!element) return;

    const baseFontSize = 35; 
    const minFontSize = 25;  

    const textLength = element.textContent.length;

    if (textLength > 10) {
        let newSize = baseFontSize - (textLength - 10) * 1.5;
        newSize = Math.max(newSize, minFontSize); 
        element.style.fontSize = newSize + "px";
    } else {
        element.style.fontSize = baseFontSize + "px";
    }

    element.scrollLeft = element.scrollWidth;
}

function CleanInput(input) {
    if (!input) {
        return "";
    }
   let mappedStr = input.split("").map(char => {
        switch(char) {
            case "×": return "×";
            case "÷": return "÷";
            case "+": return "+";
            case "-": return "-";
            case "%": return "%";
            default: return char;
        }
    }).join("");

    let cleanStr = mappedStr.replace(/\s/g, "");
    
    return cleanStr.replace(/\d+(?:\.\d+)?/g, (number) => {
        let [integer, decimal] = number.split(".");
        let formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
    });
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

document.addEventListener('paste', (e) => {
    e.preventDefault();
    const rawText = (e.clipboardData || window.clipboardData).getData('text');
    const display = document.querySelector('.display');
    const calculator = document.querySelector('.calculator');
    const isNumeral = display.classList.contains('mode-numeral');
    const isConverter = display.classList.contains('mode-conv');
    const isAdvanced = calculator.classList.contains('mode-advanced');
    let allowedChars = "";
    let targetField = "display";

    if (isNumeral) {
        targetField = "input";
        const base = parseInt(document.getElementById("numeralFrom").value);
        if (base === 2) {
            allowedChars = "01";
        } else if (base === 16) {
            allowedChars = "0-9A-Fa-f";
        } else {
            allowedChars = "0-9";
        }
        allowedChars += "\\+\\-\\*/%\\.";
    } else if (isConverter) {
        targetField = "input";
        allowedChars = "0-9\\.\\+\\-\\*/%";
    } else if (isAdvanced) {
        allowedChars = "0-9\\.\\+\\-\\*/%\\(\\)\\!\\^√";
    } else {
        allowedChars = "0-9\\.\\+\\-\\*/%";
    }

    const regex = new RegExp(`[^${allowedChars}]`, 'g');
    let cleanText = rawText.replace(regex, '');
    if (!cleanText) {
        return;
    }
    if (targetField === "input") {
        const inputElement = isNumeral ? document.getElementById('numeralInput') : document.getElementById('inputFrom');
        if (inputElement) {
            if (inputElement.value === "0") {
                inputElement.value = cleanText.toUpperCase();
            } else {
                inputElement.value += cleanText.toUpperCase();
            }
            inputElement.dispatchEvent(new Event('input'));
            if (isNumeral && typeof calculateNumeralExpression === "function") calculateNumeralExpression();
        }
    } else {
        if (typeof input !== 'undefined') {
            if (input === "0") {
                input = cleanText;
            } else {
                input += cleanText;
            }
            const resultLine = document.querySelector('.result-line');
            if (resultLine) {
                resultLine.innerHTML = (typeof CleanInput === 'function') ? CleanInput(input) : input;
            }
        }
    }
});
