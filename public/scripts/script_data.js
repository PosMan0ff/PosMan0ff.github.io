// Получение данных пользователя
async function getUserData() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      try {
        const response = await fetch('/user', {
          headers: { 'Authorization': sessionToken }
        });
        if (response.ok) {
          const { name, email } = await response.json();
          document.getElementById('user-name').textContent = name;
          document.getElementById('user-email').textContent = email;
          document.getElementById('user-info').style.display = 'block';
          document.getElementById('user-notinfo').style.display = 'none';
        } else {
          localStorage.removeItem('sessionToken');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  }

  getUserData();