const path = require('path');
const fs = require('fs');
const express = require('express');
const dots = require('dot').process({path: './src/backend/templates'});
const git = require('./git');

const app = express();

app.get('/', (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  res.send(dots.projects({projects}));
});

app.get('/:project', async (req, res) => {
  const commits = await git.getCommits(req.params.project);
  const files = await git.getFiles(commits[0]);
  res.send(dots.project({commits, files}));
});

module.exports = app;