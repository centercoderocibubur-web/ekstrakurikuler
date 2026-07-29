/*=========================================
  AUTH.JS
  Firebase Authentication (Email & Password)
==========================================*/

import { auth } from "./firebase.js";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");

function tampilkanError(pesan){
    if(loginError){
        loginError.textContent = pesan;
        loginError.classList.remove("d-none");
    }
}

if(togglePassword && passwordInput){
    togglePassword.addEventListener("click", function(){
        const tersembunyi = passwordInput.type === "password";
        passwordInput.type = tersembunyi ? "text" : "password";
        togglePassword.innerHTML = tersembunyi
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';
    });
}

if(loginForm){
    onAuthStateChanged(auth, function(user){
        if(user){
            window.location.href = "dashboard/";
        }
    });

    loginForm.addEventListener("submit", async function(event){
        event.preventDefault();

        loginError.classList.add("d-none");
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Login...';

        try{
            await setPersistence(
                auth,
                rememberMe.checked ? browserLocalPersistence : browserSessionPersistence
            );

            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "dashboard/";
        }
        catch(error){
            console.error("Login Firebase gagal:", error);
            passwordInput.value = "";
            passwordInput.focus();

            const pesan = error.code === "auth/invalid-credential" ||
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
                ? "Email atau password tidak valid."
                : "Login gagal. Periksa koneksi atau konfigurasi Firebase Authentication.";

            tampilkanError(pesan);
        }
        finally{
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> LOGIN';
        }
    });
}

function checkLogin(){
    return onAuthStateChanged(auth, function(user){
        if(!user){
            window.location.href = "../";
        }
    });
}

async function logout(){
    if(!confirm("Yakin ingin logout?")) return;

    try{
        await signOut(auth);
        window.location.href = "../";
    }
    catch(error){
        console.error("Logout Firebase gagal:", error);
        alert("Logout gagal. Silakan coba lagi.");
    }
}

window.checkLogin = checkLogin;
window.logout = logout;

export { checkLogin, logout };
