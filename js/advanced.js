let memory = 0;

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    return memory;
}

function memoryAdd(value) {
    memory += value;
}

function memorySubtract(value) {
    memory -= value;
}

function calculateFactorial(n) {
    if (n < 0) return "Error"; 
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}
const advKeys = document.querySelectorAll('[data-key="!"], [data-key="^"], [data-key="√"]');

for (let key of advKeys) {
    key.addEventListener('click', (event) => {
        const isNumeralMode = display.classList.contains('mode-numeral');
        if (isNumeralMode) {
            return;
        }
        event.stopImmediatePropagation();

        const value = key.dataset.key;
        const isConverterMode = document.querySelector('.display').classList.contains('mode-conv');
        if (isConverterMode) {
            if (typeof activeConverterInput !== 'undefined' && activeConverterInput) {
                let currentVal = activeConverterInput.value;
                let lastChar = currentVal.slice(-1);
                
                if (value === "√") {
                    if (currentVal === "0") {
                        activeConverterInput.value = "√";
                    } else if (/[0-9.]/.test(lastChar) || lastChar === ")") {
                        activeConverterInput.value += "×√";
                    } else {
                        activeConverterInput.value += "√";
                    }
                } 
                else if (value === "^") {
                    if (currentVal !== "" && currentVal !== "0" && !/[+\-×÷%(^]$/.test(lastChar)) {
                        activeConverterInput.value += "^";
                    }
                } 
                else if (value === "!") {
                    if (currentVal !== "" && currentVal !== "0" && (/[0-9.]/.test(lastChar) || lastChar === ")")) {
                        activeConverterInput.value += "!";
                    }
                }
                
                activeConverterInput.dispatchEvent(new Event('input'));
            }
            return;
        }

        if (justCalculated) {
            display_input.style.display = "none";
            if (value === "√") {
                input = "√"; 
            } else {
                input = lastResult?.toString() || "";
                input += value;
            }
            justCalculated = false;
            display_output.innerHTML = CleanInput(input);
            return;
        }

        let lastChar = input.slice(-1);

        if (value === "√") {
            if (/[0-9.]/.test(lastChar) || lastChar === ")") {
                input += "×√";
            } else {
                input += "√";
            }
        } 
        else if (value === "^") {
            if (input !== "" && !/[+\-×÷%(^]$/.test(lastChar)) {
                input += "^";
            }
        } 
        else if (value === "!") {
            if (input !== "" && (/[0-9.]/.test(lastChar) || lastChar === ")")) {
                input += "!";
            }
        }

        display_output.innerHTML = CleanInput(input);
    });
}
