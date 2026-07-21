import { checkLogin } from "./auth.js";

checkLogin();

function pilihSekolah(sekolah){

    localStorage.setItem("sekolahAbsensi", sekolah);

    window.location.href = "pertemuan.html";

}

// Jadikan global agar bisa dipanggil dari onclick
window.pilihSekolah = pilihSekolah;
