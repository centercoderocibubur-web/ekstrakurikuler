document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");
    const menu = document.getElementById("menuToggle");

    if (!sidebar || !menu) return;

    menu.addEventListener("click", function () {

        sidebar.classList.toggle("hide");
        main.classList.toggle("full");

    });

});