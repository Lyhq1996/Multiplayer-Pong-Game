let readyPlayerCount = 0;
let startAgainPlayerCount = 0;

function listen(io) {
    const pongNamespace = io.of('/pong');
    pongNamespace.on('connection', (socket) => {
        let room;

        console.log('a user connected', socket.id);
    
        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log('Player ready', socket.id, room);
            readyPlayerCount++;
            if (readyPlayerCount % 2 === 0) {
                // broadcast to all connected users
                // choose the second player as the referee
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });

        socket.on('startAgain', () => {
            console.log('Player start again', socket.id, room);
            startAgainPlayerCount++;
            if (startAgainPlayerCount % 2 === 0) {
                pongNamespace.in(room).emit('startAgainGame');
            }
        });
    
        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData);
        });
    
        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });
    
        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        })
    });
}

module.exports = {
    listen,
}
