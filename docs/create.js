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
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server returned non-JSON:", text);
      alert("Error: " + text);
      return;
    }

    const result = await res.json();
    alert(result.message);
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error("Network error:", err);
    alert("Something went wrong. Try again.");
  }
});
