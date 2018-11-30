const server = require('./src/backend/server');

const PORT = process.env.NODE_ENV === 'production' ? 8082: 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
});
