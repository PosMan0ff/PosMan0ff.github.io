// Вход
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password})
    });
    if (response.ok) {
      const { sessionToken } = await response.json();
      localStorage.setItem('sessionToken', sessionToken);
      window.location.href = 'index.html';
    } else {
      alert('Неверный email или пароль.');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
});


getUserData();