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
                activeConverterInput.textContent = "0";
            } else if (value === "=") {
                if (isNumeralMode) {
                    if (typeof calculateNumeralExpression === "function") {
                        const inputField = document.getElementById("numeralInput");
                        const exprBefore = inputField ? inputField.textContent : "";
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
                        const valBefore = inputField.textContent;
                        const valAfter = resultField.textContent;
                        const unit1 = fromUnit.value;
                        const unit2 = toUnit.value;
                        if (valBefore && valAfter) {
                            save(`${valBefore} ${unit1}`, `${valAfter} ${unit2}`);
                        }
                        if (resultField) {
                            resultField.scrollLeft = resultField.scrollWidth;
                        }
                    }
                }
            } else if (value === "+/-") {
                if (activeConverterInput.textContent !== "0") {
                    activeConverterInput.textContent = activeConverterInput.textContent.startsWith("-")
                        ? activeConverterInput.textContent.substring(1)
                        : "-" + activeConverterInput.textContent;
                }
            } else {
                const displayOps = ["+", "-", "×", "÷", "%"];
                let currentVal = activeConverterInput.textContent;
                let lastChar = currentVal.slice(-1);
                let secondLastChar = currentVal.slice(-2, -1);

                if (displayOps.includes(value)) {
                    if (displayOps.includes(lastChar)) {
                        if (lastChar === "-" && displayOps.includes(secondLastChar)) {
                            if (value !== "-") {
                                activeConverterInput.textContent = currentVal.slice(0, -2) + value;
                                activeConverterInput.dispatchEvent(new Event('input'));
                            }
                            return; 
                        } else if (value === "-" && lastChar !== "-") {
                        } else {
                            activeConverterInput.textContent = currentVal.slice(0, -1) + value;
                            activeConverterInput.dispatchEvent(new Event('input'));
                            return; 
                        }
                    }
                }

                if (isNumeralMode) {
                    if (/[0-9A-Fa-f+\-*/%()!^√.]/.test(mathValue)) {
                        if (fromBase === 2) {
                            if (activeConverterInput.textContent === "0" && mathValue !== "0") {
                                activeConverterInput.textContent = value.toUpperCase();
                            } else {
                                activeConverterInput.textContent += value.toUpperCase();
                            }
                        }
                        else if (fromBase === 16 && value.toUpperCase() === "C") {
                            activeConverterInput.textContent = (activeConverterInput.textContent === "0") ? "C" : activeConverterInput.textContent + "C";
                        }
                        else {
                            if (activeConverterInput.textContent === "0" && !/[+\-*/()]/.test(mathValue)) {
                                activeConverterInput.textContent = value.toUpperCase();
                            } else {
                                activeConverterInput.textContent += value.toUpperCase();
                            }
                        }
                    }
                } else if (isConverterMode) {
                    if (/[0-9.+\-*/%]/.test(mathValue)) {
                        if (mathValue === "." ) {
                            const parts = activeConverterInput.textContent.split(/[+\-×÷%]/);
                            if (parts[parts.length - 1].includes(".")) {
                                return;
                            }
                        }
                        activeConverterInput.textContent = (activeConverterInput.textContent === "0" && /[0-9(]/.test(mathValue)) ? mathValue : activeConverterInput.textContent + value;
                    }
                }
            }
            activeConverterInput.dispatchEvent(new Event('input'));
            setTimeout(() => {
                activeConverterInput.scrollLeft = activeConverterInput.scrollWidth;
            }, 10);
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
            justCalculated = false;
        } else if (value === "=") {
            input = input.replace(/\.(?=[+\-×÷%)]|$)/g, "");
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
            display_output.innerHTML = CleanInput(input) || "0";
            adjustDisplay(display_output);
        } else if (value === "MR") {
            let mem = memoryRecall();
            if (justCalculated) {
                input = "";
                display_input.style.display = "none";
                justCalculated = false;
            }
            if (input === "" || input === "0") {
                input = mem.toString();
            } else {
                let lastChar = input.slice(-1);
                if (/[0-9)%]/.test(lastChar)) {
                    input += "×";
                }
                input += mem.toString();
            }
            display_output.innerHTML = CleanInput(input) || input;
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
                if (input === "" && ["+", "-", "×", "÷", "%"].includes(value) && value !== "-") {
                    input = "0";
                }
                if (replaceNextNumber && /[0-9.]/.test(value)) {
                    input = input.replace(/\d+\.?\d*$/, "");
                    replaceNextNumber = false;
                }
                const lastNumberMatch = input.match(/(\d+\.?\d*)$/);
                if (lastNumberMatch && lastNumberMatch[0] === "0" && value !== "." && !["+", "-", "×", "÷", "%"].includes(value)) {
                    input = input.substring(0, lastNumberMatch.index);
                }
                let lastChar = input.slice(-1);
                if (lastChar === ")" && /[0-9.]/.test(value)) {
                    input += "×";
                }
                if (value === "(" && (/[0-9.]/.test(lastChar) || lastChar === ")")) {
                    input += "×";
                }
                if (lastChar === "%" && /[0-9]/.test(value)) {
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

    setTimeout(() => {
        element.scrollLeft = element.scrollWidth;
    }, 50);
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
    if (last === "%" && operators.includes(value) && value !== "%") {
        return true;
    }
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
    let normalized = rawText.replace(/[×*]/g, "×").replace(/[÷/]/g, "÷");
    const display = document.querySelector('.display');
    const isNumeral = display.classList.contains('mode-numeral');
    const isConverter = display.classList.contains('mode-conv');
    let allowedChars;
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
        allowedChars += "\\+\\-\\*/%×÷\\.";
    } else if (isConverter) {
        targetField = "input";
        allowedChars = "0-9\\.\\+\\-\\*/%×÷";
    } else {
        allowedChars = "0-9\\.\\+\\-\\%×÷\\(\\)\\!\\^√";
    }

    const regex = new RegExp(`[^${allowedChars}]`, 'g');
    let cleanText = normalized.replace(regex, '');
    if (!cleanText) {
        return;
    }
    if (targetField === "input") {
        const inputElement = isNumeral ? document.getElementById('numeralInput') : document.getElementById('inputFrom');
        if (inputElement) {
            if (inputElement.textContent === "0") {
                inputElement.textContent = cleanText.toUpperCase();
            } else {
                inputElement.textContent += cleanText.toUpperCase();
            }
            if (isNumeral && typeof calculateNumeralExpression === "function") {
                calculateNumeralExpression();
            } else if (isConverter && typeof convert === "function") {
                convert();
            }
            setTimeout(() => {
                inputElement.scrollLeft = inputElement.scrollWidth;
            }, 10);
        }
    } else {
        if (typeof input !== 'undefined') {
            if (justCalculated) {
                input = "";
                if (display_input) {
                    display_input.style.display = "none";
                    display_input.innerHTML = "";
                }
                justCalculated = false;
            }
            if (input === "0") {
                input = cleanText;
            } else {
                input += cleanText;
            }
            const resultLine = document.querySelector('.result-line');
            if (resultLine) {
                resultLine.innerHTML = (typeof CleanInput === 'function') ? CleanInput(input) : input;
                if (typeof adjustDisplay === 'function') {
                    adjustDisplay(resultLine);
                }
            }
        }
    }
});
