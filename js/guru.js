import { checkLogin } from "./auth.js";
import { db } from "./firebase.js";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

checkLogin();

const tabel = document.getElementById("tabelGuru");
const modal = new bootstrap.Modal(document.getElementById("modalGuru"));
let editId = null;

function aman(teks){
    return String(teks || "").replace(/[&<>'"]/g, function(karakter){
        return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[karakter];
    });
}

async function loadGuru(){
    try{
        const snapshot = await getDocs(collection(db, "guru"));
        const data = snapshot.docs.map(function(item){ return { id:item.id, ...item.data() }; })
            .sort(function(a, b){ return (a.nama || "").localeCompare(b.nama || ""); });

        tabel.innerHTML = data.length ? data.map(function(guru){
            return `<tr><td>${aman(guru.nama)}</td><td>${aman(guru.telepon) || "-"}</td><td class="text-end"><button class="btn btn-sm btn-outline-primary" onclick="editGuru('${guru.id}')">Ubah</button> <button class="btn btn-sm btn-outline-danger" onclick="hapusGuru('${guru.id}')">Hapus</button></td></tr>`;
        }).join("") : '<tr><td colspan="3" class="text-center text-muted">Belum ada data guru.</td></tr>';

        window.dataGuru = data;
    }
    catch(err){
        console.error(err);
        tabel.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Data guru tidak dapat dimuat.</td></tr>';
    }
}

function bukaModal(guru){
    editId = guru ? guru.id : null;
    document.getElementById("judulModalGuru").textContent = guru ? "Ubah Guru" : "Tambah Guru";
    document.getElementById("namaGuru").value = guru ? guru.nama || "" : "";
    document.getElementById("teleponGuru").value = guru ? guru.telepon || "" : "";
    modal.show();
}

document.getElementById("btnTambahGuru").addEventListener("click", function(){ bukaModal(); });
document.getElementById("btnSimpanGuru").addEventListener("click", async function(){
    const nama = document.getElementById("namaGuru").value.trim();
    const telepon = document.getElementById("teleponGuru").value.trim();
    if(!nama){ alert("Nama guru wajib diisi."); return; }
    const data = { nama:nama, telepon:telepon, diperbarui:new Date().toISOString() };
    try{
        if(editId){ await updateDoc(doc(db, "guru", editId), data); }
        else { await addDoc(collection(db, "guru"), { ...data, dibuat:new Date().toISOString() }); }
        modal.hide();
        await loadGuru();
    }
    catch(err){ console.error(err); alert("Data guru gagal disimpan."); }
});

window.editGuru = function(id){ bukaModal((window.dataGuru || []).find(function(guru){ return guru.id === id; })); };
window.hapusGuru = async function(id){
    if(!confirm("Hapus data guru ini?")) return;
    try{ await deleteDoc(doc(db, "guru", id)); await loadGuru(); }
    catch(err){ console.error(err); alert("Data guru gagal dihapus."); }
};

loadGuru();
