const path = require('path');
const fs = require('fs');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('lodash');
const git = require('./git');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './templates'));

app.use(compression());
app.use('/build', express.static(path.resolve(__dirname, '../../build')));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const projectPath = path.resolve(__dirname, '../../repos');
  const projects = fs.readdirSync(projectPath);
  res.render('projects', {projects});
});

app.post('/api/:project/:commit?', async (req, res) => {
  const commits = _.reverse(await git.getCommits(req.params.project));
  const commit = _.find(commits, c => c.sha() == req.params.commit) || commits[0];
  const {treeFiles, contentFiles} = await git.getFiles(req.params.project, commit, req.body.force);

  res.json({
    project: req.params.project,
    commit: commit.sha(),
    commits: commits.map(c => ({message: c.message(), sha: c.sha()})),
    treeFiles: treeFiles,
    contentFiles,
    teachingNotes: await git.getTeachingNotes(commit)
  });
});

app.get('/api/:project/:commit/:path(*)', async (req, res) => {
  const {project, commit, path} = req.params;
  const file = await git.getFileByPath(project, commit, path);
  res.json(file);
});

app.get('/:project/:commit?', async (req, res) => {
  res.render('project');
});

module.exports = app;