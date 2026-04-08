function clear() {
    return { input: "", out: "0" };
}

function calculate(inputStr) {
    if (inputStr === "") return null;
    try {
        const prepared = inputStr.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100");
        return Function(`return ${prepared}`)();
    } catch (e) {
        return "Error";
    }
}

function toggleSign(input, lastResult, justCalculated) {
    let current = input;
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
