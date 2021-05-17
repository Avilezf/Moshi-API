require('dotenv').config();
const Server = require('./models/server');

console.log('Hola')

const server = new Server();

server.listen();


