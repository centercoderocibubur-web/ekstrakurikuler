/* ==========================================
   sekolah.js
   CODERO CIBUBUR
========================================== */

import { checkLogin } from "./auth.js";

// Pastikan user sudah login. Data siswa sekarang disimpan di Firestore,
// sehingga jumlahnya dimuat oleh pilih-sekolah.js.
checkLogin();

/* ==========================================
   PILIH SEKOLAH
========================================== */

function pilihSekolah(namaSekolah){

    // Simpan sekolah yang dipilih
    localStorage.setItem("sekolahAktif", namaSekolah);

    // Buka halaman data siswa
    window.location.href = "../siswa/";

}

// Fungsi ini dipanggil dari atribut onclick pada kartu sekolah.
window.pilihSekolah = pilihSekolah;

