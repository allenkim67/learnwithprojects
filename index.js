const server = require('./src/backend/server');

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
});