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

  function getFilesIter(tree) {
    return Promise.all(tree.entries().map(async e => {
      if (e.isDirectory()) {
        return {
          name: e.name(),
          type: 'directory',
          children: await getFilesIter(await e.getTree())
        };
      } else {
        return {
          name: e.name(),
          type: 'file'
        };
      }
    }));
  }

  return getFilesIter(tree);
}

module.exports = {getCommits, getFiles};