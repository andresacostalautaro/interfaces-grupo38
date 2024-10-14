export function loadCommentsFromFile(filePath, callback) {
    fetch(filePath)
        .then(response => response.json())
        .then(comments => callback(comments))
        .catch(error => console.error('Error al cargar los comentarios:', error));
}

export function createCommentElement(comment) {
    const commentItem = document.createElement('li');
    commentItem.classList.add('comment');

    commentItem.innerHTML = `
    <article>
        <header class="user-info">
            <img src="${comment.avatar}" class="avatar" alt="Avatar de ${comment.name}">
            <span>${comment.name}</span>
        </header>
        <p>${comment.text}</p>
        <time>${comment.timestamp}</time>
    </article>
    `;

    return commentItem;
}

export function renderComments(comments, visibleCount) {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = '';  // Limpiar lista de comentarios

    comments.slice(0, visibleCount).forEach(comment => {
        const commentItem = createCommentElement(comment);
        commentList.appendChild(commentItem);
    });

    // Ocultar botón si no hay más comentarios
    const loadMoreBtn = document.querySelector('.load-more'); 
    if (visibleCount >= comments.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

export function setupLoadMoreButton(comments) {
    let visibleComments = 2;  
    const loadMoreBtn = document.querySelector('.load-more'); 

    loadMoreBtn.addEventListener('click', () => {
        visibleComments += 2;
        renderComments(comments, visibleComments);
    });
}

export function setupCommentSubmission(comments) {
    const submitBtn = document.querySelector('.submit-button'); 
    const commentInput = document.querySelector('#comment-input'); 

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        const commentText = commentInput.value.trim();
        if (commentText !== "") {
            const newComment = {
                name: 'John Doe',
                avatar: './assets/userIcons/userIcon1.png',
                text: commentText,
                timestamp: new Date().toLocaleString()
            };
            comments.unshift(newComment);  
            commentInput.value = '';  
            renderComments(comments, comments.length);  
        }
    });
}
