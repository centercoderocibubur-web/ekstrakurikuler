import { checkLogin } from "./auth.js";
import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

checkLogin();

const params = new URLSearchParams(window.location.search);

const sekolah = params.get("sekolah");

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

async function loadSiswa(){

    siswa = [];

    const snapshot = await getDocs(
        query(
            collection(db,"siswa"),
            where("sekolah","==",sekolah)
        )
    );

    snapshot.forEach(doc=>{

        siswa.push(doc.data());

    });

}

async function loadAbsensi(){

    absensi = [];

    const snapshot = await getDocs(
        query(
            collection(db,"absensi"),
            where("sekolah","==",sekolah)
        )
    );

    snapshot.forEach(doc=>{

        absensi.push(doc.data());

    });

    absensi.sort(function(a,b){

        return new Date(a.tanggal)
            - new Date(b.tanggal);

    });

}

function renderTabel(){

    const tanggalList =
        absensi.map(item=>item.tanggal);

    let html = `
    <tr>

        <th>No</th>

        <th>Nama</th>

        <th>Kelas</th>
    `;

    tanggalList.forEach(function(tanggal){

        html += `

        <th>

            ${formatTanggal(tanggal)}

        </th>

        `;

    });

    html += "</tr>";

    header.innerHTML = html;

    body.innerHTML = "";

    siswa.forEach(function(item,index){

        let baris = `

        <tr>

            <td>${index+1}</td>

            <td class="text-start">

                ${item.nama}

            </td>

            <td>${item.kelas}</td>

        `;

        tanggalList.forEach(function(tanggal){

            let status="-";

            const dataPertemuan =
            absensi.find(function(abs){

                return abs.tanggal===tanggal;

            });

            if(dataPertemuan){

                const siswaAbsen =
                dataPertemuan.siswa.find(function(s){

                    return s.nama===item.nama;

                });

                if(siswaAbsen){

                    status = singkat(siswaAbsen.status);

                }

            }

            baris += `

            <td>${status}</td>

            `;

        });

        baris += "</tr>";

        body.innerHTML += baris;

    });

    document.getElementById("totalSiswa").textContent =
        siswa.length;

    document.getElementById("totalPertemuan").textContent =
        tanggalList.length;

    hitungPersentase();
}

function hitungPersentase(){

    let hadir = 0;

    let total = 0;

    absensi.forEach(function(item){

        item.siswa.forEach(function(s){

            total++;

            if(s.status==="Hadir"){

                hadir++;

            }

        });

    });

    let persen = 0;

    if(total>0){

        persen =
        Math.round((hadir/total)*100);

    }

    document.getElementById(
        "persentaseHadir"
    ).textContent =
    persen+"%";

}

function formatTanggal(tanggal){

    return new Date(tanggal)
    .toLocaleDateString("id-ID",{

        day:"numeric",

        month:"short"

    });

}

function singkat(status){

    switch(status){

        case "Hadir":

            return "H";

        case "Izin":

            return "I";

        case "Sakit":

            return "S";

        case "Alpha":

            return "A";

        case "Libur Sekolah":

            return "LS";

        case "Libur Nasional":

            return "LN";

        case "Guru Berhalangan":

            return "GB";

        case "Kegiatan Sekolah":

            return "KS";

        default:

            return "-";

    }

}

