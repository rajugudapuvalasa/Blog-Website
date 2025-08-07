const token = localStorage.getItem('token');
const createblogForm = document.getElementById('blogForm');


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

    const result = await res.json();

    if (!response.ok) {
        console.error('Error creating blog:', result);
        alert(result.error || 'Failed to create blog.');
        return;
      }

      alert('Blog posted successfully!');
      window.location.href = 'dashboard.html';

    } catch (error) {
      console.error('Network error:', error);
      alert('Something went wrong. Please try again.');
    }
});
