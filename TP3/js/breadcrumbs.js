import { getCarousels } from "./main.js";

export function setBreadcrumbs(firstCategory, secondCategory = null) {
    const breadcrumb = document.getElementById('breadcrumb');

    // Limpiar el contenido actual del breadcrumb
    breadcrumb.innerHTML = '';

    // creo la imagen de home que va a estar siempre y la agrego como nodo hijo del breadcrumb
    const homeLink = document.createElement('a');
    homeLink.href = '#';
    const homeIcon = document.createElement('i');
    homeIcon.id ='breadcrumbs_home_icon';
    homeIcon.classList.add('fa-solid','fa-house');
    homeLink.appendChild(homeIcon);
    breadcrumb.appendChild(homeLink);
    homeLink.addEventListener('click', getCarousels);

    breadcrumb.appendChild(createBreadcrumbSeparator());

    // despues del primer separador agrego el link de la categoria principal
    const firstLink = createBreadcrumbLink(firstCategory);
    breadcrumb.appendChild(firstLink);

    // Si hay una segunda categoría, agregarla también
    if (secondCategory) {
        breadcrumb.appendChild(createBreadcrumbSeparator());
        const secondLink = createBreadcrumbLink(secondCategory);
        secondLink.classList.add('active');
        breadcrumb.appendChild(secondLink);
    }
}

// Función auxiliar para crear un enlace
function createBreadcrumbLink(text) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;
    return link;
}

// Función auxiliar para crear un separador ">"
function createBreadcrumbSeparator() {
    const separator = document.createElement('span');
    separator.textContent = ' > ';
    return separator;
}
