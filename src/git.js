const path = require('path');
const nodegit = require('nodegit');

async function getCommits(project) {
  const projectPath = path.resolve(__dirname, '../repos', project);
  const repo = await nodegit.Repository.open(projectPath);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommits();
}

async function getFiles(commit) {
  const tree = await commit.getTree();
  return tree.entries().map(entry => entry.toString());
}

module.exports = {getCommits, getFiles};