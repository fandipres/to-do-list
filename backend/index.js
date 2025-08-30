const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'fandipres'; 

const authMiddleware = require('./middlewares/auth.js');
const routerTodo = require('./routers/todo.js');
const routerUser = require('./routers/user.js');

app.use('/user', routerUser); 
app.use('/todo', authMiddleware, routerTodo);

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

const clients = new Map();

wss.on('connection', (ws, request, userId) => {
    console.log(`Client connected untuk user ID: ${userId}`);
    clients.set(userId, ws);

    ws.on('message', (message) => {
        console.log(`Received message => ${message} from user ${userId}`);
    });

    ws.on('close', () => {
        console.log(`Client disconnected untuk user ID: ${userId}`);
        clients.delete(userId);
    });
});

function broadcastUpdate(userId, data) {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
    }
}

app.locals.broadcastUpdate = broadcastUpdate;

server.on('upgrade', (request, socket, head) => {
    const { pathname, query } = url.parse(request.url, true);
    
    if (pathname === '/ws') {
        const token = query.token;
        if (!token) {
            socket.destroy();
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                socket.destroy();
                return;
            }
            
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request, decoded.userId);
            });
        });
    } else {
        socket.destroy();
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});