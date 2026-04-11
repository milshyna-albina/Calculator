const historyBtn = document.getElementById('history-button');
const historyPanel = document.getElementById('history-panel');

const menu = document.querySelector('.settings-menu');
if (historyBtn && historyPanel) {
    historyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        historyPanel.classList.toggle('hidden');
        if (menu) {
            menu.classList.remove('open');
        }
        render();
    });
    document.addEventListener('click', (e) => {
        if (!historyPanel.contains(e.target) && e.target !== historyBtn) {
            historyPanel.classList.add('hidden');
        }
    });
}

function save(expression, result) {
    if (result === "Error" || !expression) {
        return;
    }
    let formattedExp = expression.toString().replace(/([+\-×÷*/])/g, ' $1 ').replace(/\s+/g, ' ').trim();
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    history.unshift({ exp: formattedExp, res: result });
    if (history.length > 15) {
        history.pop();
    }
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

function render() {
    const list = document.getElementById('history-list');
    if (!list) {
        return;
    }
    const template = document.getElementById('history-template');
    const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    list.innerHTML = '';
    if (history.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'history-empty-msg';
        empty.textContent = 'Empty';
        list.appendChild(empty);
        return;
    }
    history.forEach(item => {
        const clone = template.content.cloneNode(true);
        const historyItem = clone.querySelector('.history-item');
        clone.querySelector('.exp').textContent = `${item.exp} =`;
        clone.querySelector('.res').textContent = item.res;
        historyItem.onclick = (e) => {
            if (!e.target.closest('.copy-history-btn')) {
                setInput(item.res);
            }
        };

        const copyBtn = clone.querySelector('.copy-history-btn');
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            const fullText = `${item.exp} = ${item.res}`;
            navigator.clipboard.writeText(fullText).then(() => {
                const img = copyBtn.querySelector('img');
                const originalSrc = img.src;
                img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUhGo11qc2JL_aP4DV4rkSUqFVYTVSk3txUQ&s";
                setTimeout(() => {
                    img.src = originalSrc;
                }, 1000);
            }).catch(err => {
                console.error('Error: ', err);
            });
        };
        list.appendChild(clone);
    });
}

function setInput(val) {
    const isNumeralMode = document.querySelector('.display').classList.contains('mode-numeral');
    const numInput = document.getElementById("numeralInput");
    if (isNumeralMode && numInput) {
        numInput.value = val;
        if (typeof convertNumeral === "function") {
            convertNumeral();
        }
    } else {
        input = val.toString();
        if (typeof display_output !== 'undefined') {
            display_output.innerHTML = CleanInput(input);
        }
    }
}

const clearHistoryBtn = document.getElementById('clear-history');
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('calcHistory');
        render();
    });
}
