const server = require('./src/server');

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
});
