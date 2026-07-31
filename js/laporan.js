import { checkLogin } from "./auth.js";
import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

checkLogin();

const sekolahList = [

    {
        nama:"SD AL JANNAH",
        warna:"primary",
        icon:"house-door-fill"
    },

    {
        nama:"SMP AL JANNAH",
        warna:"success",
        icon:"building-fill"
    },

    {
        nama:"SD SEKOLAH ALAM CIKEAS",
        warna:"warning",
        icon:"tree-fill"
    },

    {
        nama:"SMP SEKOLAH ALAM CIKEAS",
        warna:"info",
        icon:"mortarboard-fill"
    },

    {
        nama:"SMA SEKOLAH ALAM CIKEAS",
        warna:"danger",
        icon:"award-fill"
    }

];

const listSekolah =
document.getElementById("listSekolah");

loadSekolah();

async function loadSekolah(){

    try{

        const snapshot = await getDocs(
            collection(db,"siswa")
        );

        const dataSiswa = [];

        snapshot.forEach(doc=>{

            dataSiswa.push(doc.data());

        });

        tampilkanSekolah(dataSiswa);

    }

    catch(err){

        console.error(err);

        listSekolah.innerHTML = `

        <div class="alert alert-danger">

            Gagal mengambil data dari Firebase.

        </div>

        `;

    }

}

function tampilkanSekolah(dataSiswa){

    listSekolah.innerHTML = "";

    sekolahList.forEach(function(item){

        const jumlah = dataSiswa.filter(function(siswa){

            return siswa.sekolah === item.nama;

        }).length;

        listSekolah.innerHTML += `

        <div class="col-lg-4 col-md-6">

            <div class="school-card">

                <div class="school-icon bg-${item.warna}">

                    <i class="bi bi-${item.icon}"></i>

                </div>

                <h4>

                    ${item.nama}

                </h4>

                <p>

                    Laporan Absensi Semester

                </p>

                <h2>

                    ${jumlah}

                </h2>

                <small>

                    Siswa

                </small>

                <button
                    class="btn btn-${item.warna} mt-3 w-100"
                    onclick="bukaLaporan('${item.nama}')">

                    <i class="bi bi-bar-chart-fill"></i>

                    Lihat Laporan

                </button>

            </div>

        </div>

        `;

    });

}

function bukaLaporan(sekolah){

    localStorage.setItem(

        "laporanSekolah",

        sekolah

    );

    window.location.href = "../laporan-detail/";

}

window.bukaLaporan = bukaLaporan;
