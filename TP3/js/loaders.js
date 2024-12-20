export function loadHTML(url, elementId) {
    return new Promise((resolve, reject) => {  // Devuelve una promesa
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text(); // Procesar la respuesta como texto si todo va bien
            } else {
                throw new Error(`Error loading ${url}: ${response.statusText}`);
            }
        })
        .then(data => {
            const placeholder = document.getElementById(elementId);
            placeholder.innerHTML = data;
            resolve();  // Resuelve la promesa cuando la carga haya terminado
        })
        .catch(error => {
            console.error('Error fetching content:', error);
            reject(error);  // Rechaza la promesa si hay un error
        });
    });
}

export async function showForm(formTitle) {
    const pageContent = document.getElementById('page_content');
    pageContent.innerHTML = '';
    return loadHTML(`frames/form-${formTitle}.html`, 'page_content');
}