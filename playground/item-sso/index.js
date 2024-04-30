import server from "./server.js"
import server_central from "./server_central.js";

function bootstrap() {
    server()
    server_central()
}

bootstrap()