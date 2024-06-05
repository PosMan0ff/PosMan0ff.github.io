// Получаем ссылку на кнопку
const logoutBtn = document.getElementById('logoutBtn');

// Добавляем обработчик события click
logoutBtn.addEventListener('click', logout);

async function logout() {
  try {
    // Получаем токен сессии из localStorage
    const sessionToken = localStorage.getItem('sessionToken');

    // Отправляем запрос на сервер для выхода
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (response.ok) {
      // Удаляем токен сессии из localStorage
      localStorage.removeItem('sessionToken');

      // Перенаправляем пользователя на страницу выхода
      window.location.href = 'account.html';
    } else {
      // Обрабатываем ошибку
      console.error('Ошибка при выходе:', response.status);
    }
  } catch (error) {
    // Обрабатываем ошибку
    console.error('Ошибка при выходе:', error);
  }
}