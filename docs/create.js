const token = localStorage.getItem('token');
if (!token) {
  alert('Unauthorized! Please login again.');
  window.location.href = 'login.html';
}

const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Write your blog description...',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }, { color: [] }, { background: [] }]
    ]
  }
});

const createblogForm = document.getElementById('blogForm');
blogForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Set content from Quill to hidden field
  document.getElementById('hiddenContent').value = quill.root.innerHTML;

  const formData = new FormData(createblogForm);

  try {
    const res = await fetch('http://localhost:7000/api/blogs', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      alert('Blog created!');
      window.location.href = 'dashboard.html';
    } else {
      alert(result.error || 'Blog creation failed');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
