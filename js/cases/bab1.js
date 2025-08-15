// js/cases/bab1.js
const bab1 = {
    chapterTitle: "Bab 1: Awal Sang Dalang",
    cases: [
        { 
            title: "Kasus #1: Pelacakan Sinyal", 
            workspace: 'peta', 
            briefing: "Laporan intelijen pertama masuk, Detektif. Tim siber mencegat dua sinyal terenkripsi. Sinyal Alpha bergerak lurus di jalur 'y = 2x + 3', dan Sinyal Beta di jalur 'y = -x + 9'.\n\nMisi Anda adalah memprediksi di mana kedua jalur ini akan bersilangan. Itu adalah lokasi pertemuan rahasia yang harus kita gagalkan!", 
            eq: ['y = 2x + 3', 'y = -x + 9'], 
            sol: { x: 2, y: 7 }, 
            hint: "Gambarkan kedua garis di peta. Titik di mana mereka bertemu adalah jawabannya. Beralih ke mode 2D untuk presisi." 
        },
        { 
            title: "Kasus #2: Resep Rahasia", 
            workspace: 'substitusi', 
            briefing: "Koki terkenal di kota kehilangan resep legendarisnya! Brankasnya hanya bisa dibuka dengan dua variabel: 'x' gram rempah rahasia dan 'y' ml sari buah langka. Dua asistennya memberikan petunjuk.\n\nAsisten pertama bilang, 'Jumlah gram rempah (x) adalah dua kali lipat jumlah sari buah (y) dikurangi satu.'\nAsisten kedua berkata, 'Tiga kali jumlah rempah ditambah dua kali jumlah sari buah totalnya 19.'\n\nTemukan nilai x dan y untuk menyelamatkan resep itu!", 
            eq: ['x = 2y - 1', '3x + 2y = 19'], 
            sol: { x: 4.5, y: 2.75 }, 
            hint: "Satu persamaan sudah dalam bentuk 'x = ...'. Klik blok kuning untuk mensubstitusikannya ke variabel x di persamaan kedua." 
        },
        { 
            title: "Kasus #3: Perang Harga", 
            workspace: 'eliminasi', 
            briefing: "Kekacauan terjadi di Pasar Logika. Dua pedagang, Pak Budi dan Pak Tono, menjual Apel (x) dan Jeruk (y) dengan harga misterius.\n\nSeorang pembeli berkata, 'Saya membeli 2 Apel dan 3 Jeruk seharga 12.000.'\nPembeli lain menambahkan, 'Aneh, saya beli 2 Apel dan 1 Jeruk harganya 8.000.'\n\nBerapa harga 1 Apel (x) dan 1 Jeruk (y) sebenarnya?", 
            eq: ['2x + 3y = 12000', '2x + 1y = 8000'], 
            sol: { x: 3000, y: 2000 }, 
            hint: "Koefisien '2x' sudah sama. Coba kalikan salah satu persamaan dengan -1, lalu tekan tombol eliminasi." 
        },
        { 
            title: "Kasus #4: Drone Paralel", 
            workspace: 'peta', 
            type: 'multiple_choice', 
            briefing: "Peringatan keamanan! Dua drone pengintai tak dikenal terbang di atas kota. Menurut data radar, jalur terbang mereka sejajar sempurna.\n\nJika mereka terus terbang lurus, apakah ada kemungkinan mereka akan bertabrakan atau bertemu di satu titik? Jawabannya akan menentukan tingkat siaga kita.", 
            eq: ['y = 0.5x + 2', 'y = 0.5x - 3'], 
            options: ["Satu Titik Pertemuan", "Tidak Ada Pertemuan", "Pertemuan Tak Terbatas"], 
            sol: 1, 
            hint: "Dua garis yang sejajar memiliki gradien (kemiringan) yang sama. Bisakah dua garis dengan kemiringan yang sama pernah berpotongan?" 
        },
        { 
            title: "Kasus #5: Bayangan Ganda", 
            workspace: 'peta', 
            type: 'multiple_choice', 
            briefing: "Seorang informan misterius memberi kita dua petunjuk untuk melacak target. Petunjuk pertama adalah 'x + y = 5'. Sejam kemudian, petunjuk kedua datang: '2x + 2y = 10'.\n\nAnehnya, saat tim kita memplotnya di peta, kedua petunjuk itu menunjuk ke jalur yang sama persis! Apa artinya ini? Di mana saja target bisa berada?", 
            eq: ['x + y = 5', '2x + 2y = 10'], 
            options: ["Hanya di satu titik", "Tidak mungkin ditemukan", "Di sepanjang jalur"], 
            sol: 2, 
            hint: "Jika persamaan kedua disederhanakan (dibagi 2), apakah ia menjadi identik dengan persamaan pertama? Jika ya, artinya kedua petunjuk menunjuk ke satu garis yang sama." 
        },
        { 
            title: "Kasus #6: Rute Vertikal", 
            workspace: 'peta', 
            briefing: "Sebuah anomali terdeteksi. Sebuah sinyal bergerak secara vertikal sempurna di sepanjang garis x = 4. Pada saat yang sama, sebuah mobil patroli bergerak di jalur y = 0.5x + 1.\n\nDi titik mana mobil patroli akan memotong jalur sinyal anomali tersebut?", 
            eq: ['x = 4', 'y = 0.5x + 1'], 
            sol: { x: 4, y: 3 }, 
            hint: "Garis 'x = 4' adalah garis lurus vertikal yang melewati angka 4 di sumbu X. Di mana garis kedua akan memotong garis vertikal ini?" 
        },
        { 
            title: "Kasus #7: Kode Kurir", 
            workspace: 'substitusi', 
            briefing: "Sebuah paket berisi data penting diamankan oleh kurir dengan sistem kunci ganda (x dan y). Di paket tertulis: 'Nilai y adalah 5 dikurangi x.' Di buku catatannya, tertulis: 'Empat kali nilai x dikurangi dua kali nilai y hasilnya 10.'\n\nIni adalah kasus substitusi klasik. Temukan kode x dan y untuk membuka paket.", 
            eq: ['y = 5 - x', '4x - 2y = 10'], 
            sol: { x: 3.33, y: 1.67 }, 
            hint: "Persamaan pertama sangat mudah untuk disubstitusikan ke dalam persamaan kedua. Ganti 'y' di persamaan kedua dengan '(5 - x)'." 
        },
        { 
            title: "Kasus #8: Aset Tersembunyi", 
            workspace: 'eliminasi', 
            briefing: "Pesan dari agen lapangan: 'Saya menyembunyikan mikrofilm di sebuah brankas. Kodenya adalah (x, y). Saya hanya bisa memberikan dua persamaan terenkripsi: 5x + 6y = -2 dan -x + 2y = 10.'\n\nWaktu kita terbatas, Detektif. Anda harus mengalikan salah satu persamaan agar bisa melakukan eliminasi. Pecahkan kodenya!", 
            eq: ['5x + 6y = -2', '-x + 2y = 10'], 
            sol: { x: -4, y: 3 }, 
            hint: "Coba kalikan persamaan kedua dengan 5. Ini akan membuat koefisien 'x' menjadi -5x, yang siap untuk dieliminasi dengan 5x dari persamaan pertama." 
        },
        { 
            title: "Kasus #9: Frekuensi Radio", 
            workspace: 'peta', 
            briefing: "Dengar, Detektif? Itu suara interferensi. Dua frekuensi radio dari menara yang berbeda saling tumpang tindih dan menyebabkan gangguan di seluruh kota. Jalur frekuensi pertama adalah '2x + y = 1' dan yang kedua adalah 'x - y = 5'.\n\nTemukan sumber interferensi dengan menentukan titik potong kedua jalur frekuensi tersebut.", 
            eq: ['2x + y = 1', 'x - y = 5'], 
            sol: { x: 2, y: -3 }, 
            hint: "Ubah dulu kedua persamaan ke bentuk 'y = mx + c' agar mudah divisualisasikan. Persamaan pertama menjadi 'y = -2x + 1'." 
        },
        { 
            title: "Kasus #10: Tantangan Sang Dalang", 
            workspace: 'eliminasi', 
            briefing: "INI DIA! Pesan langsung dari sang 'Dalang Persamaan' muncul di terminal kita! Dia menantangmu secara langsung.\n\n'Detektif, aku lihat kau sudah menyelesaikan teka-teki pemanasanku. Mengesankan. Aku tinggalkan tantangan terakhir untuk Babak Pertama. Selesaikan jika kau bisa: 7x - y = 20 dan 3x + y = 10.'\n\nDia pikir kita tidak bisa memecahkannya. Buktikan dia salah dan tutup Babak Pertama dengan kemenangan!", 
            eq: ['7x - y = 20', '3x + y = 10'], 
            sol: { x: 3, y: 1 }, 
            hint: "Perhatikan variabel 'y'. Di satu persamaan ia -y, dan di lainnya +y. Langsung jumlahkan (eliminasi) kedua persamaan tersebut!" 
        }
    ],
    cutscenes: {
        // Cutscene akan dipicu setelah Kasus #10 (indeks 9) selesai
        afterCase10: "Kau... berhasil?\n\nMenarik. Sangat menarik. Kau mungkin lebih dari sekadar detektif biasa. Tapi jangan senang dulu, ini baru permulaan. Babak Pertama sudah berakhir, dan kau menang.\n\nAnggap saja ini tutorial. Permainanku yang sesungguhnya... akan jauh lebih rumit. Sampai jumpa di Babak Kedua, Detektif.\n\n- Dalang Persamaan"
    }
};