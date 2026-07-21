import { checkLogin } from "./auth.js";

checkLogin();

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

tampilkan();

async function tambahSiswa(){

    const siswa = {

        nama: document.getElementById("nama").value.trim(),
        kelas: document.getElementById("kelas").value,
        sekolah: document.getElementById("sekolah").value,
        kategori: document.getElementById("kategori").value

    };

    if(
        siswa.nama === "" ||
        siswa.kelas === ""
    ){
        alert("Semua data harus diisi!");
        return;
    }

    try{

        await addDoc(
            collection(db,"siswa"),
            siswa
        );

        bootstrap.Modal
        .getInstance(document.getElementById("modalSiswa"))
        .hide();

        document.getElementById("nama").value="";
        document.getElementById("kelas").selectedIndex=0;
        document.getElementById("kategori").selectedIndex=0;

        tampilkan();

        alert("Data berhasil disimpan.");

    }catch(err){

        console.error(err);

        alert("Gagal menyimpan ke Firebase");

    }

}


    // Tutup modal
    bootstrap.Modal.getInstance(document.getElementById("modalSiswa")).hide();

    // Reset form
    document.getElementById("nama").value="";
    document.getElementById("kelas").value="";
    document.getElementById("kategori").selectedIndex=0;

    // Refresh tabel
    tampilkan();

}
function tambahBaris(){

    const tbody = document.getElementById("bulkBody");

    const nomor = tbody.rows.length + 1;

    tbody.innerHTML += `

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

            <select class="form-select kategoriBulk">

                <option>Coding</option>

                <option>Robotik</option>

                <option>Roblox</option>

                <option>Digital Art</option>

                <option>AI</option>

            </select>

        </td>

        <td class="text-center">

            <button
                class="btn btn-danger btn-sm"
                onclick="hapusBaris(this)">

                <i class="bi bi-trash"></i>

            </button>

        </td>

    </tr>

    `;

}
function hapusBaris(btn){

    btn.closest("tr").remove();

    nomorUlang();

}
function nomorUlang(){

    const rows = document.querySelectorAll("#bulkBody tr");

    rows.forEach((row,index)=>{

        row.cells[0].innerText = index+1;

    });

}
async function tampilkan(){

    const sekolahAktif =
        localStorage.getItem("sekolahAktif");

    const tbody =
        document.getElementById("tbodySiswa");

    tbody.innerHTML="";

    const snapshot =
        await getDocs(collection(db,"siswa"));

    let no = 1;

    snapshot.forEach(doc=>{

        const item = doc.data();

        if(item.sekolah !== sekolahAktif) return;

        tbody.innerHTML += `
        <tr>

            <td>${no++}</td>

            <td>${item.nama}</td>

            <td>${item.kelas}</td>

            <td>${item.sekolah}</td>

            <td>${item.kategori}</td>

            <td>

                <span class="badge bg-success">

                    Aktif

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    disabled>

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    disabled>

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>
        `;

    });

}

function hapus(index){

    const sekolahAktif = localStorage.getItem("sekolahAktif");

    const dataFilter = dataSiswa.filter(item => item.sekolah === sekolahAktif);

    const siswa = dataFilter[index];

    const indexAsli = dataSiswa.findIndex(item =>
        item.nis === siswa.nis &&
        item.sekolah === siswa.sekolah
    );

    if(indexAsli !== -1){

        if(confirm("Hapus siswa ini?")){

            dataSiswa.splice(indexAsli,1);

            localStorage.setItem("siswa", JSON.stringify(dataSiswa));

            tampilkan();

        }

    }

}

function editSiswa(index){
    
    const sekolahAktif = localStorage.getItem("sekolahAktif");

    const dataFilter = dataSiswa.filter(item => item.sekolah === sekolahAktif);

    const siswa = dataFilter[index];

    editIndex = dataSiswa.findIndex(item =>

        item.nis === siswa.nis &&
        item.sekolah === siswa.sekolah

    );

    document.getElementById("nama").value = siswa.nama;

    document.getElementById("kelas").value = siswa.kelas;

    document.getElementById("kategori").value = siswa.kategori;

    document.getElementById("judulModal").innerText = "Edit Siswa";

    const modal = new bootstrap.Modal(document.getElementById("modalSiswa"));

    modal.show();

}

function modeTambah(){

    editIndex = -1;

    document.getElementById("judulModal").innerText = "Tambah Siswa";

    document.getElementById("nama").value="";
    document.getElementById("kelas").value="";
    document.getElementById("kategori").selectedIndex=0;
    document.getElementById("kelas").selectedIndex = 0;
    document.getElementById("sekolah").selectedIndex = 0;

}

const modalBanyak = document.getElementById("modalBanyak");

if(modalBanyak){

    modalBanyak.addEventListener("show.bs.modal",function(){

    document.getElementById("namaSekolahBulk").textContent =
        localStorage.getItem("sekolahAktif");

    const tbody = document.getElementById("bulkBody");

    tbody.innerHTML="";

    for(let i=0;i<5;i++){

        tambahBaris();

    }

});

}

function simpanSemua(){

    const sekolahAktif = localStorage.getItem("sekolahAktif");

    const nama = document.querySelectorAll(".namaBulk");
    const kelas = document.querySelectorAll(".kelasBulk");
    const kategori = document.querySelectorAll(".kategoriBulk");

    let dataSiswa = JSON.parse(localStorage.getItem("siswa")) || [];

    let jumlahTambah = 0;

    for(let i=0;i<nama.length;i++){

        const namaSiswa = nama[i].value.trim();

        if(namaSiswa === "") continue;

        dataSiswa.push({

            nama: namaSiswa,

            kelas: kelas[i].value,

            sekolah: sekolahAktif,

            kategori: kategori[i].value

        });

        jumlahTambah++;

    }

    localStorage.setItem(
        "siswa",
        JSON.stringify(dataSiswa)
    );

    tampilkan();

    alert(jumlahTambah + " siswa berhasil ditambahkan.");

    bootstrap.Modal.getInstance(
        document.getElementById("modalBanyak")
    ).hide();

}

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

window.tambahSiswa = tambahSiswa;
window.modeTambah = modeTambah;
window.editSiswa = editSiswa;
window.hapus = hapus;
window.tambahBaris = tambahBaris;
window.hapusBaris = hapusBaris;
window.simpanSemua = simpanSemua;
window.tampilkan = tampilkan;

document
    .getElementById("btnTambahSiswa")
    .addEventListener("click", modeTambah);

document
    .getElementById("btnTambahBaris")
    .addEventListener("click", tambahBaris);

document
    .getElementById("btnSimpanSemua")
    .addEventListener("click", simpanSemua);

document
    .getElementById("btnSimpanSiswa")
    .addEventListener("click", tambahSiswa);
