/*=========================================
  AUTH.JS
  Sistem Informasi Ekstrakurikuler
  Codero Cibubur
=========================================*/

// =============================
// DATA LOGIN
// =============================

const ADMIN = {
    username: "admin",
    password: "codero123"
};

// =============================
// CEK ELEMEN
// =============================

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");

// =============================
// LOAD REMEMBER ME
// =============================

window.addEventListener("load", () => {

    const savedUsername = localStorage.getItem("remember_username");

    if (savedUsername) {

        usernameInput.value = savedUsername;
        rememberMe.checked = true;

    }

});

// =============================
// SHOW / HIDE PASSWORD
// =============================

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="bi bi-eye-slash"></i>';

        } else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="bi bi-eye"></i>';

        }

    });

}

// =============================
// LOGIN
// =============================

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        loginError.classList.add("d-none");

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (
            username === ADMIN.username &&
            password === ADMIN.password
        ) {

            // Simpan status login
            sessionStorage.setItem("isLogin", "true");

            // Remember Me
            if (rememberMe.checked) {

                localStorage.setItem(
                    "remember_username",
                    username
                );

            } else {

                localStorage.removeItem(
                    "remember_username"
                );

            }

            // Animasi tombol
            loginBtn.disabled = true;

            loginBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>Login...';

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 800);

        } else {

            loginError.classList.remove("d-none");

            passwordInput.value = "";

            passwordInput.focus();

        }

    });

}

// =============================
// PROTEKSI HALAMAN
// =============================

function checkLogin() {

    if (sessionStorage.getItem("isLogin") !== "true") {

        window.location.href = "dashboard.html";

    }

}

// =============================
// LOGOUT
// =============================

function logout() {

    if (confirm("Yakin ingin logout?")) {

        sessionStorage.removeItem("isLogin");

        window.location.href = "index.html";

    }

}
