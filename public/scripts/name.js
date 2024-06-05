// Функция для получения имени пользователя с сервера
async function getUserNameFromServer() {
    try {
        // Получение session токена (например, из cookie)
        const sessionToken = localStorage.getItem('sessionToken')

        // Отправка GET-запроса на сервер для получения имени пользователя
        const response = await fetch(`/get-username?sessionToken=${sessionToken}`);
        const data = await response.json();

        return data.username;
    } catch (error) {
        console.error('Ошибка при получении имени пользователя:', error);
        return 'Аккаунт';
    }
}

// Обновление содержимого пункта меню "Account"
getUserNameFromServer()
    .then(userName => {
        const accountMenuItem = document.getElementById("account-menu-item");
        accountMenuItem.innerHTML = `<a href="account.html">${userName}</a>`;
    });