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
    const res = await fetch('https://blog-website-rpuc.onrender.com/api/blogs', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        alert(errorData.error || 'Blog creation failed');
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert('Server error occurred.');
      }
      return;
    }

    const result = await res.json();
    alert('Blog created!');
    window.location.href = 'dashboard.html';

  } catch (err) {
    alert('Error: ' + err.message);
  }

});
