const path = require('path');
const fs = require('fs-extra');
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
  const projectNames = await fs.readdir(projectPath);
  const projects = await Promise.all(projectNames.map(async p => {
    return {
      name: p,
      langs: await fs.readdir(path.resolve(projectPath, p))
    }
  }));
  res.render('projects', {projects});
});

app.get('/blackjack/:commit?', async (req, res) => {
  if (req.params.commit === 'javascript' || req.params.commit === 'python') {
    res.render('project');
  } else if (req.params.commit && req.params.commit !== 'python') {
    res.redirect(path.resolve('/blackjack/python/', req.params.commit));
  } else {
    res.redirect('/blackjack/python');
  }
});

app.get('/:project/:lang/:commit?', async (req, res) => {
  res.render('project');
});

module.exports = app;