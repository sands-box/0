// js/audio-manager.js

const audioManager = (() => {
    let sounds = {};
    let isInitialized = false;
    let currentMusicKey = null;

    function init() {
        if (isInitialized) return;
        if (Howler.ctx && Howler.ctx.state && Howler.ctx.state === 'suspended') { Howler.ctx.resume(); }
        sounds = {
            musicMenu: new Howl({ src: ['audio/music_menu.mp3'], loop: true, volume: 0.3, html5: true }),
            musicGameplay: new Howl({ src: ['audio/music_gameplay.mp3'], loop: true, volume: 0.4, html5: true }),
            phoneRing: new Howl({ src: ['audio/sfx_phone_ring.mp3'], loop: true, volume: 0.7 }),
            click: new Howl({ src: ['audio/sfx_click.mp3'], volume: 0.8 }),
            correct: new Howl({ src: ['audio/sfx_correct.mp3'], volume: 0.6 }),
            wrong: new Howl({ src: ['audio/sfx_wrong.mp3'], volume: 0.5 }),
        };
        isInitialized = true;
        console.log("Audio Manager Initialized.");
    }

    function playMusic(trackKey) {
        if (!isInitialized || currentMusicKey === trackKey) return;

        // Hentikan musik yang sedang berjalan
        if (currentMusicKey && sounds[currentMusicKey]) {
            const oldTrack = sounds[currentMusicKey];
            oldTrack.fade(oldTrack.volume(), 0, 500);
        }

        // Mainkan musik baru
        currentMusicKey = trackKey;
        const newTrack = sounds[trackKey];
        if (!newTrack.playing()) {
            newTrack.play();
            newTrack.fade(0, newTrack.volume(), 1000);
        }
    }

    function playSFX(sfxKey) {
        if (!isInitialized || !sounds[sfxKey]) return;
        if (sounds[sfxKey].loop() && sounds[sfxKey].playing()) return;
        sounds[sfxKey].play();
    }
    
    function stopSound(sfxKey) {
        if (!isInitialized || !sounds[sfxKey]) return;
        sounds[sfxKey].stop();
    }

    function stopAllMusic() {
        if (!isInitialized) return;
        if (currentMusicKey && sounds[currentMusicKey]) {
            sounds[currentMusicKey].stop();
        }
        currentMusicKey = null;
    }
    
    return { init, playMenuMusic: () => playMusic('musicMenu'), playGameplayMusic: () => playMusic('musicGameplay'), playClick: () => playSFX('click'), playCorrect: () => playSFX('correct'), playWrong: () => playSFX('wrong'), startPhoneRing: () => playSFX('phoneRing'), stopPhoneRing: () => stopSound('phoneRing'), stopAllMusic };
})();