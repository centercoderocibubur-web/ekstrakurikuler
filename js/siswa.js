import { db } from "./firebase.js";

console.log("Firebase berhasil terhubung");
console.log(db);
let editIndex = -1;
let dataSiswa = JSON.parse(localStorage.getItem("siswa")) || [];

tampilkan();

function tambahSiswa(){

    const sekolahAktif = localStorage.getItem("sekolahAktif");

    const siswa = {

        nama: document.getElementById("nama").value.trim(),
        kelas: document.getElementById("kelas").value,
        sekolah: document.getElementById("sekolah").value,
        kategori: document.getElementById("kategori").value

    };

    // Validasi
    if(
        siswa.nama === "" ||
        siswa.kelas === ""
    ){
        alert("Semua data harus diisi!");
        return;
    }

    // Simpan ke array
    if(editIndex == -1){

    dataSiswa.push(siswa);

    }else{

    dataSiswa[editIndex] = siswa;

    editIndex = -1;

    }

    // Simpan ke localStorage
    localStorage.setItem("siswa", JSON.stringify(dataSiswa));

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
function tampilkan(){

    dataSiswa = JSON.parse(localStorage.getItem("siswa")) || [];
    
    const sekolahAktif = localStorage.getItem("sekolahAktif");

    const tbody = document.getElementById("tbodySiswa");

    tbody.innerHTML="";

    const dataFilter = dataSiswa.filter(function(item){

        return item.sekolah === sekolahAktif;

    });

    dataFilter.forEach(function(item,index){

        tbody.innerHTML += `
<tr>

    <td>${index+1}</td>

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
            onclick="editSiswa(${index})">

            <i class="bi bi-pencil-fill"></i>

        </button>

        <button
            class="btn btn-danger btn-sm"
            onclick="hapus(${index})">

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
    addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function tesFirebase() {

    try {

        const doc = await addDoc(
            collection(db, "tes"),
            {
                nama: "Codero",
                waktu: new Date().toISOString()
            }
        );

        console.log("Berhasil", doc.id);

    } catch (e) {

        console.error(e);

    }

}

tesFirebase();
