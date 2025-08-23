const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

if (document.location.pathname.includes('dashboard.html')) {
  const token = localStorage.getItem('token');
  if (!token) location.href = 'login.html';
  const userId = JSON.parse(atob(token.split('.')[1])).id;

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      const confirmLogout = confirm("Are you sure , want to logout?");
      if (confirmLogout) {
        localStorage.removeItem('token');
        location.href = 'index.html';
      }
    };
  }

  async function loadBlogs() {
    const res = await fetch('https://blog-website-rpuc.onrender.com/api/blogs');
    const blogs = await res.json();
    const blogDiv = document.getElementById('blogs');
    const search = searchInput?.value.toLowerCase() || '';
    const category = categorySelect?.value?.toLowerCase() || '';

    blogDiv.innerHTML = '';
    blogs.reverse().forEach((b) => {
      const blogTitle = b.title.toLowerCase();
      const blogContent = b.content.toLowerCase();
      const blogCategory = (b.category || '').toLowerCase();
      const matchesSearch = blogTitle.includes(search) || blogContent.includes(search);
      const matchesCategory = category === '' || blogCategory === category;
      const isAuthor = b.author?._id === userId;
      const isLiked = b.likes?.includes(userId);

      if (matchesSearch && matchesCategory) {
        blogDiv.innerHTML += `
          <div class="blog">
            <img src="${b.image}" alt="Blog Image" style="max-width:200px;" />
            <div class="cnt">
              <h3>${b.title}</h3>
              <p>${b.content.substring(0, 0)}des...</p>
              <a href="blog.html?id=${b._id}">Read More</a>
              <p>Category: ${b.category || 'Uncategorized'}</p>
              <p>Author: ${b.author?.username || 'Unknown'}</p>
              <div class="blog-actions">
                <button class="like-btn" data-id="${b._id}" title="Like" style="background-color: #f9f9f9; padding: 5px 10px 5px 0px; border: none; border-radius: 6px; cursor: pointer;">
                  <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart" style="font-size: 22px; color:${isLiked ? 'hotpink' : '#555'}"></i>
                  <span class="like-count" style="margin-left: 5px; font-weight: bold; color: #444;">${b.likes?.length || 0}</span>
                </button>
                ${isAuthor ? `
                <button onclick="editBlog('${b._id}')" title="Edit" class="action-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteBlog('${b._id}')" title="Delete" class="action-btn">
                  <i class="fas fa-trash-alt"></i>
                </button>` : ''}
              </div>
            </div>
          </div>
        `;
      }
    });
  }

  document.addEventListener('click', async (e) => {
    if (e.target.closest('.like-btn')) {
      const btn = e.target.closest('.like-btn');
      const blogId = btn.getAttribute('data-id');
      const token = localStorage.getItem('token');
      if (!token) return alert('Login required to like!');

      try {
        const res = await fetch(`https://blog-website-rpuc.onrender.com/api/blogs/${blogId}/like`, {
          method: 'POST',
          headers: { Authorization: token }
        });
        const result = await res.json();

        // Update icon and count
        const icon = btn.querySelector('i');
        const countSpan = btn.querySelector('.like-count');
        if (result.liked) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          icon.style.color = 'hotpink';
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          icon.style.color = '#555';
        }
        countSpan.textContent = result.likeCount;
        loadBlogs();
      } catch (err) {
        console.error(err);
      }
    }
  });

  window.deleteBlog = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required!');
    if (confirm('Are you sure you want to delete this blog?')) {
      const res = await fetch(`https://blog-website-rpuc.onrender.com/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });
      const result = await res.json();
      alert(result.message || 'Deleted');
      loadBlogs();
    }
  };

  window.editBlog = (id) => {
    location.href = `editblog.html?id=${id}`;
  };

  if (searchInput) searchInput.oninput = loadBlogs;
  if (categorySelect) categorySelect.onchange = loadBlogs;

  loadBlogs();
}
