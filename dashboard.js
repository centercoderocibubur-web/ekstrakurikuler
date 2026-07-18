// ===============================
// DASHBOARD CODERO CIBUBUR
// ===============================

// Ambil data siswa dari localStorage
const dataSiswa = JSON.parse(localStorage.getItem("siswa")) || [];

// ===============================
// TOTAL SISWA
// ===============================

const totalSiswa = document.getElementById("totalSiswa");

if (totalSiswa) {
    totalSiswa.textContent = dataSiswa.length;
}

// ===============================
// JUMLAH SISWA PER SEKOLAH
// ===============================

const sekolahList = [
    "SD AL JANNAH",
    "SMP AL JANNAH",
    "SD SEKOLAH ALAM CIKEAS",
    "SMP SEKOLAH ALAM CIKEAS",
    "SMA SEKOLAH ALAM CIKEAS"
];

const progress = document.getElementById("progressSekolah");

if(progress){

    progress.innerHTML = "";

    // Cari jumlah siswa terbanyak
    let terbesar = 1;

    sekolahList.forEach(sekolah=>{

        const jumlah = dataSiswa.filter(item=>item.sekolah===sekolah).length;

        if(jumlah > terbesar){
            terbesar = jumlah;
        }

    });

    sekolahList.forEach(sekolah=>{

        const jumlah = dataSiswa.filter(item=>item.sekolah===sekolah).length;

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
                    style="width:${persen}%;">
                </div>

            </div>

        </div>

        `;

    });

}

// ===============================
// SISWA AKTIF
// ===============================

const aktif = document.getElementById("aktif");

if (aktif) {
    aktif.textContent = dataSiswa.length;
}

// ===============================
// TOTAL SEKOLAH
// ===============================


const totalSekolah = document.getElementById("totalSekolah");

if (totalSekolah) {
    totalSekolah.textContent = sekolahList.length;
}