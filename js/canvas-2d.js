// js/canvas-2d.js

// Variabel state untuk peta, disimpan di luar fungsi agar nilainya tetap ada
let panOffset = { x: 0, y: 0 };
let scale = 1.0;
let isPanning = false;
let panStart = { x: 0, y: 0 };

// Fungsi utama yang dipanggil oleh main.js
function draw2DMap(canvas, equations, showGridNumbers) {
    // 1. Setup Dasar Canvas
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Fungsi helper untuk konversi koordinat, sekarang memperhitungkan zoom dan pan
    const origin = { x: width / 2 + panOffset.x, y: height / 2 + panOffset.y };
    const unit = 25 * scale; // Ukuran satu unit pada grid
    const toCanvasX = (x) => origin.x + x * unit;
    const toCanvasY = (y) => origin.y - y * unit;

    // Bersihkan canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#222'; // Latar belakang
    ctx.fillRect(0, 0, width, height);

    // 2. Gambar Grid
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    // Tentukan batas grid yang perlu digambar berdasarkan posisi dan zoom
    const xMin = Math.floor((-origin.x) / unit);
    const xMax = Math.ceil((width - origin.x) / unit);
    const yMin = Math.floor((-origin.y) / unit);
    const yMax = Math.ceil((height - origin.y) / unit);

    for (let i = xMin; i <= xMax; i++) {
        ctx.beginPath();
        ctx.moveTo(toCanvasX(i), 0);
        ctx.lineTo(toCanvasX(i), height);
        ctx.stroke();
    }
    for (let i = yMin; i <= yMax; i++) {
        ctx.beginPath();
        ctx.moveTo(0, toCanvasY(i));
        ctx.lineTo(width, toCanvasY(i));
        ctx.stroke();
    }

    // 3. Gambar Sumbu X dan Y
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, origin.y); ctx.lineTo(width, origin.y); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, height); ctx.stroke();

    // 4. Gambar Angka Koordinat (JIKA AKTIF)
    if (showGridNumbers) {
        ctx.fillStyle = '#aaa';
        ctx.font = `${Math.max(8, 12 * scale)}px Roboto Mono`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = xMin; i <= xMax; i++) {
            if (i !== 0) ctx.fillText(i, toCanvasX(i), origin.y + (15 * scale));
        }
        for (let i = yMin; i <= yMax; i++) {
            if (i !== 0) ctx.fillText(i, origin.x - (15 * scale), toCanvasY(i));
        }
    }

    // 5. Gambar Garis Persamaan
    ctx.lineWidth = 3 * scale; // Lebar garis menyesuaikan zoom
    const colors = ["#ff5722", "#03a9f4"];
    
    equations.map(e => parseEquation(e)).forEach((line, i) => {
        if (!line) return;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath();
        
        // Hitung titik potong garis dengan batas layar, bukan ujung grid
        // Ini memastikan garis selalu terlihat penuh dari ujung ke ujung
        if (line.type === 'linear') {
            const yAtLeft = line.func((0 - origin.x) / unit);
            const yAtRight = line.func((width - origin.x) / unit);
            ctx.moveTo(0, toCanvasY(yAtLeft));
            ctx.lineTo(width, toCanvasY(yAtRight));
        } else if (line.type === 'vertical') {
            ctx.moveTo(toCanvasX(line.val), 0);
            ctx.lineTo(toCanvasX(line.val), height);
        } else if (line.type === 'horizontal') {
            ctx.moveTo(0, toCanvasY(line.val));
            ctx.lineTo(width, toCanvasY(line.val));
        }
        ctx.stroke();
    });
}

// --- Fungsi Setup Interaksi (BARU) ---

// Variabel untuk memastikan kita tidak menambahkan listener berulang kali
let isListenerAttached = false;

function setup2DMapInteraction(canvas, equations, getGridNumberState) {
    if (!isListenerAttached) {
        // Event untuk memulai Panning (geser)
        canvas.addEventListener('mousedown', (e) => {
            isPanning = true;
            panStart.x = e.clientX - panOffset.x;
            panStart.y = e.clientY - panOffset.y;
        });

        // Event saat mouse bergerak
        canvas.addEventListener('mousemove', (e) => {
            if (isPanning) {
                panOffset.x = e.clientX - panStart.x;
                panOffset.y = e.clientY - panStart.y;
                // Gambar ulang peta dengan posisi baru
                draw2DMap(canvas, equations, getGridNumberState());
            }
        });

        // Event saat mouse dilepas atau keluar area
        canvas.addEventListener('mouseup', () => { isPanning = false; });
        canvas.addEventListener('mouseleave', () => { isPanning = false; });
        
        // Event untuk Zoom in/out
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomIntensity = 0.1;
            const wheel = e.deltaY < 0 ? 1 : -1;
            const zoom = Math.exp(wheel * zoomIntensity);

            // Batasi zoom agar tidak terlalu kecil atau besar
            const newScale = Math.max(0.2, Math.min(5, scale * zoom));
            
            // Logika agar zoom terjadi di posisi kursor
            const mouseX = e.clientX - canvas.getBoundingClientRect().left;
            const mouseY = e.clientY - canvas.getBoundingClientRect().top;
            
            panOffset.x = mouseX - (mouseX - panOffset.x) * (newScale / scale);
            panOffset.y = mouseY - (mouseY - panOffset.y) * (newScale / scale);
            
            scale = newScale;
            // Gambar ulang peta dengan zoom dan posisi baru
            draw2DMap(canvas, equations, getGridNumberState());
        });
        
        isListenerAttached = true;
    }
    
    // Panggil gambar awal
    draw2DMap(canvas, equations, getGridNumberState());
}