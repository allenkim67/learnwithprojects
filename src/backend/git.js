const path = require('path');
const nodegit = require('nodegit');

async function getCommits(project) {
  const projectPath = path.resolve(__dirname, '../../repos', project);
  const repo = await nodegit.Repository.open(projectPath);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommitsUntil(c => true);
}

async function getFiles(commit) {
  const tree = await commit.getTree();
  return Promise.all(tree.entries().map(async e => {
    return {name: e.name(), body: (await e.getBlob()).toString()};
  }));
}

module.exports = {getCommits, getFiles};