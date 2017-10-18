const path = require('path');
const fs = require('fs');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const compression = require('compression');
const apiRouter = require('./api');

const app = express();

// VIEW
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './templates'));

// MIDDLEWARE
app.use(compression());
app.use('/build', express.static(path.resolve(__dirname, '../../build')));
app.use(bodyParser.json());

// ROUTERS
app.use('/api', apiRouter);

// ROUTES
app.get('/', async (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  res.render('projects', {projects});
});

app.get('/:project/:lang/:commit?', async (req, res) => {
  res.render('project');
});

module.exports = app;