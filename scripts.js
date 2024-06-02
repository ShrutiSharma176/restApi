document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error');

    function fetchPostsAndUsers() {
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
            fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
        ])
        .then(([posts, users]) => {
            loadingIndicator.classList.add('hidden');
            displayPosts(posts, users);
        })
        .catch(err => {
            loadingIndicator.classList.add('hidden');
            errorMessage.classList.remove('hidden');
            console.error(err);
        });
    }

    function displayPosts(posts, users) {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="user-info">By ${getUserById(users, post.userId).name} (${getUserById(users, post.userId).email})</div>
                <div class="post-body">${post.body}</div>
            `;
            postElement.addEventListener('click', () => displayPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    }

    function getUserById(users, userId) {
        return users.find(user => user.id === userId);
    }

    function displayPostDetails(postId) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(res => res.json())
            .then(post => {
                const postDetailElement = document.createElement('div');
                postDetailElement.classList.add('post-detail');
                postDetailElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                `;
                fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
                    .then(res => res.json())
                    .then(comments => {
                        const commentsElement = document.createElement('div');
                        commentsElement.classList.add('comments');
                        commentsElement.innerHTML = '<h3>Comments:</h3>';
                        comments.forEach(comment => {
                            const commentElement = document.createElement('div');
                            commentElement.classList.add('comment');
                            commentElement.innerHTML = `
                                <p><strong>${comment.name} (${comment.email})</strong></p>
                                <p>${comment.body}</p>
                            `;
                            commentsElement.appendChild(commentElement);
                        });
                        postDetailElement.appendChild(commentsElement);
                    });
                postsContainer.innerHTML = '';
                postsContainer.appendChild(postDetailElement);
            });
    }

    fetchPostsAndUsers();
});
