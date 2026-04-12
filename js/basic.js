function clear() {
    window.globalValue = "0";

    const mainInputLine = document.querySelector(".input-line");
    const mainResultLine = document.querySelector(".result-line");
    if (mainInputLine)  {
        mainInputLine.textContent = "";
    }
    if (mainResultLine) {
        mainResultLine.textContent = "0";
    }

    const numInput = document.getElementById("numeralInput");
    const numResult = document.getElementById("numeralResult");
    const convInput = document.getElementById("inputFrom");

    if (numInput) numInput.textContent = "0";
    if (numResult) numResult.textContent = "0";
    if (convInput) convInput.textContent = "0";

    if (typeof convert === "function") {
        convert();
    }
    lastResult = null;
    return { input: "", out: "0" };
}

function formatInputDisplay(str) {
    if (!str) return "";
    
    let cleanStr = str.toString().replace(/\s/g, "");
    
    return cleanStr.replace(/\d+(?:\.\d+)?/g, (number) => {
        let [integer, decimal] = number.split(".");

        let formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
    });
}

function calculate(inputStr) {
    if (inputStr === "") return null;
    if (/([÷×\/*%^]){2,}/.test(inputStr)) {
        return "Error";
    }
    inputStr = inputStr.replace(/\s/g, "")

    try {
        let prepared = inputStr.replace(/(\d+)!/g, (match, num) => calculateFactorial(parseInt(num)));
        prepared = prepared.replace(/(\d)\(/g, "$1*(").replace(/\)(\d)/g, ")*$1").replace(/\)\(/g, ")*(");
        prepared = prepared.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
        prepared = prepared.replace(/√(\d+(?:\.\d+)?)/g, "Math.sqrt($1)");

        prepared = prepared.replace(/×/g, "*").replace(/÷/g, "/");
        prepared = prepared.replace(/%(\d)/g, "% * $1");

        prepared = prepared.replace(/([\*\/])\s*(\d+\.?\d*)%/g, "$1 ($2/100)");
        prepared = prepared.replace(/(\d+\.?\d*)%\s*([\*\/])/g, "($1/100) $2");

        while (prepared.includes('%')) {
            let match = prepared.match(/([\d.)]+)\s*([+\-])\s*(\d+\.?\d*)%/);
            if (match) {
                prepared = prepared.replace(match[0], `(${match[1]}${match[2]}(${match[1]}*${match[3]}/100))`);
            } else {
                prepared = prepared.replace(/(\d+\.?\d*)%/g, "($1/100)");
            }
        }
        prepared = prepared.replace(/\^/g, "**");

        const result = Function(`return ${prepared}`)();
        return Number.isFinite(result) ? parseFloat(result.toFixed(10)) : result;
    } catch (e) {
        return "Error";
    }
}

function toggleSign(input, lastResult, justCalculated) {
    let current = input.toString().replace(/\s/g, "");
    if (justCalculated && lastResult !== null) current = lastResult.toString();
    if (current === "" || current === "0") {
        return current;
    }

    const bracketMatch = current.match(/\(-\d+\.?\d*\)$/);
    if (bracketMatch) {
        return current.slice(0, -bracketMatch[0].length) + bracketMatch[0].slice(2, -1);
    }

    const lastNumberMatch = current.match(/(\d+\.?\d*)$/);
    if (lastNumberMatch) {
        let num = lastNumberMatch[0];
        let before = current.substring(0, lastNumberMatch.index);
        let lastChar = before.slice(-1);

        if (lastChar === "-") {
            let bMinus = before.slice(0, -1);
            return (bMinus !== "" && !/[+×÷-]/.test(bMinus.slice(-1))) ? bMinus + "+" + num : bMinus + num;
        }
        if (lastChar === "+") {
            return before.slice(0, -1) + "-" + num;
        }
        return before + "(-" + num + ")";
    }
    return current;
}

function format(output) {
    if (output === "Error" || output === "Undefined") {
        return output;
    }
    let [integer, decimal] = output.toString().split(".");
    let arr = integer.split("");
    if (arr.length > 3) {
        for (let i = arr.length - 3; i > 0; i -= 3) {
            arr.splice(i, 0, " ");
        }
    }
    return decimal ? arr.join("") + "." + decimal : arr.join("");
}
