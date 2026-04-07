const keys = document.querySelectorAll('.but-num, .but-symb, .but-long');
const display_input = document.querySelector('.input-line');
const display_output = document.querySelector('.result-line');

let input = "";

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (value === "C") {
            input = "";
            display_input.value = "";
            display_output.innerHTML = "0";
        } else if (value === "=") {
            if (input === "") return;
            try {
                let result = Function(`return ${PerpareInput(input)}`)();
                display_output.innerHTML = CleanOutput(result);
            } catch (e) {
                display_output.innerHTML = "Error";
            }
        } else if (value === "()") {
            let open = input.split("(").length - 1;
            let close = input.split(")").length - 1;
            input += open <= close ? "(" : ")";
            display_input.value = CleanInput(input);
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.value = CleanInput(input);
            }
        }
    });
}

function CleanInput(input) {
    return input.split("").map(char => {
        switch(char) {
            case "×": return ` × `;
            case "÷": return ` ÷ `;
            case "+": return ` + `;
            case "-": return ` - `;
            case "(": return `(`;
            case ")": return `)`;
            case "%": return ` % `;
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
    let last = input.slice(-1);
    const operators = ["+", "-", "×", "÷"];
    if (value === "." && last === ".") {
        return false;
    }
    if (operators.includes(value) && operators.includes(last)) {
        return false;
    }
    return true;
}


function PerpareInput(input) {
    return input.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
}
