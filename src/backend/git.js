const path = require('path');
const _ = require('lodash');
const nodegit = require('nodegit');
const treeUtil = require('../shared/tree-util');

async function getCommits(project) {
  const repo = await _getRepo(project);
  const walker = repo.createRevWalk();
  walker.pushHead();
  return await walker.getCommitsUntil(c => true);
}

async function getFiles(project, commit) {
  let tree = await _entryTree(await commit.getTree());
  tree = treeUtil.prune(tree, node => {
    return _.includes(['.gitignore', '_teaching_notes.md'], node.entry.name());
  });

  const diffs = await _getDiff(commit);

  return {
    treeFiles: treeUtil.map(tree, node => _formatEntry(node, diffs, project)),
    contentFiles: await _getContentFiles(tree, diffs)
  };
}

function _getContentFiles(tree, diffs) {
  return Promise.all(treeUtil.leafOnly(tree)
    .filter(node => _.includes(['newFile', 'editedFile'], _getStatus(node, diffs)))
    .map(async node => {
      return {
        ..._formatEntry(node, diffs),
        content: (await node.entry.getBlob()).toString()
      };
    })
  );
}

function _formatEntry(node, diffs, project) {
  const newNode = node.entry instanceof nodegit.Tree ?
    {name: project, path: ''} :
    {name: node.entry.name(), path: node.entry.path()};

  return node.children ?
    {...newNode, type: 'directory'} :
    {...newNode, type: 'file', status: _getStatus(node, diffs)};
}

function _getStatus(node, diffs) {
  const edited = diffs[node.entry.path()];
  const newFile = edited && edited.newFile;
  return newFile ? 'newFile' : edited ? 'editedFile' : 'uneditedFile';
}

async function getFileByPath(project, commitId, path) {
  const repo = await _getRepo(project);
  const commit = await repo.getCommit(commitId);
  const diffs = await _getDiff(commit);
  const tree = await _entryTree(await commit.getTree());
  const node = await treeUtil.bfs(tree, node => {
    return !node.children && node.entry.path() === path;
  });
  return {
    ..._formatEntry(node, diffs, project),
    content: (await node.entry.getBlob()).toString()
  }
}

async function getTeachingNotes(commit) {
  const tree = await commit.getTree();
  try {
    const entry = tree.entryByName('_teaching_notes.md');
    return (await entry.getBlob()).toString();
  } catch (e) {
    return '';
  }
}

function _getRepo(project) {
  const projectPath = path.resolve(__dirname, '../../repos', project);
  return nodegit.Repository.open(projectPath);
}

async function _getDiff(commit) {
  const diffs = await commit.getDiff();
  const patches = await diffs[0].patches();
  //const hunks = await Promise.all(patches.map(patch => patch.hunks()));
  //const lines = await Promise.all(hunks.map(hunk => hunk[0].lines()));
  return patches.reduce((acc, p) => {
    return {
      ...acc,
      [p.newFile().path()]: {newFile: p.status() == 1}
    };
  }, {})
}

async function _entryTree(entry) {
  if (entry instanceof nodegit.Tree || entry.isTree()) {
    const tree = entry instanceof nodegit.Tree ? entry : await entry.getTree();
    return {
      entry,
      children: await Promise.all(tree.entries().map(_entryTree))
    }
  } else {
    return {entry};
  }
}

module.exports = {getCommits, getFiles, getFileByPath, getTeachingNotes};