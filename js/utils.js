// js/utils.js

// File ini berisi fungsi-fungsi pembantu yang digunakan di seluruh game.
// Ia dimuat pertama kali agar fungsinya tersedia untuk semua skrip lain.

function parseEquation(eqStr) {
    eqStr = eqStr.replace(/\s/g, '').toLowerCase();
    
    if (/^x=-?\d*\.?\d*$/.test(eqStr)) {
        return { type: 'vertical', val: parseFloat(eqStr.split('=')[1]) };
    }
    if (/^y=-?\d*\.?\d*$/.test(eqStr)) {
        return { type: 'horizontal', val: parseFloat(eqStr.split('=')[1]) };
    }
    
    let m, c;
    const parts = eqStr.split('=');
    let lhs = parts[0];
    let rhs = parseFloat(parts[1]);

    const getCoeff = (term, variable) => {
        const match = term.match(new RegExp(`-?\\d*\\.?\\d*${variable}`));
        if (!match) return 0;
        if (match[0] === variable) return 1;
        if (match[0] === `-${variable}`) return -1;
        return parseFloat(match[0].replace(variable, ''));
    };

    if (lhs.includes('y') && !lhs.includes('x') && getCoeff(lhs, 'y') === 1) {
        m = getCoeff(parts[1], 'x');
        const xTerm = parts[1].match(/-?\d*\.?\d*x/);
        c = parseFloat(parts[1].replace(xTerm ? xTerm[0] : '', '')) || 0;
    } else {
        const a = getCoeff(lhs, 'x');
        const b = getCoeff(lhs, 'y');
        if (b === 0) {
            return { type: 'vertical', val: rhs / a };
        }
        m = -a / b;
        c = rhs / b;
    }
    return { type: 'linear', func: (x) => m * x + c };
}