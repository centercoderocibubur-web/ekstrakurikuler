import { checkLogin } from "./auth.js";
import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

checkLogin();

const sekolah =
    localStorage.getItem("laporanSekolah");

if(!sekolah){

    alert("Sekolah belum dipilih.");

    window.location.href="../laporan/";

}

document.getElementById("judulSekolah").textContent =
    sekolah;

document.getElementById("namaSekolah").textContent =
    sekolah;

const header =
document.getElementById("headerLaporan");

const body =
document.getElementById("bodyLaporan");

let siswa = [];

let absensi = [];

init();

async function init(){

    await loadSiswa();

    await loadAbsensi();

    renderTabel();

}
