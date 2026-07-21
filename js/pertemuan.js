import { db } from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// =======================================
// PERTEMUAN.JS
// CODERO CIBUBUR
// Versi Otomatis (Libur Tidak Dihitung)
// =======================================

// -------------------------------
// Cek sekolah
// -------------------------------

const sekolah = localStorage.getItem("sekolahAbsensi");

if (!sekolah) {
    window.location.href = "absensi.html";
}

document.getElementById("judulSekolah").textContent = sekolah;

// -------------------------------
// Jadwal Sekolah
// -------------------------------

const jadwalSekolah = {

    "SD AL JANNAH": {
        hari: "Selasa",
        mulai: "2026-07-07"
    },

    "SMP AL JANNAH": {
        hari: "Selasa",
        mulai: "2026-07-07"
    },

    "SD SEKOLAH ALAM CIKEAS": {
        hari: "Kamis",
        mulai: "2026-07-09"
    },

    "SMP SEKOLAH ALAM CIKEAS": {
        hari: "Kamis",
        mulai: "2026-07-09"
    },

    "SMA SEKOLAH ALAM CIKEAS": {
        hari: "Kamis",
        mulai: "2026-07-09"
    }

};

// -------------------------------
// Load Status Pertemuan
// -------------------------------

let statusPertemuan =
JSON.parse(
    localStorage.getItem("statusPertemuan")
) || [];

// -------------------------------
// Format Tanggal Indonesia
// -------------------------------

function formatTanggal(tanggal){

    return tanggal.toLocaleDateString("id-ID",{

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

// -------------------------------
// Cari status berdasarkan tanggal
// -------------------------------

function cariStatus(tanggal){

    const tgl = tanggal.toISOString().split("T")[0];

    return statusPertemuan.find(function(item){

        return item.sekolah===sekolah &&
               item.tanggal===tgl;

    });

}

// -------------------------------
// Hitung Nomor Pertemuan
// Libur tidak dihitung
// -------------------------------

function hitungNomorPertemuan(){

    const mulai = new Date(
        jadwalSekolah[sekolah].mulai
    );

    let hasil = [];

    let nomor = 0;

    for(let minggu=0; minggu<24; minggu++){

        let tanggal = new Date(mulai);

        tanggal.setDate(
            mulai.getDate() + (minggu*7)
        );

        let data = cariStatus(tanggal);

        let status = "akan datang";

        if(data){

            status = data.status;

        }

        const libur = [

            "libur nasional",

            "libur sekolah",

            "guru berhalangan",

            "kegiatan sekolah"

        ];

        if(libur.includes(status)){

            hasil.push({

                nomor:null,

                tanggal:tanggal,

                status:status,

                dihitung:false

            });

        }else{

            nomor++;

            hasil.push({

                nomor:nomor,

                tanggal:tanggal,

                status:status,

                dihitung:true

            });

        }

    }

    return hasil;

}

// -------------------------------
// Siapkan Data Pertemuan
// -------------------------------

const daftarPertemuan =
hitungNomorPertemuan();

const container =
document.getElementById("listPertemuan");

const sekarang = new Date();

// -------------------------------
// Tampilkan Kartu Pertemuan
// -------------------------------
function getInfoAbsensi(tanggal){

    // Cek status pertemuan
    const status = statusPertemuan.find(function(item){

        return item.sekolah === sekolah &&
               item.tanggal === tanggal;

    });

    // Jika bukan terlaksana, jangan tampilkan data absensi
    if(!status || status.status !== "terlaksana"){

        return{

            total:0,

            hadir:0,

            tidakHadir:0

        };

    }

    // Ambil data absensi
    const data = JSON.parse(
        localStorage.getItem("absensi")
    ) || [];

    const absensi = data.find(function(item){

        return item.sekolah===sekolah &&
               item.tanggal===tanggal;

    });

    if(!absensi){

        return{

            total:0,

            hadir:0,

            tidakHadir:0

        };

    }

    const total = absensi.siswa.length;

    const hadir = absensi.siswa.filter(function(item){

        return item.status==="Hadir";

    }).length;

    return{

        total:total,

        hadir:hadir,

        tidakHadir:total-hadir

    };

}
daftarPertemuan.forEach(function(item){
    const info = getInfoAbsensi(

    item.tanggal.toISOString().split("T")[0]

);
    let status = "Akan Datang";
    let badge = "primary";

    if(item.status==="terlaksana"){

        status="Terlaksana";
        badge="success";

    }
    else if(item.status==="libur nasional"){

        status="Libur Nasional";
        badge="danger";

    }
    else if(item.status==="libur sekolah"){

        status="Libur Sekolah";
        badge="danger";

    }
    else if(item.status==="guru berhalangan"){

        status="Guru Berhalangan";
        badge="secondary";

    }
    else if(item.status==="kegiatan sekolah"){

        status="Kegiatan Sekolah";
        badge="warning";

    }
    else{

        if(item.tanggal < sekarang){

            status="Belum Diisi";
            badge="warning";

        }

    }

    let judul = "";

    if(item.dihitung){

        judul = "Pertemuan " + item.nomor;

    }else{

        judul = "Minggu Libur";

    }

    let tombol = "";

    let nomor = item.nomor ?? 0;

tombol = `

<button
class="btn btn-primary w-100"
onclick="bukaPertemuan('${item.tanggal.toISOString().split("T")[0]}',${nomor})">

    <i class="bi bi-pencil-square"></i>

    Ubah Status

</button>

`;

    container.innerHTML += `

<div class="col-lg-4">

    <div
        class="card-panel h-100"
        style="cursor:pointer"
        onclick="bukaAbsensi('${item.tanggal.toISOString().split("T")[0]}',${item.nomor ?? 0})">

        <h5>${judul}</h5>

        <p class="text-muted">

            ${formatTanggal(item.tanggal)}

        </p>

        <span class="badge bg-${badge}">

    ${status}

</span>

<div class="row mt-3 text-center small">

    <div class="col-4">

        <div class="fw-bold">

            ${info.total}

        </div>

        <div class="text-muted">

            Siswa

        </div>

    </div>

    <div class="col-4">

        <div class="fw-bold text-success">

            ${info.hadir}

        </div>

        <div class="text-muted">

            Hadir

        </div>

    </div>

    <div class="col-4">

        <div class="fw-bold text-danger">

            ${info.tidakHadir}

        </div>

        <div class="text-muted">

            Absen

        </div>

    </div>

</div>

<hr>

        <button
            class="btn btn-outline-primary w-100"
            onclick="event.stopPropagation(); bukaPertemuan('${item.tanggal.toISOString().split("T")[0]}',${item.nomor ?? 0})">

            <i class="bi bi-pencil-square"></i>

            Status Pertemuan

        </button>

    </div>

</div>



    `;

});

// -------------------------------
// Modal
// -------------------------------

let modalStatus;

document.addEventListener("DOMContentLoaded",function(){

    modalStatus = new bootstrap.Modal(

        document.getElementById("modalStatus")

    );

});

// -------------------------------
// Buka Pertemuan
// -------------------------------

function bukaPertemuan(tanggal,nomor){

    document.getElementById("noPertemuan").value = nomor;

    localStorage.setItem(

        "tanggalPertemuan",

        tanggal

    );

    modalStatus.show();

}

function bukaAbsensi(tanggal, nomor){

    localStorage.setItem(
        "tanggalPertemuan",
        tanggal
    );

    localStorage.setItem(
        "pertemuanAktif",
        nomor
    );

    window.location.href="absensi-siswa.html";

}

// -------------------------------------
// Simpan Status Pertemuan
// -------------------------------------

async function simpanStatusPertemuan(){

    
    const nomor = Number(
        document.getElementById("noPertemuan").value
    );

    const tanggal =
    localStorage.getItem("tanggalPertemuan");

    const status =
    document.querySelector(
        "input[name='statusPertemuan']:checked"
    ).value;

    let data =
    JSON.parse(
        localStorage.getItem("statusPertemuan")
    ) || [];

    const index =
    data.findIndex(function(item){

        return item.sekolah===sekolah &&
               item.tanggal===tanggal;

    });

    const obj={

        sekolah:sekolah,

        tanggal:tanggal,

        pertemuan:nomor,

        status:status

    };
    if(status==="akan datang"){

    data = data.filter(function(item){

        return !(

            item.sekolah===sekolah &&
            item.tanggal===tanggal

        );

    });

    localStorage.setItem(

        "statusPertemuan",

        JSON.stringify(data)

    );
try{

    await addDoc(

        collection(db,"statusPertemuan"),

        {

            sekolah: sekolah,

            tanggal: tanggal,

            pertemuan: nomor,

            status: status,

            dibuat: new Date().toISOString()

        }

    );

    console.log("Status berhasil disimpan ke Firebase");

}
catch(err){

    console.error(err);

    alert("Gagal menyimpan status ke Firebase.");

}
    modalStatus.hide();

    location.reload();

    return;

}
    if(index==-1){

        data.push(obj);

    }else{

        data[index]=obj;

    }

    localStorage.setItem(

        "statusPertemuan",

        JSON.stringify(data)

    );

    modalStatus.hide();

    // jika pertemuan terlaksana
    if(status==="terlaksana"){

        localStorage.setItem(

            "pertemuanAktif",

            nomor

        );

        localStorage.setItem(

            "tanggalPertemuan",

            tanggal

        );

        window.location.href="absensi-siswa.html";

        return;

    }

    alert("Pertemuan ditandai sebagai " + status);

    location.reload();

}

window.simpanStatusPertemuan =
    simpanStatusPertemuan;
window.bukaPertemuan = bukaPertemuan;
window.bukaAbsensi = bukaAbsensi;
window.simpanStatusPertemuan = simpanStatusPertemuan;
