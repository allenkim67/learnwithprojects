const path = require('path');
const fs = require('fs');
const express = require('express');
const dots = require('dot').process({path: './src/backend/templates'});
const git = require('./git');

const app = express();

app.get('/', async (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  const commits = await git.getCommits(projects[0]);
  const files = await git.getFiles(commits[0]);
  res.send(dots.main({projects, commits, files}));
});

module.exports = app;