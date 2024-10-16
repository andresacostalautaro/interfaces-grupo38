export function setBreadcrumbs(palabra) {
    const bcsContent = document.getElementById("bcs_content");
    if (palabra.toLowerCase() === "home" || palabra.toLowerCase() === "sign in" || palabra.toLowerCase() === "sign up" || palabra.toLowerCase() === "log in") {
        bcsContent.innerHTML = `<h3>${palabra}</h3>`;
    } else {
        palabra = palabra.replace("aventura", '');
        bcsContent.innerHTML = `
            <h3>Aventura</h3>
            <img src="assets/images/breadcrums-greater-than.svg" alt=">" class="breadcrumbs_greaterthan_icon">
            <h3>${palabra}</h3>
        `;
    }
}