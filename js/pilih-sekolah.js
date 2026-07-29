import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", loadSekolah);

async function loadSekolah(){

    const status = document.getElementById("statusDataSekolah");

    try{

        const snapshot = await getDocs(
            collection(db,"siswa")
        );

        const jumlah = {

            "SD AL JANNAH":0,
            "SMP AL JANNAH":0,
            "SD SEKOLAH ALAM CIKEAS":0,
            "SMP SEKOLAH ALAM CIKEAS":0,
            "SMA SEKOLAH ALAM CIKEAS":0

        };

        snapshot.forEach(doc=>{

            const data = doc.data();

            if(jumlah[data.sekolah] !== undefined){

                jumlah[data.sekolah]++;

            }

        });

        document.getElementById("sdj").textContent =
            jumlah["SD AL JANNAH"];

        document.getElementById("smpj").textContent =
            jumlah["SMP AL JANNAH"];

        document.getElementById("sdsac").textContent =
            jumlah["SD SEKOLAH ALAM CIKEAS"];

        document.getElementById("smpsac").textContent =
            jumlah["SMP SEKOLAH ALAM CIKEAS"];

        document.getElementById("smasac").textContent =
            jumlah["SMA SEKOLAH ALAM CIKEAS"];

        if(status){
            status.textContent = "Jumlah siswa berhasil dimuat.";
            status.className = "small text-success";
        }

    }
    catch(err){

        console.error("Gagal memuat data siswa:", err);

        if(status){
            status.textContent = "Data siswa tidak dapat dimuat. Periksa koneksi internet atau izin Firestore.";
            status.className = "small text-danger";
        }

    }

}
