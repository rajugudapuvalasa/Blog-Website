// ================= Signup =================
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://blog-website-rpuc.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        alert('Signup successful');
        window.location.href = 'dashboard.html';
      } else {
        alert(result.error || 'Signup failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// ================= Login =================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://blog-website-rpuc.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  });
}
 
//password toggle
document.querySelectorAll(".toggle-password-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});
