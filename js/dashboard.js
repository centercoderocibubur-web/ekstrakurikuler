/*=========================================
  DASHBOARD.JS
  CODERO CIBUBUR
=========================================*/

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ===============================
// DAFTAR SEKOLAH
// ===============================

const sekolahList = [
    "SD AL JANNAH",
    "SMP AL JANNAH",
    "SD SEKOLAH ALAM CIKEAS",
    "SMP SEKOLAH ALAM CIKEAS",
    "SMA SEKOLAH ALAM CIKEAS"
];

// ===============================
// LOAD DASHBOARD
// ===============================

document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard(){

    try{

        const snapshot = await getDocs(
            collection(db,"siswa")
        );

        const dataSiswa = [];

        snapshot.forEach(doc=>{

            dataSiswa.push(doc.data());

        });

        tampilkanTotalSiswa(dataSiswa);

        tampilkanProgressSekolah(dataSiswa);

        tampilkanTotalSekolah();

    }
    catch(err){

        console.error(err);

        alert("Gagal mengambil data dashboard.");

    }

}

// ===============================
// TOTAL SISWA
// ===============================

function tampilkanTotalSiswa(dataSiswa){

    const total = document.getElementById("totalSiswa");

    if(total){

        total.textContent = dataSiswa.length;

    }

}

// ===============================
// PROGRESS SEKOLAH
// ===============================

function tampilkanProgressSekolah(dataSiswa){

    const progress =
        document.getElementById("progressSekolah");

    if(!progress) return;

    progress.innerHTML = "";

    let terbesar = 1;

    sekolahList.forEach(sekolah=>{

        const jumlah = dataSiswa.filter(

            siswa => siswa.sekolah === sekolah

        ).length;

        if(jumlah > terbesar){

            terbesar = jumlah;

        }

    });

    sekolahList.forEach(sekolah=>{

        const jumlah = dataSiswa.filter(

            siswa => siswa.sekolah === sekolah

        ).length;

        const persen = (jumlah / terbesar) * 100;

        progress.innerHTML += `

        <div class="mb-4">

            <div class="d-flex justify-content-between mb-2">

                <strong>${sekolah}</strong>

                <span>${jumlah} Siswa</span>

            </div>

            <div class="progress" style="height:14px;">

                <div
                    class="progress-bar bg-primary"
                    style="width:${persen}%">
                </div>

            </div>

        </div>

        `;

    });

}

// ===============================
// TOTAL SEKOLAH
// ===============================

function tampilkanTotalSekolah(){

    const total =
        document.getElementById("totalSekolah");

    if(total){

        total.textContent = sekolahList.length;

    }

}
