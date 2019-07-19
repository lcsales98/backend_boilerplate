import app from "./config/server";

const http = require("http").Server(app);
const io = require("socket.io")(http);

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    console.log("a user connected on socketio");
    socket.on("message", function(message: any) {
        console.log(message);
    });
});

http.listen(3000, () => {
    console.log("App iniciado na Porta 3000, bora!");
});
