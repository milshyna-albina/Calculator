let activeConverterInput = null;

document.addEventListener('DOMContentLoaded', () => {
    const converterInputs = document.querySelectorAll('.conv-input, .card-input');

    converterInputs.forEach(inputField => {
        inputField.type = 'text';
        inputField.readOnly = true; 

        inputField.addEventListener('click', () => {
            activeConverterInput = inputField;
            
            converterInputs.forEach(i => i.style.outline = 'none');
        });
    });

    const calcLines = document.querySelector('.calc-lines');
    if (calcLines) {
        calcLines.addEventListener('click', () => {
            activeConverterInput = null;
            converterInputs.forEach(i => i.style.outline = 'none');
        });
    }
});