import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================================
// ABSENSI SISWA.JS
// CODERO CIBUBUR
// VERSI 3.0
// ==========================================

// ==========================================
// VALIDASI DATA
// ==========================================

const sekolah = localStorage.getItem("sekolahAbsensi");
const pertemuan = Number(localStorage.getItem("pertemuanAktif"));
const tanggalPertemuan = localStorage.getItem("tanggalPertemuan");

if (!sekolah || !tanggalPertemuan) {

    alert("Data pertemuan tidak ditemukan.");

    window.location.href = "pertemuan.html";

}

// ==========================================
// LOAD DATABASE
// ==========================================

let siswaSekolah = [];

async function loadSiswa(){

    siswaSekolah = [];

    const snapshot = await getDocs(
        collection(db,"siswa")
    );

    snapshot.forEach(doc=>{

        const data = doc.data();

        if(data.sekolah === sekolah){

            siswaSekolah.push({

                id: doc.id,

                ...data

            });

        }

    });

}

// ==========================================
// ELEMENT HTML
// ==========================================

const listSiswa =
document.getElementById("listSiswa");

const inputCari =
document.getElementById("cariSiswa");

// ==========================================
// JUDUL HALAMAN
// ==========================================

document.getElementById("judulSekolah").textContent =
sekolah;

document.getElementById("judulPertemuan").textContent =
"Pertemuan " + pertemuan;

document.getElementById("jumlahSiswa").textContent =
siswaSekolah.length;

// ==========================================
// FORMAT TANGGAL
// ==========================================

const tanggal =
new Date(tanggalPertemuan);

document.getElementById("tanggalPertemuan").textContent =
tanggal.toLocaleDateString("id-ID",{

    weekday:"long",

    day:"numeric",

    month:"long",

    year:"numeric"

});

// ==========================================
// VARIABEL GLOBAL
// ==========================================

// Menyimpan status absensi setiap siswa
let statusMap = {};

// Data siswa yang sedang tampil
let dataTampil = [];

// ==========================================
// LOAD ABSENSI
// ==========================================

async function loadAbsensi(){

    statusMap = {};

    const q = query(
        collection(db,"absensi"),
        where("sekolah","==",sekolah),
        where("tanggal","==",tanggalPertemuan)
    );

    const snapshot = await getDocs(q);

    if(snapshot.empty) return;

    const data = snapshot.docs[0].data();

    data.siswa.forEach(function(item){

        statusMap[item.nama] = item.status;

    });

}

    // Cari data absensi yang sudah pernah disimpan
    const absensi =
    dbAbsensi.find(function(item){

        return item.sekolah === sekolah &&
               item.tanggal === tanggalPertemuan;

    });

    // Jika ditemukan, timpa status default
    if(absensi){

        absensi.siswa.forEach(function(item){

            statusMap[item.nama] = item.status;

        });

    }

}

// ==========================================
// LOAD DATA PERTAMA
// ==========================================

loadAbsensi();

// ==========================================
// RENDER DAFTAR SISWA
// ==========================================

function renderSiswa(data){

    listSiswa.innerHTML = "";

    if(data.length === 0){

        listSiswa.innerHTML = `

        <div class="alert alert-warning">

            Data siswa tidak ditemukan.

        </div>

        `;

        return;

    }

    data.forEach(function(siswa){

        const status = statusMap[siswa.nama] || "Hadir";

        listSiswa.innerHTML += `

        <div class="card-panel mb-3">

            <div class="row align-items-center">

                <div class="col-lg-4">

                    <h5 class="mb-1">

                        ${siswa.nama}

                    </h5>

                    <small class="text-muted">

                        Kelas ${siswa.kelas}

                    </small>

                </div>

                <div class="col-lg-8 text-end">

                    ${buttonStatus(siswa.nama,status)}

                </div>

            </div>

        </div>

        `;

    });

}

// ==========================================
// BUTTON STATUS
// ==========================================

function buttonStatus(nama,status){

    return `

    <button
        class="btn ${status==="Hadir" ? "btn-success" : "btn-outline-success"} me-1 mb-1"
        onclick="ubahStatus('${nama}','Hadir')">

        Hadir

    </button>

    <button
        class="btn ${status==="Izin" ? "btn-warning" : "btn-outline-warning"} me-1 mb-1"
        onclick="ubahStatus('${nama}','Izin')">

        Izin

    </button>

    <button
        class="btn ${status==="Sakit" ? "btn-info" : "btn-outline-info"} me-1 mb-1"
        onclick="ubahStatus('${nama}','Sakit')">

        Sakit

    </button>

    <button
        class="btn ${status==="Alpha" ? "btn-danger" : "btn-outline-danger"} mb-1"
        onclick="ubahStatus('${nama}','Alpha')">

        Alpha

    </button>

    `;

}

// ==========================================
// RINGKASAN ABSENSI
// ==========================================

function updateRingkasan(){

    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    siswaSekolah.forEach(function(item){

        const status = statusMap[item.nama];

        switch(status){

            case "Hadir":
                hadir++;
                break;

            case "Izin":
                izin++;
                break;

            case "Sakit":
                sakit++;
                break;

            case "Alpha":
                alpha++;
                break;

        }

    });

    const total = siswaSekolah.length;

    const tidakHadir = izin + sakit + alpha;

    const persen =
        total === 0
        ? 0
        : ((hadir / total) * 100).toFixed(1);

    document.getElementById("jmlHadir").textContent = hadir;
    document.getElementById("jmlIzin").textContent = izin;
    document.getElementById("jmlSakit").textContent = sakit;
    document.getElementById("jmlAlpha").textContent = alpha;
    document.getElementById("jmlTotal").textContent = total;
    document.getElementById("jmlTidakHadir").textContent = tidakHadir;
    document.getElementById("persenHadir").textContent = persen + "%";

}

// ==========================================
// TAMPILKAN DATA PERTAMA
// ==========================================

renderSiswa(dataTampil);

updateRingkasan();

// ==========================================
// UBAH STATUS SISWA
// ==========================================

function ubahStatus(nama, status){

    statusMap[nama] = status;

    renderSiswa(dataTampil);

    updateRingkasan();

}

// ==========================================
// HADIR SEMUA
// ==========================================

function hadirSemua(){

    if(!confirm("Semua siswa akan diubah menjadi Hadir. Lanjutkan?")){

        return;

    }

    siswaSekolah.forEach(function(item){

        statusMap[item.nama] = "Hadir";

    });

    renderSiswa(dataTampil);

    updateRingkasan();

}

// ==========================================
// RESET STATUS
// ==========================================

function resetAbsensi(){

    if(!confirm("Semua status absensi akan direset menjadi Hadir. Lanjutkan?")){

        return;

    }

    siswaSekolah.forEach(function(item){

        statusMap[item.nama] = "Hadir";

    });

    renderSiswa(dataTampil);

    updateRingkasan();

}

// ==========================================
// PENCARIAN SISWA
// ==========================================

inputCari.addEventListener("keyup", function(){

    const keyword = this.value
        .toLowerCase()
        .trim();

    if(keyword === ""){

        dataTampil = [...siswaSekolah];

    }else{

        dataTampil = siswaSekolah.filter(function(item){

            return (
                item.nama.toLowerCase().includes(keyword) ||
                item.kelas.toLowerCase().includes(keyword)
            );

        });

    }

    renderSiswa(dataTampil);

});

// ==========================================
// REFRESH DATA
// ==========================================

function refreshData(){

    async function init(){

        await loadSiswa();

        dataTampil = [...siswaSekolah];

        document.getElementById("jumlahSiswa").textContent =
            siswaSekolah.length;

        await loadAbsensi();

        renderSiswa(dataTampil);

        updateRingkasan();

    }

    init();

}
// ==========================================
// SIMPAN ABSENSI
// ==========================================

async function simpanAbsensi(){

    const daftarSiswa = siswaSekolah.map(function(item){

        return{

            nama: item.nama,

            kelas: item.kelas,

            status: statusMap[item.nama] || "Hadir"

        };

    });

    const dataBaru = {

        sekolah: sekolah,

        pertemuan: pertemuan,

        tanggal: tanggalPertemuan,

        siswa: daftarSiswa,

        dibuat: new Date().toISOString()

    };
    const q = query(
    collection(db,"absensi"),
    where("sekolah","==",sekolah),
    where("tanggal","==",tanggalPertemuan)
);

const snapshot = await getDocs(q);

if(snapshot.empty){

    await addDoc(
        collection(db,"absensi"),
        dataBaru
    );

}else{

    await updateDoc(

        doc(db,"absensi",snapshot.docs[0].id),

        dataBaru

    );

}
    alert("Absensi berhasil disimpan.");

    window.location.href = "pertemuan.html";

}

// ==========================================
// KEMBALI
// ==========================================

function kembali(){

    if(confirm("Kembali ke halaman pertemuan?")){

        window.location.href = "pertemuan.html";

    }

}

// ==========================================
// DEBUG (boleh dihapus nanti)
// ==========================================

console.log("Sekolah :", sekolah);
console.log("Pertemuan :", pertemuan);
console.log("Tanggal :", tanggalPertemuan);
console.log("Jumlah Siswa :", siswaSekolah.length);
console.log("Jumlah Absensi :", dbAbsensi.length);

// ==========================================
// SELESAI
// ==========================================

window.hadirSemua = hadirSemua;
window.resetAbsensi = resetAbsensi;
window.simpanAbsensi = simpanAbsensi;
window.kembali = kembali;
window.ubahStatus = ubahStatus;
