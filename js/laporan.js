// Contoh data sekolah (Nantinya ganti dengan fungsi fetch/get dari Firebase)
const daftarSekolah = [
    { id: "S01", nama: "SMA Negeri 1" },
    { id: "S02", nama: "SMA Negeri 2" },
    { id: "S03", nama: "SMA Negeri 3" }
];

const cardContainer = document.getElementById('card-container');

// Fungsi untuk merender card
function renderCards() {
    cardContainer.innerHTML = ''; // Bersihkan container
    
    daftarSekolah.forEach(sekolah => {
        // Buat elemen card
        const card = document.createElement('div');
        card.className = 'card-sekolah'; // Sesuaikan dengan class di CSS Anda
        
        // Isi konten card
        card.innerHTML = `
            <h3>${sekolah.nama}</h3>
            <p>Klik untuk melihat laporan detail</p>
        `;
        
        // Tambahkan event saat card diklik
        card.addEventListener('click', () => {
            // Arahkan ke halaman detail laporan dengan membawa parameter ID sekolah
            window.location.href = `../laporan-detail/index.html?sekolahId=${sekolah.id}`;
        });
        
        cardContainer.appendChild(card);
    });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderCards);
