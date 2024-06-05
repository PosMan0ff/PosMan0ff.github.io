// Регистрация
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (response.ok) {
      alert('Регистрация успешна!');
      window.location.href = 'login.html';
    } else {
      alert('Ошибка регистрации.');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
});

getUserData();