import { checkLogin } from "./auth.js";

checkLogin();

function pilihSekolah(namaSekolah){

    localStorage.setItem("sekolahAktif", namaSekolah);

    window.location.href = "siswa.html";

}

window.pilihSekolah = pilihSekolah;
