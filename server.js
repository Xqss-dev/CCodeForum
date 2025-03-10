const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Хранение сообщений
let messages = [];

// Обработка WebSocket-соединений
wss.on('connection', (ws) => {
    // Отправляем историю сообщений новому пользователю
    ws.send(JSON.stringify({ type: 'history', data: messages }));

    // Обработка новых сообщений
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        messages.push(data); // Сохраняем сообщение
        // Рассылаем сообщение всем подключенным пользователям
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', data }));
            }
        });
    });
});

// Запуск сервера
server.listen(8080, () => {
    console.log('Сервер запущен на http://localhost:8080');
});
