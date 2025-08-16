gsap.registerPlugin(TextPlugin);
let gameState = {
    currentChapter: null,
    currentCase: null,
    completedCases: [],
    activeView: '2D',
    showGridNumbers: true,
    currentMode: 'arsip',
};
const screens = {
    splash: document.getElementById('splash-screen'),
    introCutscene: document.getElementById('intro-cutscene-screen'),
    mainMenu: document.getElementById('main-menu-screen'),
    chapterSelect: document.getElementById('chapter-select-screen'),
    caseBoard: document.getElementById('case-board-screen'),
    briefing: document.getElementById('briefing-screen'),
    game: document.getElementById('game-screen'),
    cutscene: document.getElementById('cutscene-screen'),
};
const modals = {
    customLab: document.getElementById('custom-lab-modal'),
    office: document.getElementById('office-modal'),
    tutorial: document.getElementById('tutorial-modal'),
    credits: document.getElementById('credits-modal'),
    hint: document.getElementById('hint-modal'),
    report: document.getElementById('report-modal'),
};
const workspaces = {
    canvas2D: document.getElementById('canvas-2d-container'),
    three: document.getElementById('three-canvas-container'),
    blackboard: document.getElementById('blackboard-workspace'),
};
const DOMElements = {
    // Judul & Kontainer
    chapterTitle: document.getElementById('chapter-title'),
    caseBoardContainer: document.getElementById('case-board-container'),
    gameContainer: document.getElementById('game-container'),
    leftPanel: document.getElementById('left-panel'),
    rightPanel: document.getElementById('right-panel'),
    // Briefing
    briefingTitle: document.getElementById('briefing-title'),
    briefingText: document.getElementById('briefing-text'),
    continueToGameBtn: document.getElementById('continue-to-game-btn'),
    // Info di dalam Game
    caseTitle: document.getElementById('case-title'),
    caseBriefing: document.getElementById('case-briefing'),
    workspaceTitle: document.getElementById('workspace-title'),
    // Tombol & Input
    mapToggleButtons: document.getElementById('map-toggle-buttons'),
    view2DBtn: document.getElementById('view-2d-btn'),
    view3DBtn: document.getElementById('view-3d-btn'),
    answerForm: document.getElementById('answer-form'),
    multipleChoiceContainer: document.getElementById('multiple-choice-answers'),
    xInput: document.getElementById('x-input'),
    yInput: document.getElementById('y-input'),
    submitAnswerBtn: document.getElementById('submit-answer-btn'),
    hintBtn: document.getElementById('hint-btn'),
    // Feedback & UI
    feedbackArea: document.getElementById('feedback-area'),
    hintText: document.getElementById('hint-text'),
    reportText: document.getElementById('report-text'),
    cutsceneText: document.getElementById('cutscene-text'),
    eliminationUI: document.getElementById('elimination-ui'),
    substitutionUI: document.getElementById('substitution-ui'),
    // Kontrol Workspace
    toggleGridBtn: document.getElementById('toggle-grid-btn'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    exitFullscreenBtn: document.getElementById('exit-fullscreen-btn'),
    workspaceContainer: document.getElementById('workspace-container'),
};
const chapters = [bab1];
function showScreen(screen) {
    Object.values(screens).forEach(s => {
        if (s.id !== screen.id) {
            gsap.to(s, { opacity: 0, duration: 0.3, onComplete: () => s.classList.add('hidden') });
        }
    });
    screen.classList.remove('hidden');
    gsap.fromTo(screen, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.3 });
    if (screen.id === 'main-menu-screen') {
        audioManager.playMenuMusic();
        gsap.from(".menu-option-card", { duration: 0.5, opacity: 0, y: 50, stagger: 0.2, delay: 0.5, ease: "back.out(1.7)" });
    } else if (screen.id === 'chapter-select-screen' || screen.id === 'case-board-screen') {
        audioManager.playMenuMusic();
    } else if (screen.id === 'game-screen') {
        audioManager.playGameplayMusic();
    } else if (screen.id === 'splash-screen') {
        audioManager.stopAllMusic();
    }
}
function showModal(modal) { modal.classList.remove('hidden'); gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 }); }
function hideModal(modal) { gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.classList.add('hidden') }); }
function showIntroCutscene() {
    showScreen(screens.introCutscene);
    audioManager.startPhoneRing();
    gsap.fromTo("#ringing-phone", { rotation: 0 }, { rotation: 15, yoyo: true, repeat: -1, duration: 0.2, ease: "power1.inOut" });
}
function startDialogScene() {
    gsap.killTweensOf("#ringing-phone");
    audioManager.stopPhoneRing();
    const scene1 = document.getElementById('scene-1');
    const scene2 = document.getElementById('scene-2');
    gsap.to(scene1, { opacity: 0, duration: 0.5, onComplete: () => scene1.classList.add('hidden') });
    scene2.classList.remove('hidden');
    gsap.from(scene2, { opacity: 0, duration: 0.5, delay: 0.5 });
    const continueBtn = document.getElementById('continue-dialog-btn');
    const tl = gsap.timeline({ onComplete: () => { continueBtn.classList.remove('hidden'); gsap.from(continueBtn, { opacity: 0 }); } });
    tl.to(document.getElementById('dialog-line-1'), { duration: 4, text: "Detektif Alvis? Aku tidak punya banyak waktu.", delay: 1 })
      .to(document.getElementById('dialog-line-2'), { duration: 6, text: "Seseorang yang menamai dirinya 'Dalang Persamaan' kembali beraksi." })
      .to(document.getElementById('dialog-line-3'), { duration: 8, text: "Dia tidak mencuri uang... dia meninggalkan teka-teki matematis. Hanya kau yang bisa menghentikannya." });
}
function startFinalScene() {
    const scene2 = document.getElementById('scene-2');
    const scene3 = document.getElementById('scene-3');
    gsap.to(scene2, { opacity: 0, duration: 0.5, onComplete: () => scene2.classList.add('hidden') });
    scene3.classList.remove('hidden');
    gsap.from(scene3, { opacity: 0, duration: 0.5, delay: 0.5 });
    gsap.from([document.getElementById('alvis-line-1'), document.getElementById('alvis-line-2'), document.getElementById('enter-office-btn')], { opacity: 0, y: 20, stagger: 1, delay: 1 });
}
function generateChapterSelect() {
    const container = document.getElementById('chapter-container');
    container.innerHTML = '';
    chapters.forEach((chapter, index) => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `<div class="chapter-icon"><i class="fa-solid fa-book-bookmark"></i></div><div class="chapter-info"><h3>${chapter.chapterTitle}</h3><p>Berisi ${chapter.cases.length} kasus investigasi.</p></div>`;
        card.addEventListener('click', () => {
            gameState.currentChapter = chapter;
            generateCaseBoard(chapter);
            showScreen(screens.caseBoard);
        });
        container.appendChild(card);
    });
}
function generateCaseBoard(chapter) {
    DOMElements.chapterTitle.textContent = chapter.chapterTitle;
    DOMElements.caseBoardContainer.innerHTML = '';
    chapter.cases.forEach((caseData, index) => {
        const isCompleted = gameState.completedCases.includes(caseData.title);
        const caseEl = document.createElement('div');
        caseEl.className = `case-file ${isCompleted ? 'completed' : ''}`;
        let iconClass = isCompleted ? 'fa-solid fa-check-circle' : 'fa-solid fa-folder-open';
        caseEl.innerHTML = `<div class="case-icon"><i class="${iconClass}"></i></div><div class="case-title">${caseData.title}</div>`;
        caseEl.addEventListener('click', () => {
            gameState.currentMode = 'arsip';
            gameState.currentCase = chapter.cases[index];
            showBriefing();
        });
        DOMElements.caseBoardContainer.appendChild(caseEl);
    });
}
function showBriefing() {
    const caseData = gameState.currentCase;
    DOMElements.briefingTitle.textContent = caseData.title;
    showScreen(screens.briefing);
    DOMElements.continueToGameBtn.classList.add('hidden');
    DOMElements.briefingText.innerHTML = '';
    const lines = caseData.briefing.split('\n');
    lines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line || '\u00A0'; 
        DOMElements.briefingText.appendChild(p);
    });
    gsap.fromTo(DOMElements.briefingText.children, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.5, ease: 'power2.out',
        onComplete: () => {
            DOMElements.continueToGameBtn.classList.remove('hidden');
            gsap.from(DOMElements.continueToGameBtn, { opacity: 0, y: 20 });
        }
    });
}
function resetGameScreen() {
    threeScene.stopAnimation();
    DOMElements.rightPanel.classList.remove('hidden');
    DOMElements.gameContainer.style.gridTemplateColumns = ''; 
    Object.values(workspaces).forEach(ws => ws.classList.add('hidden'));
    DOMElements.mapToggleButtons.classList.add('hidden');
    DOMElements.toggleGridBtn.classList.add('hidden');
    DOMElements.eliminationUI.classList.add('hidden');
    DOMElements.substitutionUI.classList.add('hidden');
    DOMElements.multipleChoiceContainer.classList.add('hidden');
    DOMElements.answerForm.classList.remove('hidden'); 
    DOMElements.caseTitle.textContent = '';
    DOMElements.caseBriefing.innerHTML = '';
    DOMElements.workspaceTitle.innerHTML = '';
    DOMElements.feedbackArea.textContent = '';
    DOMElements.feedbackArea.className = '';
    DOMElements.xInput.value = '';
    DOMElements.yInput.value = '';
    DOMElements.hintBtn.disabled = false;
}
function loadCase(caseData) {
    resetGameScreen();
    DOMElements.caseTitle.textContent = caseData.title;
    let briefingContent = `<p>${caseData.briefing.replace(/\n/g, '<br>')}</p>`;
    DOMElements.caseBriefing.innerHTML = briefingContent;
    DOMElements.hintBtn.disabled = !caseData.hint; 
    if (!caseData.workspace) {
        DOMElements.rightPanel.classList.add('hidden');
        DOMElements.gameContainer.style.gridTemplateColumns = '1fr';
    } else {
        if (caseData.workspace === 'peta') {
            DOMElements.mapToggleButtons.classList.remove('hidden');
            setupMapView(caseData);
        } else {
            workspaces.blackboard.classList.remove('hidden');
            DOMElements.workspaceTitle.innerHTML = `<i class="fa-solid fa-chalkboard"></i> Papan Tulis Digital`;
            if (caseData.workspace === 'eliminasi') {
                DOMElements.eliminationUI.classList.remove('hidden');
                interactiveUI.setupEliminationUI(DOMElements.eliminationUI, caseData.eq, (finalEq) => {
                    DOMElements.feedbackArea.textContent = `Hasil Eliminasi: ${finalEq}`;
                    DOMElements.feedbackArea.classList.add('correct');
                });
            }
            if (caseData.workspace === 'substitusi') {
                DOMElements.substitutionUI.classList.remove('hidden');
                interactiveUI.setupSubstitutionUI(DOMElements.substitutionUI, caseData.eq, (finalEq) => {
                    DOMElements.feedbackArea.textContent = `Hasil Substitusi: ${finalEq}`;
                    DOMElements.feedbackArea.classList.add('correct');
                });
            }
        }
    }
    if (caseData.type === 'multiple_choice') {
        DOMElements.answerForm.classList.add('hidden');
        DOMElements.multipleChoiceContainer.classList.remove('hidden');
        DOMElements.multipleChoiceContainer.innerHTML = '';
        caseData.options.forEach((option, idx) => {
            const btn = document.createElement('button');
            btn.className = 'game-button';
            btn.textContent = option;
            btn.onclick = () => { checkAnswer(idx); };
            DOMElements.multipleChoiceContainer.appendChild(btn);
        });
    } else {
        DOMElements.answerForm.classList.remove('hidden');
        DOMElements.multipleChoiceContainer.classList.add('hidden');
    }
}
function setupMapView(caseData) {
    DOMElements.workspaceTitle.innerHTML = `<i class="fa-solid fa-map"></i> Peta Kota (${gameState.activeView.toUpperCase()})`;
    DOMElements.view2DBtn.classList.toggle('active', gameState.activeView === '2D');
    DOMElements.view3DBtn.classList.toggle('active', gameState.activeView === '3D');
    DOMElements.toggleGridBtn.classList.toggle('hidden', gameState.activeView !== '2D');
    if (gameState.activeView === '2D') {
        workspaces.canvas2D.classList.remove('hidden');
        workspaces.three.classList.add('hidden');
        threeScene.stopAnimation();
        setup2DMapInteraction(document.getElementById('map-canvas'), caseData.eq, () => gameState.showGridNumbers);
    } else {
        workspaces.canvas2D.classList.add('hidden');
        workspaces.three.classList.remove('hidden');
        threeScene.init3DMap(workspaces.three, caseData.eq);
    }
}
function checkAnswer(selectedIndex = null) {
    const caseData = gameState.currentCase;
    let isCorrect = false;

    if (caseData.type === 'multiple_choice') {
        isCorrect = (selectedIndex === caseData.sol);
    } else if (caseData.sol) {
        const userX = parseFloat(DOMElements.xInput.value);
        const userY = parseFloat(DOMElements.yInput.value);
        if (isNaN(userX) || isNaN(userY)) {
            DOMElements.feedbackArea.textContent = 'Input tidak valid.';
            DOMElements.feedbackArea.className = 'wrong';
            return;
        }
        const dist = Math.sqrt(Math.pow(userX - caseData.sol.x, 2) + Math.pow(userY - caseData.sol.y, 2));
        isCorrect = dist < 0.1;
        if (!isCorrect && dist < 2) {
            DOMElements.feedbackArea.textContent = 'Hampir benar. Analisismu sudah dekat!';
            DOMElements.feedbackArea.className = 'wrong';
            return;
        }
    }
    if (isCorrect) {
        audioManager.playCorrect();
        const caseTitle = caseData.title;
        if (!gameState.completedCases.includes(caseTitle)) {
            gameState.completedCases.push(caseTitle);
        }
        DOMElements.reportText.textContent = `Kasus "${caseTitle}" berhasil dipecahkan. Kerja bagus, Detektif!`;
        showModal(modals.report);
    } else {
        audioManager.playWrong();
        DOMElements.feedbackArea.textContent = 'Analisis tidak tepat. Coba lagi.';
        DOMElements.feedbackArea.className = 'wrong';
    }
}
function checkAndShowCutscene() {
    if (gameState.currentMode !== 'arsip') return false;
    const caseIndex = gameState.currentChapter.cases.findIndex(c => c.title === gameState.currentCase.title);
    const cutsceneKey = `afterCase${caseIndex + 1}`;
    const cutsceneText = gameState.currentChapter.cutscenes?.[cutsceneKey];
    if (cutsceneText) {
        DOMElements.cutsceneText.textContent = '';
        showScreen(screens.cutscene);
        gsap.to(DOMElements.cutsceneText, { duration: 8, text: cutsceneText, ease: "none" });
        return true;
    }
    return false;
}
function exportCustomProblem() {
    const eq1 = document.getElementById('custom-eq1').value;
    const eq2 = document.getElementById('custom-eq2').value;
    const solX = document.getElementById('custom-sol-x').value;
    const solY = document.getElementById('custom-sol-y').value;

    if (!eq1 || !eq2 || !solX || !solY) {
        alert("Harap isi semua kolom sebelum mengekspor.");
        return;
    }

    const problemData = {
        title: "Soal Kustom Detektif SPLDV",
        eq: [eq1, eq2],
        sol: { x: parseFloat(solX), y: parseFloat(solY) }
    };

    const dataStr = JSON.stringify(problemData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detektif-spldv-soal.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function importCustomProblem() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                const data = JSON.parse(readerEvent.target.result);
                if (data.eq && data.eq.length === 2 && data.sol && typeof data.sol.x === 'number' && typeof data.sol.y === 'number') {
                    document.getElementById('custom-eq1').value = data.eq[0];
                    document.getElementById('custom-eq2').value = data.eq[1];
                    document.getElementById('custom-sol-x').value = data.sol.x;
                    document.getElementById('custom-sol-y').value = data.sol.y;
                    alert("Soal berhasil diimpor!");
                } else {
                    alert("Gagal mengimpor: Format file JSON tidak valid.");
                }
            } catch (error) {
                alert("Gagal membaca file. Pastikan file dalam format JSON yang benar.");
            }
        }
    }
    input.click();
}
function playCustomProblem() {
    const eq1 = document.getElementById('custom-eq1').value;
    const eq2 = document.getElementById('custom-eq2').value;
    const solX = document.getElementById('custom-sol-x').value;
    const solY = document.getElementById('custom-sol-y').value;

    if (!eq1 || !eq2 || !solX || !solY) {
        alert("Harap isi semua kolom sebelum bermain.");
        return;
    }
    gameState.currentMode = 'kustom';
    gameState.currentCase = {
        title: "Kasus Laboratorium Kustom",
        briefing: `Anda sedang menganalisis soal kustom.\n\nPersamaan yang diberikan adalah:\n<div class="equation">${eq1}</div><div class="equation">${eq2}</div>`,
        eq: [eq1, eq2],
        sol: { x: parseFloat(solX), y: parseFloat(solY) },
    };
    hideModal(modals.customLab);
    showScreen(screens.game);
    setTimeout(() => loadCase(gameState.currentCase), 400);
}
window.onload = () => {
    const titleEl = document.getElementById('game-title');
    titleEl.innerHTML = titleEl.innerText.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    gsap.timeline({ onComplete: () => gsap.to("#splash-icon", { scale: 1.1, duration: 1.2, repeat: -1, yoyo: true, ease: "power1.inOut" }) })
        .from("#splash-icon", { opacity: 0, scale: .5, ease: 'back.out(1.7)', duration: .8 })
        .from("#game-title span", { opacity: 0, y: -30, stagger: .05, ease: "back.out(1.7)", duration: .5 })
        .from("#game-subtitle", { opacity: 0, y: 20, duration: .5 }, "-=.3")
        .from("#start-game-btn", { opacity: 0, scale: .8, duration: .5 }, "-=.3");
    setupEventListeners();
};
function setupEventListeners() {
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.game-button, .menu-option-card, .chapter-card, .case-file')) {
            audioManager.playClick();
        }
    });
    document.getElementById('start-game-btn').addEventListener('click', () => { audioManager.init(); showIntroCutscene(); });
    document.getElementById('answer-phone-btn').addEventListener('click', startDialogScene);
    document.getElementById('continue-dialog-btn').addEventListener('click', startFinalScene);
    document.getElementById('enter-office-btn').addEventListener('click', () => showScreen(screens.mainMenu));
    document.getElementById('archives-btn').addEventListener('click', () => { generateChapterSelect(); showScreen(screens.chapterSelect); });
    document.getElementById('custom-lab-btn').addEventListener('click', () => showModal(modals.customLab));
    document.getElementById('office-btn').addEventListener('click', () => showModal(modals.office));
    document.getElementById('back-to-main-menu-from-chapter-btn').addEventListener('click', () => showScreen(screens.mainMenu));
    document.getElementById('back-to-chapter-select-btn').addEventListener('click', () => showScreen(screens.chapterSelect));
    document.getElementById('back-to-board-btn').addEventListener('click', () => {
        threeScene.stopAnimation();
        showScreen(screens.caseBoard);
        if (gameState.currentChapter) generateCaseBoard(gameState.currentChapter);
    });
    DOMElements.continueToGameBtn.addEventListener('click', () => {
        showScreen(screens.game);
        setTimeout(() => loadCase(gameState.currentCase), 400);
    });
    DOMElements.submitAnswerBtn.addEventListener('click', () => checkAnswer(null));
    document.getElementById('tutorial-btn').addEventListener('click', () => { hideModal(modals.office); showModal(modals.tutorial); });
    document.getElementById('credits-btn').addEventListener('click', () => { hideModal(modals.office); showModal(modals.credits); });
    DOMElements.hintBtn.addEventListener('click', () => {
        if(gameState.currentCase.hint) {
            DOMElements.hintText.textContent = gameState.currentCase.hint;
            showModal(modals.hint);
        }
    });
    document.getElementById('close-cutscene-btn').addEventListener('click', () => { showScreen(screens.caseBoard); generateCaseBoard(gameState.currentChapter); });
    document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        hideModal(modal);
        if (modal.id === 'report-modal') {
            if (!checkAndShowCutscene()) {
                showScreen(screens.caseBoard);
                if (gameState.currentChapter) generateCaseBoard(gameState.currentChapter);
            }
        }
    }));
    document.getElementById('export-btn').addEventListener('click', exportCustomProblem);
    document.getElementById('import-btn').addEventListener('click', importCustomProblem);
    document.getElementById('play-custom-btn').addEventListener('click', playCustomProblem);
    DOMElements.view2DBtn.addEventListener('click', () => { gameState.activeView = '2D'; setupMapView(gameState.currentCase); });
    DOMElements.view3DBtn.addEventListener('click', () => { gameState.activeView = '3D'; setupMapView(gameState.currentCase); });
    DOMElements.toggleGridBtn.addEventListener('click', () => {
        gameState.showGridNumbers = !gameState.showGridNumbers;
        draw2DMap(document.getElementById('map-canvas'), gameState.currentCase.eq, gameState.showGridNumbers);
    });
    DOMElements.fullscreenBtn.addEventListener('click', () => {
        DOMElements.workspaceContainer.classList.add('fullscreen');
        setTimeout(() => { if (gameState.currentCase.workspace === 'peta') { setupMapView(gameState.currentCase); } }, 100);
    });
    DOMElements.exitFullscreenBtn.addEventListener('click', () => {
        DOMElements.workspaceContainer.classList.remove('fullscreen');
        setTimeout(() => { if (gameState.currentCase.workspace === 'peta') { setupMapView(gameState.currentCase); } }, 100);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && DOMElements.workspaceContainer.classList.contains('fullscreen')) {
            DOMElements.exitFullscreenBtn.click();
        }
    });
    window.addEventListener('resize', () => {
        if (!screens.game.classList.contains('hidden') && gameState.currentCase?.workspace === 'peta') {
            setupMapView(gameState.currentCase);
        }
    });
}