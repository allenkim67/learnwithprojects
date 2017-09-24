const path = require('path');
const fs = require('fs');
const express = require('express');
require('express-async-errors');
const dots = require('dot').process({path: './src/backend/templates'});
const _ = require('lodash');
const git = require('./git');

const app = express();

app.use('/build', express.static(path.resolve(__dirname, '../frontend/build')));

app.get('/', async (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  res.send(dots.projects({projects}));
});

app.get('/:project/:commit?', async (req, res) => {
  const commits = _.reverse(
    await git.getCommits(req.params.project)
  );

  const commit = req.params.commit ?
    _.find(commits, c => c.sha() == req.params.commit) :
    commits[0];

  const {treeFiles, contentFiles} = await git.getFiles(commit);
  const templateVars = {
    commits: commits.map(c => ({message: c.message(), sha: c.sha()})),
    commit: commit.sha(),
    treeFiles,
    contentFiles: contentFiles.map(f => ({...f, content: f.content.toString()})),
    project: req.params.project
  };

  res.send(dots.project(templateVars));
});

module.exports = app;