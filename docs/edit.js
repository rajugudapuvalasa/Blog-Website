const quill = new Quill('#editor', { theme: 'snow' });

const blogId = new URLSearchParams(window.location.search).get('id');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const imageInput = document.querySelector('input[name="image"]');
const hiddenContent = document.getElementById('hiddenContent');
const editBlogForm = document.getElementById('editBlogForm');

// Load blog data into form
async function loadBlog() {
  try {
    const res = await fetch(`https://blog-website-rpuc.onrender.com/api/blogs/${blogId}`);
    const data = await res.json();

    if (res.ok) {
      titleInput.value = data.title;
      quill.root.innerHTML = data.content;
      categorySelect.value = data.category;
    } else {
      alert('Failed to load blog');
    }
  } catch (err) {
    console.error('Error loading blog:', err);
  }
}

// Submit updated blog
editBlogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hiddenContent.value = quill.root.innerHTML;

  const formData = new FormData();
  formData.append('title', titleInput.value);
  formData.append('content', hiddenContent.value);
  formData.append('category', categorySelect.value);

  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    const res = await fetch(`https://blog-website-rpuc.onrender.com/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      alert('Blog updated successfully');
      window.location.href = 'dashboard.html';
    } else {
      alert(result.error || 'Failed to update blog');
    }
  } catch (err) {
    console.error('Update error:', err);
    alert('Error updating blog');
  }
});

loadBlog();
