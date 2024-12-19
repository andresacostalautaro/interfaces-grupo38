export async function loadMoreComments() {
   
    const commentList = document.querySelector(".comment-list");
    const loadMoreButton = document.querySelector(".load-more");
    const comments = await fetchComments();
    console.log(comments);
    loadMoreButton.addEventListener("click", () => {
        comments.forEach(comment => {
            const newComment = createCommentElement(comment);
            commentList.appendChild(newComment);
        });

        loadMoreButton.style.display = "none"; // Oculta el botón después de cargar los comentarios
    });
}

function createCommentElement(comment) {
    const li = document.createElement("li");
    li.classList.add("comment");

    li.innerHTML = `
        <article>
            <header class="user-info">
                <img src="${comment.avatar}" class="avatar" alt="Avatar de ${comment.user}">
                <span>${comment.user}</span>
                <span class="comment-timestamp">${comment.timestamp}</span>
            </header>
            <p>${comment.text}</p>
            <div class="comment-actions">
                <button class="comment-action like-button">👍 ${comment.likes}</button>
                <button class="comment-action">Responder</button>
            </div>
        </article>
    `;

    return li;
}

async function fetchComments() {
    const response = await fetch("./data/initialComments.json");
    const data = await response.json();
    return data; 
}