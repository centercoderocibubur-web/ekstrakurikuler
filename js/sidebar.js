document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.getElementById("sidebar");
    const menu = document.getElementById("menuToggle");

    if (!sidebar || !menu) return;

    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    function tutupSidebar(){
        sidebar.classList.add("hide");
        overlay.classList.remove("active");
    }

    menu.addEventListener("click", function () {

        sidebar.classList.toggle("hide");
        overlay.classList.toggle("active", !sidebar.classList.contains("hide"));

    });

    overlay.addEventListener("click", tutupSidebar);

    sidebar.querySelectorAll("a").forEach(function(link){
        link.addEventListener("click", tutupSidebar);
    });

});
