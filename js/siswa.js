/*=========================================
  SISWA.JS
  Sistem Informasi Ekstrakurikuler
  CODERO CIBUBUR
=========================================*/

// ======================================
// IMPORT
// ======================================

import { checkLogin } from "./auth.js";
import { db } from "./firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ======================================
// LOGIN
// ======================================

checkLogin();

// ======================================
// VARIABEL GLOBAL
// ======================================

const tabel = document.getElementById("tbodySiswa");

const modalElement = document.getElementById("modalSiswa");

const modalTambah = new bootstrap.Modal(modalElement);

const modalBulkElement =
document.getElementById("modalBanyak");

const modalBulk = modalBulkElement
    ? new bootstrap.Modal(modalBulkElement)
    : null;

// koleksi firebase

const siswaCollection =
collection(db,"siswa");

// sekolah aktif

let sekolahAktif =
localStorage.getItem("sekolahAktif") || "";

// data sementara

let dataSiswa = [];

// id dokumen ketika edit

let editId = null;

// ======================================
// DOM READY
// ======================================

document.addEventListener("DOMContentLoaded", init);

let keyword = "";
let filterKategori = "Semua";

// ======================================
// INIT
// ======================================

async function init(){

    // pastikan sekolah dipilih

    if(!sekolahAktif){

        alert("Silakan pilih sekolah terlebih dahulu.");

        window.location.href="pilih-sekolah.html";

        return;

    }

    // isi nama sekolah di form

    const sekolahInput =
    document.getElementById("sekolah");

    if(sekolahInput){

        sekolahInput.value = sekolahAktif;

    }

    // event tombol

    pasangEvent();
const txtCari =
document.getElementById("cariNama");

if(txtCari){

    txtCari.addEventListener("input",function(){

        keyword = this.value;

        renderTabel();

    });

}
    const cmbKategori =
document.getElementById("filterKategori");

if(cmbKategori){

    cmbKategori.addEventListener("change",function(){

        filterKategori = this.value;

        renderTabel();

    });

}
    // tampilkan data

    await loadSiswa();

}

// ======================================
// EVENT LISTENER
// ======================================

function pasangEvent(){

    // tombol tambah siswa

    const btnTambah =
    document.getElementById("btnTambahSiswa");

    if(btnTambah){

        btnTambah.addEventListener("click",modeTambah);

    }

    // tombol simpan

    const btnSimpan =
    document.getElementById("btnSimpanSiswa");

    if(btnSimpan){

        btnSimpan.addEventListener("click",simpanSiswa);

    }

    // tambah banyak

    const btnTambahBaris =
    document.getElementById("btnTambahBaris");

    if(btnTambahBaris){

        btnTambahBaris.addEventListener("click",tambahBaris);

    }

    const btnSimpanSemua =
    document.getElementById("btnSimpanSemua");

    if(btnSimpanSemua){

        btnSimpanSemua.addEventListener("click",simpanSemua);

    }

}

// ======================================
// LOAD DATA FIREBASE
// ======================================

async function loadSiswa(){

    try{

        dataSiswa = [];

        const snapshot =
        await getDocs(siswaCollection);

        snapshot.forEach((item)=>{

            const siswa = item.data();

            siswa.id = item.id;

            if(siswa.sekolah===sekolahAktif){

                dataSiswa.push(siswa);

            }

        });

        console.log(
            "Jumlah siswa :",
            dataSiswa.length
        );

        renderTabel();

    }
    catch(err){

        console.error(err);

        alert("Gagal mengambil data siswa.");

    }

}

/*=========================================
  RENDER TABEL
=========================================*/

function renderTabel(){

    tabel.innerHTML = "";

    let hasil = dataSiswa.filter(function(item){

        const cocokNama =
            item.nama
                .toLowerCase()
                .includes(keyword.toLowerCase());

        const cocokKategori =
            filterKategori === "Semua" ||
            item.kategori === filterKategori;

        return cocokNama && cocokKategori;

    });

    if (hasil.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Belum ada data siswa.
                </td>
            </tr>
        `;

        return;

    }

hasil.forEach((siswa,index)=>{

        tabel.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${siswa.nama}</td>

            <td>${siswa.kelas}</td>

            <td>${siswa.sekolah}</td>

            <td>${siswa.kategori}</td>

            <td>

                <span class="badge bg-success">

                    Aktif

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${siswa.id}">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-hapus"
                    data-id="${siswa.id}">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    pasangEventTabel();

}

/*=========================================
  EVENT EDIT & HAPUS
=========================================*/

function pasangEventTabel(){

    document.querySelectorAll(".btn-edit")
    .forEach(btn=>{

        btn.addEventListener("click",()=>{

            editSiswa(btn.dataset.id);

        });

    });

    document.querySelectorAll(".btn-hapus")
    .forEach(btn=>{

        btn.addEventListener("click",()=>{

            hapusSiswa(btn.dataset.id);

        });

    });

}

/*=========================================
  MODE TAMBAH
=========================================*/

function modeTambah(){

    editId = null;

    document.getElementById("judulModal").innerText =
    "Tambah Siswa";

    document.getElementById("nama").value="";

    document.getElementById("kelas").selectedIndex=0;

    document.getElementById("kategori").selectedIndex=0;

    document.getElementById("sekolah").value =
    sekolahAktif;

}

/*=========================================
  EDIT SISWA
=========================================*/

function editSiswa(id){

    const siswa = dataSiswa.find(item=>item.id===id);

    if(!siswa) return;

    editId = id;

    document.getElementById("judulModal").innerText =
    "Edit Siswa";

    document.getElementById("nama").value =
    siswa.nama;

    document.getElementById("kelas").value =
    siswa.kelas;

    document.getElementById("kategori").value =
    siswa.kategori;

    document.getElementById("sekolah").value =
    siswa.sekolah;

    modalTambah.show();

}

/*=========================================
  RESET FORM
=========================================*/

function resetForm(){

    editId = null;

    document.getElementById("nama").value="";

    document.getElementById("kelas").selectedIndex=0;

    document.getElementById("kategori").selectedIndex=0;

    document.getElementById("sekolah").value =
    sekolahAktif;

}

/*=========================================
  SIMPAN SISWA
=========================================*/

async function simpanSiswa(){

    const nama =
    document.getElementById("nama").value.trim();

    const kelas =
    document.getElementById("kelas").value;

    const kategori =
    document.getElementById("kategori").value;

    const sekolah =
    document.getElementById("sekolah").value;

    // validasi

    if(nama===""){

        alert("Nama siswa belum diisi.");

        return;

    }

    if(kelas===""){

        alert("Kelas belum dipilih.");

        return;

    }

    const data={

        nama:nama,
        kelas:kelas,
        sekolah:sekolah,
        kategori:kategori,
        dibuat:new Date().toISOString()

    };

    try{

        // ==========================
        // EDIT
        // ==========================

        if(editId){

            await updateDoc(

                doc(db,"siswa",editId),

                data

            );

            alert("Data berhasil diperbarui.");

        }

        // ==========================
        // TAMBAH
        // ==========================

        else{

            await addDoc(

                siswaCollection,

                data

            );

            alert("Siswa berhasil ditambahkan.");

        }

        modalTambah.hide();

        resetForm();

        await loadSiswa();

    }
    catch(err){

        console.error(err);

        alert("Gagal menyimpan data.");

    }

}

/*=========================================
  HAPUS SISWA
=========================================*/

async function hapusSiswa(id){

    const yakin =
    confirm("Yakin ingin menghapus siswa ini?");

    if(!yakin) return;

    try{

        await deleteDoc(

            doc(db,"siswa",id)

        );

        alert("Data berhasil dihapus.");

        await loadSiswa();

    }
    catch(err){

        console.error(err);

        alert("Gagal menghapus data.");

    }

}

/*=========================================
  TAMBAH BARIS
=========================================*/

function tambahBaris(){

    const tbody =
    document.getElementById("bulkBody");

    const nomor =
    tbody.rows.length + 1;

    tbody.insertAdjacentHTML("beforeend",`

<tr>

<td>${nomor}</td>

<td>

<input
class="form-control namaBulk">

</td>

<td>

<select class="form-select kelasBulk">

<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
<option>11</option>
<option>12</option>

</select>

</td>

<td>

<select
class="form-select kategoriBulk">

<option>Coding</option>

<option>Robotik</option>

<option>Roblox</option>

<option>Digital Art</option>

<option>AI</option>

</select>

</td>

<td class="text-center">

<button
class="btn btn-danger btn-sm btnHapusBaris">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`);

    tbody
    .lastElementChild
    .querySelector(".btnHapusBaris")
    .addEventListener("click",function(){

        this.closest("tr").remove();

        nomorUlang();

    });

}

/*=========================================
  NOMOR ULANG
=========================================*/

function nomorUlang(){

    document
    .querySelectorAll("#bulkBody tr")
    .forEach((row,index)=>{

        row.cells[0].innerHTML =
        index+1;

    });

}

/*=========================================
  MODAL BANYAK
=========================================*/

if(modalBulkElement){

modalBulkElement.addEventListener(

"show.bs.modal",

function(){

document.getElementById(
"namaSekolahBulk"
).textContent = sekolahAktif;

const tbody =
document.getElementById("bulkBody");

tbody.innerHTML="";

for(let i=0;i<5;i++){

tambahBaris();

}

}

);

}

/*=========================================
  SIMPAN SEMUA
=========================================*/

async function simpanSemua(){

const nama =
document.querySelectorAll(".namaBulk");

const kelas =
document.querySelectorAll(".kelasBulk");

const kategori =
document.querySelectorAll(".kategoriBulk");

let jumlah=0;

try{

for(let i=0;i<nama.length;i++){

const isiNama =
nama[i].value.trim();

if(isiNama===""){

continue;

}

await addDoc(

siswaCollection,

{

nama:isiNama,

kelas:kelas[i].value,

kategori:kategori[i].value,

sekolah:sekolahAktif,

dibuat:new Date().toISOString()

}

);

jumlah++;

}

modalBulk.hide();

await loadSiswa();

alert(

jumlah +

" siswa berhasil ditambahkan."

);

}

catch(err){

console.error(err);

alert("Gagal menyimpan.");

}

}

