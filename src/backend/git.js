const path = require('path');
const _ = require('lodash');
const nodegit = require('nodegit');

function getRepo(project) {
  const projectPath = path.resolve(__dirname, '../../repos', project);
  return nodegit.Repository.open(projectPath);
}

async function getCommits(project) {
  const repo = await getRepo(project);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommitsUntil(c => true);
}

async function getDiff(commit) {
  const diffs = await commit.getDiff();
  const patches = await diffs[0].patches();
  //const hunks = await Promise.all(patches.map(patch => patch.hunks()));
  //const lines = await Promise.all(hunks.map(hunk => hunk[0].lines()));
  return patches.map(p => ({
    fileName: p.newFile().path(),
    newFile: p.status() == 1
  }))
}

async function getFiles(commit) {
  const tree = await commit.getTree();
  const diffs = await getDiff(commit);
  return getTreeFiles(tree, diffs);
}

async function getTreeFiles(tree, diffs) {
  const contentFiles = [];
  const entries = _.sortBy(tree.entries(), e => -e.isDirectory());
  const treeFiles = await Promise.all(entries.map(async e => {
    if (e.isDirectory()) {
      return {
        name: e.name(),
        type: 'directory',
        children: (await getTreeFiles(await e.getTree())).treeFiles
      };
    } else {
      const edited = _.find(diffs, d => d.fileName === e.name());
      const newFile = _.find(diffs, d => d.fileName === e.name() && d.newFile);
      const status = newFile ? 'newFile' : edited ? 'editedFile' : 'uneditedFile';

      const file = {
        name: e.name(),
        type: 'file',
        status
      };

      if (newFile || edited) {
         contentFiles.push({
           path: e.path(),
           content: (await e.getBlob()).toString(),
           status
         });
      }
      return file;
    }
  }));
  return {contentFiles, treeFiles}
}

async function getFileById(project, commitId, filePath) {
  const repo = await getRepo(project);
  const commit = await repo.getCommit(commitId);
  const tree = await commit.getTree();
  const entry = tree.entryByName(filePath);
  return {
    path: entry.path(),
    id: entry.id().toString(),
    content: (await entry.getBlob()).toString()
  }
}

module.exports = {getCommits, getFiles, getDiff, getFileById};