// js/ui-interactive.js

const interactiveUI = (() => {
    // Variabel privat, hanya bisa diakses di dalam modul ini
    let equationsState = [];
    let onSolveCallback = null;

    // --- Fungsi Helper Internal ---

    function getCoefficients(eqStr) {
        eqStr = eqStr.replace(/\s/g, '');
        const parts = eqStr.split('=');
        const lhs = parts[0];
        const rhs = parseFloat(parts[1]);

        const getCoeff = (term, variable) => {
            const regex = new RegExp(`-?\\d*\\.?\\d*${variable}`);
            const match = term.match(regex);
            if (!match) return 0;
            if (match[0] === variable) return 1;
            if (match[0] === `-${variable}`) return -1;
            return parseFloat(match[0].replace(variable, ''));
        };
        return { x: getCoeff(lhs, 'x'), y: getCoeff(lhs, 'y'), c: rhs };
    }

    function formatEquation(coeffs) {
        let str = '';
        if (coeffs.x !== 0) {
            str += `${coeffs.x === 1 ? '' : (coeffs.x === -1 ? '-' : coeffs.x)}x `;
        }
        if (coeffs.y !== 0) {
            if (coeffs.y > 0 && str.length > 0) {
                str += '+ ';
            }
            str += `${coeffs.y === 1 ? '' : (coeffs.y === -1 ? '-' : coeffs.y)}y `;
        }
        // Menghilangkan spasi di akhir jika ada
        return `${str.trim()} = ${coeffs.c}`;
    }

    // --- Logika Eliminasi ---

    function checkEliminationReady() {
        if (equationsState.length < 2) return;
        const [c1, c2] = equationsState.map(s => s.current);
        const btn = document.getElementById('eliminate-btn');
        if (!btn) return;

        // Cek apakah koefisien x atau y saling meniadakan
        if (Math.abs(c1.x + c2.x) < 0.01 || Math.abs(c1.y + c2.y) < 0.01) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }
    
    function setupEliminationUI(container, eqs, onSolve) {
        onSolveCallback = onSolve;
        container.innerHTML = '';
        equationsState = eqs.map(eq => ({ original: getCoefficients(eq), current: { ...getCoefficients(eq) } }));

        equationsState.forEach((state, index) => {
            const row = document.createElement('div');
            row.className = 'elimination-row';
            row.innerHTML = `
                <div class="multipliers">
                    <button data-op="mul" data-val="-1" title="Kalikan dengan -1">x-1</button>
                    <button data-op="mul" data-val="2" title="Kalikan dengan 2">x2</button>
                    <button data-op="mul" data-val="3" title="Kalikan dengan 3">x3</button>
                    <button data-op="reset" title="Kembalikan ke awal"><i class="fa-solid fa-undo"></i></button>
                </div>
                <div class="equation-display" id="eq-display-${index}">${formatEquation(state.current)}</div>
            `;
            container.appendChild(row);

            row.querySelector('.multipliers').addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;
                const { op, val } = button.dataset;
                if (op === 'mul') {
                    Object.keys(state.current).forEach(key => state.current[key] *= parseFloat(val));
                } else if (op === 'reset') {
                    state.current = { ...state.original };
                }
                document.getElementById(`eq-display-${index}`).textContent = formatEquation(state.current);
                checkEliminationReady();
            });
        });

        const eliminateBtn = document.createElement('button');
        eliminateBtn.id = 'eliminate-btn';
        eliminateBtn.className = 'game-button';
        eliminateBtn.textContent = 'ELIMINASI';
        eliminateBtn.disabled = true;
        container.appendChild(eliminateBtn);

        eliminateBtn.addEventListener('click', () => {
            const [eq1, eq2] = equationsState.map(s => s.current);
            const resultCoeffs = { x: eq1.x + eq2.x, y: eq1.y + eq2.y, c: eq1.c + eq2.c };
            
            const finalEqStr = formatEquation(resultCoeffs);
            if (onSolveCallback) onSolveCallback(finalEqStr);

            // Animasi Eliminasi
            const display1 = document.getElementById('eq-display-0');
            const display2 = document.getElementById('eq-display-1');
            const btnContainer1 = display1.parentElement.querySelector('.multipliers');
            const btnContainer2 = display2.parentElement.querySelector('.multipliers');

            gsap.to([btnContainer1, btnContainer2, eliminateBtn], { opacity: 0, duration: 0.5, onComplete: (el) => el?.remove() });
            gsap.to(display2, { opacity: 0, y: -20, duration: 0.5 });
            gsap.to(display1, { y: 40, duration: 0.5, onComplete: () => {
                gsap.to(display1, { textContent: `Hasil: ${finalEqStr}`, duration: 1, ease: 'none' });
            }});
        });
    }

    // --- Logika Substitusi ---

    function setupSubstitutionUI(container, eqs, onSolve) {
        onSolveCallback = onSolve;
        container.innerHTML = '';
        
        const sourceEqIndex = eqs.findIndex(eq => /^(x|y)\s*=/.test(eq.trim()));
        if (sourceEqIndex === -1) {
            container.innerHTML = "<p>Kasus ini tidak cocok untuk substitusi langsung.</p>";
            return;
        }
        
        const targetEqIndex = 1 - sourceEqIndex;
        
        const sourceVar = eqs[sourceEqIndex].split('=')[0].trim();
        const sourceExpression = eqs[sourceEqIndex].split('=')[1].trim();
        
        const row1 = document.createElement('div');
        row1.className = 'substitution-row';
        row1.innerHTML = `<div class="equation-display" id="sub-source">${sourceVar} = <span class="sub-block" tabindex="0">${sourceExpression}</span></div>`;
        
        const row2 = document.createElement('div');
        row2.className = 'substitution-row';
        const targetEqHTML = eqs[targetEqIndex].replace(new RegExp(sourceVar, 'g'), `<span class="sub-target">${sourceVar}</span>`);
        row2.innerHTML = `<div class="equation-display" id="sub-target-eq">${targetEqHTML}</div>`;
        
        container.appendChild(row1);
        container.appendChild(row2);

        container.querySelector('.sub-block').addEventListener('click', (e) => {
            executeSubstitution(container, sourceExpression, onSolveCallback);
        });
    }

    function executeSubstitution(container, expression, onSolve) {
        const subBlock = container.querySelector('.sub-block');
        const target = container.querySelector('.sub-target');
        if (!subBlock || !target || subBlock.style.opacity === '0') return;

        const targetRect = target.getBoundingClientRect();
        const blockRect = subBlock.getBoundingClientRect();

        const clone = subBlock.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${blockRect.left}px`;
        clone.style.top = `${blockRect.top}px`;
        clone.style.margin = '0';
        clone.style.pointerEvents = 'none';
        document.body.appendChild(clone);
        
        subBlock.style.opacity = '0'; // Gunakan opacity agar layout tidak berubah
        subBlock.style.pointerEvents = 'none'; // Nonaktifkan klik lagi

        gsap.to(clone, {
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height,
            padding: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                target.innerHTML = `(${expression})`;
                target.style.outline = 'none';
                target.style.background = 'rgba(255, 193, 7, 0.3)';
                gsap.to(target, { backgroundColor: 'transparent', duration: 1 });
                clone.remove();
                
                setTimeout(() => {
                    const finalEq = document.getElementById('sub-target-eq').textContent;
                    if (onSolve) onSolve(finalEq);
                }, 500);
            }
        });
    }

    // --- Publikasikan Fungsi ---
    return {
        setupEliminationUI,
        setupSubstitutionUI,
    };
})();