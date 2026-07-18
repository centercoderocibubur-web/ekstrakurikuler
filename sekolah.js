/* ==========================================
   sekolah.js
   CODERO CIBUBUR
========================================== */

// Pastikan user sudah login
checkLogin();

// Ambil data siswa dari Local Storage
let dataSiswa = JSON.parse(localStorage.getItem("siswa")) || [];

/* ==========================================
   PILIH SEKOLAH
========================================== */

function pilihSekolah(namaSekolah){

    // Simpan sekolah yang dipilih
    localStorage.setItem("sekolahAktif", namaSekolah);

    // Buka halaman data siswa
    window.location.href = "siswa.html";

}

/* ==========================================
   HITUNG JUMLAH SISWA
========================================== */

function jumlahSiswa(namaSekolah){

    return dataSiswa.filter(function(item){

        return item.sekolah === namaSekolah;

    }).length;

}

/* ==========================================
   TAMPILKAN JUMLAH SISWA
========================================== */

function tampilkanJumlah(){

    const daftar = {

        sdj: "SD AL JANNAH",

        smpj: "SMP AL JANNAH",

        sdsac: "SD SEKOLAH ALAM CIKEAS",

        smpsac: "SMP SEKOLAH ALAM CIKEAS",

        smasac: "SMA SEKOLAH ALAM CIKEAS"

    };

    for(const id in daftar){

        const elemen = document.getElementById(id);

        if(elemen){

            elemen.textContent = jumlahSiswa(daftar[id]);

        }

    }

}

/* ==========================================
   JALANKAN
========================================== */

document.addEventListener("DOMContentLoaded", function(){

    tampilkanJumlah();

});