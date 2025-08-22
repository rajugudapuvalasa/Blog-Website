const token = localStorage.getItem('token');
const blogForm = document.getElementById('blogForm');

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

blogForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Set the content to hidden input
  document.getElementById('hiddenContent').value = quill.root.innerHTML;

  const formData = new FormData(blogForm);

  try {
    const res = await fetch('https://blog-website-rpuc.onrender.com/api/blogs/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    });

    let result;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await res.json();
    } else {
      const text = await res.text();
      console.error('Server returned non-JSON:', text);
      alert('Server error: ' + text);
      return;
    }

    if (!res.ok) {
      console.error('Error creating blog:', result);
      alert(result.error || result.message || 'Failed to create blog.');
      return;
    }

    alert('Blog posted successfully!');
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Network error:', error);
    alert('Something went wrong. Please try again.');
  }
});
