const path = require('path');
const fs = require('fs');
const express = require('express');
require('express-async-errors');
const _ = require('lodash');
const git = require('./git');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './templates'));

app.use('/build', express.static(path.resolve(__dirname, '../../build')));

app.get('/', async (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  res.render('projects', {projects});
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
    contentFiles,
    project: req.params.project,
    teachingNotes: await git.getTeachingNotes(commit)
  };

  res.render('project', {data: templateVars});
});

app.get('/:project/:commit/:fileId', async (req, res) => {
  const {project, commit, fileId} = req.params;
  const file = await git.getFileById(project, commit, fileId);
  res.json(file);
});

module.exports = app;