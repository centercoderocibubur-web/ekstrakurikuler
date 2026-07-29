import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where
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
    window.location.href = "../absensi/";
}

document.getElementById("judulSekolah").textContent = sekolah;

// -------------------------------
// Jadwal Sekolah
// -------------------------------

const jadwalSekolah = {

    "SD AL JANNAH": {
        hari: "Kamis",
        mulai: "2026-07-30"
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

let daftarGuru = [];
let overrideTanggal = [];

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

let daftarPertemuan =
hitungNomorPertemuan();

const container =
document.getElementById("listPertemuan");

const sekarang = new Date();

// Rekap absensi dimuat dari Firestore agar tetap tersedia setelah halaman
// ditutup atau dibuka dari perangkat lain.
let dataAbsensi = [];

// -------------------------------
// Tampilkan Kartu Pertemuan
// -------------------------------
function getInfoAbsensi(tanggal){
    const absensi = dataAbsensi.find(function(item){

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

function renderPertemuan(){

    container.innerHTML = "";

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

    const dataStatus = statusPertemuan.find(function(data){
        return data.sekolah === sekolah &&
               data.tanggal === item.tanggal.toISOString().split("T")[0];
    });

    let judul = "";

    if(item.dihitung){

        judul = "Pertemuan " + item.nomor;

    }else{

        judul = "Minggu Libur";

    }

    let tombol = "";

    let nomor = item.nomor ?? 0;

    const tombolUbahTanggal = item.dihitung ? `
        <button
            class="btn btn-outline-secondary w-100 mt-2"
            onclick="event.stopPropagation(); bukaUbahTanggal(${nomor})">
            <i class="bi bi-calendar-event"></i>
            Ubah Tanggal
        </button>
    ` : "";

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

        <p class="small text-muted mt-3 mb-0">
            <i class="bi bi-person-workspace"></i>
            Guru: <strong>${dataStatus && dataStatus.guruNama ? dataStatus.guruNama : "Belum dipilih"}</strong>
        </p>

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

        ${tombolUbahTanggal}

    </div>

</div>



    `;

    });

}

async function loadRekapAbsensi(){

    try{

        const snapshot = await getDocs(
            query(collection(db, "absensi"), where("sekolah", "==", sekolah))
        );

        dataAbsensi = snapshot.docs.map(function(item){
            return item.data();
        });

    }
    catch(err){

        console.error("Gagal memuat rekap absensi:", err);

    }

}

async function loadOverrideTanggal(){

    try{

        const snapshot = await getDocs(
            query(collection(db, "overrideTanggal"), where("sekolah", "==", sekolah))
        );

        overrideTanggal = snapshot.docs.map(function(item){
            return { id:item.id, ...item.data() };
        });

        const overridePerNomor = new Map(
            overrideTanggal.map(function(item){ return [Number(item.pertemuan), item]; })
        );

        daftarPertemuan.forEach(function(item){

            const override = overridePerNomor.get(item.nomor);

            if(item.dihitung && override && override.tanggal){
                item.tanggal = new Date(`${override.tanggal}T00:00:00`);
                item.overrideTanggal = true;
            }

        });

    }
    catch(err){

        console.error("Gagal memuat override tanggal:", err);

    }

}

async function initPertemuan(){

    await Promise.all([
        loadRekapAbsensi(),
        loadOverrideTanggal()
    ]);

    renderPertemuan();

}

initPertemuan();

// -------------------------------
// Modal
// -------------------------------

let modalStatus;
let modalUbahTanggal;

document.addEventListener("DOMContentLoaded",function(){

    modalStatus = new bootstrap.Modal(

        document.getElementById("modalStatus")

    );

    modalUbahTanggal = new bootstrap.Modal(
        document.getElementById("modalUbahTanggal")
    );

    loadGuru();

});

async function loadGuru(){

    const pilihan = document.getElementById("pilihGuru");

    try{

        const snapshot = await getDocs(collection(db, "guru"));

        daftarGuru = snapshot.docs.map(function(item){
            return { id:item.id, ...item.data() };
        }).sort(function(a, b){
            return (a.nama || "").localeCompare(b.nama || "");
        });

        pilihan.innerHTML = '<option value="">-- Pilih guru --</option>' +
            daftarGuru.map(function(guru){
                return `<option value="${guru.id}">${guru.nama}</option>`;
            }).join("");

    }
    catch(err){

        console.error("Gagal memuat data guru:", err);

    }

}

function bukaUbahTanggal(nomor){

    const pertemuan = daftarPertemuan.find(function(item){
        return item.dihitung && item.nomor === nomor;
    });

    const override = overrideTanggal.find(function(item){
        return Number(item.pertemuan) === nomor;
    });

    document.getElementById("nomorOverrideTanggal").value = nomor;
    document.getElementById("tanggalOverride").value = override
        ? override.tanggal
        : "";
    document.getElementById("tanggalNormal").textContent = pertemuan
        ? formatTanggal(pertemuan.tanggal)
        : "-";

    modalUbahTanggal.show();

}

async function simpanOverrideTanggal(){

    const nomor = Number(document.getElementById("nomorOverrideTanggal").value);
    const tanggal = document.getElementById("tanggalOverride").value;
    const existing = overrideTanggal.find(function(item){
        return Number(item.pertemuan) === nomor;
    });

    try{

        if(!tanggal){

            if(existing){
                await deleteDoc(doc(db, "overrideTanggal", existing.id));
            }

        }
        else{

            const data = { sekolah:sekolah, pertemuan:nomor, tanggal:tanggal };

            if(existing){
                await updateDoc(doc(db, "overrideTanggal", existing.id), data);
            }
            else{
                await addDoc(collection(db, "overrideTanggal"), data);
            }

        }

        // Buat ulang tanggal normal sebelum menerapkan override terbaru.
        daftarPertemuan = hitungNomorPertemuan();
        await loadOverrideTanggal();
        renderPertemuan();
        modalUbahTanggal.hide();

    }
    catch(err){

        console.error("Gagal menyimpan override tanggal:", err);
        alert("Override tanggal gagal disimpan.");

    }

}

// -------------------------------
// Buka Pertemuan
// -------------------------------

function bukaPertemuan(tanggal,nomor){

    document.getElementById("noPertemuan").value = nomor;

    localStorage.setItem(

        "tanggalPertemuan",

        tanggal

    );

    const data = statusPertemuan.find(function(item){
        return item.sekolah === sekolah && item.tanggal === tanggal;
    });

    document.getElementById("pilihGuru").value = data && data.guruId
        ? data.guruId
        : "";

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

    window.location.href="../absensi-siswa/";

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

    const guruId = document.getElementById("pilihGuru").value;
    const guru = daftarGuru.find(function(item){ return item.id === guruId; });

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

        status:status,

        guruId:guru ? guru.id : "",

        guruNama:guru ? guru.nama : ""

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

        window.location.href="../absensi-siswa/";

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
window.bukaUbahTanggal = bukaUbahTanggal;
window.simpanOverrideTanggal = simpanOverrideTanggal;
