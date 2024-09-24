const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const counterFilePath = path.join(__dirname, 'counter.json');

let homePageViews = 0;
let aboutPageViews = 0;

// Функция для загрузки счетчиков из файла
const loadCounters = () => {
    if (fs.existsSync(counterFilePath)) {
        const data = fs.readFileSync(counterFilePath);
        const counters = JSON.parse(data);
        homePageViews = counters.home || 0;
        aboutPageViews = counters.about || 0;
    }
};

// Функция для сохранения счетчиков в файл
const saveCounters = () => {
    const counters = { home: homePageViews, about: aboutPageViews };
    fs.writeFileSync(counterFilePath, JSON.stringify(counters));
};

// Загрузка счетчиков при старте сервера
loadCounters();

// Middleware для статических файлов
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
    homePageViews++;
    saveCounters();
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
            <title>Главная страница</title>
        </head>
        <body>
            <h1>Главная страница</h1>
            <p>Количество просмотров: ${homePageViews}</p>
            <a href="/about">Перейти на страницу About</a>
        </body>
        </html>
    `);
});

// Страница About
app.get('/about', (req, res) => {
    aboutPageViews++;
    saveCounters();
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
            <title>О нас</title>
        </head>
        <body>
            <h1>Страница About</h1>
            <p>Количество просмотров: ${aboutPageViews}</p>
            <a href="/">Вернуться на главную страницу</a>
        </body>
        </html>
    `);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

