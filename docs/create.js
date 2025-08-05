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

const blogForm = document.getElementById('blogForm');
blogForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Set content from Quill to hidden field
  const content = quill.root.innerHTML;
  document.getElementById('hiddenContent').value = content;

  const formData = new FormData(blogForm);

  try {
    const res = await fetch('https://blog-website-rpuc.onrender.com/api/blogs', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
        // DO NOT set Content-Type header manually with FormData
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
    alert('Blog created successfully!');
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error('Fetch error:', err);
    alert('Something went wrong while creating the blog.');
  }
});
