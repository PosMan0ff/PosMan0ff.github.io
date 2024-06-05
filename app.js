const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10; // количество раундов при генерации соли

const app = express();
const port = 4795;

// Создание и подключение к базе данных SQLite3
const db = new sqlite3.Database('users.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    session_token TEXT
  )`);
});

// Обработка запросов на регистрацию
app.post('/register', express.json(), (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Ошибка регистрации' });
    }
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Ошибка регистрации' });
      }
      res.status(200).json({ message: 'Регистрация успешна' });
    });
  });
});

// Обработка запросов на вход
app.post('/login', express.json(), (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    bcrypt.compare(password, row.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }
      const sessionToken = generateSessionToken();
      db.run('UPDATE users SET session_token = ? WHERE email = ?', [sessionToken, email], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Ошибка входа' });
        }
        res.status(200).json({ sessionToken });
      });
    });
  });
});

// Вспомогательная функция для генерации токена сессии
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Обработка запросов на получение данных пользователя
app.get('/user', express.json(), (req, res) => {
  const sessionToken = req.headers.authorization;
  db.get('SELECT * FROM users WHERE session_token = ?', [sessionToken], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'Неавторизованный доступ' });
    }
    res.status(200).json({ name: row.name, email: row.email });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

// Обработка запроса на получение имени пользователя
app.get('/get-username', (req, res) => {
  const sessionToken = req.query.sessionToken;

// Выполнение запроса к базе данных SQLite3
db.get('SELECT name FROM users WHERE session_token = ?', [sessionToken], (err, row) => {
      if (err) {
          console.error('Ошибка при выполнении запроса:', err);
          res.status(500).send('Ошибка на сервере');
          return;
      }

      if (row) {
          res.json({ username: row.name });
      } else {
          res.json({ username: 'Аккаунт' });
      }
  });
});

app.post('/logout', (req, res) => {
  try {
    // Получаем токен сессии из заголовка авторизации
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader.split(' ')[1];

    // Удаляем токен сессии из базы данных
    deleteSessionToken(sessionToken, (error) => {
      if (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({ error: 'Ошибка при выходе' });
      } else {
        // Возвращаем успешный ответ
        res.status(200).json({ message: 'Выход успешен' });
      }
    });
  } catch (error) {
    // Обрабатываем ошибки
    console.error('Ошибка при выходе:', error);
    res.status(500).json({ error: 'Ошибка при выходе' });
  }
});

// Функция для удаления токена сессии из базы данных
function deleteSessionToken(token, callback) {
  db.run('UPDATE users SET session_token = NULL WHERE session_token = ?', [token], (error) => {
    callback(error);
  });
}

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});